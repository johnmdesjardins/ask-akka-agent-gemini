# akka local services views

Manage views.

## Synopsis

The `akka local service views` commands manage the views for an Akka project, including listing of existing views and deleting views and their data when a view is no longer used.

## Options

```
  -h, --help   help for views
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

* [akka local services](akka_local_services.html)	 - Manage Akka services locally.
* [akka local services views describe](akka_local_services_views_describe.html)	 - Describe a view.
* [akka local services views drop](akka_local_services_views_drop.html)	 - Delete the data for an inactive view.
* [akka local services views list](akka_local_services_views_list.html)	 - List all views.
