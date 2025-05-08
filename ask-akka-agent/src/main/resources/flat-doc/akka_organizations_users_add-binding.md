# akka organizations users add-binding

Add a role binding

```
akka organizations users add-binding --user-id USER_ID --role ROLE [flags]
```

## Options

```
      --email string          The email. Use to grant a role to a user identified by the given email address.
      --group string          The group. Use to grant a role to a group in the specified organization with this name.
      --group-org string      The name or id of the organization that owns the group, if not the organization this binding is being added to.
  -h, --help                  help for add-binding
      --organization string   name or ID for organization
      --role string           The role for the invited user
      --user-id string        The user ID. Use to grant a role to a user identified by their given UUID.
      --username string       The username. Use to grant a role to a user identified by the given username.
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

* [akka organizations users](akka_organizations_users.html)	 - Manage organization users.
