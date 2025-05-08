# akka projects observability config traces

Configure traces sampling for your Akka project.

## Synopsis

The `akka project observability config traces` command sets the traces sampling for your Akka project.

```
akka projects observability config traces [flags]
```

## Options

```
      --force-global                            force an existing regional resource to be configured as a global resource
      --force-regional                          force an existing global resource to be configured as a regional resource
  -h, --help                                    help for traces
      --owner string                            the owner of the project to use, needed if you have two projects with the same name from different owners
      --probabilistic-sampling-percentage 10%   The percentage of traces to sample, for example set to "10" to sample 10% of the traces.
      --project string                          project to use if not using the default configured project
      --region string                           region to use if project has more than one region
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

* [akka projects observability config](akka_projects_observability_config.html)	 - Manage the observability configuration for your Akka project.
