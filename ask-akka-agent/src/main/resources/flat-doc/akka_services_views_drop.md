# akka services views drop

Delete the data for an inactive view.

## Synopsis

The `akka service view drop` command triggers the deletion of the data for views that are no longer active.

```
akka services views drop SERVICE VIEW_NAME [flags]
```

## Examples

```

> akka service views drop customer-registry CustomerByName
The data for view 'CustomerByName' of service 'customer-registry' has successfully been dropped.
```

## Options

```
  -h, --help             help for drop
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

* [akka services views](akka_services_views.html)	 - Manage views.
