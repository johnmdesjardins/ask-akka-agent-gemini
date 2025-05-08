# akka completion

Generate shell completion scripts

## Synopsis

The `akka completion` command generates completion scripts for Bash, Zsh, fish and PowerShell.

If you are running on Linux or macOS, the command automatically detects your default shell if the 'SHELL' environment variable is set.
On Windows, or if you want to override the shell type, you provide the shell type as an explicit argument.

For more help with configuring the completion script, see https://doc.akka.io/reference/cli/command-completion.html

To load completions:

## Bash

```bash
$ source <(akka completion bash)

# To load completions for each session, execute once:
# Linux:
$ akka completion bash > /etc/bash_completion.d/akka
# macOS:
$ akka completion bash > /usr/local/etc/bash_completion.d/akka
```

## Zsh

```zsh
# If shell completion is not already enabled in your environment,
# you will need to enable it.  You can execute the following once:

$ echo "autoload -U compinit; compinit" >> ~/.zshrc

# To load completions for each session, execute once:
$ akka completion zsh > "${fpath[1]}/_akka"
# To work around permission issues, you may instead need to execute:
$ akka completion zsh | sudo tee "${fpath[1]}/_akka" >/dev/null

# You will need to start a new shell for this setup to take effect.
```

## fish

```fish
$ akka completion fish | source

# To load completions for each session, execute once:
$ akka completion fish > ~/.config/fish/completions/akka.fish
```

## PowerShell

```powershell
PS> akka completion powershell | Out-String | Invoke-Expression

# To load completions for every new session, run:
# PS> akka completion powershell > akka.ps1
# and source this file from your PowerShell profile.
```

```
akka completion [flags]
```

## Options

```
  -h, --help   help for completion
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
