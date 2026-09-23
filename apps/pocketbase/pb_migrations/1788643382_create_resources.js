/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let collection;
    try {
      collection = app.findCollectionByNameOrId("resources");
    } catch (_) {
      collection = new Collection({
        type: "base",
        name: "resources",
        // Free resources are public; member-only resources require any signed-in user.
        listRule: "members_only = false || @request.auth.id != ''",
        viewRule: "members_only = false || @request.auth.id != ''",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: "title", type: "text", required: true, max: 200 },
          { name: "summary", type: "text", max: 500 },
          {
            name: "category",
            type: "select",
            maxSelect: 1,
            values: [
              "foundations",
              "nutrition",
              "movement",
              "sleep",
              "metabolic",
              "biomarkers",
              "mindset",
            ],
          },
          {
            name: "format",
            type: "select",
            maxSelect: 1,
            values: ["guide", "protocol", "checklist", "video", "podcast"],
          },
          { name: "url", type: "url" },
          { name: "members_only", type: "bool" },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
        indexes: ["CREATE INDEX idx_resources_members_only ON resources (members_only)"],
      });
      app.save(collection);
    }

    const seeds = [
      {
        title: "The Upstream Primer: Lifestyle Medicine 101",
        summary:
          "What lifestyle medicine actually is, what the evidence says, and why it sits at the center of the Met-X method.",
        category: "foundations",
        format: "guide",
        url: "https://lifestylemedicine.org/",
        members_only: false,
      },
      {
        title: "WHO Physical Activity Guidelines, Decoded",
        summary:
          "The global minimums for movement that protect against cancer, diabetes, and cardiovascular disease — translated into plain English.",
        category: "movement",
        format: "guide",
        url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
        members_only: false,
      },
      {
        title: "Understanding Metabolic Health",
        summary:
          "Glucose, insulin, triglycerides, and why only a minority of adults are metabolically healthy. Start here before your first panel.",
        category: "metabolic",
        format: "video",
        url: "https://www.levelshealth.com/blog",
        members_only: false,
      },
      {
        title: "Sleep: The Master Recovery Lever",
        summary:
          "The neuroscience of sleep and the protocols that actually move it — the same foundation we build before any training block.",
        category: "sleep",
        format: "podcast",
        url: "https://www.hubermanlab.com/podcast",
        members_only: false,
      },
      {
        title: "Met-X Biomarker Playbook",
        summary:
          "The 40+ markers we track quarterly, what each one means, and the thresholds we intervene on — our internal reference, annotated for members.",
        category: "biomarkers",
        format: "protocol",
        url: "https://peterattiamd.com/blog/",
        members_only: true,
      },
      {
        title: "Zone 2 Training Blueprint",
        summary:
          "The exact aerobic base protocol we prescribe in the first 12 weeks: frequency, duration, heart-rate targets, and progression rules.",
        category: "movement",
        format: "protocol",
        url: "https://peterattiamd.com/podcast/",
        members_only: true,
      },
      {
        title: "Fasting & Nutrition Periodization, Member Edition",
        summary:
          "How we sequence nutrition interventions around training blocks and lab cycles — including when fasting is appropriate and when it is not.",
        category: "nutrition",
        format: "protocol",
        url: "https://www.foundmyfitness.com/",
        members_only: true,
      },
      {
        title: "Quarterly Review Checklist",
        summary:
          "The one-page checklist we walk through with every member each quarter: labs, body composition, strength benchmarks, and goals.",
        category: "biomarkers",
        format: "checklist",
        url: "https://www.bluezones.com/",
        members_only: true,
      },
    ];

    for (const seed of seeds) {
      const existing = app.findRecordsByFilter(
        "resources",
        "title = {:title}",
        "-created",
        1,
        0,
        { title: seed.title },
      );
      if (existing.length > 0) {
        continue;
      }

      const record = new Record(collection);
      record.set("title", seed.title);
      record.set("summary", seed.summary);
      record.set("category", seed.category);
      record.set("format", seed.format);
      record.set("url", seed.url);
      record.set("members_only", seed.members_only);
      app.save(record);
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("resources");
      app.delete(collection);
    } catch (e) {
      if (e.message.includes("no rows in result set")) {
        console.log("Collection not found, skipping revert");
        return;
      }
      throw e;
    }
  },
);
