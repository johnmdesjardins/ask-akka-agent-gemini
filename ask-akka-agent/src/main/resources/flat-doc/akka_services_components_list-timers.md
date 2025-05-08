# akka services components list-timers

List the timers registered in this service.

## Synopsis

The `akka service components list-timers` command lists timers registered in this service.

```
akka services components list-timers SERVICE_NAME [flags]
```

## Options

```
      --failing-only      Filter timers to include only the failing ones.
  -h, --help              help for list-timers
      --name string       Filter timers by the name, or part of the name.
      --owner string      the owner of the project to use, needed if you have two projects with the same name from different owners
      --page-size int     The size of pages to fetch. Default and max is 100.
      --project string    project to use if not using the default configured project
      --raw               Use to specify that messages should not be decoded, but should be a raw format.
      --region string     region to use if project has more than one region
      --upcoming string   Filter timers that will trigger from now to now + upcoming duration, e.g. 2h. Duration units: "s", "m", "h", "d", "w", "y".
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

* [akka services components](akka_services_components.html)	 - Inspect components of a service.
