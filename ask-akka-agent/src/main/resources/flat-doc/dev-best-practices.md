# Developer best practices

## Reactive principles

Akka is ideally suited for the creation of _Microservices_. Microservices generally follow the Unix philosophy of "Do one thing and do it well." Akka allows developers to build systems that follow [the Reactive Principles, window="new"](https://principles.reactive.foundation/) without having to become distributed data or distributed computing experts. As a best practice, following the Reactive Principles in your design makes it easier to build distributed systems. [Akkademy, window="new"](https://akkademy.akka.io/learn/public/catalog/view/3) offers free courses on Reactive Architecture.

## Domain Driven Design

Domain-driven design (DDD) is the concept that the structure and language of software code (class names, class methods, class variables) should match the business domain. For example, if a software processes loan applications, it might have classes such as LoanApplication and Customer, and methods such as AcceptOffer and Withdraw. &mdash; [Wikipedia, window="new"](https://en.wikipedia.org/wiki/Domain-driven_design)

Akka makes it easy and fast to build services using the concepts of Domain Driven Design (DDD). While it’s not necessary to understand all the ins and outs of Domain Driven Design, you’ll find a few of the concepts that make building services even more straightforward below. See [Akka architecture model](concepts:architecture-model.adoc) for more information on the role of your domain model in Akka and how Akka layers your architecture. Akkademy provides a free course on [Domain Driven Design, window="new"](https://akkademy.akka.io/learn/courses/6/reactive-architecture2-domain-driven-design).

### Bounded context

[Bounded context, window="new"](https://martinfowler.com/bliki/BoundedContext.html) is a concept that divides large domain models into smaller groups that are explicit about their interrelationships. Normally a microservice is a bounded context. You _may_ choose to have multiple bounded contexts in a microservice.

Each of these contexts will have autonomy to evolve the models it owns. Keeping each model within strict boundaries allows different modelling for entities that look similar but have slightly different meaning in each of the contexts. Each bounded contact should have its own domain, application, and API layers as described in [Akka architecture model](concepts:architecture-model.adoc).

![Bounded Context](bounded-context.svg)

### Events first

Defining your data structures first, and splitting them into bounded contexts, will also help you think about all the different interactions your data needs to have. These interactions, like `ItemAddedToShoppingCart` or `LightbulbTurnedOn` are the events that are persisted and processed in Akka. Defining your data structures first, makes it easier to think about which events are needed and where they fit into your design. These data structures and events will live in your domain model layer as described in [Akka architecture model](concepts:architecture-model.adoc).

### Message migration

Behind the scenes everything in Akka is ultimately message driven. Plan for the evolution of your messages. Commands and events use data structures that often must evolve over time. Fields get added, fields get removed, the meaning of fields may change. How do you handle this over time as your system grows and evolves? Akka will make this easier, but you are ultimately responsible for schema evolution. 

## Right-sizing your services

Each Akka Service consists of one or more Components and is packaged and deployed as a unit. Akka services are deployed to Akka Projects. Thus, when you couple multiple business concerns by packaging them in the same service, even under separate bounded contexts, you limit the runtime’s ability to make the most efficient decisions to scale up or down.

### How big to make your services

Deciding how many components and concepts to fit into a single service can be complex. Generally smaller is better hence the name microservices often being used. When you design a series of small services that don’t share code and can be deployed independently, you reap these benefits:

* **Your development velocity is higher**. It is faster and less complex to write and debug them because they focus on a small set of operations, usually around a single business concern (be it with one or multiple types of [_Entities_](reference:glossary.adoc#entity)).
* **Your operating velocity is higher**. Using smaller independent services simplifies operational concerns and provide scalability because they can be deployed, stopped and started independently of the rest of the system.
* **You can scale the services independently** to handle variations in load gracefully. If properly designed, multiple instances of the service can be started up when necessary to support more load: for example, if your system runs on Black Friday and the shopping cart service gets super busy, you can spin up more shopping carts to handle that load without also having to start up more copies of the catalog service. When the load decreases, these extra instances can be removed again, minimizing resource usage.
* **You reduce the failure domain / fault boundary**. Independent services handle failures gracefully. Components interact asynchronously with the rest of the world through messages and [_commands_](reference:glossary.adoc#command). If one instance, or even a whole service, fails, it is possible for the rest of the system to keep going with reduced capabilities. This prevents cascading failures that take down entire systems.
* **Your development team is more productive**. A team can focus on features of a single service at a time, without worrying about what other services or teams are doing, or when they are releasing, allowing more parallel teams to focus on other services, allowing your development efforts to scale as needed.
* **You gain flexibility for upgrades**. You can upgrade services in a "rolling" fashion, where new instances are started before older instances are removed, allowing new versions to be deployed with no downtime or interruption.
* **You gain security**. Services serve as a security boundary both in your system overall and between teams.
* **You get granular visibility into costs**. Services are all billed separately, so it’s easier to see and understand costs and billing on a per-service basis if you break your services up in some way that matches your organizational needs overall.
