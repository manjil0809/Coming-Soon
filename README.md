# Manjil Aryal — Personal Portfolio

A fast, dependency-free personal portfolio site. Plain HTML5, CSS3 and vanilla
JavaScript — no frameworks, no build step, no npm install.

```
manjil-aryal-portfolio/
├── index.html          # all page content
├── style.css           # all styling (design tokens at the top)
├── script.js           # nav, reveal animations, hero canvas
├── README.md
└── assets/
    ├── img/
    │   ├── portrait.svg    # placeholder — replace with your photo
    │   └── favicon.svg
    └── projects/
        ├── chilvy.svg      # placeholder project images (replace with
        ├── shubhayatra.svg # real screenshots when you have them)
        ├── cosog.svg
        ├── biomedical.svg
        ├── aavso.svg
        ├── hamro-subidha.svg
        └── aida.svg
```

---

## 1. Run it

Just open `index.html` in a browser. That's it.

For a local server (nicer for testing, avoids any file:// quirks):

```bash
cd manjil-aryal-portfolio
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## 2. Replace the placeholder links — do this first

Every placeholder link is marked with a `data-replace` attribute, so you can find
them all at once. Search `index.html` for `data-replace`.

If you open the site and check the browser console, it also prints a list of the
placeholders still left to fill in.

| What | Where | Change |
|---|---|---|
| Your email | Contact section | `href="mailto:hello@example.com"` **and** the visible text |
| LinkedIn / GitHub / Instagram / X / WordPress | `.socials` list in Contact | replace `href="#"` |
| Project GitHub + demo links | `.proj__links` in each project card | replace `href="#"` |

Once a link is real, you can delete its `data-replace="…"` attribute — and when
they're all done, delete the last block in `script.js` (the placeholder-warning
block) if you want.

---

## 3. Swap in your images

**Your photo** — put a 4:3-ish image at `assets/img/portrait.jpg`, then in
`index.html`:

```html
<img src="assets/img/portrait.jpg" alt="Portrait of Manjil Aryal" loading="lazy">
```

**Project screenshots** — drop them in `assets/projects/` and point each card's
`<img src="…">` at the new file. A 16:10 ratio (e.g. 1600×1000) fits the cards
best; the feature card (Chilvy) can take something taller. Keep the SVGs as
fallbacks until you have real screenshots — they're vector, so they stay sharp.

Compress photos before committing them (`tinypng.com` or `squoosh.app`). Nothing
hurts a portfolio's first impression more than a 4 MB hero image.

---

## 4. Change the design

All design tokens live in `:root` at the top of `style.css`:

```css
:root{
  --ink:    #08090b;   /* page background            */
  --ink-2:  #0c0e11;   /* alternating section bg     */
  --text:   #e9e9ec;   /* body text                  */
  --brass:  #d8a657;   /* primary accent             */
  --slate:  #7f9cc9;   /* secondary accent           */
  --serif:  "Instrument Serif", …;   /* display font */
  --sans:   "Inter", …;              /* body font    */
}
```

Change `--brass` and the whole site re-tints — buttons, numbers, borders,
hover states and the pulsing star in the hero. Some ideas if you want a different
feel: `#7cc5a9` (jade), `#8b9cff` (periwinkle), `#e0674f` (terracotta).

Fonts come from Google Fonts via the `<link>` in `<head>`. To self-host or swap
them, change that link and the `--serif` / `--sans` values.

---

## 5. Edit the content

Everything is in `index.html`, in plain semantic HTML, in the order it appears on
the page:

1. Hero
2. About
3. Experience (`<ol class="timeline">` — copy an `<li class="tl reveal">` to add an entry)
4. Selected Projects (copy an `<article class="proj reveal">` block to add one)
5. Research
6. Leadership & Community
7. Achievements (copy an `<article class="ach reveal">`; `ach--wide` spans two columns)
8. Skills (just `<li>` items inside each `.skillset`)
9. Contact

Keep the `reveal` class on anything new — that's what triggers the scroll-in
animation. Add `style="--d:.15s"` to stagger it.

To **remove** a section: delete its `<section>` and the matching links in both
`.nav__links` and `.mobile-menu__links`.

---

## 6. Deploy

### GitHub Pages (free, recommended)

```bash
cd manjil-aryal-portfolio
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
git push -u origin main
```

Naming the repo `YOUR-USERNAME.github.io` publishes it at
`https://YOUR-USERNAME.github.io`. For any other repo name, go to
**Settings → Pages → Source: main / root**, and it'll be served at
`https://YOUR-USERNAME.github.io/REPO-NAME/`.

### Netlify or Vercel

Drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop) — done,
live in seconds. Or connect the GitHub repo for automatic deploys on every push.
No build command, no output directory; it's a static site.

### Custom domain

Buy a domain, point it at your host, and add it under **Settings → Pages →
Custom domain** (GitHub) or **Domain settings** (Netlify/Vercel). HTTPS is
automatic on all three.

---

## 7. Before you share it

- [ ] Replaced every `data-replace` link
- [ ] Real email in the Contact section
- [ ] Your photo in place of `portrait.svg`
- [ ] Project screenshots added where you have them
- [ ] Updated `<title>` and the `description` / `og:description` meta tags
- [ ] Added an `og:image` (1200×630) so link previews look right when shared
- [ ] Checked it on your phone
- [ ] Tabbed through the page with the keyboard — focus rings should be visible
- [ ] Ran it through [PageSpeed Insights](https://pagespeed.web.dev/)

---

## Accessibility & performance notes

Already handled, worth not breaking:

- Semantic landmarks (`header`, `main`, `section`, `footer`) and a skip link
- Visible focus states on every interactive element
- `aria-expanded` / `aria-hidden` wired to the mobile menu, which also closes on `Esc`
- Full `prefers-reduced-motion` support — animations off, hero canvas hidden
- Hero canvas pauses when scrolled out of view or the tab is hidden
- Images lazy-loaded; no external JS or CSS beyond the font stylesheet
- A print stylesheet, so the page prints as a clean document

---

## Browser support

Chrome, Edge, Firefox and Safari (last two major versions). Uses
`IntersectionObserver`, CSS custom properties and `clamp()` — all widely
supported. Older browsers get the content and layout, just without the reveal
animations.
