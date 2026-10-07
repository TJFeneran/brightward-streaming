---
name: fslides-deck
description: Create or edit fslides HTML presentations, manifests and notes. Use for requested fslides work or an existing fslides deck, not installation-only tasks or the current Brightward PDF workflow.
---

# Authoring fslides in Brightward

An fslides deck has a `fslides.config.js` manifest, standalone `slides/*.html`
files at 1280 by 720, and `notes.json`. Read the bundled
[authoring guide](references/authoring.md) for the config and runtime contract.

This project installs tooling only. Create content only when the user asks to
start a deck. Preserve the existing PDF, narration and `presentation/content.json`
unless a subsequent request explicitly changes that workflow.

## Project-local commands

Find the Brightward root by its `tools/fslides.cjs` launcher. From that root:

```sh
npm run slides -- create fslides/decks/brightward --style brightward
npm run slides -- --deck fslides/decks/brightward serve
```

The launcher uses pinned local dependencies, fixes upstream's obsolete starter
package, and makes the style guide discoverable in Codex's `.agents/skills`.
There is no need for a global install or a second deck-local install.
See `fslides/README.md` for manual setup and commands.

## Authoring loop

- Follow `$fslides-style-brightward` when the manifest has `style: 'brightward'`.
- Keep every slide on a fixed 1280 by 720 body, load `/js/fuckslides.js` for
  keyboard relay and use the kit's standalone fitting helper.
- Register slide filenames and labels at the same manifest index. Use descriptive
  filenames; rename the upstream minimal starter's `index.html` before authoring.
- Put requested talk tracks in `notes.json`. Preserve recordings in
  `slides/recordings/`; they are the user's work.
- Inspect rendered slides using `$fslides-verify`. Density is optional; author and
  verify five levels only if the user opts in or the deck already enables it.
- Keep important claims and synthetic-data disclosures visible at the presentation
  density. A reduced density must not turn a target into a claimed result.
- Export locally with `$fslides-export` when requested. Creating or editing a deck
  does not itself request publishing, GitHub Pages, a comment gateway or upload.

Read `Brightward-Project-Brief.md` and the approved content when working on this
presentation. Current capabilities are cited recommendations via Responses/File
Search; future remediation needs a visible future label. The demo currently runs
outside the slides between slides 2 and 3. Do not add an embedded live-demo slide
unless the user explicitly changes that plan.

## Focused skills

- `fslides-style`: applying or maintaining a style kit.
- `fslides-density`: optional five-level detail control.
- `fslides-clean-deck`: wording and visual simplification.
- `fslides-verify`: screenshots and visible word counts.
- `fslides-export`: local HTML, PDF or PowerPoint and requested cloud export.
- `fslides-live-demo`: an explicitly requested interactive slide.

Adapted from fslides/fslides, commit 14de21ea389491e917fcdee3683ff41557127762.
