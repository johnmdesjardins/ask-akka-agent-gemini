# akka services apply

Apply a service descriptor to the currently configured project.

## Synopsis

The `akka service apply` command applies a service descriptor, creating the service, or updating the service as appropriate.
For more information see https://doc.akka.io/operations/services/deploy-service.html#apply

```
akka services apply [flags]
```

## Examples

```
akka service apply -f _file-name_
```

## Options

```
  -f, --file string      The YAML file to apply. If not supplied, will read from stdin.
      --force-global     force an existing regional resource to be configured as a global resource
      --force-regional   force an existing global resource to be configured as a regional resource
  -h, --help             help for apply
      --owner string     the owner of the project to use, needed if you have two projects with the same name from different owners
      --project string   project to use if not using the default configured project
      --region string    region to use if project has more than one region
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
