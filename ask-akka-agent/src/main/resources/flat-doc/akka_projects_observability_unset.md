# akka projects observability unset

Unset the observability settings for your Akka project.

## Synopsis

The `akka project observability unset` command unsets the observability settings for your Akka project.

## Options

```
  -h, --help   help for unset
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

* [akka projects observability](akka_projects_observability.html)	 - Manage the observability settings for your Akka project.
* [akka projects observability unset default](akka_projects_observability_unset_default.html)	 - Unset the observability configuration at the default scope of your project.
* [akka projects observability unset logs](akka_projects_observability_unset_logs.html)	 - Unset the observability configuration at the logs scope of your project.
* [akka projects observability unset metrics](akka_projects_observability_unset_metrics.html)	 - Unset the observability configuration at the metrics scope of your project.
* [akka projects observability unset traces](akka_projects_observability_unset_traces.html)	 - Unset the observability configuration at the traces scope of your project.
