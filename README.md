# Songs

A digital hymnbook for Walsall Christadelphians. It's a Progressive Web App, so it works on Android, iPhone, Mac and Windows, can be installed to the home screen, and works offline.

## Adding a hymn

Add an entry to the `HYMNS` list in `index.html` with a `title` and its `parts` (verses, chorus, refrain). Hymns are listed A–Z by title.

When you change any files, bump `CACHE` in `sw.js` (e.g. `hymnbook-v2`) so installed copies pick up the update.
