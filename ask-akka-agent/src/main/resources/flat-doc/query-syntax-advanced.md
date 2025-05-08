## Advanced view queries

Advanced view queries include additional sort operations, grouping operations, joins across tables, and subquery support.

**❗ IMPORTANT**\
Advanced view queries might not be available by default. Please contact the Akka support team if you require access to these features.

### Joins and multiple tables

Advanced views can subscribe to events and changes from multiple entities or event sources. Data for multiple tables can then be joined using relational join operations, similar to SQL. Supported join types are:

* `(INNER) JOIN` - only returns entries with matching values in both tables
* `LEFT (OUTER) JOIN` - returns all entries in the left table, joined with any matching entries from the right table
* `RIGHT (OUTER) JOIN` - returns all entries in the right table, joined with any matching entries from the left table
* `FULL (OUTER) JOIN` - returns all entries from both tables, with joined entries for matching values

In these examples, the Customer Registry used for simple views is extended to be a simple Store, adding Products and Orders for Customers. Customers and Products are implemented using Event Sourced Entities, while Orders is a Key Value Entity.

Each Product includes a name and a price:

**{sample-base-url}/view-store/src/main/java/store/product/domain/Product.java[Product.java]**


```
**{sample-base-url}/view-store/src/main/java/store/product/domain/Money.java[Money.java]**


```

Each Order has an id, refers to the Customer and Product ids for this order, has the quantity of the ordered product, and a timestamp for when the order was created:

**{sample-base-url}/view-store/src/main/java/store/order/domain/Order.java[Order.java]**


```

A view can subscribe to the events or changes for each of the Customer, Order, and Product entities.

The view query can then JOIN across these tables, to return all orders for a specified customer, and include the customer and product details with each order.

To do this, create a class with a `ComponentId` annotation and extending from `View`. Inside, various inner classes that extend `TableUpdater` can be declared, each subscribing to one of the entities and setting a table name.

**{sample-base-url}/view-store/src/main/java/store/order/view/joined/CustomerOrder.java[CustomerOrder.java]**


```

**{sample-base-url}/view-store/src/main/java/store/order/view/joined/JoinedCustomerOrdersView.java[JoinedCustomerOrdersView.java]**


```
1. Add a component id for this multi-table view.
2. Each nested table updater stores its state type in a different table (declared with `@Table`) and subscribes to one of the entities: `customers`, `products`, and `orders`.
3. The view query does the following:
   * Select all columns from the joined entries to project into the combined `CustomerOrder` result type.
   * Join customers with orders on a matching customer id.
   * Join products with orders on a matching product id.
   * Find orders for a particular customer.
   * Sort all the orders by their created timestamp.
4. The query method returns a collections of customer orders.

In the example above, each `CustomerOrder` returned will contain the same customer details. The results can instead include the customer details once, and then all the ordered products in a collection, using a [projection](#_result_projection) in the SELECT clause. That is, instead of using SELECT * you can define which columns will be used in the response message:

**{sample-base-url}/view-store/src/main/java/store/order/view/nested/NestedCustomerOrders.java[NestedCustomerOrders.java]**


```
1. The `orders` field will contain the nested `CustomerOrder` objects.

**{sample-base-url}/view-store/src/main/java/store/order/view/nested/NestedCustomerOrdersView.java[NestedCustomerOrdersView.java]**


```
1. In the view query, the customer columns are projected into the result, and the order and product columns are combined into a nested object and projected into the `orders` field.
2. A single `CustomerOrders` object is returned, which will have the customer details and all orders for this customer.

A [projection](#_result_projection) for a JOIN query can also restructure the results. For example, the shipping details for a customer can be constructed in a particular form, and the product orders transformed into a different nested message structure:

**{sample-base-url}/view-store/src/main/java/store/order/view/structured/StructuredCustomerOrders.java[StructuredCustomerOrders.java]**


```

**{sample-base-url}/view-store/src/main/java/store/order/view/structured/CustomerShipping.java[CustomerShipping.java]**


```

**{sample-base-url}/view-store/src/main/java/store/order/view/structured/ProductOrder.java[ProductOrder.java]**


```

**{sample-base-url}/view-store/src/main/java/store/order/view/structured/ProductValue.java[ProductValue.java]**


```

**{sample-base-url}/view-store/src/main/java/store/order/view/structured/StructuredCustomerOrdersView.java[StructuredCustomerOrdersView.java]**


```
1. The view query does the following:
   * The `customerId` is renamed to just `id` in the result.
   * Customer shipping details are transformed and combined into a nested object.
   * The product price is reconstructed into a `ProductValue` object, nested within the order object.
   * The order and associated product information is transformed and combined into a collection of `ProductOrder` objects.
   * The nested orders in the result will still be sorted by their created timestamps.

**📌 NOTE**\
Rather than transforming results in a projection, it’s also possible to transform the stored state in the update methods for the view table.

### Enable advanced views

Advanced view queries are not available by default when you deploy your Akka service. Please contact the Akka support team if you require access to these features.

For local development and when running integration tests, the advanced view features are available by default.
