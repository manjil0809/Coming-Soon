# Manjil Aryal — portfolio

A single-page portfolio in plain HTML, CSS and JavaScript. No build step, no
framework, no dependencies to install. Open `index.html` in a browser and it runs.

```
manjil-aryal-portfolio/
├── index.html        all the content lives here
├── css/style.css     all the styling
├── js/main.js        hero sequence, scroll reveals, nav, theme toggle
├── assets/
│   ├── manjil.jpg    your portrait, black and white
│   ├── manjil.webp   the same portrait, smaller file
│   └── chilvy.webp   the Chilvy screens
└── README.md
```

---

## Adding a project image

Three entries have an empty image slot waiting: **COSOG**, **Remote biomedical
monitoring**, and **Shubhayatra**. Each one shows the exact filename it wants.

1. Put your image in `assets/` under the name the slot asks for —
   `cosog.webp`, `biomedical.webp`, `shubhayatra.webp`.
2. Open `index.html`, find that entry, and delete the whole
   `<div class="shot__empty">…</div>` block.
3. Just above it there is a commented-out `<img>` line. Uncomment it and write a
   real `alt` description.

So this:

```html
<figure class="shot">
  <div class="shot__empty">
    <span>Project image</span>
    <code>assets/cosog.webp</code>
  </div>
</figure>
```

becomes this:

```html
<figure class="shot">
  <img src="assets/cosog.webp" loading="lazy" decoding="async"
       alt="A leaf photographed in the app, with the detected disease named below it.">
  <figcaption>What the detector returns from a single photograph.</figcaption>
</figure>
```

The `<figcaption>` is optional — delete the line if you do not want one. Chilvy
already has both, so copy that entry if you would rather work from a filled example.

**What to shoot.** Screenshots of the actual thing beat renders. For COSOG, the
detection result on screen. For the biomedical work, a photograph of the rig with
the sensors visible. For Shubhayatra, a Figma frame or a slide from the pitch.
Anything around 1400–1600px wide is plenty. `.webp` keeps the file small; `.png`
and `.jpg` work too, just change the extension in the `src`.

**If an entry never gets an image**, delete its whole `<figure class="shot">` block.
The layout closes up cleanly — nothing else needs touching.

---

## Before you publish — fill these in

**1. Your contact details** — `index.html`, the `#contact` section near the bottom.
Four links currently read `[ add your email ]` and so on. Replace the text and the
`href`, then delete `class="is-placeholder"` from each so they stop rendering grey
and italic.

```html
<li><a href="mailto:you@example.com">you@example.com</a></li>
<li><a href="https://github.com/yourhandle">GitHub</a></li>
```

**2. Your live URL and a share image** — in `<head>`, the commented-out `canonical`,
`og:url` and `og:image` tags. These control how the link looks when it is pasted
into a chat or posted anywhere. Without `og:image` the link appears as plain text,
which matters if you are sending this to anyone.

**3. A Chilvy link**, if you have one — there is a commented-out `entry__links`
line in the Chilvy entry ready for it.

**4. The WordCamp Bharatpur year** — that row in the Community section shows a dash
because the year was not in your profile document. Fill it in and the column lines up.

---

## Two figures to confirm before this goes live

Your profile document flagged both of these, so they are on the page but worth a
second look first:

- **"Reported to reach 89+ farmers"** (COSOG). Swap in whatever the latest
  verified number is, or cut the line from the margin column.
- **The National Merit Scholarship selectivity.** The page says only that it was
  awarded by the Government of Nepal through a competitive national examination.
  The "top 0.01%" framing was left off deliberately — add it only if you can
  point to a source.

Everything else on the page comes straight from your profile document. Roles are
as you stated them, the biomedical work is described as a prototype rather than a
product, and no proficiency percentages appear anywhere.

---

## Editing it

**Text** — open `index.html`. It is ordered the way the page is, with each section
marked by a comment banner. Prose sits in `<div class="column">`; the facts that
appear in the narrow left-hand column sit in `<aside class="margin">` just above it.

**Adding a project** — copy any `<article class="sheet entry">` block, change the
`id`, and edit. The layout handles the rest.

**Moving a small project up** — the two short pieces at the end of the work section
(Hamro Subidha, AIDA) sit in a compact `<ul class="also">` list. If one of them
grows into something with a screenshot and a real story, promote it: copy a full
`<article class="sheet entry">` block and move the text across.

**Your photo** — replace `assets/manjil.jpg` and `assets/manjil.webp` with any
portrait. The CSS crops to 4:5 and converts to black and white for you, so you can
drop in a colour photo of any shape and it will still sit correctly. If you only
have one file, delete the `<source>` line in the `<picture>` block and point the
`<img src>` at it.

**Colours** — the top of `css/style.css`, in `:root`. Six values:

| Token | Does |
|---|---|
| `--stone` | page background |
| `--paper` | raised surfaces, including the frame around project images |
| `--ink` | text |
| `--graphite` | secondary text |
| `--hairline` | rules and borders |
| `--marigold` | the single accent |

Dark theme values are in the `html[data-theme="dark"]` block right underneath.
Change one token and it updates everywhere.

**Type** — Archivo (a variable grotesque) for headings and anything structural,
Newsreader (a serif) for reading. The hero animation uses Archivo's width axis,
so if you swap the display face for one without a `wdth` axis, the name will fade
in instead of opening out. Nothing breaks.

---

## How the motion works

One deliberate moment, then quiet. On load, your name rises into place while
Archivo opens from condensed to full width. After that, sections fade in once as
you reach them, links underline on hover, and that is all.

- Everything is CSS transitions driven by `IntersectionObserver`. No animation library.
- `prefers-reduced-motion: reduce` is respected — all of it switches off and the
  page renders statically.
- If JavaScript fails or is off, the full page still renders and reads. The
  reveal marks are removed on error rather than leaving content hidden.

---

## Deploying

Any static host works. The whole thing is three files plus images.

**GitHub Pages** — push the folder to a repo, then Settings → Pages → deploy from
the `main` branch, root. Live at `username.github.io/repo-name`.

**Netlify or Cloudflare Pages** — drag the folder onto the dashboard. No build
command, no publish directory.

**Your own host** — upload the contents by FTP. There is nothing to run.

### Fonts

Fonts load from Google Fonts over the network. To self-host instead — faster, and
no third-party request — download both families, put the `.woff2` files in
`assets/`, delete the three `<link>` tags for fonts in `<head>`, and add
`@font-face` rules at the top of `style.css`.

---

## What changed in this version

- **Your portrait** sits in the margin column of the opening section, in black and
  white, framed with a hairline. On phones it leads the section rather than trailing
  it. The conversion is baked into the file and reinforced in CSS, so it stays
  monochrome even if you swap in a colour photo.
- **Project image slots** on the four substantial entries. Chilvy is filled with
  your screens; the other three show a labelled empty slot that reads as deliberate
  rather than broken, and prints as nothing at all.
- **Shorter project writing.** Chilvy went from four paragraphs to two — the
  numbers it was repeating already live in the margin column, so the prose does not
  need to carry them. The same cut was made across every entry.
- **Hamro Subidha and AIDA moved into a compact "Also built" list.** Two thin
  entries at full size made the work section sag; at list size they read as range
  instead of padding.
- **Numbered sections** (01–06) in the band titles, which gives a long single page
  some navigational spine.
- **Fixed a path bug.** The old `index.html` loaded `style.css` and `main.js` from
  the root while the README described them in `css/` and `js/`. The folders now
  match the markup — the site would have rendered unstyled on a real host otherwise.
- **Head tags** for sharing and search: a `theme-color` that follows the theme, an
  inline SVG favicon with no extra file, and Person structured data.
- **Image loading** is lazy below the fold with width and height declared, so
  nothing jumps as the page loads.

---

## What I checked

Rendered at 1440px and 390px, in both themes: no horizontal overflow at any of
them, no console errors, keyboard focus visible throughout, a skip link to the
content, and it prints to a clean sheet without the nav or the empty image slots.

On contrast: body text is 21:1 and secondary grey text is 6.0:1 on light and
6.4:1 on dark, both clear of the 4.5:1 threshold. Marigold is deliberately never
used for text — at 1.8:1 against the stone background it would fail — so it only
ever appears as markers, rules and borders. The section numbers are set in
graphite for the same reason. Hover on the
contact links shifts them sideways rather than recolouring them, so the cue does
not depend on colour.
