# akka projects tokens create

Create a service token

## Synopsis

The `akka project tokens create` command creates a project service token.

```
akka projects tokens create [flags]
```

## Options

```
      --description string   A description of the service token
  -h, --help                 help for create
      --owner string         the owner of the project to use, needed if you have two projects with the same name from different owners
      --project string       project to use if not using the default configured project
      --scope stringArray    The scopes for the service token to have (default [all])
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

* [akka projects tokens](akka_projects_tokens.html)	 - Manage your Akka project service tokens.
