# ploy-action

GitHub Action that installs and runs [Ploy](https://github.com/source-ag/ploy), Source.ag's deployment tool. Used in CI workflows to deploy services or update deployment files with new service versions.

## Stack

- TypeScript (ES6, strict mode)
- GitHub Actions runtime (`@actions/core`, `@actions/exec`, `@actions/tool-cache`)
- `simple-git` for git operations in the `update` command
- Bundled with `@vercel/ncc` into `dist/index.js` (checked into the repo)

## Project Structure

```
src/
  main.ts        # Entry point - parses inputs, runs deploy or update command
  context.ts     # Action input parsing and OS detection
  ploy.ts        # Downloads and installs the Ploy binary from GitHub releases
  git.ts         # Git operations for the update command (commit + push)
  github.ts      # GitHub API client for fetching Ploy releases
dist/            # Bundled output (committed, verified by CI)
action.yml       # Action definition with inputs/outputs
```

## Development

```bash
npm ci
npm run all    # build + format + lint + package (produces dist/)
```

Individual steps: `npm run build`, `npm run format:check`, `npm run lint`, `npm run package`.

The `dist/` directory must be committed. CI (`check-dist.yml`) verifies it matches the build output.

## Code Style

ESLint enforces strict TypeScript rules: no semicolons, explicit function return types, no `any`, and camelCase. Prettier handles formatting. See `.eslintrc.json` for the full config.

## Key Details

- `action.yml` uses `node16` runtime
- Two commands: `deploy` (default) and `update` (updates a service version in the deployment file, commits, and pushes)
- Ploy binary is downloaded from `source-ag/ploy` GitHub releases at runtime
