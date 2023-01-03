# Ploy Action

This is a Github Action to deploy software using [Ploy](https://github.com/DonDebonair/ploy)

## Usage

### Workflow

```yaml
name: DEV deployment

on:
  push:
    branches:
      - main
    paths:
      - development.yml

jobs:
  deploy-app:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-central-1
      - name: Do deployment
        uses: DonDebonair/ploy-action@v1
        with:
          deployment-file: development.yml
          github-token: ${{ github.token }}
```

## Development

To generate the `dist` code, please run

```
npm ci
npm run all
```
