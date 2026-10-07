# Project-local fslides for Brightward

Installed: fslides 0.7.1, seven upstream skills adapted for Codex, and the
`fslides-style-brightward` skill. The animated Brightward deck now lives in
`decks/brightward/`: four slides, original SVG graphics and the approved speaker
notes, with the demo between slides 2 and 3. The existing PDF, narration, content
JSON and PDF builder remain in place.

## Present the Brightward deck

From the project root:

```fish
cd "/home/tj/Documents/Brightward Streaming"
npm run slides -- --deck fslides/decks/brightward serve
```

Open `http://localhost:3000/`. If the server was started with the default starter,
stop it with Ctrl+C and run the command again: fslides 0.7.1 caches its manifest
when the process starts. A browser refresh alone does not update that cached list.

The editable source is `decks/brightward/slides/`, with a portable HTML copy at
`decks/brightward/brightward-streaming.html`. The HTML retains animation.
PDF exports are deferred while edits are in progress; create one only when TJ
requests it. Refresh the HTML copy after editing. `notes.json` mirrors the
approved talk track, including the entire 1:10-4:00 browser demo after slide 2.
The 30% figure is an unvalidated target and future remediation is explicitly
separate from the current advisory app.

The attached Elastic guide has been adapted to Brightward's approved Aurora +
Modern clarity identity: navy/teal, Sora/Inter/IBM Plex Mono, readable body text,
evidence-focused diagrams and qualified capability claims. A white canvas variant
is available with `body.light`. See [the adapted guide](styles/brightward/SKILL.md).

## Check the installation

From the project root, in fish or bash:

```sh
npm run slides:doctor
npm run slides -- style list
```

After cloning on another machine, run `npm ci` and `npm run slides:browser` first.
The explicit browser command also works when npm blocks dependency install scripts.
To keep Puppeteer's browser
inside the ignored local dependencies, fish users can use:

```fish
env PUPPETEER_CACHE_DIR="$PWD/node_modules/.cache/puppeteer" npm ci
npm run slides:browser
npm run slides:doctor
```

Codex loads the skills from `.agents/skills/`. They should be available on your
next turn; if the selector does not refresh, reopen the chat or restart Codex.
Invoke `$fslides-deck` or `$fslides-style-brightward` explicitly when useful.
These skills apply to fslides work and do not replace the existing PDF workflow.

## Create another deck when ready

Run this only when you want to begin authoring:

```sh
npm run slides -- create fslides/decks/my-next-deck --style brightward
```

This creates the upstream minimal starter with Brightward style assets and a
Codex-readable style skill. It does not write your presentation content. Replace
the starter with your own named slide files, register them in `fslides.config.js`,
and add the stylesheet/runtime tags shown in the adapted guide. The kit contains
no reference slide templates. The upstream minimal starter calls its initial file
`index.html`; rename it to a descriptive name such as `cover.html` and update the
manifest before adding your content.

The launcher resolves the local `brightward` kit, corrects the upstream starter's
old `fuck-slides` dependency to pinned `fslides`, and moves its generated Claude
style brief to `.agents/skills/`. The parent project's dependencies are sufficient
when you use this launcher; a second deck-local install is unnecessary.

For Brightward single-file HTML exports, the launcher also embeds the local fonts
referenced by the linked stylesheet and corrects inlined JavaScript MIME types.
These bridge upstream 0.7.1 export gaps without patching the installed package.

Then, from the project root:

```sh
npm run slides -- --deck fslides/decks/brightward serve
npm run slides -- --deck fslides/decks/brightward export brightward.html
npm run slides -- --deck fslides/decks/brightward pdf
```

Stop the server with Ctrl+C. The fslides player opens at `http://localhost:3000/`.
If an older starter message tells you to run `fuckslides serve`, use the project
launcher command above instead. There is no global `fuckslides` command installed.
Use arrows to navigate, N for notes, G for overview and F for fullscreen.
No GitHub Pages workflow, comment gateway or hosting is enabled by this setup.
Keep publishing as a separate deliberate action. A private source repository does
not establish that a separately published presentation will be private.

To apply the kit to an existing fslides deck:

```sh
npm run slides -- --deck PATH/TO/DECK style use brightward
```

Application refreshes style assets and retains an existing Codex style skill so
your edits to it are preserved. To refresh the guide as well, review and copy the
current kit guide deliberately.

## Sources and maintenance

- Framework: https://github.com/fslides/fslides and npm package `fslides@0.7.1`
- Skill snapshot: upstream commit `14de21ea389491e917fcdee3683ff41557127762`
- Attached source: `style-skill-base.md`, supplied by TJ
- Visual reference: https://elastic.github.io/observability-team/collaterals/observability-presentation/company-preso.html
- Codex skill discovery: https://learn.chatgpt.com/docs/build-skills

The seven upstream skills cover authoring, style, density, cleanup, export,
live demos and visual verification. Local edits use project commands and Codex
paths, preserve Brightward's current demo boundary, make density optional and
remove automatic publishing. Verification scripts resolve the pinned local
Puppeteer/browser cache and fail visibly when a slide cannot load.

The complete framework source is available through the installed npm dependency;
it is not copied as a second nested Git checkout. Commit `package-lock.json` and
the adapted skills/style kit; ignore `node_modules`, credentials, runtime state
and recordings. The upstream package declares MIT licensing; retain attribution
when redistributing these adapted skills.

## Dependency audit at installation

On October 7, 2026, `npm audit` reported 11 high-severity entries in the installed
fslides dependency tree, stemming from `extract-zip`, `basic-ftp` and `image-size`
advisories and their dependents. npm reported no automatic fix available. The
requested upstream version remains pinned; no unverified dependency overrides or
forced upgrades were applied. This installation passes functional checks, but it
is not a vulnerability-free dependency set. Recheck upstream updates before using
untrusted archives/images or publishing a production service around this tooling.
