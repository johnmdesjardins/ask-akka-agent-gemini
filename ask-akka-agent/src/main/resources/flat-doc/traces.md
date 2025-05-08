# View traces 

Akka projects have the traces dashboard built-in as part of the Control Tower in the Akka Console. This is available out-of-the-box. You can find your traces here as long as you have [enabled the traces](operations:observability-and-monitoring/observability-exports.adoc#activating_tracing) in your service.

In the top panel you have the list of traces you can inspect. When you click on one of them, the contents of the trace are displayed in the panel below. As shown in the figure. 

![operations:dashboard-control-tower-traces-screenshot](operations:dashboard-control-tower-traces-screenshot.png)

You can filter by time to select traces in the desired time period. And further select the spans of a trace to find out more details about its attributes and resources, as shown in the figure. 

![operations:dashboard-control-tower-span-screenshot](operations:dashboard-control-tower-span-screenshot.png)
