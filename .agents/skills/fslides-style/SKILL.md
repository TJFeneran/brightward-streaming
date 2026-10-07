---
name: fslides-style
description: Apply, adapt or maintain a reusable design kit for fslides HTML slides. Use for fslides styling and the Brightward kit, not unrelated app design or automatic deck creation.
---

# fslides style kits in Codex

Brightward's local kit is `fslides/styles/brightward/`: `style.json`, `SKILL.md`,
`assets/brightward.css`, `assets/brightward.js` and local fonts. Read the kit brief
before changing it. It adapts the supplied Elastic web guide to the approved
Brightward Aurora + Modern clarity identity and the actual demo capabilities.

From the Brightward project root:

```sh
npm run slides -- style list
npm run slides -- --deck PATH/TO/DECK style use brightward
```

The launcher copies assets into the deck's `slides/style/`, sets the manifest's
`style` to `brightward`, and installs the guide under `.agents/skills/` rather
than upstream's Claude path. It retains an existing Codex guide to preserve user
edits. Review updates before copying a newer guide over it.

A new deck uses `create NAME --style brightward` only when authoring is requested.
Do not run `style add` for this local kit; that would install into the user's
home registry. The launcher resolves `brightward` from the project directly.

For another requested kit, use the same structure and preserve existing identity
choices. Reference slide templates are optional; this setup deliberately includes
no slides. Never assume the supplied Elastic guide's `EW.iso` engine is available.
The Brightward assets expose only their documented `BW.fit()` and `BW.footer()`
helpers, with optional CSS entrances. Keep style validation in temporary files
when the task is installation-only.

Adapted from fslides/fslides, commit 14de21ea389491e917fcdee3683ff41557127762.
