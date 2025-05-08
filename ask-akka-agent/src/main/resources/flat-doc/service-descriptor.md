# Service Descriptor reference

## Akka Service descriptor

A _Service Descriptor_ in Akka defines the configuration for a service resource. This is used by the `akka service apply command` for deploying a service together with a detailed configuration. Below is the detailed reference for each part of the service descriptor and its fields.

The Service Descriptor is used by the `akka service apply` command, described in [deploying a service with a descriptor](operations:services/deploy-service.adoc#apply).

| Field | Type | Description |
| --- | --- | --- |
| **name** | string _required_ | The name of the service |
| **service** | [ServiceSpec](#servicespec) _required_ | Specification for the Akka service |

### ServiceSpec

The **ServiceSpec** defines the detailed configuration of an Akka service, including container images, environment variables, and resource management.

| Field | Type | Description |
| --- | --- | --- |
| **image** | string _required_ | The name of the docker image for the service container |
| **env** | [][EnvVar (Environment Variables)](#envvar-(environment-variables)) | Environment variables to be set in the service’s container |
| **jwt** | [ServiceJwt](#servicejwt) | JWT configuration for the service |
| **resources** | [ServiceResources](#serviceresources) | Resource configuration for the service, including instance size and autoscaling |
| **volumeMounts** | [][VolumeMount](#volumemount) | Volume mounts to mount in the service’s container |
| **telemetry** | [][ServiceTelemetry](#servicetelemetry) | Telemetry configuration for the service |
| **replication** | [ServiceReplication](#servicereplication) | Replication configuration for stateful components in the service |

### EnvVar (Environment Variables)

| Field | Type | Description |
| --- | --- | --- |
| **name** | string _required_ | The name of the environment variable |
| **value** | string | The value of the environment variable. Either this must be set, or **valueFrom** must be set, but not both. |
| **valueFrom** | [EnvVarSource (referencing secrets from Environment Variables)](#envvarsource-(referencing-secrets-from-environment-variables)) | Configuration for where to get the value of the environment variable from. Either this must be set, or **value** must be set, but not both. |

### EnvVarSource (referencing secrets from Environment Variables)

The source for an environment variable.

| Field | Type | Description |
| --- | --- | --- |
| **secretKeyRef** | [SecretKeyRef (details of a referenced secret)](#secretkeyref-(details-of-a-referenced-secret)) _required_ | A reference to a secret. |

### SecretKeyRef (details of a referenced secret)

A reference to a particular key in a particular secret, used by environment variables.

| Field | Type | Description |
| --- | --- | --- |
| **name** | string _required_ | The name of a configured secret |
| **key** | string _required_ | The name of a key in the specified secret |
| **optional** | boolean | Whether the secret or its key must exist. If true, the service will fail to deploy if the secret or its key doesn’t exist. If false, the service will be deployed with the environment variable unset if the secret doesn’t or its key doesn’t exist. |

### ServiceJwt

The JWT configuration allows a service to manage token signing and validation. Keys are prioritized for matching tokens.

| Field | Type | Description |
| --- | --- | --- |
| **keys** | [][JwtKey](#jwtkey) | List of JWT keys for signing and validation. Order matters. |

The order of **keys** is important. When signing or validating, the first matching key will be used, according to the following rules.

For validating:

* The list is first filtered by all keys capable of validating - that is, any keys for the HMAC algorithm, or any keys for an asymmetric algorithm that have the public key defined.
* If the token being validated defines an issuer (iss), and there is at least one key that has that issuer defined, then the list is filtered to only include keys from that issuer. Otherwise, all keys capable of validating remain as candidates.
* The list is then filtered matching the algorithm. The algorithm only has to match by key type, that is, by HMAC, RSA, ECDSA or EdDSA. A key that has an algorithm of HS256 can be used to validate a token signed by an algorithm of HS512.
* If at this point, there are still multiple keys remaining, then the first key that matches the key id (kid) parameter, if defined, in the token is used, otherwise, the first key of the remaining keys is used.

For signing:

* The list is first filtered by all keys capable of signing - that is, any keys for the HMAC algorithm, or any keys for an asymmetric algorithm that have the private key defined.
* If the token to be signed contains an issuer claim (iss), and there is at least one key that has that same issuer defined, then the list is filtered to only include the keys with that issuer, otherwise, all keys capable of signing remain as candidates. The first key out of the remaining keys is used.

### JwtKey

A key that can be used for Akka’s JWT support.

| Field | Type | Description |
| --- | --- | --- |
| **keyId** | string _required_ | The id of the key. When signing, it will be placed in the key id parameter (kid) of the JWT header. It may be used for matching incoming keys when validating. It is important that, for a given issuer, if two keys have the same id, that those keys must be the same key. Ideally, key ids should be unique across all services. The key id allows JWT keys to be rotated: a new key can be configured with a lower priority on all services that use it. Once that change is pushed out, then the key’s priority, i.e., the order in the list, can be increased so that it is now the key that gets used for signing. Finally, once all JWTs signed by the old key have expired, the old key can be removed. |
| **issuer** | string | The issuer of tokens that use this key. If a token being signed or validated contains an issuer (iss) claim, this will be matched against it. This allows multiple keys for different issuers to be provisioned without conflicting. Setting this parameter is also important if you have keys from multiple issuers, but you don’t trust that one of them won’t try and spoof the other. Since it pins a particular set of keys to only be used to validate that issuer’s token, if the other tries to spoof it, validation will fail. |
| **algorithm** | string _required_ | The algorithm to use this key for. When validating, this secret may be used if the secret for this algorithm is compatible with the algorithm that the token being validated was signed with. Valid values are: * `HMD5` - HMAC with MD5 * `HS224` - HMAC with SHA224 * `HS256` - HMAC with SHA256 * `HS384` - HMAC with SHA384 * `HS512` - HMAC with SHA512 * `RS256` - RSA with SHA256 * `RS384` - RSA with SHA384 * `RS512` - RSA with SHA512 * `ES256` - Elliptic Curve DSA with SHA256 * `ES384` - Elliptic Curve DSA with SHA384 * `ES512` - Elliptic Curve DSA with SHA512 * `Ed25519` - Edward’s Curve DSA |
| **secret** | [ObjectRef](#objectref) _required_ | The configured secret to use for signing or validating. This must be a reference to a secret. The secret must have the following keys defined, depending on the algorithm used: * HMAC algorithms - a key named `secret.key`, containing the bytes of the secret. * Asymmetric algorithms - One or both of `private.key` and `public.key`. If only a `private.key` is supplied, the key will only be used for signing, if only a public key is supplied, the key will only be used for validating. The public key must be formatted as an X.509 PEM public key (with a header, `BEGIN PUBLIC KEY`). The private key must be a PEM PKCS-8 key encoded (with a header, `BEGIN PRIVATE KEY`) according to the algorithm the secret is used for. Alternatively, for RSA algorithms, RSA private keys may be PEM PKCS-1 encoded (with a header, `BEGIN RSA PRIVATE KEY`). The keys must not be encrypted. For ECDSA keys, EC key encoding (`BEGIN EC PRIVATE KEY`) is not supported, and PKCS-8 must be used instead. |

### ObjectRef

A reference to an object, such as a configured secret.

| Field | Type | Description |
| --- | --- | --- |
| **name** | string _required_ | The name of the object. |

### ServiceResources

The configuration for the resources used by an Akka Service.

| Field | Type | Description |
| --- | --- | --- |
| **instanceType** | string | The type of instance to use. Supported values are: * `small` - A small instance. |
| **autoscaling** | [ServiceAutoscaling](#serviceautoscaling) | The autoscaling configuration for a service. Autoscaling is only supported for non-trial projects. |

### ServiceAutoscaling

The configuration for how the Akka service is scaled in response to load.

| Field | Type | Description |
| --- | --- | --- |
| **minInstances** | int | The minimum instances of a service that should be available. Must be at least 1, and no greater than **maxInstances**. May not be greater than 10. |
| **maxInstances** | int | The maximum instances of a service that should be available. Must be at least 1, and no less than **minInstances**. May not be greater than 10. |
| **cpuUsageThreshold** | int | The target CPU usage for autoscaling to achieve. Once CPU usage across all instances exceeds this, the service will be scaled up. Must be at least 1 and no greater than 100. |

### VolumeMount

A volume that should be mounted into the service container.

| Field | Type | Description |
| --- | --- | --- |
| **mountPath** _required_ | string | Path within the container at which the volume should be mounted. Must not contain ':'. |
| **secret** | [SecretVolumeSource](#secretvolumesource) | A secret that should be used to populate this volume. |

### SecretVolumeSource

Adapts a secret into a volume that can be mounted into the service’s container.

| Field | Type | Description |
| --- | --- | --- |
| **secretName** _required_ | string | The name of a secret in the service’s project to mount. |
| **defaultMode** | int | Mode bits to set the permissions on created files from the secret by default. Must be an octal value between 0000 and 0777, or a decimal value between 0 and 511. Defaults to 0644. |
| **optional** | boolean | Specifies whether the container should fail to start if the secret doesn’t exist. |

### ServiceTelemetry

Telemetry configuration for the service.

| Field | Type | Description |
| --- | --- | --- |
| **tracing** | [][ServiceTracing](#servicetracing) | Tracing configuration for the service |

### ServiceTracing

Tracing configuration for the service.

| Field | Type | Description |
| --- | --- | --- |
| **enabled** | boolean | Specifies if the service produces traces or not |

### ServiceReplication

Replication configuration for stateful components, such as Entities and Workflows, in the service. See [Selecting primary for stateful components](operations:regions/index.adoc#selecting-primary) for more information and considerations before changing.

| Field | Type | Description |
| --- | --- | --- |
| **mode** | string | Replication mode. The only supported mode is `replicated-read`. Defaults to `replicated-read`. |
| **replicatedRead** | [ReplicatedRead](#replicatedread) | Configuration of `replicated-read` mode. |

### ReplicatedRead

Replicated read means that writes are handled by one primary replica and reads can be served by any replica.

| Field | Type | Description |
| --- | --- | --- |
| **PrimarySelectionMode** | string | Selection of primary can be `static`, `dynamic` and `none`. * `static` - one region is defined as the primary for the project, and all stateful component instances will use that region as primary * `dynamic` - the primary is selected by each individual component instance based on where the first event is persisted * `none` - read-only mode for all regions, which causes all write requests to be rejected |
