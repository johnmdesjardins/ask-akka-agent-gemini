# akka projects observability set traces

Set the traces exporter for your Akka project.

## Synopsis

The `akka project observability set traces` command sets the traces exporter for your Akka project.

## Options

```
  -h, --help   help for traces
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

* [akka projects observability set](akka_projects_observability_set.html)	 - Set the observability settings for your Akka project.
* [akka projects observability set traces google-cloud](akka_projects_observability_set_traces_google-cloud.html)	 - Set your project to export traces to Google Cloud.
* [akka projects observability set traces otlp](akka_projects_observability_set_traces_otlp.html)	 - Set your project to export traces to an OTLP collector.
