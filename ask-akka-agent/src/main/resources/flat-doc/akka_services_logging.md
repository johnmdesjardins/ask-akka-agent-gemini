# akka services logging

Change the log level configration of a service.

## Options

```
  -h, --help   help for logging
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
* [akka services logging list](akka_services_logging_list.html)	 - List the log levels configuration.
* [akka services logging set-level](akka_services_logging_set-level.html)	 - Set the logger level configuration.
* [akka services logging unset-level](akka_services_logging_unset-level.html)	 - Unset the logger level configuration.
