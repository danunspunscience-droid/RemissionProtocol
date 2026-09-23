/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    // Resolve the admins auth collection so we can scope write rules to it.
    let admins;
    try {
      admins = app.findCollectionByNameOrId("admins");
    } catch (_) {
      // admins should already exist from an earlier migration; if not, skip
      // rule-scoping by leaving admins undefined (rules will still be safe).
      admins = null;
    }

    const adminWriteRule = admins
      ? `@request.auth.collectionId = "${admins.id}"`
      : null;
    const publicReadRule = admins
      ? `status = 'published' || @request.auth.collectionId = "${admins.id}"`
      : `status = 'published'`;

    let collection;
    try {
      collection = app.findCollectionByNameOrId("founders");
    } catch (_) {
      collection = new Collection({
        type: "base",
        name: "founders",
        listRule: publicReadRule,
        viewRule: publicReadRule,
        createRule: adminWriteRule,
        updateRule: adminWriteRule,
        deleteRule: adminWriteRule,
        fields: [
          // Stable slug identifying which About-page slot this fills.
          { name: "slug", type: "text", required: true, max: 60 },
          { name: "name", type: "text", required: true, max: 120 },
          { name: "credentials", type: "text", max: 120 },
          { name: "title", type: "text", max: 120 },
          { name: "bio", type: "text", max: 1200 },
          { name: "personal_mission", type: "text", max: 600 },
          {
            name: "photo",
            type: "file",
            maxSelect: 1,
            maxSize: 10485760,
            mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          },
          { name: "photo_position", type: "text", max: 50 },
          { name: "sort_order", type: "number" },
          {
            name: "status",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["draft", "published"],
          },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
        indexes: [
          "CREATE UNIQUE INDEX idx_founders_slug ON founders (slug)",
          "CREATE INDEX idx_founders_status ON founders (status)",
        ],
      });
      app.save(collection);
    }

    // Seed the two founders (no photo — admin uploads via CMS).
    const seed = (slug, data) => {
      let existing = [];
      try {
        existing = app.findRecordsByFilter("founders", `slug = "${slug}"`, "", 1);
      } catch (_) {
        existing = [];
      }
      if (existing && existing.length > 0) return; // already exists

      const rec = new Record(collection);
      rec.set("slug", slug);
      rec.set("name", data.name);
      rec.set("credentials", data.credentials);
      rec.set("title", data.title);
      rec.set("bio", data.bio);
      rec.set("personal_mission", data.personal_mission);
      rec.set("photo_position", "center top");
      rec.set("sort_order", data.sort_order);
      rec.set("status", "published");
      app.save(rec);
    };

    seed("daniel_lee", {
      name: "Daniel Lee, MD, ABOM",
      credentials: "MD, ABOM",
      title: "Co-Founder · Physician-Researcher",
      sort_order: 1,
      bio: "Daniel Lee is a board-certified physician with a background in nuclear medicine and radiology, and board certification in obesity and lifestyle medicine. His work centers on post-treatment optimization — translating cutting-edge biomedical research in immuno-oncology, epigenetic reprogramming, and metabolic resilience into protocols survivors can actually follow. He pairs deep imaging and physiology literacy with a researcher's discipline, ensuring every Met-X recommendation is grounded in evidence, not guesswork.",
      personal_mission:
        "To close the gap between 'no evidence of disease' and genuine recovery — giving survivors the same scientific rigor after treatment that carried them through it.",
    });

    seed("steve_hudson", {
      name: "Steve Hudson",
      credentials: "Elite Performance Coach",
      title: "Co-Founder · Elite Performance Coach",
      sort_order: 2,
      bio: "Steve Hudson is an elite strength and conditioning coach and a cancer survivor himself. His lived survivorship experience informs a condition-specific approach to fitness programming — rebuilding the strength, capacity, and confidence that serious illness and treatment can take. Steve has trained high-performing executives, athletes, and founders for decades, and now applies that same elite standard to recovery: training scaled precisely to what each member's labs, body, and recovery can absorb.",
      personal_mission:
        "To prove that survivorship is not a smaller life organized around a diagnosis — it is the starting line for rebuilding something stronger.",
    });
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("founders");
      app.delete(collection);
    } catch (e) {
      if (e.message && e.message.includes("no rows in result set")) {
        return;
      }
      throw e;
    }
  },
);
