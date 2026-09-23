/// <reference path="../pb_data/types.d.ts" />

// Dedicated collection for audio podcast episodes (MP3/WAV uploads).
//
// Storage boundary: audio files live in PocketBase file storage for now, and
// the frontend resolves the playable URL through a single helper
// (apps/web/src/lib/podcastAudio.js → getAudioUrl). To migrate to Cloudflare
// Workers + R2 later, swap that one helper to return an R2 URL (or read a
// stored `audio_file_url` text field) — no component changes required.
//
// Fields map 1:1 to the requested schema:
//   episode_id      → record id (PocketBase primary key)
//   title           → title
//   description     → description
//   publish_date    → publish_date
//   duration        → duration (human string, e.g. "42:15")
//   audio_file_url  → derived from the `audio_file` file field via getAudioUrl

migrate(
  (app) => {
    let admins;
    try {
      admins = app.findCollectionByNameOrId("admins");
    } catch (_) {
      throw new Error(
        "admins collection not found — run the create_admins_and_hero_media migration first",
      );
    }

    const adminWriteRule = `@request.auth.collectionId = "${admins.id}"`;
    const adminReadRule = `status = 'published' || @request.auth.collectionId = "${admins.id}"`;

    let collection;
    try {
      collection = app.findCollectionByNameOrId("podcast_episodes");
    } catch (_) {
      collection = new Collection({
        type: "base",
        name: "podcast_episodes",
        // Public can read only published episodes; admins can read/write everything.
        listRule: adminReadRule,
        viewRule: adminReadRule,
        createRule: adminWriteRule,
        updateRule: adminWriteRule,
        deleteRule: adminWriteRule,
        fields: [
          { name: "title", type: "text", required: true, max: 200 },
          { name: "description", type: "text", max: 2000 },
          { name: "author_name", type: "text", max: 120 },
          { name: "author_credentials", type: "text", max: 120 },
          // Human-readable duration, e.g. "42:15" or "1h 12m". Entered by admin.
          { name: "duration", type: "text", max: 20 },
          // Audio file hosted in PocketBase file storage (MP3/WAV), up to 100 MB.
          {
            name: "audio_file",
            type: "file",
            required: true,
            maxSelect: 1,
            maxSize: 104857600, // 100 MB
            mimeTypes: [
              "audio/mpeg",
              "audio/mp3",
              "audio/wav",
              "audio/x-wav",
              "audio/wave",
            ],
          },
          {
            name: "status",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["draft", "published"],
          },
          { name: "publish_date", type: "date" },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
        indexes: [
          "CREATE INDEX idx_podcast_episodes_status ON podcast_episodes (status)",
        ],
      });
      app.save(collection);
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("podcast_episodes");
      app.delete(collection);
    } catch (e) {
      if (!e.message.includes("no rows in result set")) throw e;
    }
  },
);
