---
name: fslides-style-brightward
description: >-
  Apply Brightward's Aurora and Modern clarity design to fslides HTML slides
  using style brightward, including palette, type, diagrams and export-safe
  motion. Use for Brightward fslides styling; installation does not create a deck.
---

# Brightward presentation style

Adapted from the user-supplied Elastic web style guide and its company presentation.
Use the reference's clear hierarchy, whitespace, short diagram labels and causal
assembly. Brightward's identity comes from `Brightward-Demo/DESIGN.md`: navy,
teal, Sora, Inter and IBM Plex Mono. Elastic product graphics, logos, pink AI
cubes and company claims do not belong in Brightward output.

The kit includes `assets/brightward.css`, `assets/brightward.js` and local fonts.
The project launcher applies these into a future deck's `slides/style/`.
No reference slides or finished Brightward deck are included in this installation.
For example layout guidance, read `references/layouts.md` next to this file.

## Project context

Read the current project brief and `presentation/content.json` before authoring
requested content. Brightward is a fictional streaming customer with synthetic
incidents. The current app uses Responses and File Search to produce a grounded
triage brief and inspect cited evidence. It makes no infrastructure changes.
Show future remediation separately, with an explicit future label.

Keep stated metrics honest. The 30% improvement is an unvalidated target unless
new evidence establishes it. Measured results, illustrative telemetry and targets
need distinct labels. Do not turn an example's autonomous SRE claim into a current
Brightward capability.

The approved content currently has four slides and the entire demo between slides
2 and 3. Follow that flow when the user asks to use it. This installation authorizes
tooling only; it does not migrate, regenerate or overwrite the PDF or narration.
Use later user direction to decide whether to create an experimental HTML deck.

## Atmosphere and canvas

Calm, precise, evidence-focused. One claim per slide. The diagram explains that
claim. Use a fixed 1280 by 720 body with 56px vertical and 72px horizontal padding.
Reserve the bottom 48px for the footer. A two-column slide gives text approximately
500px and the visual the remaining space, separated by 48px. Keep essential text
away from the player's lower-right controls.

Default to Brightward navy. Optional `body.light` gives a white canvas for the
reference's editorial feel, using darker teal for readable text. `body.soft` adds
a subdued navy surface; `body.light.soft` gives a pale neutral canvas. Keep a
consistent theme within a deck unless the user chooses a deliberate section break.

## Typography

| Role | Family and scale at 1280 by 720 |
| --- | --- |
| Headline | Sora 500, 46-58px, 1.08 line height, about -0.03em tracking |
| Cover headline | Sora 500, 72-88px, at most two short lines |
| Essential body | Inter 400, 24-28px, about 1.4 line height |
| Subtitle | Inter 400, 22-24px, secondary color, at most two lines |
| Diagram labels | Inter 500, 20-24px, sentence case |
| Eyebrow and footer | IBM Plex Mono 400, 12-14px, supplementary only |
| Supporting metadata | IBM Plex Mono 400, 14-16px |
| Big stats | Inter 500, 84px or larger, accent, tight tracking |

Use plain sentence headlines with a concrete claim. An accent span `.b` can
highlight the payoff. Do not shrink essential content into the small callout scale
of the original guide: Brightward's recorded demo needs readable text.

## Palette

| Token | Dark canvas | Light canvas | Meaning |
| --- | --- | --- | --- |
| `--bg` | #0B1220 | #FFFFFF | canvas |
| `--surface` | #162235 | #F5F7FA | supporting surface |
| `--ink` | #EEF4FA | #0B1220 | primary text |
| `--muted` | #A9B9CF | #52647A | secondary text |
| `--accent` | #5EEAD4 | #11796C | evidence, retrieval, primary emphasis |
| `--line` | #314158 | #CBD5E1 | thin dividers and connectors |
| `--ready` | #86EFAC | #216B3B | evidenced readiness or recovery |
| `--warning` | #FBBF24 | #8B5A00 | unresolved decisions and review |
| `--error` | #FDA4AF | #B4233B | incident or error |

Always pair status color with words. Green recovery requires actual recovery
evidence. A generated brief is ready for review, not a resolved incident.
Do not encode current versus future capability solely through color.

## Diagram language

Use rounded rectangles and thin directional connectors for the default process
view. Limit a main flow to roughly three to five nodes. Clearly label the incident,
retrieval, cited output and human decision. Future action tools sit outside the
current path. A screenshot of the actual app is useful evidence; retain its global
synthetic-demo label and readable source excerpts.

Isometric solids are optional when they clarify layers or assembly. Draw SVG
geometry locally rather than assuming the unattached `EW.iso` engine exists.
Use flat faces: light top, accent front, darker side; neutral blocks use slate.
Draw the base before objects resting on it. Put labels outside solids on short
leaders. Show visible air and a surface shadow for a hovering block.
Dots may suggest a bounded knowledge field at low contrast, but they carry no
invented count, score or metric. Label data states explicitly rather than relying
on the original guide's multi-color-to-blue convention.

## Components and footer

Cards use a 1px divider and 12px corners. Controls use 8px corners, evidence chips
4px. Favor spacing and typography over many nested boxes. Use restrained shadows;
the Elastic hard offset shadow is optional for a single featured window.
Primary controls use navy text on teal. In the light variant use white text on
the darker teal. Keep visible keyboard focus. External links use `target="_blank"`
with `rel="noopener"`.

`data-foot="Section · tag"` on the body adds the demo UI favicon beside the
Brightward wordmark at bottom left and mono context at bottom right.
`data-foot="none"` hides it. The default footer discloses fictional customer and
synthetic incidents. Use `assets/favicon.svg`, copied from
`Brightward-Demo/static/favicon.svg`, for both favicon and footer logo. Retain
the teal double-chevron mark and navy square; do not substitute a text star.

## Motion and export

Motion should explain order or causality: retrieve evidence, then present a brief,
then review. The style provides `.in1` through `.in6` short fade-up classes if useful.
Finish entrances by 1.8 seconds; fslides PDF capture waits about 2 seconds.
Use `prefers-reduced-motion` and `navigator.webdriver` to settle automatically.
Avoid decorative counting, rapid blinking and continuous attention-seeking loops.
Important meaning must survive a static PDF frame.

## Assets and verification

After applying the kit, use these paths from a slide in `slides/`:

```html
<link rel="icon" href="style/favicon.svg?v=forward" type="image/svg+xml" sizes="any">
<link rel="stylesheet" href="style/brightward.css">
<!-- slide content -->
<script src="style/brightward.js"></script>
<script src="/js/fuckslides.js"></script>
```

`BW.fit()` scales standalone slides; it runs automatically and defers to the
player inside its iframe. `BW.footer()` adds footer chrome. These are the actual
provided helpers; there is no `EW` dependency. Keep text in HTML if editable
PowerPoint export matters, since SVG becomes an image.

Inspect rendered slides before exporting. Check clipping, color contrast, font
loading, readable labels and the static export frame. Verify all five densities
only when density is enabled; preserve each slide's saved level. The density dial
is optional and must not hide material caveats or synthetic-data labels.

Prefer short sentences and ordinary punctuation. The supplied guide avoids em
dashes; retain that preference in new copy. Preserve approved wording and do not
invent performance numbers or silently change the author's claim.
