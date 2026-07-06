# calcalpro.com — Cal Cal marketing site

The marketing website for **Cal Cal**, the AI calorie & macro tracker
(app source lives in the `NewApp` repo).

## What's here

```
index.html     Landing page (hero + live phone mockup, how it works,
               features, AI coach, pricing, FAQ, final CTA)
support.html   Support / contact page (required for App Store review)
privacy.html   Privacy policy (required for App Store review)
terms.html     Terms of use (required for subscription apps)
legal.css      Shared styles for the support/privacy/terms pages
CNAME          Custom domain for GitHub Pages (calcalpro.com)
img/           Web-sized brand art (logo, favicon, mascots, OG image),
               generated from the originals in NewApp/art
```

The hero phone plays `img/demo.mp4` (the app screen recording from
NewApp/art, compressed from 18 MB to ~1.2 MB, status bar cropped).
To replace it, re-run a similar ffmpeg pass on the new recording:
`ffmpeg -i in.mp4 -vf "crop=1080:2228:0:160,scale=720:-2,fps=30"
-c:v libx264 -crf 26 -movflags +faststart -an img/demo.mp4`
and regenerate `img/demo-poster.jpg` from its first frame.

Everything is dependency-free static HTML/CSS with a little vanilla JS —
no build step, no framework, no external requests. The design uses the
app's exact design tokens (Fresh green `#19CC6B`, the protein/carbs/fat
ring colors, `#F5F5F7` background) so the site and app feel like one
product.

## Preview locally

```
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy on GitHub Pages (free)

1. Merge this branch to `main`.
2. Repo **Settings → Pages** → Source: *Deploy from a branch* → `main` / root.
3. At your domain registrar, point `calcalpro.com`:
   - `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www` → `sru4ka.github.io`
4. Back in **Settings → Pages**, set the custom domain to `calcalpro.com`
   and enable **Enforce HTTPS** (the `CNAME` file here keeps it set).

## Before launch

- Replace the two `href="#pricing"` App Store badge links in `index.html`
  with the real App Store URL once the app is live.
- Contact address on the site is dbromberg1@gmail.com (in
  `support.html`, `privacy.html`, `terms.html`).
- Have a lawyer look over `privacy.html` / `terms.html` — they're a solid
  starting point, not legal advice.
