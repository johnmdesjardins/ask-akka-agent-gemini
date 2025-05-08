# akka auth login

Log in to Akka.

## Synopsis

Typing `akka auth login` launches your web browser and takes you to the proper URL to enter your credentials.
The command-line client will print "Waiting for UI login..." and pause while this happens, and then resume with a message once it receives the authorization token from the Akka server.

If successfully authenticated, and if you already have a single project, the current project will be set to the active one.

**💡 TIP**\
You may use `akka auth login --no-launch-browser` to make the command-line client display the URL you should go to in order to do the authorization, rather than try to launch the browser itself.
You can use this if, for some reason, the command-line client is unable to launch your browser for you.

```
akka auth login [flags]
```

## Options

```
  -h, --help                help for login
      --no-launch-browser   If set, the CLI will just print the URL to authorize the login to standard output, rather than launching the URL in a browser.
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

* [akka auth](akka_auth.html)	 - Manage Akka authentication.
