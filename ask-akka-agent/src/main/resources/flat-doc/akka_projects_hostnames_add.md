# akka projects hostnames add

Add a hostname to a project

## Synopsis

The `akka project hostnames add _name_' command will add a hostname to the project.
The name is optional.
If not specified, you will be assigned a random hostname by Akka.
Names must be valid hostnames that have a CNAME record that resolves to the ingress address for the region you wish to use it on.

```
akka projects hostnames add [NAME] [flags]
```

## Options

```
  -h, --help             help for add
      --owner string     the owner of the project to use, needed if you have two projects with the same name from different owners
      --project string   project to use if not using the default configured project
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

* [akka projects hostnames](akka_projects_hostnames.html)	 - Manage hostnames for your Akka project.
