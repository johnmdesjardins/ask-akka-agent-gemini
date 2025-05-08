# akka roles add-binding

Add a role binding.

## Synopsis

The command `akka roles add-binding` grants a user access to a project.

The user may be referenced by either their user ID, username, or email.
If using username or email, the user must already be a member either of the project or the project’s owning organization, otherwise the user may be invited by their email address.

```
akka roles add-binding [flags]
```

## Options

```
      --email string       The email. Use to grant a role to a user identified by the given email address.
      --group string       The group. Use to grant a role to a group in the specified organization with this name.
      --group-org string   The name or id of the organization that owns the group, if not the project that owns the group.
  -h, --help               help for add-binding
      --role string        The role to grant. For a list of available roles, run akka roles list.
      --user-id string     The user ID. Use to grant a role to a user identified by their given UUID.
      --username string    The username. Use to grant a role to a user identified by the given username.
```

## Options inherited from parent commands

```
      --cache-file string   location of cache file (default "~/.akka/cache.yaml")
      --config string       location of config file (default "~/.akka/config.yaml")
      --context string      configuration context to use
      --disable-prompt      Disable all interactive prompts when running akka commands. If input is required, defaults will be used, or an error will be raised.
                            This is equivalent to setting the environment variable AKKA_DISABLE_PROMPTS to true.
  -o, --output string       set output format to one of [text,json,go-template=] (default "text")
      --owner string        the owner of the project to use, needed if you have two projects with the same name from different owners
      --project string      project to use if not using the default configured project
  -q, --quiet               set quiet output (helpful when used as part of a script)
      --timeout duration    client command timeout (default 10s)
      --use-grpc-web        use grpc-web when talking to Akka APIs. This is useful when behind corporate firewalls that decrypt traffic but don't support HTTP/2.
  -v, --verbose             set verbose output
```

## SEE ALSO

* [akka roles](akka_roles.html)	 - Manage the user roles for an Akka project.
