# akka services proxy

Create an HTTP proxy to a service.

## Synopsis

The `akka service proxy` command creates an HTTP proxy that forwards all traffic to the service.
This allows you to interact with the service as if it was running locally.

```
akka services proxy SERVICE [flags]
```

## Options

```
      --bind-address string   The address to bind to. (default "127.0.0.1")
      --grpcui                Enable the gRPC UI and open it in a browser.
  -h, --help                  help for proxy
      --owner string          the owner of the project to use, needed if you have two projects with the same name from different owners
  -p, --port int              The port to run the proxy on. (default 8080)
      --project string        project to use if not using the default configured project
      --region string         region to use if project has more than one region
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
