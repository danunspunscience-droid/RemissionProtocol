/// <reference path="../pb_data/types.d.ts" />

// Adds `is_reference` and `key_insight` fields to library_content, then seeds
// four clearly-labeled REFERENCE entries from world-class nutrition / metabolic
// health scientists. These are external experts Met-X aligns with — NOT original
// Met-X content — and are surfaced in a dedicated Reference section on the
// Content Library page. Temporary placeholder content for launch.

const SEEDS = [
  {
    title: "Diet, Lifestyle, and Chronic Disease Prevention",
    excerpt:
      "Walter C. Willett, MD, DrPH, is Professor of Epidemiology and Nutrition at the Harvard T.H. Chan School of Public Health. Over five decades he has published more than 2,000 studies on how diet and lifestyle shape the risk of heart disease, cancer, and diabetes, leading the Nurses' Health Study and Health Professionals Follow-up Study. His work helped build the evidence base for plant-forward dietary patterns and long-term disease prevention.",
    content_type: "blog",
    author_name: "Walter C. Willett",
    author_credentials: "MD, DrPH — Harvard T.H. Chan School of Public Health",
    read_time: "Research profile",
    external_url: "https://hsph.harvard.edu/profile/walter-c-willett/",
    key_insight:
      "Key insight — Build the diet around whole plant foods (whole grains, vegetables, fruits, nuts, and legumes) and minimize red and processed meat; this pattern is consistently linked to lower risk of chronic disease and greater longevity.",
  },
  {
    title: "Dietary Patterns and Cardiometabolic Disease",
    excerpt:
      "Frank B. Hu, MD, PhD, is Chair of the Department of Nutrition at the Harvard T.H. Chan School of Public Health. His research focuses on the epidemiology and prevention of cardiometabolic diseases through diet and lifestyle, including gene-environment interactions and precision nutrition. He has led detailed analyses of dietary patterns, sugar-sweetened beverages, and the Mediterranean diet in relation to type 2 diabetes and cardiovascular risk.",
    content_type: "blog",
    author_name: "Frank B. Hu",
    author_credentials: "MD, PhD — Harvard T.H. Chan School of Public Health",
    read_time: "Research profile",
    external_url: "https://hsph.harvard.edu/profile/frank-b-hu/",
    key_insight:
      "Key insight — Overall dietary patterns matter more than single nutrients; Mediterranean and other plant-rich patterns are strongly associated with lower risk of type 2 diabetes and cardiovascular disease.",
  },
  {
    title: "Personalized Nutrition and the Gut Microbiome",
    excerpt:
      "Tim D. Spector, MD, is Professor of Genetic Epidemiology at King's College London and scientific founder of ZOE. He leads research on the gut microbiome, personalized nutrition, and metabolic health, including the PREDICT studies of individual metabolic responses to food. His work demonstrates that responses to identical meals vary widely between people and are shaped by the microbiome.",
    content_type: "blog",
    author_name: "Tim D. Spector",
    author_credentials: "MD — King's College London",
    read_time: "Research profile",
    external_url: "https://www.kcl.ac.uk/people/professor-tim-spector",
    key_insight:
      "Key insight — Personalized nutrition, informed by an individual's gut microbiome and post-meal metabolic responses, can improve cardiometabolic health more effectively than one-size-fits-all diet advice.",
  },
  {
    title: "Healthy Low-Fat vs Low-Carbohydrate Diets (DIETFITS)",
    excerpt:
      "Christopher D. Gardner, PhD, is a Professor of Medicine at Stanford University and Director of Nutrition Studies at the Stanford Prevention Research Center. His research tests dietary interventions in free-living adults, including the DIETFITS randomized trial comparing healthy low-fat and healthy low-carbohydrate diets. He studies 'food as medicine' and how diet quality shapes metabolic recovery.",
    content_type: "blog",
    author_name: "Christopher D. Gardner",
    author_credentials: "PhD — Stanford University",
    read_time: "Peer-reviewed study",
    external_url: "https://jamanetwork.com/journals/jama/fullarticle/2673150",
    key_insight:
      "Key insight — Diet quality mattered more than macronutrient ratio: in the DIETFITS trial, healthy low-fat and healthy low-carb diets produced similar 12-month weight loss, underscoring whole, minimally processed foods as the common denominator.",
  },
];

migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId("library_content");

    // Add the reference + insight fields if they are not already present.
    if (!collection.fields.getByName("is_reference")) {
      collection.fields.add(new BoolField({ name: "is_reference" }));
    }
    if (!collection.fields.getByName("key_insight")) {
      collection.fields.add(new TextField({ name: "key_insight", max: 600 }));
    }
    app.save(collection);

    const publishedAt = new Date("2026-09-06T00:00:00Z").toISOString();

    for (const data of SEEDS) {
      // Idempotent: skip if a reference record with this external_url exists.
      const existing = app.findRecordsByFilter(
        "library_content",
        `external_url = "${data.external_url}"`,
      );
      if (existing && existing.length > 0) continue;

      const r = new Record(collection);
      r.set("title", data.title);
      r.set("excerpt", data.excerpt);
      r.set("content_type", data.content_type);
      r.set("author_name", data.author_name);
      r.set("author_credentials", data.author_credentials);
      r.set("read_time", data.read_time);
      r.set("external_url", data.external_url);
      r.set("key_insight", data.key_insight);
      r.set("is_reference", true);
      r.set("featured", true);
      r.set("status", "published");
      r.set("published_at", publishedAt);
      app.save(r);
    }
  },
  (app) => {
    // Remove only the seeded reference rows.
    for (const data of SEEDS) {
      try {
        const rows = app.findRecordsByFilter(
          "library_content",
          `external_url = "${data.external_url}"`,
        );
        if (rows) {
          for (const r of rows) app.delete(r);
        }
      } catch (e) {
        if (!e.message.includes("no rows in result set")) throw e;
      }
    }

    // Remove the added fields.
    try {
      const collection = app.findCollectionByNameOrId("library_content");
      if (collection.fields.getByName("is_reference")) {
        collection.fields.removeByName("is_reference");
      }
      if (collection.fields.getByName("key_insight")) {
        collection.fields.removeByName("key_insight");
      }
      app.save(collection);
    } catch (e) {
      if (!e.message.includes("no rows in result set")) throw e;
    }
  },
);
