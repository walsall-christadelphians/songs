# Songs

A digital hymnbook for Walsall Christadelphians. It's a Progressive Web App, so it works on Android, iPhone, Mac and Windows, can be installed to the home screen, and works offline.

## Adding a hymn

Songs live in `songs.json`. Each has a `title`, optional `ref`, `words`, `music`, `source`, `year`, `audio` (a file in `audio/`) and `parts` (each a `label` with `lines`, or `{"label": "Chorus", "repeat": true}` to repeat an earlier section). Words in (brackets) show as echoes. Songs are listed A–Z by title.

When you change any files, installed copies pick up changes to pages and songs automatically next time they are online.
