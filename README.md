# Songs

A digital hymnbook for Walsall Christadelphians. It's a Progressive Web App, so it works on Android, iPhone, Mac and Windows, can be installed to the home screen, and works offline.

## Adding a hymn

Songs live in `songs.json`. Each has a `title`, optional `ref`, `words`, `music`, `source`, `year`, `audio` (a file in `audio/`, or a list of `{"src", "label"}` for several recordings), `charts` (a list of chord charts and/or sheet music, each shown in its own tab: `kind` is "chords" or "sheet"; give `lines` for a chords-over-words sheet written like `[G]word`, or `pages` for images of each page, plus an optional `pdf`) and `parts` (each a `label` with `lines`, or `{"label": "Chorus", "repeat": true}` to repeat an earlier section). Words in (brackets) show as echoes. Songs are listed A–Z by title.

When you change any files, installed copies pick up changes to pages and songs automatically next time they are online.
