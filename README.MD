This package contains the source code for the CrownLedger Sports responsive UI/UX prototype.

## What is included

- `handoff.html` — customer-facing source handoff page with instructions and code viewer.
- `prototype.html` — runnable static prototype shell.
- `styles.css` — responsive styling, brand tokens, cards, tables, wallet, admin, and mobile layouts.
- `app.js` — demo navigation, fictional odds rendering, bet slip state, wallet tabs, promotion terms toggle, and admin tabs.
- `README.md` — this setup guide and scope notes.

## How to run locally

1. Download or copy the folder.
2. Open `prototype.html` in a browser for the simplest review.
3. Optional local server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/prototype.html`.

No build step or package installation is required.

## Demo-only scope

This source code is a front-end prototype only. It does not:

- create real accounts;
- place wagers;
- process deposits or withdrawals;
- connect to live odds, score, payment, KYC, AML, or banking APIs;
- operate a gambling product;
- provide legal or compliance advice.

All odds, balances, users, events, transactions, promotions, and admin metrics are fictional/demo data.

## Brand notes

The prototype uses the original CrownLedger Sports direction: deep navy surfaces, sovereign gold accents, emerald action states, and a premium finance-style interface. It does not use Bet9ja logos, trademarks, proprietary assets, or exact visual identity.

## Production considerations

A real regulated platform would need specialist engineering and legal/compliance work around licensing, jurisdiction-specific rules, KYC/AML, responsible-gaming controls, payment partners, sportsbook/odds infrastructure, security, privacy, audit logging, monitoring, and operational risk.# Betting
