## Query syntax reference

Define View queries in a language that is similar to SQL. The following examples are added to illustrate the syntax. 

### Retrieving

* All customers without any filtering conditions:

  ```genericsql
  SELECT * FROM customers
  ```

### Filter predicates

Use filter predicates in `WHERE` conditions to further refine results.

* Customers with a name matching the `customerName` property of the request object:

  ```genericsql
  SELECT * FROM customers WHERE name = :customerName
  ```
* Customers matching the `customerName` AND `city` properties of the request object, with `city` being matched on a nested field:

  ```genericsql
  SELECT * FROM customers WHERE name = :customerName AND address.city = :city
  ```
* Customers in a city matching a literal value:

  ```genericsql
  SELECT * FROM customers WHERE address.city = 'New York'
  ```

#### Comparison operators

The following comparison operators are supported:

* `=` equals
* `!=` not equals
* `>` greater than
* `>=` greater than or equals
* `<` less than
* `\<=` less than or equals

#### Logical operators

Combine filter conditions with the `AND` or `OR` operators, and negate using the `NOT` operator. Group conditions using parentheses.

```genericsql
SELECT * FROM customers WHERE
  name = :customer_name AND NOT (address.city = 'New York' AND age > 65)
```

#### Array operators

Use `IN` or `= ANY` to check whether a value is contained in a group of values or in a `List` field.

Use `IN` with a list of values or parameters:

```genericsql
SELECT * FROM customers WHERE email IN ('bob@example.com', :someEmail)
```

Use `= ANY` to check against a `List` column:

```genericsql
SELECT * FROM customers WHERE :someEmail = ANY(emails)
```

Or use `= ANY` with a `List` field in the request object:

```genericsql
SELECT * FROM customers WHERE email = ANY(:someEmails)
```

#### Pattern matching

Use `LIKE` to pattern match on strings. The standard SQL `LIKE` patterns are supported, with `_` (underscore) matching a single character, and `%` (percent sign) matching any sequence of zero or more characters.

```genericsql
SELECT * FROM customers WHERE name LIKE 'Bob%'
```

**📌 NOTE**\
For index efficiency, the pattern must have a non-wildcard prefix or suffix as used in the query above. A pattern like ’%foo%'` is not supported. Given this limitation, only constant patterns with literal strings are supported; patterns in request parameters are not allowed.

#### Text search

Use the `text_search` function to search text values for words, with automatic tokenization and normalization based on language-specific configuration. The `text_search` function takes the text column to search, the query (as a parameter or literal string), and an optional language configuration.

```genericsql
text_search(<column>, <query parameter or string>, [<configuration>])
```

If the query contains multiple words, the text search will find values that contain all of these words (logically combined with AND), with tokenization and normalization automatically applied.

The following text search language configurations are supported: ’danish'`, ’dutch'`, ’english'`, ’finnish'`, ’french'`, ’german'`, ’hungarian'`, ’italian'`, ’norwegian'`, ’portuguese'`, ’romanian'`, ’russian'`, ’simple'`, ’spanish'`, ’swedish'`, ’turkish'`. By default, a ’simple'` configuration will be used, without language-specific features.

```genericsql
SELECT * FROM customers WHERE text_search(profile, :search_words, 'english')
```

**📌 NOTE**\
Text search is currently only available for deployed services, and can’t be used in local testing.

#### Data types

When modeling your queries, the following data types are supported:

| Data type | Java type |
| --- | --- |
| Text | `String` |
| Integer | `int` / `Integer` |
| Long | `long` / `Long` |
| Float | `float` / `Float` |
| Double | `double` / `Double` |
| Boolean | `boolean` / `Boolean` |
| Lists | `Collection<T>` and derived |
| Timestamp | `java.time.Instant` |
| Date and time | `java.time.ZonedDateTime` |

#### Optional fields

Fields in a view type that were not given a value are handled as the default value for primitive Java data types.

However, in some use cases it is important to explicitly express that a value is missing, doing that in a view column can be done in two ways:

* use one of the Java non-primitive types for the field (e.g. use `Integer` instead of `int`)
* Wrap the value in an `java.util.Optional`
* make the field a part of another class and leave it uninitialized (i.e. `null`), for example `address.street` where the lack of an `address` message implies there is no `street` field.

Optional fields with values present can be queried just like regular view fields:

```genericsql
SELECT * FROM customers WHERE phoneNumber = :number
```

Finding results with missing values can be done using `IS NULL`:

```genericsql
SELECT * FROM customers WHERE phoneNumber IS NULL
```

Finding entries with any value present can be queried using `IS NOT NULL`:

```genericsql
SELECT * FROM customers WHERE phoneNumber IS NOT NULL
```

Optional fields in query requests messages are handled like normal fields if they have a value, however missing optional request parameters are seen as an invalid request and lead to a bad request response.

### Sorting

Results for a view query can be sorted. Use `ORDER BY` with view columns to sort results in ascending (`ASC`, by default) or descending (`DESC`) order.

If no explicit ordering is specified in a view query, results will be returned in the natural index order, which is based on the filter predicates in the query.

```genericsql
SELECT * FROM customers WHERE name = :name AND age > :minAge ORDER BY age DESC
```

**📌 NOTE**\
Some orderings may be rejected, if the view index cannot be efficiently ordered. Generally, to order by a field it should also appear in the `WHERE` conditions.

### Aggregation

#### Grouping

Grouping of results based on a field is supported using `collect(*)`. Each found key leads to one returned entry, where
all the entries for that key are collected into a `List` field.

Given the view data structure and response type:

```java
record Product(String name, int popularity) {}
record GroupedProducts(int popularity, List<Products> products) {}
```

```genericsql
SELECT popularity, collect(*) AS products
  FROM all_products
  GROUP BY popularity
  ORDER BY popularity
```

This example query returns one `GroupedProducts` entry per found unique popularity value, with all the products with
that popularity in the `products` list.

It is also possible to project individual fields in the grouped result. Given the previous `Product` view table type
and the following response type:

```java
record GroupedProductsNames(int popularity, List<String> productNames) {}
```

```genericsql
SELECT popularity, name AS productNames
  FROM all_products
  GROUP BY popularity
  ORDER BY popularity
```

#### Count

Counting results matching a query can be done using `count(*)`.

```genericsql
SELECT count(*) FROM customers WHERE address.city = 'New York'
```

### Paging

Splitting a query result into one "page" at a time rather than returning the entire result at once is possible in two ways:

* a count based offset;
* a token based offset.

In both cases `OFFSET` and `LIMIT` are used.

`OFFSET` specifies at which offset in the result to start

`LIMIT` specifies a maximum number of results to return

#### Count based offset ====

The values can either be static, defined up front in the query:

```genericsql
SELECT * FROM customers LIMIT 10
```

Or come from fields in the request message:
```genericsql
SELECT * FROM customers OFFSET :startFrom LIMIT :maxCustomers
```

Note: Using count based offsets can lead to missing or duplicated entries in the result if entries are added to or removed from the view between requests for the pages.

#### Token based offset ====

The count based offset requires that you keep track of how far you got by adding the page size to the offset for each query.

An alternative to this is to use a string token emitted by Akka identifying how far into the result set the paging has reached using the functions `next_page_token()` and `page_token_offset()`.

When reading the first page, an empty token is provided to `page_token_offset`. For each returned result page a new token that can be used to read the next page is returned by `next_page_token()`, once the last page has been read, an empty token is returned. ([See here](#check-if-there-are-more-pages-====) for determining if the last page was reached).

The size of each page can optionally be specified using `LIMIT`, if it is not present a default page size of 100 is used.

With the query request and response types like this:

```java
public record Request(String pageToken) {}
public record Response(List<Customer> customers, String nextPageToken) { }
```

A query such as the one below will allow for reading through the view in pages, each containing 10 customers:
```genericsql
SELECT * AS customers, next_page_token() AS nextPageToken
FROM customers
OFFSET page_token_offset(:pageToken)
LIMIT 10
```

The page token value string is not meant to be parseable into any meaningful information other than being a token for reading the next page.

Starting from the beginning of the pages is done by using empty string as request `pageToken` field value.

#### Total count of results

To get the total number of results that will be returned over all pages, use `total_count()` in a query that projects its results into a field. The total count will be returned in the aliased field (using `AS`) or otherwise into a field named `totalCount`.

```
SELECT * AS customers, total_count() AS total, has_more() AS more FROM customers LIMIT 10
```

#### Check if there are more pages ====

To check if there are more pages left, you can use the function `has_more()` providing a boolean value for the result. This works both for the count and token based offset paging, and also when only using `LIMIT` without any `OFFSET`:

```genericsql
SELECT * AS customers, has_more() AS moreCustomers FROM customers LIMIT 10
```

This query will return `moreCustomers = true` when the view contains more than 10 customers.
