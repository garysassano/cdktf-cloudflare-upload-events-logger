# cdktf-cloudflare-upload-events-logger

CDKTF app that generates a log upon uploading a file to an R2 bucket.

### Related Apps

- [wrangler-cloudflare-upload-events-logger](https://github.com/garysassano/wrangler-cloudflare-upload-events-logger) - Built with Wrangler instead of CDKTF.

## Prerequisites

- **_Cloudflare:_**
  - Must have set the `CLOUDFLARE_API_TOKEN` variable in your local environment.
- **_Terraform:_**
  - Must be [installed](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli#install-terraform) in your system.
- **_Node.js + npm:_**
  - Must be [installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) in your system.

## Installation

```sh
npx projen install
```

## Deployment

```sh
npx projen deploy
```

## Cleanup

```sh
npx projen destroy
```

## Architecture Diagram

![Architecture Diagram](./src/assets/arch-diagram.svg)
