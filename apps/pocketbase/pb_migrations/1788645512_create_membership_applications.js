/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let collection;
    try {
      collection = app.findCollectionByNameOrId("membership_applications");
    } catch (_) {
      collection = new Collection({
        type: "base",
        name: "membership_applications",
        // Public may submit an application; only server-side superuser can read/manage.
        listRule: null,
        viewRule: null,
        createRule: "",
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: "name", type: "text", required: true, max: 200 },
          { name: "email", type: "email", required: true },
          { name: "phone", type: "text", max: 40 },
          {
            name: "age_range",
            type: "select",
            maxSelect: 1,
            values: ["under_40", "40_49", "50_59", "60_69", "70_plus"],
          },
          { name: "location", type: "text", max: 200 },
          {
            name: "primary_goal",
            type: "select",
            maxSelect: 1,
            values: [
              "cancer_prevention",
              "cancer_recovery",
              "metabolic_reversal",
              "longevity",
              "executive_health",
              "other",
            ],
          },
          { name: "current_health", type: "text", max: 1000 },
          { name: "recent_diagnosis", type: "text", max: 500 },
          {
            name: "timeline",
            type: "select",
            maxSelect: 1,
            values: ["immediate", "this_quarter", "six_months", "exploring"],
          },
          {
            name: "referral_source",
            type: "select",
            maxSelect: 1,
            values: [
              "physician",
              "member_referral",
              "friend_family",
              "podcast_media",
              "search",
              "social",
              "other",
            ],
          },
          { name: "why_metx", type: "text", max: 1500 },
          { name: "expectations", type: "text", max: 1500 },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
      });
      app.save(collection);
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("membership_applications");
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
