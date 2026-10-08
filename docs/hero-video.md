# Import & export hero film

`public/anj-import-export-hero.mp4` is an original edit of three licensed stock clips, not footage of ANJ Global's own facilities, fleet or partners. The edit shows container shipping, cargo aviation and produce packing. Visible carrier branding is incidental; no endorsement or business relationship is asserted.

## Sources

All sources were downloaded and visually checked on 8 October 2026. [Pexels license](https://www.pexels.com/license/) allows website use and editing; attribution is not required but is recorded here.

1. **Aerial Footage of a Cargo Ship at Sea Loaded with Containers**, Alexander Bobrov. [Source page](https://www.pexels.com/video/aerial-footage-of-a-cargo-ship-at-sea-loaded-with-containers-2943126/). [Original MP4](https://videos.pexels.com/video-files/2943126/2943126-hd_1920_1080_24fps.mp4). Excerpt: 02–09 seconds.
2. **Cargo Jet Taking Off from Busy Airport**, Tuan Vy Spotter. [Source page](https://www.pexels.com/video/cargo-jet-taking-off-from-busy-airport-37723633/). [Original MP4](https://videos.pexels.com/video-files/37723633/15998681_1920_1080_30fps.mp4). Excerpt: 08–15 seconds.
3. **Tomatoes on Boxes**, Pixabay. [Source page](https://www.pexels.com/video/tomatoes-on-boxes-855561/). [Original MP4](https://videos.pexels.com/video-files/855561/855561-hd_1920_1080_25fps.mp4). Excerpt: 03–10 seconds. The supplied file is 1280×720 despite its download filename.

## Edit and rebuild

- Approximately 19 seconds, 1280×720, 24 fps, H.264/yuv420p; audio removed.
- Three 0.8-second crossfades, including a return to the opening clip for a continuous loop.
- Consistent restrained color grading and fast-start MP4 metadata for web playback.
- A matching first-frame poster displays while video loads or autoplay is unavailable.
- The existing hero text remains HTML; it is not baked into the footage.

Keep original downloads outside `public`, then run:

```text
node scripts/create-hero-video.mjs <ffmpeg-executable> <ship.mp4> <aircraft.mp4> <produce.mp4>
```

This writes the finished MP4 and poster to `public`. The site does not request third-party stock-video URLs during playback.
