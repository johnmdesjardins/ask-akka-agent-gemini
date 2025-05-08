# Setup and dependency injection

## Service lifecycle

It is possible to define logic that runs on service instance start up.

This is done by creating a class implementing `akka.javasdk.ServiceSetup` and annotating it with `akka.javasdk.annotations.Setup`.
Only one such class may exist in the same service.

**{sample-base-url}/spring-dependency-injection/src/main/java/com/example/CounterSetup.java[CounterSetup.java]**

```java
```
1. One annotated implementation of `ServiceSetup`
2. A few different objects can be dependency injected, see below
3. `onStartup` is invoked at service start, but before the service is completely started up

It is important to remember that an Akka service consists of one to many distributed instances that can be restarted
individually and independently, for example during a rolling upgrade. Each such instance starting up will invoke
`onStartup` when starting up, even if other instances run it before.

## Disabling components

You can use `ServiceSetup` to disable components by overriding `disabledComponents` and returning a set of component classes to disable.

**{sample-base-url}/doc-snippets/src/main/java/com/example/MyAppSetup.java[MyAppSetup.java]**

```java
```
1. Override `disabledComponents`
2. Provide a set of component classes to disable depending on the configuration

## Dependency injection

The Akka SDK provides injection of types related to capabilities the SDK provides to components.

Injection is done as constructor parameters for the component implementation class.

The following types can be injected in Service Setup, Endpoints, Consumers, Timed Actions, and Workflows:

|                                                                                                                                                                             |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Injectable class                                                                                                                                                            |
| Description                                                                                                                                                                 |
| `akka.javasdk.client.ComponentClient`                                                                                                                                       |
| for interaction between components, see [component-and-service-calls.adoc](component-and-service-calls.adoc)                                                                |
| `akka.javasdk.http.HttpClientProvider`                                                                                                                                      |
| for creating clients to make calls between Akka services and also to other HTTP servers, see [component-and-service-calls.adoc](component-and-service-calls.adoc)           |
| `akka.javasdk.timer.TimerScheduler`                                                                                                                                         |
| for scheduling timed actions, see [timed-actions.adoc](timed-actions.adoc)                                                                                                  |
| `akka.stream.Materializer`                                                                                                                                                  |
| Used for running Akka streams                                                                                                                                               |
| `com.typesafe.config.Config`                                                                                                                                                |
| Access the user defined configuration picked up from `application.conf`                                                                                                     |
| `java.util.concurrent.Executor`                                                                                                                                             |
| An executor which runs each task in a virtual thread, and is safe to use for blocking async work, for example with `CompletableFuture.supplyAsync(() -> blocking, executor) |


Furthermore, the following component specific types can also be injected:

|     |
| --- |
| Component Type |
| Injectable classes |
| Endpoint |
| `akka.javasdk.http.RequestContext` with access to request related things. |
| Workflow |
| `akka.javasdk.workflow.WorkflowContext` for access to the workflow id |
| Event Sourced Entity |
| `akka.javasdk.eventsourcedentity.EventSourcedEntityContext` for access to the entity id |
| Key Value Entity |
| `akka.javasdk.keyvalueentity.KeyValueEntityContext` for access to the entity id |

## Custom dependency injection

In addition to the predefined objects a service can also provide its own objects for injection. Any unknown
types in component constructor parameter lists will be looked up using a `DependencyProvider`.

Providing custom objects for injection is done by implementing a service setup class with an overridden `createDependencyProvider` that returns a custom instance of `akka.javasdk.DependencyProvider`. A single instance
of the provider is used for the entire service instance.

Note that the objects returned from a custom `DependencyProvider` must either be a new instance for every call
to the dependency provider or be thread safe since they will be shared by any component instance accepting
them, potentially each running in parallel. This is best done by using immutable objects which is completely safe.

**❗ IMPORTANT**\
Injecting shared objects that use regular JVM concurrency primitives such as locks, can easily block
individual component instances from running in parallel and cause throughput issues or even worse, deadlocks,
so should be avoided.

The implementation can be pure Java without any dependencies:

**{sample-base-url}/doc-snippets/src/main/java/com/example/MyAppSetup.java[MyAppSetup.java]**

```java
```
1. Override `createDependencyProvider`
2. Create an object for injection, in this case an immutable settings class built from config defined in
    the `application.conf` file of the service.
3. Return an implementation of `DependencyProvider` that will return the instance if called with its class.

It is now possible to declare a constructor parameter in any component accepting `MyAppSettings`. The SDK will
inject the instance provided by the `DependencyProvider`.

Or make use of an existing dependency injection framework, like this example leveraging Spring:

**{sample-base-url}/spring-dependency-injection/src/main/java/com/example/CounterSetup.java[CounterSetup.java]**

```java
```
1. Set up a Spring `AnnotationConfigApplicationContext`
2. DependencyProvider is a SAM (single abstract method) type with signature `Class<T> -> T`, the method reference `AnnotationConfigApplicationContext#getBean` matches it.

## Custom dependency injection in tests

The TestKit allows providing a custom `DependencyProvider` through `TestKit.Settings#withDependencyProvider(provider)` so
that mock instances of dependencies can be used in tests.

**{sample-base-url}/doc-snippets/src/test/java/com/example/MyIntegrationTest.java[MyIntegrationTest.java]**

```java
```
1. Implement a test specific `DependencyProvider`.
2. Configure the TestKit to use it.

Any component injection happening during the test will now use the custom `DependencyProvider`.

The test specific `DependencyProvider` must be able to provide all custom dependencies used by
all components that the test interacts with.
