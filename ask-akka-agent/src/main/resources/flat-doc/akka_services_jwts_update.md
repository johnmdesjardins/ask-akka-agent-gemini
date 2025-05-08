# akka services jwts update

Update a JWT key in a service.

## Synopsis

The `akka service jwt update` command updates a JWT key in a service.

```
akka services jwts update [SERVICE] [flags]
```

## Examples

```
> akka services jwt update my-service --key-id my-key
  --hmacSecretLiteral YSBkaWZmZXJlbnQgc2VjcmV0
```

## Options

```
      --algorithm string   The JWT algorithm to use, use akka service jwt list-algorithms to list supported algorithms.
      --force-global       force an existing regional resource to be configured as a global resource
      --force-regional     force an existing global resource to be configured as a regional resource
  -h, --help               help for update
      --issuer string      The name of the issuer to validate/sign messages for.
      --key-id string      A unique key id.
      --owner string       the owner of the project to use, needed if you have two projects with the same name from different owners
      --project string     project to use if not using the default configured project
      --region string      region to use if project has more than one region
      --secret string      A symmetric or asymmetric secret reference.
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

* [akka services jwts](akka_services_jwts.html)	 - Manage JWT keys of a service.
