# akka container-registry push

Push an Akka service image for a particular Akka project.

## Synopsis

The `akka container-registry push _image_` command will push the given container image to the Akka container registry.
The provided image name must be a valid Docker image tag and not an image hash/SHA-256.

This command will replace the `HOST[:PORT_NUMBER]` portion of the specified _image_ with the appropriate Akka container registry hostname if it does not match the expected hostname.
This command is also multi-region aware.
If the current (or specified) Akka project is a multi-region project, the provided _image_ will be tagged with a new tag for each Akka region where the project resides and this command will push the image to each of those regions for you.

**📌 NOTE**\
You must have the source _image_ in your local Docker service image catalog for this command to function.
If the image is not locally stored, you can pull it (via `docker pull _image_` first       before running this command.

```
akka container-registry push IMAGE [flags]
```

## Options

```
  -h, --help             help for push
      --owner string     the owner of the project to use, needed if you have two projects with the same name from different owners
      --project string   project to use if not using the default configured project
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

* [akka container-registry](akka_container-registry.html)	 - Manage and push service images to the Akka Container Registry.
