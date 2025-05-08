# Component and service calls

An Akka service comprises many components. Such components might depend on one another, on other Akka services or even external services. This section describes how to call other components and services from within an Akka service.

## Akka components

Since Akka is an auto-scaling solution, components can be distributed across many nodes within the same service. That’s why calls between Akka components is done via a client rather than through normal method calls, the receiving component instance may be on the same node, but it may also be on a different node.

Requests and responses are always serialized to JSON between the client and the component.

### Component Client

The `akka.javasdk.client.ComponentClient` is a utility for making calls between components in a type-safe way. To use the `ComponentClient` you need to inject it into your component via the constructor:

**{sample-base-url}/shopping-cart-quickstart/src/main/java/shoppingcart/api/ShoppingCartEndpoint.java[ShoppingCartEndpoint.java]**


```
1. Accept the `ComponentClient` as a constructor argument, keep it in a field.
2. Use a specific request builder for the component you want to call
3. Invoking the method returns a `CompletionStage<T>` where `T` is what the component eventually returns.
4. Adapt the response rather than returning it as is. In this case discarding the response value, and respond OK without a response body.

The component client can call command handlers on Event Sourced Entities, Key Value Entities, Workflows, Timed Actions, and query methods on Views.

The component client is available for injection only in Service Setup, Endpoints, Consumers, Timed Actions, and Workflows. For more information, see [dependency injection](java:setup-and-dependency-injection.adoc#_dependency_injection).

## Akka services

Calling other Akka services in the same project is done by invoking them using an HTTP client. The service is identified by the name it has been deployed. Akka takes care of routing requests to the service and keeping the data safe by encrypting the connection and handling authentication for you.

In this sample we will make an action that does a call to the [Key Value Entity Counter](key-value-entities.adoc) service, deployed with the service name `counter`.

The SDK provides `akka.javasdk.http.HttpClientProvider` which provides HTTP client instances for calling other services.

In our delegating service implementation:

**{sample-base-url}/doc-snippets/src/main/java/com/example/callanotherservice/DelegatingServiceEndpoint.java[DelegatingServiceEndpoint.java]**


```
1. Accept a `HttpClientProvider` parameter for the constructor
2. Use it to look up a client for the `counter` service
3. Use the `HttpClient` to prepare a REST call to the **counter** service
4. Invoking the call will return a `CompletionStage<StrictResponse<T>>` with details about the result as well as the deserialized response body.
5. Handle the response, which may be successful, or an error

The HTTP client provider client is only available for injection in the following types of components: HTTP Endpoints, Workflows, Consumers and Timed Actions.

## External services

Calling HTTP services deployed on **different** Akka projects or any other external HTTP server is also done with the `HttpClientProvider`. Instead of a service name, the protocol and full server name is used when calling `httpClientFor`. For example `https://example.com` or `http://example.com`.

**{sample-base-url}/doc-snippets/src/main/java/com/example/callanotherservice/CallExternalServiceEndpoint.java[CallExternalServiceEndpoint.java]**


```
1. Accept a `HttpClientProvider` parameter for the constructor
2. Look up a `HttpClient` for a service using `http` protocol and server name.
3. Issue a GET call to the path `/astros.json` on the server
4. Specify a class to parse the response body into
5. Once the call completes, handle the response.
6. Return an adapted result object which will be turned into a JSON response.
