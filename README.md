# Portfolio

Five interactive portfolio concepts, with a shared entry page.

- [Portfolio](https://serjamba.github.io/portfolio/)
- [AXIS](https://serjamba.github.io/portfolio/axis/)
- [VOID](https://serjamba.github.io/portfolio/void/)
- [MONOLITH](https://serjamba.github.io/portfolio/monolith/)
- [TORQ](https://serjamba.github.io/portfolio/torq/)
- [MOKA](https://serjamba.github.io/portfolio/moka/)

## Hosting and updates

GitHub Pages: **Settings → Pages → Deploy from a branch → main → / (root)**.
The `.nojekyll` file keeps this as a plain static site. Routes inside applications use URL hashes, so direct links and browser refresh do not need server rewrites.

To update, clone this repository, edit the relevant site's files, test through a local HTTP server, then commit and push to `main`. Wait for the Pages deployment and verify the public URLs. Keep relative asset paths and matching filename case. For a local preview, run `python -m http.server 8000` from the repository root.

Do not copy development archives, browser profiles, caches, backups, credentials, or original oversized source images into this repository. Local originals and backups are maintained separately by the owner.

## Demonstration scope

All five sites are portfolio concepts. Forms and checkout are demonstrations: no real requests, orders, payments, or contact submissions are performed. Use fictional data when testing.

AXIS's Horizon is a conceptual architectural pavilion, not a constructed residential building or construction documentation. The static presentation render and interactive model use the same architecture but different rendering quality. Open 3D with the explicit button; walking uses WASD/arrows and mouse, with Escape to exit. On touch devices, use the prepared viewpoints. Walking limits the rendering buffer to 1024 pixels wide and disables screen-space contact shadows for performance.

## Resource credits

See each site's `ASSET_MANIFEST.md`, AXIS's `pavilion/LICENSES.md`, and TORQ's `RESOURCE_SOURCES.md`. Third-party licenses remain beside the corresponding resources. These include Three.js (MIT), Inter (SIL OFL), Lucide (ISC), and Romantic Veneer by Jenelle van Heerden / Poly Haven (CC0). Manufacturer trademarks belong to their owners; their appearance does not imply partnership. Public repository access does not grant additional rights to third-party assets or trademarks.
