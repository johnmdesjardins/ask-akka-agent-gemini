# akka organizations auth update openid

Update an OpenID authentication domain for the current (or specified) organization

## Synopsis

The `akka organizations auth openid update` command updates an OpenID authentication domain for the given organization in Akka.

```
akka organizations auth update openid DOMAIN-ID [flags]
```

## Options

```
      --auth-method string      The authentication method to use, as defined in section 9 of the OpenID Connect Core. Must be one of none, basic, post, jwt, or private-key-jwt.
      --client-id string        The client id to use when communication with the OpenID Connect provider.
      --client-secret string    The client secret, if needed for the given auth method.
      --groups-claim string     The groups claim. Optional.
  -h, --help                    help for openid
      --issuer string           The OpenID issuer, this should be an https URL.
      --organization string     name or ID for organization
      --scopes-add strings      Any additional custom scopes to be added to authentication requests, in addition to Akka's default of openid, profile and email.
      --scopes-remove strings   Any custom scopes to be removed from authentication requests.
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

* [akka organizations auth update](akka_organizations_auth_update.html)	 - Update an authentication domain for your organization on Akka
