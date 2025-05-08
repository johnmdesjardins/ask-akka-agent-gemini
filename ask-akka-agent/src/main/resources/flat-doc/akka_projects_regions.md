# akka projects regions

Manage the regions assigned to your Akka project.

## Synopsis

The `akka projects regions` commands manages the regions for your Akka project.
The available regions are the regions assigned to the organization that the project belongs to.

## Options

```
  -h, --help   help for regions
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

* [akka projects](akka_projects.html)	 - Manage your Akka projects.
* [akka projects regions add](akka_projects_regions_add.html)	 - Add a region to the project
* [akka projects regions list](akka_projects_regions_list.html)	 - List the regions for the project
* [akka projects regions set-primary](akka_projects_regions_set-primary.html)	 - Set the primary region for the project
