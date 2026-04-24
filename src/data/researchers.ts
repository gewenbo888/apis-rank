export interface Researcher {
  id: number;
  name_en: string;
  name_zh: string;
  affiliation_en: string;
  affiliation_zh: string;
  field_en: string;
  field_zh: string;
  h_index: number;
  citations: number;
  papers: number;
  notable_work_en: string;
  notable_work_zh: string;
  country: string;
  native_province_en: string;
  native_province_zh: string;
  homepage?: string;
}

export interface ProvinceStats {
  province_en: string;
  province_zh: string;
  count: number;
  researchers: Researcher[];
  avg_h_index: number;
  total_citations: number;
}

export function getProvinceStats(data: Researcher[]): ProvinceStats[] {
  const map = new Map<string, Researcher[]>();
  for (const r of data) {
    const key = r.native_province_en;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  const stats: ProvinceStats[] = [];
  for (const [province_en, rs] of map) {
    stats.push({
      province_en,
      province_zh: rs[0].native_province_zh,
      count: rs.length,
      researchers: rs.sort((a, b) => b.h_index - a.h_index),
      avg_h_index: Math.round(rs.reduce((s, r) => s + r.h_index, 0) / rs.length),
      total_citations: rs.reduce((s, r) => s + r.citations, 0),
    });
  }
  return stats.sort((a, b) => b.count - a.count || b.avg_h_index - a.avg_h_index);
}

// Field mapping for API services:
//  h_index    → Overall Score (0–100, weighted composite)
//  citations  → Reliability score (×10) → uptime + p95 latency consistency
//  papers     → DX score (×10) → SDKs, sandbox, debugging
//  native_province_en/zh → API category (group axis)
//
// Weighted criteria (1–10):
//   Performance/reliability 22% · DX 18% · Pricing 17% · Integration 15% · Docs 14% · Rate limits 14%

type _R = {
  n: string; z: string;
  a: string; az: string;
  f: string; fz: string;
  h: number; c: number; p: number;
  w: string; wz: string;
  g: string;
  pn: string; pz: string;
  hp?: string;
};

const _data: _R[] = [
  // === AI / LLM ===
  {n:"OpenAI API",z:"OpenAI API",a:"OpenAI",az:"OpenAI",f:"GPT-5.5, o-series, embeddings, images",fz:"GPT-5.5、o 系列、嵌入、图像",h:96,c:99,p:96,w:"Pros: best-in-class quality, broad SDKs, function calling. Cons: priciest top tier, occasional capacity issues. Use: production text/multimodal apps that need quality first.",wz:"优点：质量顶尖、SDK 全面、函数调用。缺点：高端价格最高，偶发容量紧张。场景：以质量为先的生产文本/多模态应用。",g:"🇺🇸",pn:"AI / LLM",pz:"AI / 大模型",hp:"https://platform.openai.com/docs"},
  {n:"Anthropic API",z:"Anthropic API",a:"Anthropic",az:"Anthropic",f:"Claude Opus 4.7, Sonnet, Haiku",fz:"Claude Opus 4.7、Sonnet、Haiku",h:95,c:97,p:97,w:"Pros: best long-context coding, prompt caching, batch API. Cons: smaller image-gen story. Use: agentic coding, document QA, regulated industries.",wz:"优点：最强长上下文与编程能力、Prompt 缓存、批量 API。缺点：图像生成较弱。场景：智能体编程、文档问答、合规行业。",g:"🇺🇸",pn:"AI / LLM",pz:"AI / 大模型",hp:"https://docs.anthropic.com"},
  {n:"Google Gemini API",z:"Google Gemini API",a:"Google",az:"谷歌",f:"Gemini 3.1 Pro, Flash, Nano",fz:"Gemini 3.1 Pro、Flash、Nano",h:91,c:96,p:90,w:"Pros: 2M-token context, native multimodal, generous free tier. Cons: SDK feels less polished than OAI/Anthropic. Use: heavy long-context, video, GCP-native stacks.",wz:"优点：200 万上下文、原生多模态、免费额度大方。缺点：SDK 体验略逊。场景：超长上下文、视频、GCP 原生栈。",g:"🇺🇸",pn:"AI / LLM",pz:"AI / 大模型",hp:"https://ai.google.dev/docs"},
  {n:"DeepSeek API",z:"DeepSeek API",a:"DeepSeek",az:"DeepSeek",f:"DeepSeek V4 Pro / Flash",fz:"DeepSeek V4 Pro / Flash",h:88,c:93,p:86,w:"Pros: ~10% cost of GPT-5 for similar coding/reasoning, OpenAI-compatible API. Cons: data-residency concerns for some firms. Use: cost-sensitive coding/reasoning at scale.",wz:"优点：编程/推理水平接近 GPT-5，价格仅约其 10%；OpenAI 兼容。缺点：部分企业有数据合规顾虑。场景：成本敏感的大规模编程/推理。",g:"🇨🇳",pn:"AI / LLM",pz:"AI / 大模型",hp:"https://platform.deepseek.com"},
  {n:"Mistral API",z:"Mistral API",a:"Mistral AI",az:"Mistral AI",f:"Large 3, Small 3, Codestral",fz:"Large 3、Small 3、Codestral",h:78,c:91,p:85,w:"Pros: EU-hosted, strong open weights, fast Codestral. Cons: smaller ecosystem. Use: EU-residency workloads, local fine-tunes.",wz:"优点：欧盟托管、开源权重出色、Codestral 速度快。缺点：生态相对较小。场景：欧盟数据合规、本地微调。",g:"🇫🇷",pn:"AI / LLM",pz:"AI / 大模型",hp:"https://docs.mistral.ai"},
  {n:"Groq",z:"Groq",a:"Groq",az:"Groq",f:"LPU inference for OSS models",fz:"开源模型 LPU 推理",h:85,c:87,p:90,w:"Pros: insanely fast (300+ tok/s on Llama 70B), OpenAI-compatible. Cons: limited model menu, hard rate-limits. Use: latency-critical chatbots and agents.",wz:"优点：速度惊人（Llama 70B 300+ tok/s），OpenAI 兼容。缺点：模型有限、限速严格。场景：低延迟聊天/智能体。",g:"🇺🇸",pn:"AI / LLM",pz:"AI / 大模型",hp:"https://console.groq.com/docs"},
  {n:"Together AI",z:"Together AI",a:"Together",az:"Together",f:"OSS hosting + fine-tuning",fz:"开源模型托管 + 微调",h:74,c:88,p:84,w:"Pros: huge OSS catalog, fine-tune in browser, OpenAI-compatible. Cons: variable latency under load. Use: hosting Llama/Qwen/Mixtral with custom adapters.",wz:"优点：开源模型库齐全、浏览器微调、OpenAI 兼容。缺点：高负载下延迟波动。场景：托管 Llama/Qwen/Mixtral + 自定义适配。",g:"🇺🇸",pn:"AI / LLM",pz:"AI / 大模型",hp:"https://docs.together.ai"},
  {n:"OpenRouter",z:"OpenRouter",a:"OpenRouter",az:"OpenRouter",f:"Multi-provider LLM gateway",fz:"多提供商大模型网关",h:82,c:90,p:92,w:"Pros: one API key for 200+ models with smart fallback, transparent pricing. Cons: ~5% markup, latency overhead. Use: model A/B-testing, cost arbitrage.",wz:"优点：一把密钥调用 200+ 模型、智能故障转移、价格透明。缺点：约 5% 加价、有延迟开销。场景：模型 A/B 测试、成本套利。",g:"🇺🇸",pn:"AI / LLM",pz:"AI / 大模型",hp:"https://openrouter.ai/docs"},

  // === Payments ===
  {n:"Stripe",z:"Stripe",a:"Stripe",az:"Stripe",f:"Cards, invoices, billing, Connect",fz:"卡支付、发票、订阅、Connect",h:99,c:99,p:99,w:"Pros: gold-standard DX, dashboards, fraud tooling, marketplace primitives. Cons: pricier than alternatives in low-margin verticals. Use: any modern payment flow.",wz:"优点：DX 黄金标准，仪表盘、风控、Marketplace 基础完善。缺点：在低毛利行业偏贵。场景：任意现代支付流。",g:"🇺🇸",pn:"Payments",pz:"支付",hp:"https://docs.stripe.com"},
  {n:"Adyen",z:"Adyen",a:"Adyen",az:"Adyen",f:"Enterprise unified commerce",fz:"企业级统一商务支付",h:88,c:96,p:80,w:"Pros: best for large global retailers, native acquirer in 30+ markets. Cons: docs less SMB-friendly, slower onboarding. Use: enterprise, complex multi-region.",wz:"优点：大型全球零售首选，30+ 市场原生收单。缺点：文档不够 SMB 友好，接入周期长。场景：企业级、跨区域复杂场景。",g:"🇳🇱",pn:"Payments",pz:"支付",hp:"https://docs.adyen.com"},
  {n:"PayPal / Braintree",z:"PayPal / Braintree",a:"PayPal",az:"PayPal",f:"Wallet + cards + Pay Later",fz:"钱包 + 卡 + 后付",h:74,c:88,p:72,w:"Pros: huge consumer reach, BNPL built-in. Cons: legacy API surfaces, dispute UX painful. Use: B2C checkout where wallet conversion matters.",wz:"优点：消费者覆盖巨大、内置先买后付。缺点：API 偏老、争议处理体验差。场景：钱包转化为重的 B2C 结账。",g:"🇺🇸",pn:"Payments",pz:"支付",hp:"https://developer.paypal.com"},
  {n:"Paddle",z:"Paddle",a:"Paddle",az:"Paddle",f:"Merchant-of-record SaaS billing",fz:"代收款 SaaS 计费",h:79,c:87,p:88,w:"Pros: handles global VAT/sales tax automatically. Cons: higher take rate vs Stripe. Use: SaaS / digital products selling globally.",wz:"优点：自动处理全球 VAT/销售税。缺点：抽成比 Stripe 高。场景：全球销售的 SaaS / 数字产品。",g:"🇬🇧",pn:"Payments",pz:"支付",hp:"https://developer.paddle.com"},
  {n:"Lemon Squeezy",z:"Lemon Squeezy",a:"Lemon Squeezy (Stripe)",az:"Lemon Squeezy (Stripe)",f:"MoR for indie SaaS",fz:"独立 SaaS 代收款",h:75,c:84,p:90,w:"Pros: indie-friendly DX, low ceremony, Stripe-acquired so future-safe. Cons: less flexible than Stripe direct. Use: solo devs / small SaaS shipping fast.",wz:"优点：独立开发者友好、配置简单、被 Stripe 收购更稳。缺点：灵活度不及 Stripe 直连。场景：独立/小型 SaaS 快速上线。",g:"🇺🇸",pn:"Payments",pz:"支付",hp:"https://docs.lemonsqueezy.com"},

  // === Communications (SMS / Voice / Chat) ===
  {n:"Twilio",z:"Twilio",a:"Twilio",az:"Twilio",f:"SMS, voice, WhatsApp, Verify",fz:"短信、语音、WhatsApp、验证",h:90,c:96,p:91,w:"Pros: most coverage, mature SDKs, A2P 10DLC handled. Cons: pricing has crept up. Use: any reliable SMS/voice need at scale.",wz:"优点：覆盖最广、SDK 成熟、A2P 10DLC 已处理。缺点：价格逐步走高。场景：需要可靠规模化的短信/语音。",g:"🇺🇸",pn:"Communications",pz:"通信 (短信/语音)",hp:"https://www.twilio.com/docs"},
  {n:"Vonage",z:"Vonage",a:"Vonage (Ericsson)",az:"Vonage (Ericsson)",f:"SMS, voice, video, network APIs",fz:"短信、语音、视频、网络 API",h:74,c:88,p:78,w:"Pros: telco-grade voice, network APIs (SIM swap, location). Cons: docs older. Use: carrier-integrated apps.",wz:"优点：电信级语音、网络 API（SIM 交换、定位）。缺点：文档偏老。场景：与运营商深度集成的应用。",g:"🇺🇸",pn:"Communications",pz:"通信 (短信/语音)",hp:"https://developer.vonage.com"},
  {n:"MessageBird / Bird",z:"MessageBird / Bird",a:"Bird",az:"Bird",f:"Omnichannel (SMS/Email/WA)",fz:"全渠道 (短信/邮件/WA)",h:71,c:86,p:75,w:"Pros: omnichannel under one bill, EU-hosted. Cons: rebrand churn. Use: EU-first omnichannel CRM.",wz:"优点：全渠道统一计费、欧盟托管。缺点：品牌频换。场景：欧盟优先的全渠道 CRM。",g:"🇳🇱",pn:"Communications",pz:"通信 (短信/语音)",hp:"https://docs.bird.com"},
  {n:"Sendbird",z:"Sendbird",a:"Sendbird",az:"Sendbird",f:"In-app chat & calls",fz:"应用内聊天与通话",h:73,c:85,p:82,w:"Pros: best DX for in-app chat (DoorDash, Reddit use it). Cons: per-MAU pricing scary. Use: marketplaces, social, support chat.",wz:"优点：应用内聊天 DX 最佳（DoorDash、Reddit 在用）。缺点：按 MAU 计费偏贵。场景：市集、社交、客服聊天。",g:"🇺🇸",pn:"Communications",pz:"通信 (短信/语音)",hp:"https://sendbird.com/docs"},

  // === Email ===
  {n:"Resend",z:"Resend",a:"Resend",az:"Resend",f:"Transactional email (React Email)",fz:"事务性邮件 (React Email)",h:88,c:91,p:96,w:"Pros: cleanest DX, React-based templates, fast deliverability. Cons: newer = less battle-tested at extreme volume. Use: modern dev teams, indie SaaS.",wz:"优点：DX 最清爽、React 模板、送达快。缺点：极大体量下不如老牌成熟。场景：现代开发团队、独立 SaaS。",g:"🇺🇸",pn:"Email",pz:"邮件",hp:"https://resend.com/docs"},
  {n:"Postmark",z:"Postmark",a:"ActiveCampaign",az:"ActiveCampaign",f:"Transactional email",fz:"事务性邮件",h:84,c:96,p:88,w:"Pros: best deliverability, separate streams for txn vs broadcast. Cons: bulk-marketing not its sweet spot. Use: anyone where the transactional email MUST land.",wz:"优点：送达率最佳、事务/营销分流。缺点：大批量营销非其强项。场景：事务性邮件必须送达的场景。",g:"🇺🇸",pn:"Email",pz:"邮件",hp:"https://postmarkapp.com/developer"},
  {n:"SendGrid",z:"SendGrid",a:"Twilio",az:"Twilio",f:"Email API + Marketing",fz:"邮件 API + 营销",h:74,c:88,p:80,w:"Pros: huge brand, all-in-one. Cons: deliverability has slipped, support patchy. Use: legacy stacks where it's already wired in.",wz:"优点：品牌大、全功能一站式。缺点：送达率下滑、支持参差。场景：已有集成的旧栈。",g:"🇺🇸",pn:"Email",pz:"邮件",hp:"https://docs.sendgrid.com"},
  {n:"Mailgun",z:"Mailgun",a:"Sinch",az:"Sinch",f:"Email API + validation",fz:"邮件 API + 验证",h:71,c:86,p:78,w:"Pros: solid HTTP API, EU region, email validation add-on. Cons: dashboard feels dated. Use: dev teams who like raw HTTP/SMTP control.",wz:"优点：HTTP API 稳定、欧盟区、邮件校验。缺点：仪表盘老旧。场景：偏好 HTTP/SMTP 直连的团队。",g:"🇺🇸",pn:"Email",pz:"邮件",hp:"https://documentation.mailgun.com"},
  {n:"Loops",z:"Loops",a:"Loops",az:"Loops",f:"Email for SaaS lifecycle",fz:"SaaS 生命周期邮件",h:69,c:82,p:90,w:"Pros: best UX for product-led email, drag-and-drop loops. Cons: smaller deliverability track record. Use: SaaS onboarding, retention drips.",wz:"优点：产品驱动邮件 UX 最佳、可视化循环。缺点：送达率履历较短。场景：SaaS 引导、留存触达。",g:"🇺🇸",pn:"Email",pz:"邮件",hp:"https://loops.so/docs"},

  // === Maps / Geo ===
  {n:"Google Maps Platform",z:"Google Maps 平台",a:"Google",az:"谷歌",f:"Maps, Places, Routes, Geocoding",fz:"地图、地点、路线、地理编码",h:92,c:98,p:88,w:"Pros: highest data quality, Places API unbeatable. Cons: pricing is the highest in the industry. Use: when address/POI quality matters more than cost.",wz:"优点：数据质量最高、Places 无人能敌。缺点：业内最贵。场景：地址/POI 质量优先于成本时。",g:"🇺🇸",pn:"Maps / Geo",pz:"地图 / 地理",hp:"https://developers.google.com/maps"},
  {n:"Mapbox",z:"Mapbox",a:"Mapbox",az:"Mapbox",f:"Custom map tiles, navigation, search",fz:"自定义瓦片、导航、搜索",h:84,c:92,p:90,w:"Pros: best customization, vector tiles, GL JS. Cons: pricing increases since 2024. Use: brand-styled maps, mobile nav, automotive.",wz:"优点：自定义最佳、矢量瓦片、GL JS。缺点：2024 年后价格上调。场景：品牌化地图、移动导航、车载。",g:"🇺🇸",pn:"Maps / Geo",pz:"地图 / 地理",hp:"https://docs.mapbox.com"},
  {n:"HERE",z:"HERE",a:"HERE Technologies",az:"HERE Technologies",f:"Routing, traffic, fleet",fz:"路径、交通、车队",h:73,c:90,p:75,w:"Pros: enterprise routing/fleet APIs, automotive heritage. Cons: SDK feels enterprise-y. Use: logistics, fleet, automotive.",wz:"优点：企业路径/车队 API、汽车基因深。缺点：SDK 偏企业风格。场景：物流、车队、汽车。",g:"🇳🇱",pn:"Maps / Geo",pz:"地图 / 地理",hp:"https://developer.here.com"},

  // === Storage / CDN ===
  {n:"AWS S3",z:"AWS S3",a:"Amazon",az:"亚马逊",f:"Object storage",fz:"对象存储",h:96,c:99,p:88,w:"Pros: durability gold standard (11 9s), every tool integrates. Cons: egress fees, pricing complexity. Use: anything that must never be lost.",wz:"优点：耐久性黄金标准（11 个 9）、生态全适配。缺点：出口流量费高、定价复杂。场景：任何不可丢失的数据。",g:"🇺🇸",pn:"Storage / CDN",pz:"存储 / CDN",hp:"https://docs.aws.amazon.com/s3"},
  {n:"Cloudflare R2",z:"Cloudflare R2",a:"Cloudflare",az:"Cloudflare",f:"S3-compatible object storage",fz:"S3 兼容对象存储",h:90,c:96,p:93,w:"Pros: zero egress fees, S3-compatible, ties into Workers. Cons: no glacier-tier yet. Use: media-heavy apps, AI training data, anything with hot egress.",wz:"优点：零出口流量费、S3 兼容、与 Workers 深度集成。缺点：暂无归档层。场景：媒体型应用、AI 训练数据、出口流量大的场景。",g:"🇺🇸",pn:"Storage / CDN",pz:"存储 / CDN",hp:"https://developers.cloudflare.com/r2"},
  {n:"Backblaze B2",z:"Backblaze B2",a:"Backblaze",az:"Backblaze",f:"Object storage",fz:"对象存储",h:75,c:91,p:78,w:"Pros: ~75% cheaper than S3, Cloudflare egress free. Cons: smaller ecosystem. Use: backups, archives, indie SaaS.",wz:"优点：比 S3 便宜约 75%、与 Cloudflare 出口免费。缺点：生态较小。场景：备份、归档、独立 SaaS。",g:"🇺🇸",pn:"Storage / CDN",pz:"存储 / CDN",hp:"https://www.backblaze.com/b2/docs"},

  // === Auth ===
  {n:"Clerk",z:"Clerk",a:"Clerk",az:"Clerk",f:"Auth + user mgmt + orgs",fz:"认证 + 用户管理 + 组织",h:88,c:92,p:96,w:"Pros: best DX for B2B auth, drop-in components, organizations built-in. Cons: priciest above 10k MAU. Use: B2B SaaS that needs orgs/SSO fast.",wz:"优点：B2B 认证 DX 最佳、即插组件、原生组织。缺点：10k MAU 以上偏贵。场景：需要组织/SSO 快速上线的 B2B SaaS。",g:"🇺🇸",pn:"Auth",pz:"认证",hp:"https://clerk.com/docs"},
  {n:"Auth0",z:"Auth0",a:"Okta",az:"Okta",f:"Identity, SSO, MFA, B2B",fz:"身份、SSO、MFA、B2B",h:84,c:96,p:84,w:"Pros: enterprise-grade, every protocol supported. Cons: pricing famously expensive at scale. Use: regulated B2B, complex IAM.",wz:"优点：企业级、协议全覆盖。缺点：规模化后价格出名得贵。场景：合规 B2B、复杂 IAM。",g:"🇺🇸",pn:"Auth",pz:"认证",hp:"https://auth0.com/docs"},
  {n:"WorkOS",z:"WorkOS",a:"WorkOS",az:"WorkOS",f:"Enterprise SSO/SCIM/Audit",fz:"企业 SSO/SCIM/审计",h:82,c:93,p:90,w:"Pros: \"Stripe for enterprise auth\", clean SSO+SCIM in days. Cons: not for consumer auth. Use: SaaS upselling enterprise tier.",wz:"优点：「企业认证界的 Stripe」，几天搞定 SSO+SCIM。缺点：不面向消费端认证。场景：上探企业付费层的 SaaS。",g:"🇺🇸",pn:"Auth",pz:"认证",hp:"https://workos.com/docs"},
  {n:"Supabase Auth",z:"Supabase Auth",a:"Supabase",az:"Supabase",f:"Auth bundled with Postgres",fz:"与 Postgres 一体的认证",h:80,c:90,p:92,w:"Pros: free tier generous, RLS-tight integration. Cons: tied to Supabase. Use: greenfield projects already using Supabase.",wz:"优点：免费额度慷慨、与 RLS 紧密结合。缺点：绑定 Supabase。场景：基于 Supabase 的新项目。",g:"🇺🇸",pn:"Auth",pz:"认证",hp:"https://supabase.com/docs/guides/auth"},

  // === Backend / Database ===
  {n:"Supabase",z:"Supabase",a:"Supabase",az:"Supabase",f:"Postgres + Auth + Storage + Edge",fz:"Postgres + 认证 + 存储 + Edge",h:90,c:92,p:96,w:"Pros: open-source Firebase, full Postgres, generous free tier. Cons: cold-start on free. Use: full-stack JS/TS apps, MVPs to mid-scale.",wz:"优点：开源版 Firebase、完整 Postgres、免费额度大方。缺点：免费层有冷启动。场景：全栈 JS/TS、MVP 到中等规模。",g:"🇺🇸",pn:"Backend / DB",pz:"后端 / 数据库",hp:"https://supabase.com/docs"},
  {n:"Firebase",z:"Firebase",a:"Google",az:"谷歌",f:"Realtime DB, Firestore, Auth, Functions",fz:"实时数据库、Firestore、认证、函数",h:84,c:96,p:84,w:"Pros: realtime sync, mobile SDKs, GCP integration. Cons: Firestore queries limited; vendor lock-in. Use: mobile apps with realtime needs.",wz:"优点：实时同步、移动 SDK、与 GCP 集成。缺点：Firestore 查询受限、生态绑定。场景：移动端实时应用。",g:"🇺🇸",pn:"Backend / DB",pz:"后端 / 数据库",hp:"https://firebase.google.com/docs"},
  {n:"Neon",z:"Neon",a:"Databricks",az:"Databricks",f:"Serverless Postgres",fz:"无服务器 Postgres",h:85,c:91,p:92,w:"Pros: branch-per-PR, scale-to-zero, fast cold starts. Cons: write throughput vs RDS limits. Use: preview-env-heavy SaaS, agent backends.",wz:"优点：每 PR 一个分支、可缩至 0、冷启动快。缺点：写吞吐有上限。场景：依赖预览环境的 SaaS、智能体后端。",g:"🇺🇸",pn:"Backend / DB",pz:"后端 / 数据库",hp:"https://neon.tech/docs"},
  {n:"Convex",z:"Convex",a:"Convex",az:"Convex",f:"Reactive backend + DB",fz:"响应式后端 + 数据库",h:80,c:90,p:96,w:"Pros: TypeScript-end-to-end, reactive queries, no impedance mismatch. Cons: newer; limited eject path. Use: real-time TS apps where Firebase feels too NoSQL.",wz:"优点：端到端 TypeScript、响应式查询、无阻抗失配。缺点：较新，迁出路径有限。场景：嫌 Firebase 太 NoSQL 的实时 TS 应用。",g:"🇺🇸",pn:"Backend / DB",pz:"后端 / 数据库",hp:"https://docs.convex.dev"},

  // === Search ===
  {n:"Algolia",z:"Algolia",a:"Algolia",az:"Algolia",f:"Hosted instant search",fz:"托管即时搜索",h:88,c:96,p:92,w:"Pros: best DX, sub-50ms results, ranking explained. Cons: pricey at scale. Use: e-commerce, docs sites, anywhere typo-tolerant fast search wins.",wz:"优点：DX 最佳、< 50ms 响应、排名可解释。缺点：规模化偏贵。场景：电商、文档、需要容错快搜的场景。",g:"🇫🇷",pn:"Search",pz:"搜索",hp:"https://www.algolia.com/doc"},
  {n:"Typesense Cloud",z:"Typesense Cloud",a:"Typesense",az:"Typesense",f:"OSS hosted search",fz:"开源托管搜索",h:78,c:91,p:90,w:"Pros: open-source, simpler than Elastic, cheaper than Algolia. Cons: smaller ecosystem of integrations. Use: small/mid sites avoiding Algolia bills.",wz:"优点：开源、比 Elastic 简单、比 Algolia 便宜。缺点：集成生态较小。场景：避开 Algolia 账单的中小站点。",g:"🇺🇸",pn:"Search",pz:"搜索",hp:"https://typesense.org/docs"},
  {n:"Meilisearch Cloud",z:"Meilisearch Cloud",a:"Meili SAS",az:"Meili SAS",f:"OSS hosted search",fz:"开源托管搜索",h:75,c:89,p:91,w:"Pros: dead-simple API, ms-level search, hybrid search added. Cons: faceting weaker than Algolia. Use: indie/mid SaaS that wants Algolia DX without the bill.",wz:"优点：API 极简、毫秒级搜索、新增混合检索。缺点：分面弱于 Algolia。场景：想要 Algolia DX 但避开账单的独立/中小 SaaS。",g:"🇫🇷",pn:"Search",pz:"搜索",hp:"https://www.meilisearch.com/docs"},

  // === Voice / Video ===
  {n:"Mux",z:"Mux",a:"Mux",az:"Mux",f:"Video API + analytics",fz:"视频 API + 分析",h:84,c:93,p:92,w:"Pros: best DX for video, real-time analytics, simulcast. Cons: pricier than Cloudflare Stream at scale. Use: media platforms, courses, live commerce.",wz:"优点：视频 DX 最佳、实时分析、多端转推。缺点：规模化时贵于 Cloudflare Stream。场景：媒体平台、课程、直播电商。",g:"🇺🇸",pn:"Voice / Video",pz:"语音 / 视频",hp:"https://docs.mux.com"},
  {n:"Cloudflare Stream",z:"Cloudflare Stream",a:"Cloudflare",az:"Cloudflare",f:"Video storage + delivery",fz:"视频存储 + 分发",h:78,c:91,p:84,w:"Pros: cheapest per-minute streaming, integrated CDN. Cons: thinner analytics than Mux. Use: cost-sensitive video at scale.",wz:"优点：分钟单价最便宜、CDN 一体。缺点：分析弱于 Mux。场景：成本敏感的大规模视频。",g:"🇺🇸",pn:"Voice / Video",pz:"语音 / 视频",hp:"https://developers.cloudflare.com/stream"},
  {n:"Deepgram",z:"Deepgram",a:"Deepgram",az:"Deepgram",f:"Speech-to-text + voice agents",fz:"语音转文字 + 语音智能体",h:86,c:92,p:91,w:"Pros: highest WER on real conversations, sub-300ms streaming. Cons: pricing complex. Use: voice agents, call analytics.",wz:"优点：真实对话 WER 最佳、< 300ms 流式。缺点：定价复杂。场景：语音智能体、通话分析。",g:"🇺🇸",pn:"Voice / Video",pz:"语音 / 视频",hp:"https://developers.deepgram.com"},
  {n:"AssemblyAI",z:"AssemblyAI",a:"AssemblyAI",az:"AssemblyAI",f:"Speech-to-text + audio intelligence",fz:"语音转文字 + 音频智能",h:82,c:91,p:91,w:"Pros: solid streaming + LeMUR LLM-on-audio. Cons: cost. Use: meeting/podcast transcription, audio analytics.",wz:"优点：流式稳定 + LeMUR 音频 LLM。缺点：成本。场景：会议/播客转写、音频分析。",g:"🇺🇸",pn:"Voice / Video",pz:"语音 / 视频",hp:"https://www.assemblyai.com/docs"},
  {n:"ElevenLabs",z:"ElevenLabs",a:"ElevenLabs",az:"ElevenLabs",f:"TTS, voice cloning, dubbing",fz:"TTS、声音克隆、配音",h:90,c:93,p:94,w:"Pros: most natural TTS, multi-lingual cloning. Cons: ToS strict on voice cloning. Use: audiobooks, agents, dubbing, accessibility.",wz:"优点：最自然 TTS、多语言克隆。缺点：克隆条款严格。场景：有声书、智能体、配音、无障碍。",g:"🇬🇧",pn:"Voice / Video",pz:"语音 / 视频",hp:"https://elevenlabs.io/docs"},
];

export const researchers: Researcher[] = _data.map((r, i) => ({
  id: i + 1,
  name_en: r.n, name_zh: r.z,
  affiliation_en: r.a, affiliation_zh: r.az,
  field_en: r.f, field_zh: r.fz,
  h_index: r.h, citations: r.c, papers: r.p,
  notable_work_en: r.w, notable_work_zh: r.wz,
  country: r.g,
  native_province_en: r.pn, native_province_zh: r.pz,
  homepage: r.hp,
}));

export type SortKey = "h_index" | "citations" | "papers";

export function sortResearchers(
  data: Researcher[],
  by: SortKey
): Researcher[] {
  return [...data].sort((a, b) => b[by] - a[by]);
}
