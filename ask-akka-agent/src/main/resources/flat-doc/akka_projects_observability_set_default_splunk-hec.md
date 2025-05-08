# akka projects observability set default splunk-hec

Set your project to export default to a Splunk HEC endpoint.

```
akka projects observability set default splunk-hec [flags]
```

## Options

```
      --client-cert-secret string   If set, will use the given TLS secret for client TLS authentication.
      --endpoint string             The endpoint to export to.
      --force-global                force an existing regional resource to be configured as a global resource
      --force-regional              force an existing global resource to be configured as a regional resource
  -h, --help                        help for splunk-hec
      --index string                The index to target, optional, will use the indexes configured for the HEC connector in Splunk if not configured.
      --insecure                    If set to true, TLS will not be used.
      --insecure-skip-verify        If set to true, the certificate supplied by the server will not be verified.
      --owner string                the owner of the project to use, needed if you have two projects with the same name from different owners
      --project string              project to use if not using the default configured project
      --region string               region to use if project has more than one region
      --server-ca-secret string     If set, will use the given TLS CA secret for server TLS verification.
      --source string               The name of the source, optional, will use the source configured for the HEC connector in Splunk if not configured.
      --source-type string          The type of the source, optional, will use the source type configured for the HEC connector in Splunk if not configured.
      --token-secret-key string     The name of the key that the Splunk token is configured at in the Akka secret.
      --token-secret-name string    The name of the Akka secret to read the Splunk token from.
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

* [akka projects observability set default](akka_projects_observability_set_default.html)	 - Set the default exporter for your Akka project.
