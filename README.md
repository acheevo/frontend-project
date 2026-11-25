# frontend-project

A static landing-page starter built with React 19, TypeScript, Vite, and Tailwind CSS 4. It includes responsive sections, reusable React components, a production NGINX image, and GitHub Actions checks.

## Getting started

Install the Node.js LTS version in [.nvmrc](.nvmrc) with your version manager, then use its bundled npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. To customize the display name or local port, copy `.env.example` to `.env` and edit `VITE_APP_NAME` or `PORT`. The production bundle substitutes `VITE_APP_NAME` at build time. Variables with a `VITE_` prefix are public.

Tailwind 4 requires modern browsers. Its baseline includes Safari 16.4, Chrome 111, and Firefox 128. Vite's JavaScript build also targets current widely available browsers. [Tailwind browser requirements](https://tailwindcss.com/docs/compatibility) and [Vite build targets](https://vite.dev/guide/build.html#browser-compatibility).

## Checks and builds

- `npm run check` runs ESLint, strict TypeScript checks, and the production build.
- `npm run type-check` runs TypeScript in isolation.
- `npm run lint` runs ESLint.
- `npm run build` writes the deployable static build to `dist/`.
- `npm run preview` serves the built files locally.

The TypeScript range stays on 6.0 while typescript-eslint requires a compiler version below 6.1. Upgrade them together when the linter supports a newer compiler.

## Where to make changes

- `src/App.tsx` assembles the app from layout and section components.
- `src/components/ui/` houses shared primitives such as `Button` and `Container`.
- `src/index.css` defines Tailwind theme tokens, animations, and custom utilities.
- `src/config/app.ts` contains display defaults and the repository link.
- `index.html` defines the initial page title and favicon.
- [AGENTS.md](AGENTS.md) describes the workflow and verification for coding agents.

## Docker

Run the production build on host port `3000` and container port `8080`:

```bash
docker compose up --build frontend
curl --fail http://localhost:3000/health
```

Use the development service separately to keep the same host port and enable hot reload:

```bash
docker compose --profile dev up --build frontend-dev
```

After changing dependencies, refresh the development volume with `docker compose --profile dev run --rm frontend-dev npm ci`. The volume has its own dependencies for the container's architecture.

For a standalone image, pass the app name during the build:

```bash
docker build --build-arg 'VITE_APP_NAME=My App' -t frontend-project .
docker run --rm -p 127.0.0.1:3000:8080 frontend-project
```

NGINX runs as a non-root user, serves deep links through the SPA entry point, and caches hashed assets for one year. Use an independent health probe at `/health`.

## GitHub Actions

CI installs the lockfile, runs the checks and npm audit, then builds and smoke-tests the production image. Dependabot proposes npm, GitHub Actions, and Docker image updates. Pushing a `v*` tag triggers **Docker Release**, which pushes to Docker Hub using the `DOCKER_USERNAME`, `DOCKER_TOKEN`, and `PROJECT_NAME` repository secrets. An optional `VITE_APP_NAME` repository variable customizes the release image's display name.

## License

[MIT](LICENSE)

## Agent-assisted UI

Start Storybook with `npm run storybook` to inspect the components and their
states. Connect an agent to the local MCP endpoint at
`http://127.0.0.1:6006/mcp` to discover components and retrieve usage guidance.
Use `npm run ui:prompt` and the **Generative UI → Card → Preview** story to try
a json-render spec. The preview runs locally with no model service or account.
See [AGENTS.md](AGENTS.md) for the browser checks and the full workflow.

## Managed AI

Select **AIaaS** in Nimbus when creating the project. Open **Managed service connections**
on the project overview and create a 10-minute preview token. Pass the shown run URL
and token to the client from `src/lib/managedAI.ts`:

```ts
const result = await runAI(
  { provider: 'claude', prompt: 'Summarize this text' },
  { runURL, token },
)
console.log(result.result)
```

Keep preview credentials in memory and use them for trusted test prompts. For app users, set `runURL` to your authenticated API or fullstack backend’s AI endpoint and pass the app user’s access token. Set the backend’s allowed browser origins and, for web, allow that backend origin in the starter’s `connect-src` policy.
Keep `AIAAS_API_TOKEN` in the backend runtime and keep tokens out of the bundled client.
