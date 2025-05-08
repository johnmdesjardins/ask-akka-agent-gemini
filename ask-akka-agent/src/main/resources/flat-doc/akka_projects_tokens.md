# akka projects tokens

Manage your Akka project service tokens.

## Synopsis

The `akka projects tokens` commands manipulate the service tokens that have access to your Akka project.
These service tokens are tied to a single project and allow for authenticating and performing actions on that project.
Often used for automation and CI/CD pipelines.
See more details at https://doc.akka.io/operations/integrating-cicd/index.html .

## Options

```
  -h, --help   help for tokens
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

* [akka projects](akka_projects.html)	 - Manage your Akka projects.
* [akka projects tokens create](akka_projects_tokens_create.html)	 - Create a service token
* [akka projects tokens list](akka_projects_tokens_list.html)	 - List all service tokens
* [akka projects tokens revoke](akka_projects_tokens_revoke.html)	 - revoke service token
