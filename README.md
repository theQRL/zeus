# Zeus :: QRL interface

[![Netlify Status](https://api.netlify.com/api/v1/badges/cdf10616-1ba2-40a2-8a1f-6b6f29ff97dd/deploy-status)](https://app.netlify.com/sites/nervous-euler-f912f2/deploys) ![GitHub](https://img.shields.io/github/license/theqrl/zeus)

![Zeus](src/img/zeus-logo.png)

## Introduction

This is Zeus, the front-end for interaction with the QRL network.

It is deployed at [https://zeus.theqrl.org](zeus.theqrl.org)

Zeus is a work-in-progress and is not yet considered production ready.

## Stack

This is built from the ground up using an Vue/Ionic/Capacitor/Electron (VICE) stack to build for:

- Web
- Desktop
- Mobile (iOS)
- Mobile (Android)

...all from the same codebase.

It leverages several of the QRL ecosystem development tools:

- QRLLIB
- explorer-helpers
- wallet-helpers
- node-helpers

and relies on the [https://github.com/theqrl/zeus-proxy](zeus-proxy) middleware to interact with the decentralised QRL nodes.

## Running

1. Clone
2. Ensure Node > v10 and NPM installed (there's an .nvmrc file for `nvm use` to ensure your node version is correct)
3. Run an `npm install`
4. `ionic serve` will spawn a livereload development server locally

API endpoints should work out of the box but `./src/API.ts` can be adjusted to fit individual setups (e.g. custom QRL deployments)

## Contributing

Issues and/or Pull Requests welcome.  Any code committed will be considered as a public domain contribution to this MIT licensed project.  If you are interested in helping the ongoing development of this software on a more formal basis please contact [info@theqrl.org](info@theqrl.org)
