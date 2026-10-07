# Website photography

- Container port: CHUTTERSNAP, [Unsplash](https://unsplash.com/photos/aerial-view-of-intermodal-containers-xewrfLD8emE). Free Unsplash License. Saved as public/trade-port.jpg.
- Market produce: Josh Hild, [Unsplash](https://unsplash.com/photos/24cZizjVBk8). Free Unsplash License. Saved as public/trade-produce.jpg.
- Cargo-aircraft video: retained from the existing website (Pexels video 37723633).
- ANJ Global logo: user-supplied brand artwork.

Photography illustrates product sectors and logistics; it does not depict company-owned facilities.

# Publishing

The five React routes in app/ are the source of truth. Build with the existing framework build script. The Site publishes the generated static export in dist/client. The previous hand-authored out/index.html was replaced so preview and production use the same source.
