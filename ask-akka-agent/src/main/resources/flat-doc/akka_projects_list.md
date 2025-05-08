# akka projects list

List all projects.

## Synopsis

The `akka projects list` command will list a one-line summary of all projects that your Akka account has access to.
The current project will have an asterisk '*' next to it.

**💡 TIP**\
You can change the current project using `akka config set project _my-project_`

```
akka projects list [flags]
```

## Options

```
  -h, --help                  help for list
      --include-deleted       include deleted projects in the output
      --organization string   filter projects in the output to only this organization
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
