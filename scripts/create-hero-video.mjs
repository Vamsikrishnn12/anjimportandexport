// Rebuild the edited hero from the licensed source clips listed in docs/hero-video.md.
// Usage: node scripts/create-hero-video.mjs <ffmpeg.exe> <ship.mp4> <aircraft.mp4> <produce.mp4>
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const [encoder, ship, aircraft, produce] = process.argv.slice(2);
if (!encoder || !ship || !aircraft || !produce) {
  throw new Error("Provide the FFmpeg executable and the three original source clips.");
}
const root = fileURLToPath(new URL("../", import.meta.url));
const video = resolve(root, "public/anj-import-export-hero.mp4");
const poster = resolve(root, "public/anj-import-export-poster.jpg");
const normalize = "setpts=PTS-STARTPTS,fps=24,scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1,settb=AVTB,format=yuv420p,eq=contrast=1.04:saturation=0.82:brightness=-0.025";

// Crossfade back into the opening shot, then trim that shot's first 0.8s.
// The last and first frames now meet at the same moment in the source footage.
const filters = [
  `[0:v]trim=start=2:duration=7,${normalize},split=2[sea][loop]`,
  `[loop]trim=duration=0.8,setpts=PTS-STARTPTS,fps=24,settb=AVTB[loopStart]`,
  `[1:v]trim=start=8:duration=7,${normalize}[air]`,
  `[2:v]trim=start=3:duration=7,${normalize}[goods]`,
  "[sea][air]xfade=transition=fade:duration=0.8:offset=6.2[seaAir]",
  "[seaAir][goods]xfade=transition=fade:duration=0.8:offset=12.4[trade]",
  "[trade][loopStart]xfade=transition=fade:duration=0.8:offset=18.6[cycle]",
  "[cycle]trim=start=0.8:end=19.4,setpts=PTS-STARTPTS,fps=24,settb=1/24,format=yuv420p[out]",
].join(";");

function run(args) {
  const result = spawnSync(encoder, args, { cwd: root, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Video encoding failed (${result.status}).`);
}
run([
  "-hide_banner", "-y", "-i", resolve(ship), "-i", resolve(aircraft), "-i", resolve(produce),
  "-filter_complex_threads", "2", "-filter_complex", filters, "-map", "[out]", "-an",
  "-c:v", "libx264", "-preset", "medium", "-crf", "25", "-maxrate", "2500k",
  "-bufsize", "5000k", "-profile:v", "high", "-level", "3.1", "-pix_fmt", "yuv420p",
  "-movflags", "+faststart", "-map_metadata", "-1", "-metadata", "title=ANJ Global — Import & Export",
  video,
]);
run(["-hide_banner", "-y", "-i", video, "-frames:v", "1", "-q:v", "3", "-update", "1", poster]);
