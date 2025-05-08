# akka organizations auth add

Add an authentication domain to your organization on Akka

## Synopsis

The `akka organizations add` commands allow adding authentication for organizations in Akka.

## Options

```
  -h, --help   help for add
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

* [akka organizations auth](akka_organizations_auth.html)	 - Manage authentication for your organization on Akka
* [akka organizations auth add openid](akka_organizations_auth_add_openid.html)	 - Add an OpenID authentication domain to the current (or specified) organization
