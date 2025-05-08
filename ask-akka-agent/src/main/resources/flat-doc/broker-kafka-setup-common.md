## Delivery characteristics

When your application consumes messages from Kafka, it will try to deliver messages to your service in 'at-least-once' fashion while preserving order.

Kafka partitions are consumed independently. When passing messages to a certain entity or using them to update a view row by specifying the id as the Cloud Event `ce-subject` attribute on the message, the same id must be used to partition the topic to guarantee that the messages are processed in order in the entity or view. Ordering is not guaranteed for messages arriving on different Kafka partitions.

**⚠️ WARNING**\
Correct partitioning is especially important for topics that stream directly into views and transform the updates: when messages for the same subject id are spread over different transactions, they may read stale data and lose updates.

To achieve at-least-once delivery, messages that are not acknowledged will be redelivered. This means redeliveries of 'older' messages may arrive behind fresh deliveries of 'newer' messages. The _first_ delivery of each message is always in-order, though.

When publishing messages to Kafka from Akka, the `ce-subject` attribute, if present, is used as the Kafka partition key for the message.

## Testing Akka eventing

See [Testing Akka eventing](operations:projects/message-brokers.adoc#_testing)
