# Designing HTTP Endpoints

An Endpoint is a component that creates an externally accessible API. Endpoints are how you expose your services to the outside world. Endpoints can have different protocols and, initially, support HTTP.

HTTP Endpoint components make it possible to conveniently define such APIs accepting and responding in JSON,
or dropping down to lower level APIs for ultimate flexibility in what types of data is accepted and returned.

## Basics ==
To define an HTTP Endpoint component, create a public class and annotate it with `@HttpEndpoint("/path-prefix")`.

Each public method on the endpoint that is annotated with method `@Get`, `@Post`, `@Put`, `@Patch` or `@Delete`
will be handling incoming requests matching the `/path-prefix` and the method-specific path used as value defined
for the path annotation.

The most basic example:

**{sample-base-url}/doc-snippets/src/main/java/com/example/api/ExampleEndpoint.java[ExampleEndpoint.java]**

```java
```
1. Common path prefix for all methods in the same class `/example`.
2. ACL configuration allowing any client to access the endpoint.
3. `GET` endpoint path is combined with the prefix and becomes available at `/example/hello`
4. Return value, is turned into an `200 Ok` response, with content type `text/plain` and the specified string as body.

**📌 NOTE**\
Without an ACL annotation no client is allowed to access the endpoint. For more details on how ACLs can be configured, see [access-control.adoc](access-control.adoc)

### Path parameters ===
The path can also contain one or more parameters, which are extracted and passed to the method:

**{sample-base-url}/doc-snippets/src/main/java/com/example/api/ExampleEndpoint.java[ExampleEndpoint.java]**

```java
```
1. Path parameter `name` in expression.
2. Method parameter named as the one in the expression
3. When there are multiple parameters
4. The method must accept all the same names in the same order as in the path expression.

Path parameter can be of types `String`, `int`, `long`, `boolean`,  `float`, `double`, `short` and `char` as well
as their `java.lang` class counterparts.

### Request body ===

To accept an HTTP JSON body, specify a parameter that is a class that [Jackson](https://github.com/FasterXML/jackson?tab=readme-ov-file#what-is-jackson) can deserialize:

**{sample-base-url}/doc-snippets/src/main/java/com/example/api/ExampleEndpoint.java[ExampleEndpoint.java]**

```java
```
1. A class that Jackson can serialize and deserialize to JSON
2. A parameter of the request body type
3. When combining request body with path variables
4. The body must come last in the parameter list

Additionally, the request body parameter can be of the following types:

* `String` for any request with a text content type, the body decoded into a string
* `java.util.List<T>` where `T` is a type Jackson can deserialize, accepts a JSON array.
* `akka.http.javadsl.model.HttpEntity.Strict` for the entire request body as bytes together with the content type for
   arbitrary payload handling.
* `akka.http.javadsl.model.HttpRequest` for a low level, streaming representation of the entire request
    including headers. See [http-endpoints.adoc#_low_level_requests](http-endpoints.adoc#_low_level_requests) below for more details

### Response body ===

To return response with JSON, the return value can be a class that Jackson can serialize:

**{sample-base-url}/doc-snippets/src/main/java/com/example/api/ExampleEndpoint.java[ExampleEndpoint.java]**

```java
```
1. Returning an object that Jackson can serialize into JSON

In addition to an object that can be turned to JSON, a request handler can return the following:

* `null` or `void` to return an empty body.
* `String` to return a UTF-8 encoded `text/plain` HTTP response.
* `CompletionStage<T>` to respond based on an asynchronous result.
  * When the completion stage is completed with a `T` it is
     turned into a response.
  * If it is instead failed, the failure leads to an error response according to
     the error handling explained in [error responses](http-endpoints.adoc#_error_responses).
* `akka.http.javadsl.model.HttpResponse` for complete control over the response, see [http-endpoints.adoc#_low_level_responses](http-endpoints.adoc#_low_level_responses) below

### Error responses ===

The HTTP protocol has several status codes to signal that something went wrong with a request, for
example HTTP `400 Bad request` to signal that the incoming request was not valid.

Responding with an error can be done by throwing one of the exceptions available through static factory methods in
`akka.javasdk.http.HttpException`.

**{sample-base-url}/doc-snippets/src/main/java/com/example/api/ExampleEndpoint.java[ExampleEndpoint.java]**

```java
```
1. Throw one of the exceptions created through factory methods provided by `HttpException` to respond with a HTTP error
2. Return non-error

In addition to the special `HttpException`s, exceptions are handled like this:

* `IllegalArgumentException` is turned into a `400 Bad request`
* Any other exception is turned into a `500 Internal server error`.
  * In production the error is logged together with a correlation
  id and the response message only includes the correlation id to not leak service internals to an untrusted client.
  * In local development and integration tests the full exception is returned as response body.

## Interacting with other components ==

The most common use case for endpoints is to interact with other components in a service. This is done through
the `akka.javasdk.client.ComponentClient`. If the constructor of the endpoint class has a parameter of this type,
it will be injected by the SDK.

**{sample-base-url}/shopping-cart-quickstart/src/main/java/shoppingcart/api/ShoppingCartEndpoint.java[ShoppingCartEndpoint.java]**

```java
```
1. Common path prefix for all methods in the same class `/carts`.
2. Accept the `ComponentClient` and keep it in a field.
3. GET endpoint path is combined with a path parameter name, e.g. `/carts/123`.
4. The component client can be used to interact with other components.
5. Result of a request to a component is a `CompletionStage<T>`, it can be returned directly to let Akka serialize it.
6. Use path parameter `\{cartId}` in combination with request body `ShoppingCart.LineItem`.
7. When the call has completed successfully, respond `200 Ok` with an empty body.

For more details see [component-and-service-calls.adoc](component-and-service-calls.adoc)

## Interacting with other HTTP services

It is also possible to interact with other services over HTTP. This is done through the `akka.javasdk.http.HttpClientProvider`.

When the other service is also an Akka service deployed in the same project, it can be looked up via the deployed name
of the service:

**{sample-base-url}/event-sourced-customer-registry-subscriber/src/main/java/customer/api/CustomerRegistryEndpoint.java[CustomerRegistryEndpoint.java]**

```java
```
1. Accept the `HttpClientProvider`
2. Use it to create a client for the service `customer-registry`
3. Issue an HTTP POST request to the service
4. The result of a request is either `CompletionStage<T>` with the result
5. If the call was successful, respond with our own response.

**💡 TIP**\
If you’re looking to test this locally, you will likely need to run the 2 services with different ports. For more details, consult [Running multiple services](running-locally.adoc#_running_multiple_services_locally).

It is also possible to interact with arbitrary non-Akka services using the `HttpClientProvider`, for such use,
pass a string with `https://example.com` or `http://example.com` instead of a service name.

For more details see [component-and-service-calls.adoc](component-and-service-calls.adoc)

## Advanced HTTP requests and responses ==

For more control over the request and responses it is also possible to use the more
low-level Akka HTTP model APIs.

### Low level responses ===

Returning `akka.http.javadsl.model.HttpResponse` makes it possible to do more flexible and advanced responses.

For example, it allows returning custom headers, custom response body encodings and even streaming responses.

As a convenience `akka.javasdk.http.HttpResponses` provides factories for common response scenarios without
having to reach for the Akka HTTP model APIs directly:

**{sample-base-url}/doc-snippets/src/main/java/com/example/api/ExampleEndpoint.java[ExampleEndpoint.java]**

```java
```
1. Declare the return type as `akka.http.javadsl.model.HttpResponse`
2. Return a bad request response
3. Return an ok response, you can still use arbitrary objects and get them serialized to JSON

`akka.javasdk.http.HttpResponses` provides convenient factories for common response message types without
having to reach for the Akka HTTP model APIs directly:

**{sample-base-url}/doc-snippets/src/main/java/com/example/api/ExampleEndpoint.java[ExampleEndpoint.java]**

```java
```
1. Declare the return type as `akka.http.javadsl.model.HttpResponse`
2. Return a bad request response
3. Return an ok response

Dropping all the way down to the Akka HTTP API:

**{sample-base-url}/doc-snippets/src/main/java/com/example/api/ExampleEndpoint.java[ExampleEndpoint.java]**

```java
```
1. At this level there is no convenience, the response object must manually be rendered into JSON bytes
2. The response returned by `HttpResponse.create` is `200 Ok`
3. Pass the response body bytes and the `ContentType` to describe what they contain

### Low level requests ===

Accepting `HttpEntity.Strict` will collect all request entity bytes into memory for processing (up to 8Mb),
for example to handle uploads of a custom media type:

**{sample-base-url}/doc-snippets/src/main/java/com/example/api/ExampleEndpoint.java[ExampleEndpoint.java]**

```java
```
1. `HttpEntity.Strict` gives access to the request body content type
2. as well as the actual bytes, in a `akka.util.ByteString`

Accepting `akka.http.javadsl.model.HttpRequest` makes it possible to do more flexible and advanced request handling
but at the cost of quite a bit more complex request handling.

This way of handling requests should only be used for advanced use cases when there is no other option.

In such a method it is paramount that the streaming request body is always handled, for example by discarding it
or collecting it all into memory, if not it will stall the incoming HTTP connection.

Handling the streaming request will require a `akka.stream.Materializer`, to get access to a materializer, define a
constructor parameter of this type to have it injected by the SDK.

**{sample-base-url}/doc-snippets/src/main/java/com/example/api/ExampleEndpoint.java[ExampleEndpoint.java]**

```java
```
1. Accept the materializer and keep it in a field
2. Make sure to discard the request body when failing
3. Or collect the bytes into memory

### Accessing request headers ===

Accessing request headers is done through the [RequestContext](_attachments/api/akka/javasdk/http/RequestContext.html) methods `requestHeader(String headerName)` and `allRequestHeaders()`.

By letting the endpoint extend [AbstractHttpEndpoint](_attachments/api/akka/javasdk/http/AbstractHttpEndpoint.html) request context is available through the method `requestContext()`.

**{sample-base-url}/doc-snippets/src/main/java/com/example/api/ExampleEndpoint.java[ExampleEndpoint.java]**

```java
```
1. `requestHeader(headerName)` returns an `Optional` which is empty if the header was not present.

## See also

* [java:access-control.adoc](java:access-control.adoc)
* [security:tls-certificates.adoc](security:tls-certificates.adoc)
