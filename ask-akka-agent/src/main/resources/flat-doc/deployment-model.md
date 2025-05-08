# Deployment model

Akka applications are distributed by design. Although you can run an entire set of complex services on a single machine, they are meant to be distributed. This guide explains deployment and distribution in Akka. 

## Logical deployment

In Akka the logical unit of deployment is a Service. A service contains your components and it deploys into a project. The hierarchy is described below. 

### Project
A project is the root of one or more services that are meant to be deployed and run together. The project is a logical container for these services and provides some common management capabilities. Projects contain a list of [regions](concepts:deployment-model.adoc#_region) that they deploy to. One of the regions will always be the **primary region** which acts as the source of resources to replicate between regions. This will be the first region that deployments roll out to. By default the primary region is the first region specified when [creating a project](operations:projects/create-project.adoc). More detail on regions is covered below in [physical deployment](concepts:deployment-model.adoc#_physical_deployment).

### Service(s)
[operations:services/index.adoc](operations:services/index.adoc) are the core unit of deployment in Akka. They equate to the concept of a microservice and contain all your components and objects as described in the [Akka architecture model](concepts:architecture-model.adoc). A project contains one or more services. Services can be started, stopped, and paused independently. They can also be scaled independently making them also the unit of scale.

## Physical deployment 

Akka services run in a cluster. A cluster is an instance of the Akka runtime which is spread over multiple machines in a given geographical place. We call that place a [region](concepts:deployment-model.adoc#_region). In our cloud service a region corresponds to a region from a cloud infrastructure provider such as AWS, Azure, or Google Cloud. "US East" is an AWS region that contains multiple Availability Zones: for Akka this is just a region. By default Akka spans availability zones in our cloud.

### Region
[operations:organizations/regions.adoc](operations:organizations/regions.adoc) are specific clusters running Akka in a specific place. Regions are designed to run independently for greater availability. They are also designed to replicate data asynchronously between each other. Every Akka [project](concepts:deployment-model.adoc#_project) specifies a list of one or more regions in which it runs.

In addition to your services from a project, a region also has endpoints for your API. You define endpoints within the [API layer](concepts:architecture-model.adoc#_architecture) and Akka will expose them. They will be unique to each region. That is they will have unique DNS, much like AWS services S3 and SQS do.

[Container registries](operations:projects/container-registries.adoc) exist in all Akka.io regions so that the images that are your packaged services are in close proximity to the compute they will run on.

A given cloud provider region _may_ have many Akka regions within it. In this way Akka can scale past any upper bound limits of the infrastructure on which it runs.

### Multiple region by design
Stateful components in Akka have a concept of location, that is region, and are designed to span regions and replicate their data across regions. This is outlined in [state model](concepts:state-model.adoc). These components call the region they were created in their **primary region** and keep track of it throughout their lifetime. This allows Akka to simplify some aspects of distributed computing. 

In Akka projects regional choices are made at deployment time, not development time, allowing you to change your regions over time and even change your primary region. You can also control if your service is in **static** or **dynamic** mode of regionalization, which impacts where the primary copy of component data resides. Static mode marks the primary region of the project as the primary region for all components. Dynamic mode allows components to use the region they are first created in as their primary region. For more information see [operations:regions/index.adoc#selecting-primary](operations:regions/index.adoc#selecting-primary).

By default, most entities will only allow their primary region to change their state, to make this easier Akka will also automatically route state changing operations to the primary region. This routing is asynchronous and durable, meaning network partitions will not stop the write from being queued. This gives you a read anywhere model out of the box that automatically routes writes appropriately.

**📌 NOTE**\
Primary region is also a concept in the context of a project. All projects will have a primary region

If you use more sophisticated state models you can have a write anywhere model. See [state model](concepts:state-model.adoc) for more details.

## Managing physical deployment

You manage a project as a single unit and Akka does all the work to manage each specific region that it spans. When you deploy a service to a project with multiple regions Akka will deploy the service to all of the regions on your behalf. You execute one command, but many are taking place behind the scenes. 

### Operating regions within a project
Regions can be added to or removed from an Akka project while it is running. There is no need to stop the services within the project to do this. 

#### Adding regions
You can add regions to an Akka project and Akka will deploy the services in that project to the new region and expose endpoints. It will also begin replication of all data **(for now that excludes Key Value Entities)**. This replication time will depend on the size of the dataset (state) being replicated and the distance between the regions. Adding regions is a graceful behavior. The new region will be available to serve traffic after being added, but it may take some time until the initial replication is complete. You can monitor replication by monitoring Consumer Lag.

#### Removing regions
There are two ways to remove regions from a project: **graceful** and **emergency**. Their names imply their function. Graceful remove takes time, it marks the region as read-only, and starts to move the origin for all the entities out of the region. This is the preferred way to remove regions as their is no risk of data corruption, even for entities that haven’t implemented conflict resolution strategies. 

Emergency region removal is for emergency scenarios such as the rare times when an infrastructure provider’s region becomes unavailable. Executing an emergency region removal fast ejects the region and reassigns the origin for all entities to the remaining regions. If there are writes in progress for non-CRDT types (i.e. entities that do not implement conflict resolutions e.g. KeyValueEntity) they _could_ be lost or overwritten.

## Next steps

Now that you understand the overall architecture and deployment model of Akka you are ready to learn more about the [Development process](development-process.adoc). 

The following topics may also be of interest.

* [State model](state-model.adoc)
* [java:dev-best-practices.adoc](java:dev-best-practices.adoc)
* [Architecture model](architecture-model.adoc)
