# Gourmet Gather website

React + Vite site for Gourmet Gather. Customers browse Plates, Buckets and the Workplace menu, build an order,
choose one-time / weekly / monthly and delivery or pickup, then the full order is sent to the restaurant's
WhatsApp for confirmation and payment.

## Run it on your computer

You need Node.js 18 or newer.

```bash
npm install      # first time only
npm run dev      # opens at http://localhost:5173
```

## Where to change things

| What | File |
| --- | --- |
| Restaurant name, WhatsApp number, opening hours | `src/config.js` |
| Dishes, prices, options and extras | `src/data/menu.js` |
| Colours and fonts | top of `src/index.css` (`--red`, `--yellow`, …) |
| The WhatsApp message wording | `src/lib/order.js` → `buildWhatsAppMessage` |

### Adding food photos
1. Put the photo in `public/images/` (e.g. `public/images/party-jollof.jpg`).
2. In `src/data/menu.js`, set that dish's `image: '/images/party-jollof.jpg'`.

Dishes without a photo show a drawn placeholder.

## How open / closed works
Hours are checked against Lagos time (Africa/Lagos), whatever timezone the visitor is in.
When closed, visitors see a pop-up once per visit, buttons say "Pre-order", and the WhatsApp message is marked
as a pre-order.

## Deploying to Vercel
Push this folder to GitHub, then import the repo in Vercel (framework: Vite). `vercel.json` is already set up
so page links like `/menu` work on refresh.

## Online payments later
Checkout lives in `src/pages/Checkout.jsx`. A payment step (e.g. Paystack) can be added on the review step,
before or instead of the WhatsApp button.
