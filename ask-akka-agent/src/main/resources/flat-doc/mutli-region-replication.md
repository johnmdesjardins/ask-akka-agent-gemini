## Multi-region replication

Stateful components like Event Sourced Entities or Workflow can be replicated to other regions. This is useful for several reasons:

* resilience to tolerate failures in one location and still be operational, even multi-cloud redundancy
* possibility to serve requests from a location near the user to provide better responsiveness
* load balancing to be able to handle high throughput

For each stateful component instance there is a primary region, which handles all write requests. Read requests can be served from any region.

Read requests are defined by declaring the command handler method with `ReadOnlyEffect` as return type. A read-only handler cannot update the state, and that is enforced at compile time.

**{sample-base-url}/shopping-cart-quickstart/src/main/java/shoppingcart/application/ShoppingCartEntity.java[ShoppingCartEntity.java]**


```

Write requests are defined by declaring the command handler method with `Effect` as return type, instead of `ReadOnlyEffect`. Write requests are routed to the primary region and handled by the stateful component instance in that region even if the original call to the instance with the component client was made from another region.

State changes (Workflow) or events (Event Sourced Entity) persisted by the instance in the primary region are replicated to other regions and processed by corresponding instance there. This means that the state of the stateful components in all regions are updated from the primary.

The replication is asynchronous, which means that read replicas are eventually updated. Normally within a few milliseconds, but if there is for example a problem with the network between the regions it can take longer time for the read replicas to become up to date, but eventually they will.

This also means that you might not see your own writes, immediately. Consider the following:

* send a write request and that is routed to a primary in another region
* after receiving the response of the write request, you send a read request that is served by the non-primary region
* the stateful component instance in the non-primary region might not have seen the replicated changes yet, and therefore replies with "stale" information

If it’s important for some read requests to have seen latest writes you can use `Effect` for such command handler, even though it is not persisting any events. Then the request will be routed to the primary and use the latest fully consistent state.

The operational aspects are described in [operations:regions/index.adoc](operations:regions/index.adoc).
