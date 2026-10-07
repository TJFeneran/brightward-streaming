# Brightward project guidance

`Brightward-Project-Brief.md` holds the current demo status and approved content.
Follow the user's latest request when experimenting with a new presentation format.
The existing PDF and narration come from `presentation/content.json` and
`tools/build-slides-pdf.py`; an fslides installation does not migrate them.

For requested fslides work, use the project-local skills in `.agents/skills` and
the pinned launcher `npm run slides --`. See `fslides/README.md` for manual setup.
The Brightward style kit lives in `fslides/styles/brightward`; default to its
palette and local fonts. The setup deliberately includes no authored HTML deck.

Current app behavior provides grounded triage suggestions via Responses/File
Search and makes no infrastructure changes. Label synthetic incidents, targets
and future capabilities honestly. The approved demo runs between slides 2 and 3.

Keep credentials, `.northstar` state, environments and generated caches out of
Git. Installation and deck authoring do not enable publishing or a comment gateway.
