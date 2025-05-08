# akka organizations

Manage your organizations on Akka

## Synopsis

The `akka organizations` commands manage the organizations in your Akka account.
Organizations are the root of the management hierarchy and serve as a container for all Projects where Services are deployed.
For more details on organizations, see https://doc.akka.io/operations/organizations/index.html .

## Options

```
  -h, --help   help for organizations
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

* [akka](akka.html)	 - Akka control
* [akka organizations auth](akka_organizations_auth.html)	 - Manage authentication for your organization on Akka
* [akka organizations get](akka_organizations_get.html)	 - Get organization information.
* [akka organizations invitations](akka_organizations_invitations.html)	 - Invite new users to the organization with a specific role.
* [akka organizations list](akka_organizations_list.html)	 - List all organizations of which the user is a member of.
* [akka organizations users](akka_organizations_users.html)	 - Manage organization users.
