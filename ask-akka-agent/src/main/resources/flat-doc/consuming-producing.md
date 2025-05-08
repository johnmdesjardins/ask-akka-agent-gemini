# Consuming and producing

Consuming and producing allow stream based interaction between services and also with the outside world. Consuming or publishing a stream of events is a common Microservices pattern. The source of events can be the journal of an Event Sourced Entity, the Key Value Entity state changes, a [Google Cloud Pub/Sub, window="new"](https://cloud.google.com/pubsub/docs/overview) or [Apache Kafka, window="new"](https://kafka.apache.org/) topic for asynchronous messaging between services.

In this section, we will explore how you can use a Consumer component to:

* Consume events emitted by an Event Sourced Entity within the same service.
* Consume state changes emitted by a Key Value Entity within the same service.
* Consume events from Event Sourced Entities using as service to service eventing.
* Consume messages from topics of Google Cloud Pub/Sub or Apache Kafka.
* Produce messages to a Google Cloud Pub/Sub or Apache Kafka topic.

**📌 NOTE**\
Events and messages are guaranteed to be delivered at least once. This means that Consumers must be able to handle duplicated messages.

## Consumer’s Effect API

The Consumer’s Effect defines the operations that Akka should perform when an incoming message is delivered to the Consumer.

A Consumer Effect can either:

* return a message to be published to a Topic (in case the method is a publisher)
* return Done to indicate that the message was processed successfully
* ignore the incoming message

For additional details, refer to [Declarative Effects](concepts:declarative-effects.adoc).

## Consume from Event Sourced Entity

You can consume event from an Event Sourced Entity by adding `@Consume.FromEventSourcedEntity` as a type level annotation of your Consumer implementation.

**{sample-base-url}/event-sourced-counter-brokers/src/main/java/counter/application/CounterEventsConsumer.java[CounterEventsConsumer.java]**


```
1. Set component id, like for any other component.
2. Set the source of the events to the Event Sourced Entity `CounterEntity`.
3. Extend the `Consumer` component class.
4. Add handler for `CounterEvent` events.
5. Return `effect().done()` when processing is completed.
6. Return `effect().ignore()` to ignore the event and continue the processing.

If an exception is raised during the event processing. Akka runtime will redelivery the event until the application process it without failures.

When deleting Event Sourced Entities, and want to act on it in a consumer, make sure to persist a final event representing
the deletion before triggering delete.

## Consume from Key Value Entity

You can consume state changes from a Key Value Entity. To receive messages with the entity state changes, annotate the Consumer with `@Consume.FromKeyValueEntity` and specify the class of the entity. Although it looks similar to an Event Sourced Entity Consumer, the semantics are different. The Key Value Entity Consumer is guaranteed to receive the most recent state change, but not all changes in between in case of a very high update pace.

**{sample-base-url}/key-value-shopping-cart/src/main/java/com/example/application/ShoppingCartConsumer.java[ShoppingCartConsumer.java]**


```
1. Set the source to the Key Value Entity `ShoppingCartEntity`.
2. Add handler for `ShoppingCart` state update.
3. Optionally, add handler when the entity is deleted.

## Service to Service Eventing

An Akka application can be comprised of multiple services working to support specific business requirements. Although each service is an independent deployable unit, often times information needs to flow between those services.

Akka provides brokerless at-least-once event delivery across Akka services in the same project through the Service to Service eventing.

The source of the events is an [Event Sourced Entity](event-sourced-entities.adoc). Its events can be published as a stream and consumed by another Akka service without the need to set up a message broker.

**📌 NOTE**\
For eventing from an entity inside the same Akka service as the consuming component, use regular
[@Consume.FromEventSourcedEntity](consuming-producing.adoc#consume-from-event-sourced-entity) instead of Service to Service eventing.

### Event Producer

The event producer is a Consumer that consumes the events from a local source and makes them available for consumption from another service. This is done with an additional `@Produce.ServiceStream` annotation, the stream `id` is what identifies the specific stream of events from the consuming services. The ACL configuration is set to allow access from specific (or all) Akka services.

To illustrate how to publish entity events, let’s assume the existence of a `CustomerEntity` that emits events of types: `CustomerCreated`, `NameChanged` and `AddressChanged`. You will get the events delivered to a Consumer, transform them to a public set of event types and let them be published to a stream.

**{sample-base-url}/event-sourced-customer-registry/src/main/java/customer/api/CustomerEvents.java[CustomerEvents.java]**


```
1. Identify which Event Sourced Entity to publish events for.
2. Set stream public identifier for Consumers.
3. Allow access from other Akka services (in the same project), but not from the public internet.
4. Event handler transforms service internal event model into public API types.
5. Filter event types that should not be available to consuming services using `ignore()`.

### Event Consumer

The consuming side can be a Consumer or a View, annotated with `@Consume.FromStream` with a `service` identifying the publishing service, and the `id` of the stream to subscribe to.

**{sample-base-url}/event-sourced-customer-registry-subscriber/src/main/java/customer/application/CustomersByNameView.java[CustomersByNameView.java]**


```
1. Annotate the Table Updater with `@Consume.FromStream` to subscribe to an event stream from another Akka service.
2. The name of the Akka service publishing the event stream.
3. The public identifier of the specific stream.
4. Consumer group is required in case many consumers subscribing to the same stream.
5. Handler method per message type that the stream may contain.

**💡 TIP**\
If you’re looking to test this locally, you will likely need to run the 2 services with different ports. For more details, consult [Running multiple services](running-locally.adoc#_running_multiple_services_locally).

## Consume from a message broker Topic

To receive messages from a Google Cloud Pub/Sub or Apache Kafka topic, annotate the Consumer class with `@Consume.FromTopic` and specify the topic name.

In the following example the events from the topic are delivered to the Consumer and logged.

**{sample-base-url}/event-sourced-counter-brokers/src/main/java/counter/application/CounterEventsTopicConsumer.java[CounterEventsTopicConsumer.java]**


```
1. Consume from topic 'counter-events'.
2. Add handler for a given message type.
3. Mark processing as completed.

**📌 NOTE**\
By default, Akka assumes the messages in the topic were serialized as JSON and as such, deserializes them into the input type of your handlers by taking advantage of CloudEvents standard.

### Receiving CloudEvents

This time instead of a single event handler, we have a handler for each message type. Consumer is able to match the payload type to the handler method based on the `ce-type` attribute of the CloudEvent message.

Akka uses the [CloudEvents, window="new"](https://cloudevents.io/) standard when receiving from and publishing to topics. The CloudEvents specification standardizes message metadata so that systems can integrate more easily.

Describing the structure of the message payload is the CloudEvents feature most important to Akka.

An example of that is the capability to send serialized JSON messages and have Akka deserialize them accordingly.

To allow proper reading of JSON messages from external topics, the messages need to specify the message attributes:

* `Content-Type` = `application/json`
* `ce-specversion` = `1.0`
* `ce-type` = fully qualified name (e.g.  `com.example.ValueIncreased`)

(The `ce-` prefixed attributes are part of the CloudEvents specification.)

### Receiving Bytes

If the content type is `application/octet-stream`, no content type is present, or the type is unknown to Akka, the message is treated as a binary message. The topic subscriber method must accept the `byte[]` message.

**{sample-base-url}/event-sourced-counter-brokers/src/main/java/counter/application/RawBytesConsumer.java[RawBytesConsumer.java]**

```java
```
1. When consuming raw bytes messages from a topic the input type must be `byte[]`.

If a Consumer produce messages of `byte[]` type to a topic, the messages published to the topic will have content-type `application/octet-stream`.

## Producing to a Topic

Producing to a topic is the same as producing to a stream in service to service eventing. The only difference is the `@Produce.ToTopic` annotation. Used to set a destination topic name.

**❗ IMPORTANT**\
To guarantee that events for each entity can be read from the message broker in the same order they were written, the cloud event subject id must be specified in metadata along with the event. See how to in [Metadata](consuming-producing.adoc#_metadata) below.

**{sample-base-url}/event-sourced-counter-brokers/src/main/java/counter/application/CounterJournalToTopicConsumer.java[CounterJournalToTopicConsumer.java]**


```
1. Set the source to events from the `CounterEntity`.
2. Set the destination to a topic name 'counter-events'.
3. Add handler for the counter events.
4. Return `Effect.produce` to produce events to the topic.

## Handling Serialization

Check [serialization](serialization.adoc) documentation for more details.

## Deployment-dependent sources

It is possible to use environment variables to control the name of the service or topic that a consumer consumes from, this is useful for example for using the same image in staging and production deployments but having them consume from different source services.

Referencing environment variables is done with the syntax `$\{VAR_NAME}` in the `service` parameter of the `@Consume.FromStream` annotation or `value` parameter of the `@Consume.FromTopic` annotation.

**⚠️ WARNING**\
Changing the service or topic name after it has once been deployed means the consumer will start over from the beginning of the event stream.

See [`akka service deploy -h`](reference:cli/index.adoc) for details on how to set environment variables when deploying a service.

## Metadata

For many use cases, a Consumer from Event Sourced or Key Value Entity will trigger other services and needs to pass the entity ID to the receiver. You can include this information in the event payload (or Key Value Entity state) or use built-in metadata to get this information. It is made available to the consumer via the metadata `messageContext().metadata().get("ce-subject")`. The same value can be also accessed via `CloudEvent` interface.

Using metadata is also possible when producing messages to a topic or a stream. You can pass some additional information which will be available to the consumer.

**{sample-base-url}/event-sourced-counter-brokers/src/main/java/counter/application/CounterJournalToTopicWithMetaConsumer.java[CounterJournalToTopicWithMetaConsumer.java]**


```
1. Get the counter ID from the metadata.
2. Publish event to the topic with custom metadata.

## Testing the Integration

When an Akka service relies on a broker, it might be useful to use integration tests to assert that those boundaries work as intended. For such scenarios, you can either:

* Use TestKit’s mocked topic:
  * this offers a general API to inject messages into topics or read the messages written to another topic, regardless of the specific broker integration you have configured.
* Run an external broker instance:
  * if you’re interested in running your integration tests against a real instance, you need to provide the broker instance yourself by running it in a separate process in your local setup and make sure to disable the use of TestKit’s test broker. Currently, the only external broker supported in integration tests is Google PubSub Emulator.

### TestKit Mocked Incoming Messages

Following up on the counter entity example used above, let’s consider an example (composed by 2 Consumer and 1 Event Sourced Entity) as pictured below:

![java:eventing-testkit-sample](java:eventing-testkit-sample.svg)

In this example:

* commands are consumed from an external topic `event-commands` and forwarded to a `Counter` entity;
* the `Counter` entity is an Event Sourced Entity and has its events published to another topic `counter-events`.

To test this flow, we will take advantage of the TestKit to be able to push commands into the `event-commands` topic and check what messages are produced to topic `counter-events`.

**{sample-base-url}/event-sourced-counter-brokers/src/test/java/counter/application/CounterIntegrationTest.java[CounterIntegrationTest.java]**

```java
```
1. Use the TestKitSupport class.
2. Get a `IncomingMessages` for topic named `counter-commands` and `OutgoingMessages` for `counter-events` from the TestKit.
3. Build 2 commands and publish both to the topic. Note the `counterId` is passed as the subject id of the message.
4. Read 2 messages, one at a time. We pass in the expected class type for the next message.
5. Assert the received messages have the same value as the commands sent.

**💡 TIP**\
In the example above we take advantage of the TestKit to serialize / deserialize the messages and pass all the required metadata automatically for us. However, the API also offers the possibility to read and write raw bytes, construct your metadata or read multiple messages at once.

#### Configuration

Before running your test, make sure to configure the TestKit correctly.

**{sample-base-url}/event-sourced-counter-brokers/src/test/java/counter/application/CounterIntegrationTest.java[CounterIntegrationTest.java]**

```java
```
1. Mock incoming messages from the `counter-commands` topic.
2. Mock outgoing messages from the `counter-events` topic.

#### Testing with metadata

Typically, messages are published with associated metadata. If you want to construct your own `Metadata` to be consumed by a service or make sure the messages published out of your service have specific metadata attached, you can do so using the TestKit, as shown below.

**{sample-base-url}/event-sourced-counter-brokers/src/test/java/counter/application/CounterIntegrationTest.java[CounterIntegrationTest.java]**


```
1. Build a `CloudEvent` object with the 3 required attributes, respectively: `id`, `source` and `type`.
2. Add the subject to which the message is related, that is the `counterId`.
3. Set the mandatory header "Content-Type" accordingly.
4. Publish the message along with its metadata to topic `commandsTopic`.
5. Upon receiving the message, access the metadata.
6. Assert the headers `Content-Type` and `ce-subject` (every CloudEvent header is prefixed with "ce-") have the expected values.

#### One Suite, Multiple Tests

When running multiple test cases under the same test suite and thus using a common TestKit instance, you might face some issues if unconsumed messages from previous tests mess up with the current one. To avoid this, be sure to:

* have the tests run in sequence, not in parallel;
* clear the contents of the topics in use before the test.

As an alternative, you can consider using different test suites which will use independent TestKit instances.

**{sample-base-url}/event-sourced-counter-brokers/src/test/java/counter/application/CounterIntegrationTest.java[CounterIntegrationTest.java]**


```
1. Run this before each test.
2. Clear the topic ignoring any unread messages.

**📌 NOTE**\
Despite the example, you are neither forced to clear all topics nor to do it before each test. You can do it selectively, or you might not even need it depending on your tests and the flows they test.

### External Broker

To run an integration test against a real instance of Google PubSub (or its Emulator) or Kafka, use the TestKit settings to override the default eventing support, as shown below:

**{sample-base-url}/event-sourced-counter-brokers/src/test/java/counter/application/CounterWithRealKafkaIntegrationTest.java[CounterWithRealKafkaIntegrationTest.java]**

```java
```

## Multi-region replication

Consumers are not replicated directly in the same way as for example [Event Sourced Entity replication](event-sourced-entities.adoc#_replication). A Consumer receive events from entities in the same service, or another service, in the same region. The entities will replicate all events across regions and identical processing can occur in the consumers of each region.

A Consumer can also receive messages from a broker topic, and that could be regional or global depending on how the message broker is configured.
