# akka secrets create generic

Create or update a generic secret.

## Synopsis

The `akka secrets create generic` command creates or updates a generic secret in the current project.

```
akka secrets create generic SECRET_NAME [flags]
```

## Examples

```
> akka secrets create generic db-secret --literal USERNAME=admin --literal PASSWORD=password
```

## Options

```
      --force-global            force an existing regional resource to be configured as a global resource
      --force-regional          force an existing global resource to be configured as a regional resource
      --from-file stringArray   A key=filename pair. The secret value will be read from the passed in file name. Can be passed multiple times.
  -h, --help                    help for generic
      --literal strings         A key=value pair. Can be passed multiple times, for example --literal MY_VAR1=value1 --literal MY_VAR2="value2 with spaces". Multiple key/value pairs can also be passed separated by commas.
      --owner string            the owner of the project to use, needed if you have two projects with the same name from different owners
      --project string          project to use if not using the default configured project
      --region string           region to use if project has more than one region
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

* [akka secrets create](akka_secrets_create.html)	 - Create or update a secret in the current project.
