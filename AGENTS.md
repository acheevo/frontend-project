# Frontend template agent

This repository ships a React and TypeScript landing-page starter. Own a change from the request through a working build and a verified user flow. Assume future copies will replace the branding and add their own content.

## Get oriented

- Check `git status --short` and read the affected source, `package.json`, and relevant sections of [README.md](README.md). Preserve work already in the checkout.
- Use the Node LTS release in [.nvmrc](.nvmrc), then run `npm ci`. Use the npm lockfile for local, CI, and container builds.
- Trace UI behavior from `src/main.tsx` through `src/App.tsx` into `src/components/`. Put primitives in `ui/`, navigation and page chrome in `layout/`, and landing-page blocks in `sections/`. Shared variants use `src/utils/cn.ts`. React 19 accepts a typed `ref` prop on components.
- Start with `src/index.css` for theme tokens and Tailwind utilities, `src/config/app.ts` for display-name defaults, and `src/vite-env.d.ts` for public environment types. The `@/` alias is defined in `tsconfig.json` and read by Vite. `VITE_*` values appear in the browser bundle, so keep secrets on the server.

## Work through the task

1. Define the expected user-visible behavior and reproduce the issue with `npm run dev`. Use a free port with `PORT=3100 npm run dev` if the default port is occupied.
2. Make the smallest coherent change across the entry point, shared styles, and configuration. Use complete Tailwind class names in source so the compiler can find them. Retain responsive layout, keyboard access, focus indicators, and reduced-motion behavior when changing interactive UI.
3. Run the narrowest relevant check while iterating. Read the first failure, fix the cause, and rerun it. For dependency changes, inspect the release notes and peers, update the manifest and lockfile together, and verify a clean `npm ci`. Keep `.nvmrc`, the Node engine range, CI, and both Dockerfiles aligned when changing Node.
4. Run the applicable end-to-end checks below. Cover default settings and any changed environment override. If a required service is unavailable, use a local equivalent where possible and report which behavior still needs verification.

## Verify and hand off

- For any code change run `npm run check`, which runs ESLint, strict TypeScript checking, and the Vite production build. For dependency changes also run `npm audit --audit-level=high`.
- For UI changes, open the app at desktop and mobile widths. Exercise altered controls with a keyboard and a pointer, verify navigation targets, and check the browser console. Use `npm run preview` for production-specific issues.
- For Docker or workflow changes, validate `docker compose config --quiet` and run `actionlint` if available. Build and start the production image, load `/health` on container port `8080`, and verify a deep link serves the app while a missing `/assets/` file returns 404. Compare HTML and hashed asset cache headers. When touching development setup, verify a source edit triggers hot reload with `docker compose --profile dev up --build frontend-dev`.
- For branding changes, verify the rendered name and page title. Check the fallback in `src/config/app.ts` and `index.html` alongside `VITE_APP_NAME` in `.env.example` and any Docker build arguments.
- Review `git diff --check` and the final diff. Report what changed, the checks actually run, and any verification left open with its precise cause.

## Generate and verify UI with the component catalog

1. Run `npm run storybook` and connect a local MCP client to
   `http://127.0.0.1:6006/mcp`. Discover components and inspect their props and
   examples before writing new UI. When MCP is unavailable, inspect the stories
   and component sources directly. Use local imports from `@/components/ui`
   and `@/generative` when adapting examples.
2. Add stories for states the user can reach, including loading and failure
   when relevant. Test interactions with accessible roles and names. Run
   `npx playwright install chromium` once and `npm run test:stories` after editing.
3. For generated UI, run `npm run ui:prompt` to export the json-render catalog
   prompt. Paste a spec into **Generative UI → Card → Preview** in Storybook.
   The parser checks the spec before rendering existing React components.
   Keep privileged actions and model credentials outside the renderer.
4. Run `npm run build:storybook` to verify the catalog builds. Check the final
   story against the real application or API when their behavior differs.

For Codex, add the optional local connection with
`codex mcp add template-storybook --url http://127.0.0.1:6006/mcp`.
