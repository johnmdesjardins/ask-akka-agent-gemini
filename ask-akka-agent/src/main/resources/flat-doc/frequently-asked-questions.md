# Frequently Asked Questions

**💡 TIP**\
If your question doesn’t appear on this page, try searching the documentation for keywords or check out our [community forum, window="new"](https://discuss.akka.io/).

## What are examples of Akka use cases?

Any use case requiring high throughput and low latency processing of data is solved efficiently with Akka. Some examples include:

* IoT platforms
* Real-time financial services
* Modern eCommerce systems
* Streaming media
* Internet-based gaming
* Factory automation
* Telemedicine
* Chatbots

## How is Akka different from other serverless offerings?

When building and managing services, developers typically need to manage several layers under the logic. For example, databases, caches, and message brokers must be configured and maintained. When services must be highly scalable, low latency, and stateful the task becomes incredibly difficult and cumbersome. Akka [components](reference:glossary.adoc#component) allow the developer to focus in on innovative business logic while Akka manages the backend. Akka gives EVERY developer the power to efficiently build robust services that scale up and down as needed.

## What are the key benefits of Akka?

* Full focus on business logic–eliminates time spent setting up back-end / guides best practices approach
* No additional infrastructure that slows down velocity and adds to technical debt accumulation is required
* Flexible way to drive performance while keeping costs (infrastructure & operational) to a minimum
* Any developer can use–no special skills required
* No stateful limitations like with “traditional” Function-as-a-Service platforms
* Distributed teams–teams can work seamlessly together regardless of location

## What makes Akka unique?

* Akka has a simple, API-driven programming model that makes it easy for developers to define the data that they need and manages that data behind the scenes so that it is available automatically at runtime.
* Unlike traditional Function-as-a-Service platforms, Akka offers tightly integrated [components](reference:glossary.adoc#component) that developers don’t have to assemble themselves in order to build stateful services and APIs.
* Unlike existing stateful serverless platforms, Akka offers a wide range of data modeling and persistence options (like Event Sourcing and CRDTs) so developers can choose what fits their use case best.

## What are the business benefits?

In one sentence: "High performance and very low latency in an extremely cost-efficient manner with no database required."

In a few more words, with Akka, companies can:

* Provide higher agility to ever-changing market demands: Legacy infrastructure and architectures make it very expensive to deliver scalable solutions quickly. Akka lets you circumvent all those technical limitations.
* Increase the speed to innovation: Distributed compute and data have long been purview of expert engineers proficient in narrow scope of programming languages. Akka makes building these kinds of applications straight-forward.
* Lower infrastructure costs: Scalable cloud architectures are difficult to operate, require large teams of costly resources and run significant risk of unexpected budget overages. Akka will charge for what you use, not what you might need (when generally available).

## What are the benefits for developers?

* Any developer can get going in 5 minutes or less
* Developers can use the language, framework and IDE of their choice 
* No database set up or maintenance
* No maintenance
* Model domain objects in code, not in database tables

## Is Akka good for large scale systems?

Yes! Akka is a single globally distributed state model. Teams anywhere in the world can work in their own system, with their own languages and tools using the same state models. 

## Does Akka leverage reactive architecture?

Akka leverages the proven Akka reactive architecture for building stateful, high-performance, business-critical systems, without the developer needing to understand the complexities of Akka itself or distributed systems architecture in general.

## What are the resource limits of an Akka service?

Individual requests and responses, states and events can in general have a payload size up to 12 Mb.

Requests and responses from entities are more limited and may not be larger than roughly 500 Kb.

## Free Trial Accounts

### Who can sign up for a trial?

We know that you want to "try before you buy" so everyone can sign up for a free trial! Whether you’re a back-end developer, an architect, a serverless expert, or have a completely different role you can sign up for Akka. Our only request is that you sign up with your company email address (we promise we won’t spam you or try to sell you anything). Your trial is completely free, we give you a certain amount of credits, and if you run out drop us an email at mailto:akka-support@lightbend.com[] to request more and extend your trial.

### Are there any limits to what I can deploy?

All services are limited to a maximum of 10 instances. This will limit the `requests per second (rps)` for the services. The maximum `rps` is dependent also on the type of service being created and the business logic implemented. While `rps` attainment of multiples of thousands is possible, even within the constraint of the 10 instances, generally hundreds of requests per second should be expected. To support more scale, this limit can be increased via a support request.

All projects on Akka are limited to a maximum data storage size of 2TB. If you anticipate having more than 500GB of data in one project, please contact us at mailto:akka-support@lightbend.com[akka-support@lightbend.com] so that we can help optimize your data storage and performance. Changes are dependent on use case and business priority.

### How does Akka work within my stack and integrate with my other applications?

Akka leverages Protocol Buffers as the description of the API. Using these Protocol Buffers, you can generate code to call services on Akka. Akka also supports adding HTTP endpoints to your service so you can use RESTful invocations. Calling other services from Akka works in the same way you normally would.

### How does Akka ensure my data is secure?

In order to create the most secure environment possible, each project that you create on Akka gets a unique namespace. Using a namespace allows Akka to limit traffic to only the services that you expose to the outside world. We also leverage our Cloud Providers' features to keep your data secure.

All data stored by Akka is encrypted at rest; this includes, but is not limited to:

* Service state.
* Information about projects, services, and users.
* Deployment configuration such as environment variables and Docker credentials.

Encryption is done using AES256, with a FIPS 140-2 validatedfootnote:fips[https://csrc.nist.gov/projects/cryptographic-module-validation-program/Certificate/3318, window="new"] module of the cryptographic library 'Tink'.

**💡 TIP**\
For a more detailed overview of encryption and key management in Google Cloud products see
[Encryption at rest in Google Cloud, window="new"](https://cloud.google.com/security/encryption-at-rest/default-encryption).

### Will Akka meet my company security standards? 

We take data security and privacy very seriously. If you have any specific questions on this topic, please contact us.

### Can I upgrade my trial project to a paid plan?

The short answer is no. Please see the documentation on [upgrading to a paid plan](support:paid-plans.adoc) for more information.

## Paid Accounts

### How do I purchase a paid plan?

[Contact Akka](https://akka.io/contact-us) to purchase a paid plan. See the [pricing page](https://akka.io/pricing) for purchase options.

## What if I have additional questions or want to provide feedback?

* Email us at mailto:akka-support@lightbend.com[] to provide feedback or get help. One of our team will get back to you as soon as possible.
* Check out the latest discussions about Akka at [https://discuss.akka.io/, window="new"](https://discuss.akka.io/).
