# akka roles invitations

Manage invitations to user roles on a project.

## Synopsis

The command `akka role invitations _subcommand_` manages invitations to user roles for a project.

## Options

```
  -h, --help   help for invitations
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
* [akka roles invitations delete](akka_roles_invitations_delete.html)	 - Delete an invitation from a project.
* [akka roles invitations invite-user](akka_roles_invitations_invite-user.html)	 - Invite a user to a project.
* [akka roles invitations list](akka_roles_invitations_list.html)	 - List invitations to a project.
