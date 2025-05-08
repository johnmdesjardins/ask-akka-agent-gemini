# akka services delete

Delete a service.

## Synopsis

The `akka services delete _service-name_` command deletes a service and removes all associated resources.
You may optionally delete associated routes with the `--delete-routes` flag.
Issuing the delete performs a soft delete, where the deletion of the service and its data can be undone for up to two weeks using `akka services restore _service-name_`.
To immediately issue a permanent delete add the `--hard` flag.

```
akka services delete SERVICE [flags]
```

## Examples

```
akka services delete my-service
```

## Options

```
      --all-regions      run the command on all regions
      --delete-routes    delete associated routes that map ONLY to this service.
      --hard             hard delete the service, including its data (cannot be undone)
  -h, --help             help for delete
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
