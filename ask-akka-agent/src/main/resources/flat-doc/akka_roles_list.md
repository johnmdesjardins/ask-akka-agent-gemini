# akka roles list

List project roles.

## Synopsis

The command `akka roles list` displays the list of possible roles for the current project.
You establish the "current project" by using either `akka config set project _my-project_` or specifying the `--project=_my_project_` flag.

```
akka roles list [flags]
```

## Options

```
  -h, --help   help for list
```

## Options inherited from parent commands

```
      --cache-file string   location of cache file (default "~/.akka/cache.yaml")
      --config string       location of config file (default "~/.akka/config.yaml")
      --context string      configuration context to use
      --disable-prompt      Disable all interactive prompts when running akka commands. If input is required, defaults will be used, or an error will be raised.
                            This is equivalent to setting the environment variable AKKA_DISABLE_PROMPTS to true.
  -o, --output string       set output format to one of [text,json,go-template=] (default "text")
      --owner string        the owner of the project to use, needed if you have two projects with the same name from different owners
      --project string      project to use if not using the default configured project
  -q, --quiet               set quiet output (helpful when used as part of a script)
      --timeout duration    client command timeout (default 10s)
      --use-grpc-web        use grpc-web when talking to Akka APIs. This is useful when behind corporate firewalls that decrypt traffic but don't support HTTP/2.
  -v, --verbose             set verbose output
```

## SEE ALSO

* [akka roles](akka_roles.html)	 - Manage the user roles for an Akka project.
