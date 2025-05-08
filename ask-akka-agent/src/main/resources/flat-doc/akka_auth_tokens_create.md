# akka auth tokens create

Create an Akka token.

## Synopsis

This command allows you to create a refresh token that can be used to authenticate another Akka command instance on another machine.

```
akka auth tokens create [flags]
```

## Examples

```

$ akka auth tokens create --type=refresh --scopes=all --description="Token for use by CI/CD system"
Token created: 0123456789abcdef0123456789abcdef0123456789abcdef
```

## Options

```
      --description string   A description of the token. If the token is a refresh token, this will be stored with the token for reference.
  -h, --help                 help for create
      --scopes stringArray   The scopes for the token. Valid scopes are: all, container_registry, execution, organizations, projects, user. Only applies to refresh tokens. (default [execution])
      --type string          The type of token to create, either access or refresh (default "refresh")
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

* [akka auth tokens](akka_auth_tokens.html)	 - Manage Akka authentication tokens for your user.
