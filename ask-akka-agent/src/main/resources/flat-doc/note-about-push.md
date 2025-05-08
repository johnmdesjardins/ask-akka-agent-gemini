**📌 NOTE**\
The `--push` flag will push the container image to the Akka Container Registry before deploying the service. If your project has more than one region, the image will be pushed to each region ACR and deployed in all regions. If you are not using ACR, you first need to push the image to the container registry you are using.\
See [pushing to ACR](#_pushing_to_acr) and [pushing to external container registry](#_pushing_to_ext_cr) for more information.
