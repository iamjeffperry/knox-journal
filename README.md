# Knox Journal

Knox Journal is a focused Project Zomboid survivor diary. It helps players remember where they left off, record lessons from each run, and request a context-aware next goal from Knox Advisor.

## Version 0.1

- Create and switch between survivors
- Track run status, equipment, base, vehicle, supplies, and objectives
- Log play sessions and lessons learned
- Keep completed survivors in the journal
- Ask GPT-5.6 Luna for a focused goal, tip, or session analysis
- Save an Advisor recommendation as the next objective

## Knox Advisor

The diary works without AI. To enable Knox Advisor, configure `OPENAI_API_KEY` in the hosting environment. The key is used only by the server and is never sent to the browser.

## Development

```bash
npm install
npm run db:generate
npm run dev
```

Built with Next.js, Vinext, Cloudflare D1, and the OpenAI Responses API.
