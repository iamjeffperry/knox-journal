# Deployment targets

Knox Journal is designed to support three hosting profiles without changing its Project Zomboid data or interface.

| Target | Journal storage | Knox Advisor | Status |
| --- | --- | --- | --- |
| ChatGPT Sites | Cloudflare D1 | Server-side API route | Working |
| Vercel | Browser local storage by default | Optional server-side API route | Planned |
| GitHub Pages | Browser local storage | Disabled | Planned |

## Portability rules

Future changes should keep these boundaries intact:

1. Project Zomboid reference data stays in ordinary TypeScript modules with no hosting imports.
2. Interface components communicate with a journal storage adapter instead of importing a database directly.
3. Each host supplies its own storage adapter: D1 for Sites and local storage for static or personal deployments.
4. Knox Advisor remains optional. The journal must work when no AI service is configured.
5. An OpenAI API key is accepted only by server-side code. GitHub Pages must never request or store one in the browser.

## Path to one-click Vercel deployment

The Vercel button should be added only after the following are complete:

- a browser-local journal adapter;
- a standard Next.js production build independent of the Cloudflare worker build;
- a portable environment-variable helper for the Advisor route;
- import/export so a journal can move between devices or hosting providers; and
- a clean deployment from a fresh fork with only `OPENAI_API_KEY` as an optional setting.

This keeps the eventual one-click button truthful: the diary will work immediately, and AI will be an optional enhancement rather than a setup blocker.
