# akka docker add-credentials

Add Docker credentials to an Akka project.

## Synopsis

Use the `akka docker add-credentials [flags]` command to add a set of Docker credentials to the project.
With this, any service in the project can be deployed based on images from the private Docker registry.

```
akka docker add-credentials [flags]
```

## Options

```
      --config-only                                  only update the config, do not add or change the secret
      --docker-email string                          the Docker email address
      --docker-password string                       the Docker password
      --docker-server https://mydockerregistry.com   the Docker server, for example https://mydockerregistry.com
      --docker-username string                       the Docker username
      --force-global                                 force an existing regional resource to be configured as a global resource
      --force-regional                               force an existing global resource to be configured as a regional resource
  -h, --help                                         help for add-credentials
      --owner string                                 the owner of the project to use, needed if you have two projects with the same name from different owners
      --project string                               project to use if not using the default configured project
      --region string                                region to use if project has more than one region
      --secret-name string                           the name of the Akka secret to place the Docker credentials in (default "docker-credentials")
      --secret-only                                  only add or update the secret, do not change the container registry config
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

* [akka docker](akka_docker.html)	 - Manage credentials for projects using private Docker registries.
