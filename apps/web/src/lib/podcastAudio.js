// Audio files are served via native Cloudflare Pages Functions /api/files/ endpoint or public R2 CDN
export function getAudioUrl(rec) {
  if (!rec) return "";
  if (typeof rec === "string") {
    if (rec.startsWith("http") || rec.startsWith("/api/")) return rec;
    return `/api/files/${rec}`;
  }
  const audioPath = rec.audio_file || rec.file || rec.url || "";
  if (!audioPath) return "";
  if (audioPath.startsWith("http") || audioPath.startsWith("/api/")) return audioPath;
  return `/api/files/${audioPath}`;
}
export default getAudioUrl;
