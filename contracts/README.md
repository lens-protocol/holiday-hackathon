# Lens Network Hardhat Boilerplate

This repository contains a boilerplate for developing smart contracts on the Lens Network using [Hardhat](https://hardhat.org/).

## Table of Contents <!-- omit in toc -->

- [Requirements](#requirements)
- [Initial Setup](#initial-setup)
- [Usage](#usage)
- [Networks](#networks)
- [License](#license)

## Requirements

- Node.js: >= v20
- Yarn: v3.2.4

### Node.js <!-- omit in toc -->

If you use [nvm](https://github.com/nvm-sh/nvm) to manage your Node.js versions, you can run:

```bash
nvm use
```

to switch to the correct Node.js version.

See the [installation guide](https://nodejs.org/en/download/package-manager) for other ways to install Node.js.

### Yarn <!-- omit in toc -->

Enable [Corepack](https://www.totaltypescript.com/how-to-use-corepack), if it isn't already; this will add the Yarn binary to your `PATH`:

```bash
corepack enable
```

See the [installation guide](https://yarnpkg.com/getting-started/install) for other ways to install Yarn.

## Initial Setup

Install dependencies:

```bash
yarn install
```

Create a `.env` file copying the `.env.example` file:

```bash
cp .env.example .env
```

Update the `.env` file with the correct values.

## Usage

### Compile <!-- omit in toc -->

```bash
yarn compile
```

### Clean <!-- omit in toc -->

```bash
yarn clean
```

### Lint <!-- omit in toc -->

```bash
yarn lint
```

### Test <!-- omit in toc -->

Run tests on the Hardhat Network powered by a [ZKsync In-memory Node]((https://docs.zksync.io/build/test-and-debug/in-memory-node).

```bash
yarn test
```

To run tests on a specific network:

```
yarn test [--network <network-name>]
```

For example, to run tests on the `lensTestnet` network:

```bash
yarn test --network lensTestnet
```

> [!TIP]
> zkSync In-memory Node currently supports only the L2 node. If contracts also need L1, use another testing environment like [Dockerized Node](https://docs.zksync.io/build/test-and-debug/dockerized-l1-l2-nodes).

### Deploy <!-- omit in toc -->

```bash
yarn deploy --script <deploy-script.ts> --network <network-name>
```

For example:

```bash
yarn deploy --script deploy-token.ts --network lensTestnet
```

## Networks

- `lensTestnet`: Lens Development Network (37111).
- `hardhat`: runs on a ZKsync [In-Memory Node](https://docs.zksync.io/build/test-and-debug/in-memory-node) for testing.

## License

Lens Network Hardhat Boilerplate [MIT licensed](./LICENSE)
