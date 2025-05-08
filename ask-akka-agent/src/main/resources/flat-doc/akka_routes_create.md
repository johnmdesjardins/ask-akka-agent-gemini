# akka routes create

Create a route.

## Synopsis

The `akka routes create _name_` command will create a route for the project.
You must either supply a filename containing the route YAML, or supply a minimum of a hostname and a path.

```
akka routes create NAME [flags]
```

## Options

```
      --client-ca-secret string                  The name of a TLS CA secret that should be used to authenticate client connections
      --client-certificate-subject stringArray   Add a client certificate subject name, to be validated when a client CA cert is configured. Prefix/suffix matching is supported using *.
      --cors-method stringArray                  A CORS method to allow. For example, --cors-method PUT --cors-method POST
      --cors-origin stringArray                  A CORS origin to allow. For example, --cors-origin ORIGIN1 --cors-origin ORIGIN2
  -f, --filename string                          The name of a file to read the route spec from
      --force-global                             force an existing regional resource to be configured as a global resource
      --force-regional                           force an existing global resource to be configured as a regional resource
  -h, --help                                     help for create
      --hostname string                          The hostname
      --http-basic-credentials stringArray       Add an HTTP basic username and password, separated by =, to allow access to the route using HTTP basic authentication. Multiple may be supplied.
      --http-basic-realm string                  The name of the realm to use for HTTP Basic authentication
      --owner string                             the owner of the project to use, needed if you have two projects with the same name from different owners
      --path stringArray                         A path mapping. For example, --path /somepath1=some-service1 --path /somepath2=some-service2
      --project string                           project to use if not using the default configured project
      --region string                            region to use if project has more than one region
      --server-certificate-secret string         The name of a TLS certificate secret that should be used to serve connections
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

* [akka routes](akka_routes.html)	 - Manage routes for your Akka project.
