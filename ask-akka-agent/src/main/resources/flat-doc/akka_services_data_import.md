# akka services data import

Import data to a service.

## Synopsis

The `akka service data import` command imports a services data.

```
akka services data import SERVICE [flags]
```

## Options

```
      --async                                              Whether the command should return immediately once the operation has been accepted, or if it should wait for the operation to complete.
      --compression string                                 The compression to use on the export. Either gzip or none. Defaults to gzip. (default "gzip")
      --event-sourced-entity-object stringArray            A storage object name (relative to the bucket and object prefix) to import from. Multiple may be specified. If not specified, the default object names used by the export process are used. Implies --include-event-sourced-entities.
      --event-sourced-entity-snapshot-object stringArray   A storage object name (relative to the bucket and object prefix) to import from. Multiple may be specified. If not specified, the default object names used by the export process are used.
      --format string                                      The format of the export. Either protobuf or json. Defaults to protobuf. (default "protobuf")
      --gcs-bucket string                                  If exporting to GCS, the name of the bucket to export to.
      --gcs-object-prefix string                           If exporting to GCS, a prefix to append to the GCS object name, for example, 'my-export/'
      --gcs-secret string                                  If exporting to GCS, the name of an Akka secret to read the service account key to access GCS from.
      --gcs-secret-key string                              If exporting to GCS, the name of the key inside the Akka secret that contains the service account key. Defaults to key.json. (default "key.json")
  -h, --help                                               help for import
      --include-event-sourced-entities                     Whether event sourced entities should be imported. Defaults to false.
      --include-event-sourced-entity-snapshots             Whether event sourced entity snapshots should be imported. Defaults to true. (default true)
      --include-value-entities                             Whether value entities should be imported. Defaults to false.
      --owner string                                       the owner of the project to use, needed if you have two projects with the same name from different owners
      --project string                                     project to use if not using the default configured project
      --region string                                      region to use if project has more than one region
      --s3-access-key string                               If exporting to S3, the name of the key inside the Akka secret that contains the access key id to authenticate with. Defaults to access-key-id. (default "access-key-id")
      --s3-bucket string                                   If exporting to S3, the name of the bucket to export to.
      --s3-object-prefix string                            If exporting to S3, a prefix to append to the S3 object name, for example, 'my-export/'
      --s3-region string                                   If exporting to S3, the region that the bucket lives in. Only necessary if this is a different region from the Akka execution cluster.
      --s3-secret string                                   If exporting to S3, the name of an Akka secret to read the access key and secret to access S3 with.
      --s3-secret-key string                               If exporting to S3, the name of the key inside the Akka secret that contains the secret access key to authenticate with. Defaults to secret-access-key. (default "secret-access-key")
      --s3-session-key string                              If exporting to S3, the name of the key inside the Akka secret that contains the session token to authenticate with.
      --truncate                                           Whether all existing data should be truncated prior to import.
      --value-entity-object stringArray                    A storage object name (relative to the bucket and object prefix) to import from. Multiple may be specified. If not specified, the default object names used by the export process are used. Implies --include-value-entities.
```

## Options inherited from parent commands

```
      --cache-file string   location of cache file (default "~/.akka/cache.yaml")
      --config string       location of config file (default "~/.akka/config.yaml")
      --context string      configuration context to use
      --disable-prompt      Disable all interactive prompts when running akka commands. If input is required, defaults will be used, or an error will be raised.
                            This is equivalent to setting the environment variable AKKA_DISABLE_PROMPTS to true.
  -o, --output string       set output format to one of [text,json,go-template=] (default "text")
  -q, --quiet               set quiet output (helpful when used as part of a script)
      --timeout duration    client command timeout (default 10s)
      --use-grpc-web        use grpc-web when talking to Akka APIs. This is useful when behind corporate firewalls that decrypt traffic but don't support HTTP/2.
  -v, --verbose             set verbose output
```

## SEE ALSO

* [akka services data](akka_services_data.html)	 - Manage the data of a service.
