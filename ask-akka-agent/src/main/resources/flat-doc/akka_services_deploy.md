# akka services deploy

Deploy a service to the currently configured project.

## Synopsis

The `akka service deploy _service-name_ _docker-image_` command deploys a service with name _service-name_ using the _docker-image_.
This command is meant for rapid experimentation and development.
For production use cases, we recommend deploying through a service descriptor, using the `akka service apply` command.

**📌 NOTE**\
If using a private image repository, you will need Docker credentials to be set up in order for Akka to be able to pull from your images.
For more info see `akka docker`

```
akka services deploy SERVICE IMAGE [flags]
```

## Examples

```
akka services deploy my-service my-repo/my-service-image
```

## Options

```
      --classic                     deploys an Akka service using the previous Java/Scala Protobuf SDK.
      --env stringToString          the environment variables separated by commas, for example MY_VAR1=value1,MY_VAR2="value2 with spaces" (default [])
      --force-global                force an existing regional resource to be configured as a global resource
      --force-regional              force an existing global resource to be configured as a regional resource
  -h, --help                        help for deploy
      --max-instances int32         the maximum number of instances of a service that should be available. Must be greater than or equal to 1, less than or equal to 10, and greater than or equal to min-instances. Defaults to 10. Not available for trial projects. (default -1)
      --min-instances int32         the minimum number of instances of a service that should be available. Must be greater than or equal to 1, less than or equal to 10, and less than or equal to max-instances. Defaults to 3. Not available for trial projects. (default -1)
      --owner string                the owner of the project to use, needed if you have two projects with the same name from different owners
      --project string              project to use if not using the default configured project
      --push                        pushes the service image to the Akka container registry for the project. Run "akka cr push --help" for more information about how image push works.
      --region string               region to use if project has more than one region
      --secret-env stringToString   environment variables from secrets, comma separated, whose values refer to secret-name and secret-key, for example MY_VAR1=secret-name/secret-key1,MY_VAR2=secret-name/secret-key2 (default [])
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

* [akka services](akka_services.html)	 - Manage and deploy services on Akka.
