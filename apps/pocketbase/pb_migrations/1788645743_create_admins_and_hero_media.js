/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // ---- 1. Admins auth collection (closed sign-up) ----
    let admins;
    try {
      admins = app.findCollectionByNameOrId("admins");
    } catch (_) {
      admins = new Collection({
        type: "auth",
        name: "admins",
        listRule: "id = @request.auth.id",
        viewRule: "id = @request.auth.id",
        createRule: null, // closed — no self-registration
        updateRule: "id = @request.auth.id",
        deleteRule: null,
        fields: [{ name: "name", type: "text", max: 100 }],
        passwordAuth: { enabled: true },
        authAlert: { enabled: false },
      });
      app.save(admins);
    }

    // Seed a single admin account (no UI to create one).
    try {
      app.findAuthRecordByEmail("admins", "admin@metxbootcamp.com");
    } catch (_) {
      const admin = new Record(admins);
      admin.setEmail("admin@metxbootcamp.com");
      admin.setPassword("MetX#Admin@2026Secure!");
      admin.set("name", "Met-X Admin");
      admin.set("verified", true);
      app.save(admin);
    }

    // ---- 2. hero_media collection ----
    // Public can read only published items; admins can read/write everything.
    const adminCreateRule = `@request.auth.collectionId = "${admins.id}"`;
    const adminReadWriteRule = `status = 'published' || @request.auth.collectionId = "${admins.id}"`;

    let hero;
    try {
      hero = app.findCollectionByNameOrId("hero_media");
    } catch (_) {
      hero = new Collection({
        type: "base",
        name: "hero_media",
        listRule: adminReadWriteRule,
        viewRule: adminReadWriteRule,
        createRule: adminCreateRule,
        updateRule: adminCreateRule,
        deleteRule: adminCreateRule,
        fields: [
          {
            name: "media_type",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["image", "video"],
          },
          {
            name: "file",
            type: "file",
            required: true,
            maxSelect: 1,
            maxSize: 104857600, // 100 MB to allow video
            mimeTypes: [
              "image/jpeg",
              "image/png",
              "image/webp",
              "image/gif",
              "video/mp4",
              "video/webm",
            ],
          },
          { name: "headline", type: "text", max: 200 },
          { name: "subheading", type: "text", max: 400 },
          { name: "cta_label", type: "text", max: 60 },
          { name: "cta_link", type: "text", max: 200 },
          { name: "object_position", type: "text", max: 50 },
          { name: "video_autoplay", type: "bool" },
          { name: "video_muted", type: "bool" },
          { name: "video_loop", type: "bool" },
          { name: "video_controls", type: "bool" },
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
          "CREATE INDEX idx_hero_media_status ON hero_media (status)",
        ],
      });
      app.save(hero);
    }
  },
  (app) => {
    try {
      const hero = app.findCollectionByNameOrId("hero_media");
      app.delete(hero);
    } catch (e) {
      if (!e.message.includes("no rows in result set")) throw e;
    }
    try {
      const admin = app.findAuthRecordByEmail("admins", "admin@metxbootcamp.com");
      app.delete(admin);
    } catch (e) {
      if (!e.message.includes("no rows in result set")) throw e;
    }
    try {
      const admins = app.findCollectionByNameOrId("admins");
      app.delete(admins);
    } catch (e) {
      if (!e.message.includes("no rows in result set")) throw e;
    }
  },
);
