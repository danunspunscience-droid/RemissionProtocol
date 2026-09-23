/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    let collection;
    try {
      collection = app.findCollectionByNameOrId("contact_requests");
    } catch (_) {
      collection = new Collection({
        type: "base",
        name: "contact_requests",
        // Public can submit; only server-side superuser can read/manage.
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
            name: "topic",
            type: "select",
            maxSelect: 1,
            values: ["consultation", "membership", "speaking", "press", "other"],
          },
          { name: "message", type: "text", max: 2000 },
          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
      });
      app.save(collection);
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("contact_requests");
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
