# Data migration

Akka allows exporting and importing data to and from your services.

* Migrating data between environments
* Bootstrapping development environments with data
* Migrating data from an existing system into Akka
* Migrating data out of Akka
* Disaster recovery - note, Akka already backs up all data for disaster recovery purposes

Akka exports/imports data to/from local cloud object stores. If your service is deployed to an AWS region, then you can export/import data to/from S3, and if GCP, then to/from GCS. Event sourced entities and value entities are supported, however at present views are not supported.

The export format can either be protobuf or line separated JSON.

## Prepare

Before you can perform an export or import, you will need to setup your Akka project to be able to access an object store in your cloud provider.

### Preparing on AWS

On AWS, you will need to:

1. Create an S3 bucket for the export/import to be written to or read from.
2. Create a user for Akka to use to perform operations on S3.
3. Create an IAM policy that grants allow permission for operations on the S3 bucket and objects in that bucket.
4. Attach the IAM policy to user created in step 2.
5. Create an access key for the user created in step 2.
6. Place the access key created in step 5 in an Akka secret.

#### Create an S3 bucket

We recommend creating an S3 bucket in the same region as the Akka region your service is running in. If you already have a bucket that you would like to use for this, you can skip this step. For the purposes of these instructions, we’re going to call the bucket `my-akka-bucket`.

Instructions for creating a bucket in AWS can be found [here, window="new"](https://docs.aws.amazon.com/AmazonS3/latest/userguide/create-bucket-overview.html).

#### Create a user

For the purposes of these instructions, we’re going to call the user `my-akka-user`. Instructions for creating users in AWS can be found [here, window="new"](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).

#### Create an IAM policy

For imports, the IAM policy must grant `ListBucket` permissions on the bucket, and `GetObject` permissions on the object paths you wish to export to. For exports, `PutObject` and `DeleteObject` will also be needed on the object paths. Here is an example policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::my-akka-bucket",
                "arn:aws:s3:::my-akka-bucket/*"
            ]
        }
    ]
}
```

Instructions for creating IAM policies in AWS can be found [here, window="new"](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html).

#### Attach IAM policy to user

Having created the policy, you can now attach the policy to the user you created earlier. Instructions for doing that can be found [here, window="new"](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html).

#### Create an access key

Now that the user has the right permissions, you need to create an access key for that user. Instructions for doing this can be found [here, window="new"](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html). Copy the access key ID and secret access key for use in the next step.

#### Create an Akka secret with the access key

Now the access key that you created needs to be given to Akka. This can be done by creating an Akka secret. We’re going to call this secret `my-credentials`:

```bash
akka secrets create generic my-credentials \
  --literal access-key-id=C2VJCMV0IHNLY3JLDCBZZWNYZXQK \
  --literal secret-access-key=dGhpcyBpcyB2ZXJ5IHNlY3JldCBpcyBpdCBub3QK
```

Note that the keys `access-key-id` and `secret-access-key` can be called by other names, but these are the default names that the data management tool expects, so using these names will require less configuration later on.

### Preparing on GCP

On GCP, you will need to:

1. Create an GCS bucket for the export/import to be written to or read from.
2. Create a service account for Akka to use to perform operations on GCS.
3. Grant the service account access to the GCS bucket.
4. Create service account key for the service account.
5. Place the service account key JSON in an Akka secret.

#### Create a GCS bucket

We recommend creating a GCS bucket in the same region as the Akka service is running. If you already have a bucket that you would like to use for this, you can skip this step. For the purposes of these instructions, we’re going to call the bucket `my-akka-bucket`.

Instructions for creating a bucket in GCS can be found [here, window="new"](https://cloud.google.com/storage/docs/creating-buckets).

#### Create a service account

For the purposes of these instructions, we’re going to call the user `my-akka-service-account`. Instructions for creating service accounts in GCP can be found [here, window="new"](https://cloud.google.com/iam/docs/service-accounts-create).

#### Granting access

For exports, you will need to grant the service account the Storage Object Admin role to the bucket (`roles/storage.objectAdmin`). For imports, you will need to grant the service account the Storage Object Viewer role to the bucket (`roles/storage.objectViewer`). Instructions for managing IAM policies for buckets can be found [here, window="new"](https://cloud.google.com/storage/docs/access-control/using-iam-permissions).

#### Create the service account key

You will need to create a JSON service account key for the `my-akka-service-account` for Akka to use to access the bucket. This can be done by following [these instructions, window="new"](https://cloud.google.com/iam/docs/keys-create-delete). Once the key is created, place it in a file called `key.json`.

#### Create an Akka secret

You now need to place the previously created key in an Akka secret. For the purpose of these instructions, we’re going to call this secret `my-credentials`. While the name of the file in the secret can be anything, we recommend `key.json` as this is the default that subsequent commands will use.

```bash
akka secrets create generic my-credentials --from-file key.json=path/to/key.json
```

## Data format

The format that Akka exports data to/from can either be JSON or protobuf. By default, the exports are gzipped.

### Protobuf

The protobuf schema for the export can be found [here](#attachment$data_management_schema.proto). While an export can be parsed and formatted as a single protobuf message, for large exports, this may not be practical or possible. Instead, we recommend a streaming approach for reading and writing exports.

#### Writing exports as streams

For streaming exports, we can take advantage of the fact that writing a single protobuf message out to a stream with a repeating field many times will result in a single large message with the entries from each message written being concatenated into one large repeating field.

```java
public void export(Iterable<EventSourcedEntityEvent> events) throws IOException {
    var fileStream = new FileOutputStream("my-export.binpb");
    var stream = CodedOutputStream.newInstance(fileStream);

    // First write the header
    Export.newBuilder()
            .setVersion("v1")
            .setExportHeader(ExportHeader.newBuilder()
                            .setId("my-export")
                            .setRecordType(ExportRecordType.EVENT_SOURCED_ENTITY_EVENT)
                    ).build()
            .writeTo(stream);

    for (var event : events) {
        // Now write each event as if it was a single export message with a single records field.
        // This has the effect of concatenating the event into the records field of the
        // previously written message.
        Export.newBuilder()
                .addRecords(event.toByteString())
                .build()
                .writeTo(stream);
    }

    // Flush and close.
    stream.flush();
    fileStream.close();
}
```

#### Reading exports as streams

Reading exports is a little more complex, it requires using the protobuf `CodedInputStream` class, but is nonetheless straight forward.

```java
public void readExport(File file) throws IOException {
    var extensionRegistry = ExtensionRegistry.newInstance();
    var stream = CodedInputStream.newInstance(new FileInputStream(file));
    int tag = stream.readTag();
    while (tag != 0) {
        switch (WireFormat.getTagFieldNumber(tag)) {
            case 1:
                // Version field
                var version = stream.readString();
                if (!version.equals("v1")) {
                    throw new RuntimeException("Unknown export version: " + version);
                }
                break;

            case 2:
                // Header field
                var headerBuilder = ExportHeader.newBuilder();
                stream.readMessage(headerBuilder, extensionRegistry);
                var header = headerBuilder.build();
                if (header.getRecordType() != ExportRecordType.EVENT_SOURCED_ENTITY_EVENT) {
                    throw new RuntimeException("Expected event sourced entity events, but got: " + header.getRecordType().name());
                }
                break;

            case 3:
                // A record
                var builder = EventSourcedEntityEvent.newBuilder();
                stream.readMessage(builder, extensionRegistry);
                var event = builder.build();
                handleEvent(event);
                break;
        }
        tag = stream.readTag();
    }
}
```

### JSON

JSON exports use the protobuf schema specified [here](#attachment$data_management_schema.proto), with the exception that the JSON is formatted as newline separated JSON.

The first line should be the `Export` object with no `records` fields set. Each subsequent line should be a record for the records field.

In addition to this, JSON payloads in the export are encoded specially. Rather than encoding the JSON bytes as base64 in the `value` field of the protobuf `Any` message, the JSON message is placed in a field called `json`, with any type associated with the message being encoded in a field called `type`. Otherwise, it gets encoded as a regular protobuf `Any` message, with the bytes base64 encoded in the `value` field, and the `typeUrl` field populated with the type of the protobuf message.

Here is an example JSON export:

```json
{"version":"v1","exportHeader":{"recordType":"EVENT_SOURCED_ENTITY_EVENT"}}
{"entityType":"asset","entityId":"1","seqNr":1,"timestamp":"2024-01-12T00:19:14.006111Z","payload":{"type":"asset-moved","json":{"location":"workshop"}}}
{"entityType":"asset","entityId":"1","seqNr":2,"timestamp":"2024-01-12T00:20:29.782976Z","payload":{"type":"asset-moved","json":{"location":"toolshed"}}}
```

## Running exports

The `akka service data export` command can be used to run an export. For example:

```bash
akka service data export assets --s3-secret my-credentials \
  --s3-bucket my-bucket --include-event-sourced-entities
```

The format of the export is controlled using the `--format` flag, which can either be `protobuf` or `json`. The default is `protobuf`. Additionally, the compression algorithm that is used to compress/decompress the export can be specified using the `--compression` flag, which can either be `gzip` or `none`, with the default being `gzip`.

To control what gets exported, the `--include-event-sourced-entities` and `--include-value-entities` flags can be used.

By default, the export will be run synchronously, displaying the progress of the export as it runs. Cancelling the export command will not stop the export, it will continue to run in the background. The export command can be run asynchronously by passing the `--async` flag.

### Exporting to AWS S3

To export to S3, you must supply the S3 credentials secret via the `--s3-secret` argument. You also need to supply the bucket name using the `--s3-bucket` argument, and if that bucket doesn’t live in the same region as your service is running, you must supply the region name with the `--s3-region` argument.

An optional prefix can be prepended to the names of the files that get exported, this can be specified using the `--s3-object-prefix` argument.

### Exporting to GCS

To export to GCS, you must supply the GCS credentials secret via the `--gcs-secret` argument. You also need to supply the bucket name using the `--gcs-bucket` argument.

An optional prefix can be prepended to the names of the files that get exported, this can be specified using the `--gcs-object-prefix` argument.

## Running imports

The `akka service data import` command can be used to run an export. For example:

```bash
akka service data import assets --s3-secret my-credentials \
  --s3-bucket my-bucket --include-event-sourced-entities
```

When importing to a service, the first thing Akka will do is pause that service. If the service is running while the import is happening, the services data may be corrupted. If the import succeeds, Akka will resume the service.

If you wish to clear the services database before importing, use the `--truncate` flag. This will delete all existing data in the service.

The names of the files to import can either be specified explicitly, by passing `--event-sourced-entity-object`, `--event-ousrced-entity-snapshot-object` and/or `--value-entity-object` flags, or Akka can use the default filenames that it selects when creating an export. In the latter case, `--s3-object-prefix` and `--gcs-object-prefix` can be used, and `--include-event-sourced-entities` and `--include-value-entities` can be used to control which export types Akka will look for.

The flags for specifying credentials and object names specific to S3 and GCS are the same as for exporting.

## Managing tasks

When an import or export task is submitted, before anything is done, Akka will validate the credentials and other aspects of the task to ensure that it can be issued. Once that validation is complete, the task will be submitted to a task queue for processing. The status of the task can be queried by running `akka service data list-tasks`.

If a task fails, Akka will attempt to re-run it, using an exponential back-off. To cancel a task permanently, `akka service data cancel` can be used.

If you wish to watch a task that is running, you can use `akka service data watch`.

## See also

* [`akka service data` commands](reference:cli/akka-cli/akka_services_data.adoc#_see_also)
