# Troubleshooting

This page provides troubleshooting advice for errors and issues that you might encounter when using Akka. If come across an issue that is not listed here, let us know using any of the below options.

## Support

* Check out [Frequently Asked Questions](support:frequently-asked-questions.adoc).
* Email us at mailto:akka-support@lightbend.com[] to provide feedback or get help.
* Check out the latest discussions about Akka at [https://discuss.akka.io/, window="new"](https://discuss.akka.io/).

## Update your Akka CLI

We make frequent changes and updates to the Akka CLI to give you a great experience. Make sure that you’re using at least the latest supported version ({akka-cli-min-version}), and preferably the latest version.

**📌 NOTE**\
You can check the version of the Akka CLI you have by running `akka version`.

## How to resolve code generation errors

When you see the following error:

```
[ERROR] /path/to/file.proto [0:0]: --akka-grpc_out: protoc-gen-akka-grpc: Plugin output is unparseable: [0.001s][warning][os,container] Duplicate cpuset controllers detected. Picking /sys/fs/cgroup/cpuset, skipping /host/sys/fs/cgroup/cpuset.
(...)
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  1.071 s
[INFO] Finished at: 2022-03-07T15:31:49Z
[INFO] ------------------------------------------------------------------------
[ERROR] Failed to execute goal org.xolstice.maven.plugins:protobuf-maven-plugin:0.6.1:compile (protobuf) on project customer-registry: protoc did not exit cleanly. Review output for more information. -> [Help 1]
```

This problem is caused by JDK17 [reporting some warnings to `stdout` instead of `stderr`, window="new"](https://bugs.openjdk.java.net/browse/JDK-8270087). The easiest way to resolve this is to avoid the situation leading to the warning, or switching to a JDK version without this bug, like JDK11.

## How to resolve service unavailable or imagePullBackoff errors

When you deploy a service to Akka, and it cannot pull the service image, the status will display `unavailable` or `imagePullBackoff`, as shown in the example below.

![Pull Status](reference:pull-status-one.png)

There are two primary reasons as to why this error might occur. Review each case below to see if it fits your particular scenario.

### Case 1: Invalid URL

It’s probable that the error is happening because there is a bad value for the Docker image URL used when creating the service. For example, say the URL used is
`gcr.io/akka-public/samples-js-value-entity-shopping-cart:0.0.81818`
An invalid value anywhere within the Name or URL triggers the `ImagePullBackoff` error. In this case, the tag used, `0.0.81818`, does not exist.

**To resolve this issue, look for the following in the URL:**

* Typos
* Missing components
* Additional components

### Case 2: Invalid or absent credentials
The second most likely scenario for this status is when a developer specifies an image in a private repository, but fails to provide Docker credentials, or supplies incorrect Docker credentials. If this is the issue the status will appear as shown in the example below. Note that `unauthorized` will be appended at the end of the status.

In this case, the provided  image name `gcr.io/some-private-repository/akka-application:1.0.0` is completely valid. However, it requires container registry credentials to be setup.

The same status message will appear within the System Lifecycle events window.

**Options to resolve this issue include:**

* Use a public repository
* Supply your  [credentials](operations:projects/external-container-registries.adoc), and validate that they are correct.

## How to resolve errors when my deployment cannot start

It is possible that a user created function may fail, or cause a service to fail. Any user function errors that prevent the Akka runtime from starting (such as, mis-configured services), will be reported through to the logs with an error message.

These error messages include:

* An error code
* A detailed description of the error
* The protobuf source location, if appropriate

The log will also contain links to the documentation. The documentation links will be to specific sections for some error codes, otherwise the link will be to the appropriate Akka SDK section.

**To resolve this type of issue:**

1. Review the logs
2. Note any key information
3. Peruse the relevant (linked) documentation
4. Debug the user code locally
5. Test

## How to resolve errors when the runtime doesn't start

This should not happen. Lightbend does not expect any broken runtime releases to be deployed. However, if a service doesn’t start, and there are no errors logged which indicate a problem with your code, then an Akka Runtime failure is a remote possibility.

**Steps to resolve:**

If you think that you are encountering a failing Akka Runtime, the only way to resolve the issue is to log into your Akka account and contact customer support.
