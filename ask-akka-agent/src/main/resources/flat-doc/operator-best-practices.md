# Operator best practices

## Regionalization precautions
### Primary selection mode
Akka services have two different modes, **static** or **dynamic**, which controls how they perform replication for stateful components. This is outlined in  [Selecting primary for stateful components](operations:regions/index.adoc#selecting-primary). It is important to note that setting this mode has the following implications for your project.

#### Event Sourced Entities 
If the service is set to static primary selection mode Event Sourced Entities will use the primary project region as their primary data region. They will still replicate events, and hence state, to all regions in the project, but will only be writeable in the primary. Akka will route update requests to this region from any endpoint. If the primary selection mode is dynamic then each entity instance will use the region it was created in as its primary data region and be writeable only in that region. Again Akka will forward write requests to the appropriate region on a per instance basis.

#### Workflows
Workflows handle writes, reads and forwarding of requests in the same way as Event Sourced Entities, with the addition that actions are only performed by the primary Workflow instance.

#### Key Value Entities
Static primary selection mode impacts Key Value Entities by specifying one region, the primary region, to be the source for all Key Value Entities in the project. Routing for Key Value Entities automatically forwards all requests from any regional endpoint to this primary region. 

### Primary region

Changing primary regions is a serious operation and should be thought out carefully. Ideally you plan this ahead of time and synchronize the regions by allowing the replication lag to drop to zero. You can put the project into a read only mode that will stop any writes from happening if you want to be sure that there will be zero data collisions when you change the primary.

**📌 NOTE**\
At this time [Key Value Entities](java:key-value-entities.adoc) do not replicate data between regions, but Akka will route all traffic to the correct region for reads and writes. If you change the primary region on a project with Key Value Entities the current state of the entities will be lost. 

### Container registries
Container registries are regional in Akka. If you decide to use [operations:projects/external-container-registries.adoc](operations:projects/external-container-registries.adoc) be aware that you should have container registries in or near each of the regions in your project. If you only have your container images in one place and that place becomes unavailable your services will not be able to start new instances.
