# API Services · Ranked · API 服务排行榜

44 production APIs scored on **6 weighted criteria** across **10 categories**.

## Links

- **Live:** [apis.psyverse.fun](https://apis.psyverse.fun)
- **GitHub:** [github.com/gewenbo888/apis-rank](https://github.com/gewenbo888/apis-rank)

## Scoring methodology

Each API scored **1–10 across 6 criteria**, weighted into a single **Overall Score (0–100)**:

| Criterion | Weight | Why |
|---|---:|---|
| **Performance & reliability** | **22%** | When the API is down, your product is down. Status pages, p95 latency, multi-region failover. |
| Developer experience | 18% | Sandbox, error messages, idempotency keys, debugging. The integration cost is real. |
| Pricing | 17% | At scale, this is the line item that gets you fired or promoted. |
| Ease of integration | 15% | SDKs, webhook quality, OpenAPI specs. How long from sign-up to first successful call. |
| Documentation quality | 14% | Bad docs cap adoption no matter how good the API is. |
| Rate limits & scalability | 14% | The hidden ceiling that bites in production. |

## Three sortable columns

- **Overall** — composite weighted score (0–100)
- **Reliability** — uptime + p95 latency consistency (×10)
- **DX** — SDKs + sandbox + debugging quality (×10)

Sort by **Overall** for the balanced view. Sort by **Reliability** when uptime is non-negotiable (Stripe, AWS S3, OpenAI). Sort by **DX** for the fastest-to-first-success (Resend, Stripe, Convex, Clerk, Lemon Squeezy).

## Categories (group tab)

- **AI / LLM** — OpenAI · Anthropic · Gemini · DeepSeek · Mistral · Groq · Together · OpenRouter
- **Payments** — Stripe · Adyen · PayPal · Paddle · Lemon Squeezy
- **Communications (SMS/Voice/Chat)** — Twilio · Vonage · MessageBird · Sendbird
- **Email** — Resend · Postmark · SendGrid · Mailgun · Loops
- **Maps / Geo** — Google Maps · Mapbox · HERE
- **Storage / CDN** — AWS S3 · Cloudflare R2 · Backblaze B2
- **Auth** — Clerk · Auth0 · WorkOS · Supabase Auth
- **Backend / DB** — Supabase · Firebase · Neon · Convex
- **Search** — Algolia · Typesense · Meilisearch
- **Voice / Video** — Mux · Cloudflare Stream · Deepgram · AssemblyAI · ElevenLabs

## Pros / Cons / Best use

Each row's expanded view contains a one-paragraph **Pros · Cons · Best Use** summary in EN and 中文 — designed so you can decide whether to read the docs or not in 30 seconds.

## Stack

- Next.js 16 · React 19 · App Router (`src/app/`)
- Tailwind CSS 4
- Cloned from `chinese-ai-researchers` template via `/psyverse-ranking`
- Bilingual via `src/data/i18n.ts`; data + scoring in `src/data/researchers.ts`

## Disclaimer

Snapshot of the API economy, **April 2026**. Scores are subjective composites of vendor docs, status-page history, third-party benchmarks (DevAPI, APIcontext), and hands-on use. Treat as descriptive, not endorsement. Always benchmark against your own load profile before committing.

## About

Part of the [Psyverse](https://psyverse.fun) portfolio. Sibling to [llms.psyverse.fun](https://llms.psyverse.fun) (frontier LLMs), [aiapps.psyverse.fun](https://aiapps.psyverse.fun) (AI apps), [ides.psyverse.fun](https://ides.psyverse.fun) (IDEs), [saas.psyverse.fun](https://saas.psyverse.fun) (B2B SaaS), [gear.psyverse.fun](https://gear.psyverse.fun) (gear), [creators.psyverse.fun](https://creators.psyverse.fun) (creators), [coders.psyverse.fun](https://coders.psyverse.fun) (AI coders), [learn.psyverse.fun](https://learn.psyverse.fun) (online learning), [oss.psyverse.fun](https://oss.psyverse.fun) (open-source projects). Same template, different domain.
