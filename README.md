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

## Admin panel (edit dishes, prices, photos, hours)

Go to **/admin** on the live site (e.g. `https://your-site.vercel.app/admin`).

- **Dishes:** name, photo, price, description, category, sold-out switch, "Most ordered" switch
- **Choices & extras:** protein options, sizes, sides and add-ons shared between dishes (change a price once, it updates everywhere)
- **Restaurant settings:** opening hours, WhatsApp number, tagline, contact details

Every save is a commit to GitHub. Vercel rebuilds automatically, and the change is live in about a minute.

### One-time setup
1. In `public/admin/config.yml`, set `repo:` to your GitHub `username/repo-name`.
2. Create a GitHub token for whoever will edit the menu: GitHub → Settings → Developer settings →
   Personal access tokens → **Fine-grained tokens** → Generate. Give it access to **only this repository**,
   with **Contents: Read and write** permission.
3. Open `/admin`, choose **Sign In Using Access Token**, and paste the token.

Anyone signing in needs write access to the repo. For non-technical staff, a "Sign In with GitHub" button
can be enabled later with the free Sveltia CMS Authenticator (see sveltiacms.app docs).

### Editing locally
The folder must be a Git repository first (it will be once you've set it up for GitHub, or run `git init`).
Run `npm run dev`, open `http://localhost:5173/admin/index.html` in Chrome or Edge, choose
**Work with Local Repository** and select this project folder. Edits are written straight into the files here;
commit and push them as usual.

## Where things live in the code

| What | File |
| --- | --- |
| Dishes (one file each) | `content/dishes/*.json` |
| Shared choices & extras | `content/option-groups.json` |
| Hours, WhatsApp, email, address, socials, promo code | `content/settings.json` |
| About page text | `content/about.json` |
| Careers / job openings | `content/careers.json` |
| Photos | `public/images/` |
| Restaurant name | `src/config.js` |
| Colours and fonts | top of `src/index.css` |
| WhatsApp message wording | `src/lib/order.js` → `buildWhatsAppMessage` |
| Admin panel fields | `public/admin/config.yml` |

## First-order discount (GOURMET)
The banner shows on devices that haven't sent an order yet (until the visitor closes it).
At checkout the customer types the code, sees the discount, and the WhatsApp message tells the cashier
the code was used. If the same device has ordered before, the message says so. The cashier confirms it's a
first order using the customer's phone number. Turn the offer off or change the code in `content/settings.json`.

## How open / closed works
Hours are checked against Nigeria time (WAT, called "Africa/Lagos" in software, which covers Uyo too), whatever timezone the visitor is in.
When closed, visitors see a pop-up once per visit, buttons say "Pre-order", and the WhatsApp message is marked
as a pre-order.

## Deploying to Vercel
Push this folder to GitHub, then import the repo in Vercel (framework: Vite). `vercel.json` is already set up
so page links like `/menu` work on refresh.

## Online payments later
Checkout lives in `src/pages/Checkout.jsx`. A payment step (e.g. Paystack) can be added on the review step,
before or instead of the WhatsApp button.
