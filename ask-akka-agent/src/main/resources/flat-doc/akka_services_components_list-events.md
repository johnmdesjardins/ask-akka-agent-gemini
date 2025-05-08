# akka services components list-events

List events from the Event Sourced Entity for the given service, component and entity id

## Synopsis

The `akka service components list-events` command lists events from the Event Sourced Entity for the given service, component and entity id

```
akka services components list-events SERVICE_NAME COMPONENT_NAME ENTITY_ID [flags]
```

## Options

```
  -h, --help                      help for list-events
      --include-internal-events   Whether to include internal events in the list.
      --include-state             Whether events should include the state of the entity after each event has been applied.
  -i, --interactive               Whether the command should allow interactively paging through results.
      --owner string              the owner of the project to use, needed if you have two projects with the same name from different owners
      --page-size int             The size of pages to fetch. Defaults to 100.
      --page-token string         Page token for paging.
      --project string            project to use if not using the default configured project
      --raw                       Use to specify that messages should not be decoded, but should be a raw format.
      --region string             region to use if project has more than one region
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
