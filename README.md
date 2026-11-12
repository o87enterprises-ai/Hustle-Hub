# HustleHub MVP v0.2
Responsive installable web prototype for a broad side-income audience.

**Features:** income tracker, idea board, guided action planner, marketplace preview (search/category filter), local service-listing drafts, proposed Free / Plus ($9.99) / Business ($19.99) tiers, illustrative 10% fee calculator.

## Run
`npx serve public` (or any static server on localhost/HTTPS; service workers don't work from `file://`).

## Deploy (Cloudflare)
`npx wrangler deploy` (static assets from `public/`). For a preview: `npx wrangler versions upload`.

## Limitations
No accounts, cloud sync, publishing, live jobs, booking, messaging, payments, refunds, ID checks, reviews, moderation or connected AI. Pricing and fee are hypotheses; no money is collected.

## Before accepting users or payments
Auth, database/backups, payments, seller verification, privacy policy/terms, moderation/reporting, disputes/refunds, tax/legal review, fraud prevention, analytics, accessibility and security testing.
