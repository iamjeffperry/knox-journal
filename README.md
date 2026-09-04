# Knox Journal

Knox Journal is a Project Zomboid survivor diary. It remembers where a run left off, records lessons from each session, and can suggest a focused next goal through Knox Advisor.

## Features

- Create and switch between survivor journals
- Select Build 41 or Build 42 occupations, starting locations, and traits
- Track condition, equipment, base, vehicle, supplies, and objectives
- Log sessions and delete entries with confirmation
- Keep dead survivors alongside active runs
- Ask GPT-5.6 Luna for a goal, survival tip, or session analysis
- Save an Advisor recommendation as the next objective

## Run locally

Requirements: Node.js 22 or newer.

```bash
npm install
npm run db:generate
npm run dev
```

To enable Knox Advisor, add an `OPENAI_API_KEY` to your local environment. API keys must stay on the server and must never be added to browser code or committed to Git.

## Deployment

The current hosted build uses Cloudflare D1 for journal storage. The project is being kept deployment-neutral at the UI and data-model layers, with two portable targets planned:

- **Vercel:** one-click Next.js deployment, browser-local journals by default, and an optional server-side Knox Advisor.
- **GitHub Pages:** static journal with browser-local storage; Knox Advisor is disabled because a static site cannot safely hold an API key.

See [Deployment targets](docs/deployment-targets.md) for the compatibility plan. Until the storage adapter is completed, the repository is not yet a working one-click Vercel or GitHub Pages deployment.

## Project status

Knox Journal is under active development. Bug reports and focused pull requests are welcome.
