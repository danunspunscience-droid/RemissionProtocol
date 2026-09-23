import pb from '@/lib/pocketbaseClient';

// Storage boundary for podcast audio.
//
// Audio files currently live in PocketBase file storage and are resolved here
// from the `audio_file` file field. To migrate to Cloudflare Workers + R2
// later, replace this single function to return the R2 URL (e.g. read from a
// stored `audio_file_url` text field). Every component reads the playable URL
// through getAudioUrl, so the storage backend can be swapped without touching
// the player or admin UI.
export const getAudioUrl = (rec) => {
    if (!rec || !rec.audio_file) return '';
    return pb.files.getURL(rec, rec.audio_file);
};

export default getAudioUrl;
