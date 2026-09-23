/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // Resolve the admins auth collection (created by an earlier migration).
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
      collection = app.findCollectionByNameOrId("library_content");
    } catch (_) {
      collection = new Collection({
        type: "base",
        name: "library_content",
        // Public can read only published items; admins can read/write everything.
        listRule: adminReadRule,
        viewRule: adminReadRule,
        createRule: adminWriteRule,
        updateRule: adminWriteRule,
        deleteRule: adminWriteRule,
        fields: [
          { name: "title", type: "text", required: true, max: 200 },
          { name: "excerpt", type: "text", max: 1000 },
          {
            name: "content_type",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["blog", "vlog", "podcast"],
          },
          { name: "author_name", type: "text", max: 120 },
          { name: "author_credentials", type: "text", max: 120 },
          // e.g. "8 min read" for blogs; left blank for vlog/podcast.
          { name: "read_time", type: "text", max: 40 },
          // YouTube URL for vlogs (embed) and podcasts (link only).
          { name: "youtube_url", type: "url" },
          // Optional external link for blog articles.
          { name: "external_url", type: "url" },
          {
            name: "featured_image",
            type: "file",
            maxSelect: 1,
            maxSize: 10485760, // 10 MB
            mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          },
          // Mark to surface as the Editor's Pick on the Content Library page.
          { name: "featured", type: "bool" },
          {
            name: "status",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["draft", "published"],
          },
          { name: "published_at", type: "date" },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
        indexes: [
          "CREATE INDEX idx_library_content_status ON library_content (status)",
          "CREATE INDEX idx_library_content_type ON library_content (content_type)",
        ],
      });
      app.save(collection);
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("library_content");
      app.delete(collection);
    } catch (e) {
      if (!e.message.includes("no rows in result set")) throw e;
    }
  },
);
