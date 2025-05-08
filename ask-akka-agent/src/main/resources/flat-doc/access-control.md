# Access Control Lists (ACLs)

The simplest access control that the Akka offers is through Access Control Lists (ACLs). ACLs allow you to
specify lists of what can access your services, at multiple granularity. For example, you can configure a method that
initiates a payment on a payment service to only accept requests from the shopping cart service. You can also control
whether services or methods can be invoked from the Internet.

For a conceptual introduction, see [security:acls.adoc](security:acls.adoc) in the ***Security*** section.

## Principals

A principal in Akka is an abstract concept that represents anything that can make or be the source of a request.
Principals that are currently supported by Akka include other services, and the internet. Services are identified
by the service name chosen when deployed. Akka uses mutual TLS (mTLS) to associate requests with one or more principals.

Note that requests that have the internet principal are requests that Akka has identified as coming through the Akka
ingress route. This is identified by mTLS, however it does not imply that mTLS has been
used to connect to the ingress from the client in the internet. These are separate hops. To configure mTLS from
internet clients, see [TLS certificates](security:tls-certificates.adoc).

## Configuring ACLs

Akka SDK ACLs consist of two lists of principal matchers. One to allow to invoke a method, and the other to deny to
invoke a method. For a request to be allowed, at least one principal associated with a request must be matched by at
least one principal matcher in the allow list, and no principals associated with the request may match any principal
matchers in the deny list.

An ACL can be configured at the class level, or at the method level. If an ACL is configured at the class level it
applies to all methods in the class. Unless it’s overridden by an ACL added at method level.

Here is an example of an ACL added at the class level on an HTTP Endpoint:

**{sample-base-url}/doc-snippets/src/main/java/com/example/acl/UserEndpoint.java[UserEndpoint.java]**


```

The above ACL only allows incoming traffic from `service-a`. Meaning that only a service named `service-a` deployed on that same project will be able to make calls to this endpoint. This rule is applied to all methods in this HTTP Endpoint.

This rule can be overridden by an ACL on a method level. Here is an example ACL on a method that overrides the class level ACL:

**{sample-base-url}/doc-snippets/src/main/java/com/example/acl/UserEndpoint.java[UserEndpoint.java]**


```
Note that an ACL defined on a method completely overrides an ACL defined at class level. It does not add to
it.

You can combine `allow` and `deny` rules. In the following example, access is open to all other services, except
`service-b`.

**{sample-base-url}/doc-snippets/src/main/java/com/example/acl/UserEndpoint.java[UserEndpoint.java]**


```

To allow all traffic:

**{sample-base-url}/doc-snippets/src/main/java/com/example/acl/UserEndpoint.java[UserEndpoint.java]**


```

To allow only traffic from the internet:

**{sample-base-url}/doc-snippets/src/main/java/com/example/acl/UserEndpoint.java[UserEndpoint.java]**


```

To allow traffic from `service-a` and `service-b`:

**{sample-base-url}/doc-snippets/src/main/java/com/example/acl/UserEndpoint.java[UserEndpoint.java]**


```

To block all traffic, an ACL with no allows can be configured:

**{sample-base-url}/doc-snippets/src/main/java/com/example/acl/UserEndpoint.java[UserEndpoint.java]**


```

## Default ACL

If no ACLs are defined at all, Akka will deny requests from both other services and the internet to all components of
an Akka service.

**❗ IMPORTANT**\
The Maven archetype includes an example endpoint with a very permissive ACL that opens access to public
internet
requests. This allows for easy try out and testing. For production usage, make sure to add appropriate ACL
restrictions.

### Customizing the deny code

When a request is denied, by default a 403 `Forbbiden`, is sent. The code that is returned when a request is denied can be customised using the `deny_code` property.

For example, to make Akka reply with 404, `Not Found`:

**{sample-base-url}/doc-snippets/src/main/java/com/example/acl/UserEndpoint.java[UserEndpoint.java]**


```

Similar to allow and deny rules, deny codes defined at class level are applied to all methods in the component, but
can be overwritten on a per method base.

## Backoffice and self invocations

Invocations of methods from the same service, or from via the backoffice proxy that is available to developers, are always
permitted, regardless of what ACLs are defined on them.

**💡 TIP**\
The `akka service proxy` command creates an HTTP proxy that forwards all
traffic to a service. This allows you to interact with the service as if it was running locally.

## Local development with ACLs

When testing or running in development, by default, all calls to your service will be blocked as ACLs are enabled by default.

You can disable the local ACL checks by configuring the following settings in the `application.conf` file:

**src/main/resources/application.conf**

```conf
akka.javasdk.dev-mode.acl.enabled = false
```

Alternatively, start with:

```shell
mvn compile exec:java -Dakka.javasdk.dev-mode.acl.enabled=false
```

## Service identification in local development

If running multiple services in local development, you may want to run with ACLs enabled to verify that they work for
cross-service communication.

Let’s consider the existence of two distinct services called `shopping-cart` and `payment`.

The payment service only accepts request from the shopping cart service and has an ACL defined as
such:

**{sample-base-url}/doc-snippets/src/main/java/com/example/acl/PaymentEndpoint.java[PaymentEndpoint.java]**

```java
```

During development, if you want to make calls to the payment service from inside the shopping cart service, then the
shopping cart service needs to identify itself as `shopping-cart` (as per PaymentEndpoint’s ACL). When running
locally, the services identify themselves with the name used in the `artifactId` tag in its `pom.xml` file. This value can be
overwritten in the project’s `application.conf` file by defining a maven property named `akka.javasdk.dev-mode
.service-name`.

The `application.conf` needs to be located in the project’s main resources directory, i.e.: `src/main/resources`.

**src/main/resources/application.conf**

```conf
akka.javasdk.dev-mode.service-name=shopping-cart
```

**📌 NOTE**\
This property is only applicable when running the services on your local machine. When deployed, the service name
is the one used to create the service and should also match the ACL definition, i.e.: `shopping-cart`.

If you want to simulate calls to the payment endpoint and pretend that the calls are
coming from the shopping cart service, you can add the header `impersonate-service` to your requests, for example:

```bash
curl -i localhost:9000/payments/{cart-id}/check-transaction \
  --header "impersonate-service: shopping-cart"
```

Note that in local development, the services don’t actually authenticate with each other, they only pass their identity in a header. It is assumed in local development that a client can be trusted to set that header correctly.

## Programmatically accessing principals

The current principal associated with a request can be accessed through the `RequestContext`.

**📌 NOTE**\
Endpoints are stateless and each request is served by a new Endpoint instance. Therefore, the `RequestContext` is always a new instance and is associated with the request currently being handled.

**{sample-base-url}/doc-snippets/src/main/java/com/example/acl/UserEndpoint.java[UserEndpoint.java]**


```
1. Let your endpoint extend [AbstractHttpEndpoint](_attachments/api/akka/javasdk/http/AbstractHttpEndpoint.html) to get access to the request specific `RequestContext` through `requestContext()`.

You can access the current Principals through method `RequestContext.getPrincipals()`

If the request came from another service, the `Principals.getLocalService()` method will return a non-empty
`Optional` containing the name of the service that made the request. Akka guarantees that this field will only be
present from an authenticated principal, it can’t be spoofed.

Further, you can use `Principals.isInternet`, `Principals.isSelf` or `Principals.isBackoffice` to verify if the request
was made from the Internet, from the current service or from the Backoffice API respectively. Backoffice requests are
those made using the `akka services proxy` command, they are authenticated and authorized to ensure only developers
of your project can make them.

**{sample-base-url}/doc-snippets/src/main/java/com/example/acl/UserEndpoint.java[UserEndpoint.java]**


```

## ACLs when running unit tests

In the generated unit test testkits, the ACLs are ignored.

## ACLs when running integration tests

ACLs are enabled by default when running integration tests.

ACL rules will be applied whenever a call is made using testkit’s `HttpClient`. Those calls are interpreted as
originating from the internet. You can disable the ACL checks by overriding the `testKitSettings()` method.

**{sample-base-url}/doc-snippets/src/test/java/com/example/acl/UserEndpointIntegrationTest.java[UserEndpointIntegrationTest.java]**


```

Calls made through the `ComponentClient` are internal to the service and therefore no ACL rule is applied.
