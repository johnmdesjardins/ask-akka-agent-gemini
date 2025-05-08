# Errors and failures

The Akka SDK provides several mechanisms dealing with validation or when something is going wrong.

## Errors

The first line of the defense is the validation of the incoming data on the `Endpoint` level. Already described is details in the [request and response](http-endpoints.adoc#_advanced_http_requests_and_responses) section. This is a basic request validation, which doesn’t require domain state. It’s better to handle it as soon as possible, since it will reduce the load on the system. The logic can reject the request before it reaches the entity.

The next phase is domain validation error. An incoming command doesn’t fulfil the requirements or the current state doesn’t allow the command to be handled. Such errors can be signalled back to the client as an error effect using the `effects().error(description)` function.

**{sample-base-url}/event-sourced-counter-brokers/src/main/java/counter/application/CounterEntity.java[CounterEntity.java]**


```
1. Return an error effect with a description if the validation fails.

The `effects().error` is later transformed into a `IllegalArgumentException` that fails a Java `CompletionStage`. This exception can be handled with `CompletionStage.exceptionally` method and transformed into a proper HTTP error. The default behavior is to return an HTTP 400 error with the error message as a response body.

**{sample-base-url}/event-sourced-counter-brokers/src/main/java/counter/api/CounterEndpoint.java[CounterEndpoint.java]**


```
1. Calling component method without additional exception handling.

Calling such endpoint with an invalid request will return:

```
HTTP/1.1 400 Bad Request
Access-Control-Allow-Origin: *
Server: akka-http/10.6.3
Date: Wed, 25 Sep 2024 10:44:22 GMT
Content-Type: text/plain; charset=UTF-8
Content-Length: 28

Increasing counter above 10000 is blocked
```

## Errors as reply types

To have a full and type-safe control over the errors, another approach would be to encode them as a part of reply protocol.

**{sample-base-url}/event-sourced-counter-brokers/src/main/java/counter/application/CounterEntity.java[CounterEntity.java]**


```
1. Additional Jackson annotations are required to serialize a polymorphic `CounterResult` type.
2. Sealed trait groups all possible results of the command handling.
3. Instead of returning an error effect, we reply with a specific result type.
4. A `CounterResult.Success` reply returns the updated counter value.

Handling the response in the client is straightforward.

**{sample-base-url}/event-sourced-counter-brokers/src/main/java/counter/api/CounterEndpoint.java[CounterEndpoint.java]**


```
1. Match all the possible results and transform them into HTTP responses.

This approach is more explicit and type-safe, but it requires more boilerplate code. It is recommended to use this approach when the error handling is more complex and requires more than just a simple message.

**📌 NOTE**\
Make sure that you are familiar with the Jackson serialization library and how to use it with sealed interfaces and generic types. Schema evolution and compatibility aspects in terms of response types should be considered. Especially in the context of using Workflows, where step action results are persisted and will be deserialized in the future.

## Failures

All unexpected exception thrown be the user code are transformed into an HTTP 500 error. When running the service locally in dev mode, a stack trace is will be a part of the HTTP response. In production, this information is hidden, to not leak internal details about the service to a client. The client will receive a non-descriptive message with a correlation ID, like below.

```
Unexpected error [2c74bdfb-3130-464c-8852-cf9c3c2180ad]
```

That same correlation ID `2c74bdfb-3130-464c-8852-cf9c3c2180ad` is included in the log entry for the error as an MDC value with the key `correlationID`. This makes it possible to find the specific error in the logs using `akka logs` or by querying your configured logging backend for the service.
