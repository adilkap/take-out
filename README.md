# take-out 💕

A tiny single-page site to ask someone out.

- **Title:** "I have a question" (shows in the iMessage link preview)
- **Yes** → confetti + "<askerName> is a very lucky guy ;)"
- **No** → shrinks 20% and runs away on every click, then poofs

## Configuring the names

The names are set in **`config.js`** — no other files need editing:

```js
const CONFIG = {
  // The person being asked out (shown in the question).
  recipientName: "Amna",

  // The person doing the asking (shown after a "Yes").
  askerName: "Adil",
};
```

- `recipientName` fills the question: **"<recipientName>, can I take you out tonight?"**
- `askerName` fills the celebration message: **"<askerName> is a very lucky guy ;)"**

Change the values, save, and refresh (or commit + push to update the live site).

## Run locally
Just open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy (GitHub Pages)
This repo is deployed at **https://adilkap.github.io/take-out/**.

Settings → Pages → Deploy from branch → `main` / root. Static files, no build step —
just commit and push to `main` and Pages rebuilds automatically.
