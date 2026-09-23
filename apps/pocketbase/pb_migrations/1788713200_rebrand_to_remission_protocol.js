/// <reference path="../pb_data/types.d.ts" />

// Rebrand seeded data from "Met-X" / "Met-X Bootcamp" to "Remission Protocol".
// Updates already-seeded resource titles/summaries, the Daniel Lee founder bio,
// and the admin display name. UI copy was updated separately in the React app.

migrate(
  (app) => {
    // 1. Resources — title + summary that referenced the old brand.
    try {
      const playbook = app.findRecordsByFilter(
        "resources",
        "title = {:title}",
        "",
        1,
        0,
        { title: "Met-X Biomarker Playbook" },
      );
      if (playbook && playbook.length > 0) {
        playbook[0].set("title", "Remission Protocol Biomarker Playbook");
        app.save(playbook[0]);
      }
    } catch (e) {
      if (!e.message.includes("no rows in result set")) throw e;
    }

    try {
      const primer = app.findRecordsByFilter(
        "resources",
        "title = {:title}",
        "",
        1,
        0,
        { title: "The Upstream Primer: Lifestyle Medicine 101" },
      );
      if (primer && primer.length > 0) {
        const summary = primer[0].get("summary") || "";
        primer[0].set(
          "summary",
          summary.replace("the Met-X method", "the Remission Protocol method"),
        );
        app.save(primer[0]);
      }
    } catch (e) {
      if (!e.message.includes("no rows in result set")) throw e;
    }

    // 2. Founders — Daniel Lee bio reference to the old brand.
    try {
      const daniel = app.findRecordsByFilter(
        "founders",
        "slug = {:slug}",
        "",
        1,
        0,
        { slug: "daniel_lee" },
      );
      if (daniel && daniel.length > 0) {
        const bio = daniel[0].get("bio") || "";
        daniel[0].set(
          "bio",
          bio.replace("every Met-X recommendation", "every Remission Protocol recommendation"),
        );
        app.save(daniel[0]);
      }
    } catch (e) {
      if (!e.message.includes("no rows in result set")) throw e;
    }

    // 3. Admin display name.
    try {
      const admin = app.findAuthRecordByEmail("admins", "admin@metxbootcamp.com");
      if (admin && admin.get("name") === "Met-X Admin") {
        admin.set("name", "Remission Protocol Admin");
        app.save(admin);
      }
    } catch (e) {
      if (!e.message.includes("no rows in result set")) throw e;
    }
  },
  (app) => {
    // Revert seeded data back to the old brand strings.
    try {
      const playbook = app.findRecordsByFilter(
        "resources",
        "title = {:title}",
        "",
        1,
        0,
        { title: "Remission Protocol Biomarker Playbook" },
      );
      if (playbook && playbook.length > 0) {
        playbook[0].set("title", "Met-X Biomarker Playbook");
        app.save(playbook[0]);
      }
    } catch (e) {
      if (!e.message.includes("no rows in result set")) throw e;
    }

    try {
      const primer = app.findRecordsByFilter(
        "resources",
        "title = {:title}",
        "",
        1,
        0,
        { title: "The Upstream Primer: Lifestyle Medicine 101" },
      );
      if (primer && primer.length > 0) {
        const summary = primer[0].get("summary") || "";
        primer[0].set(
          "summary",
          summary.replace("the Remission Protocol method", "the Met-X method"),
        );
        app.save(primer[0]);
      }
    } catch (e) {
      if (!e.message.includes("no rows in result set")) throw e;
    }

    try {
      const daniel = app.findRecordsByFilter(
        "founders",
        "slug = {:slug}",
        "",
        1,
        0,
        { slug: "daniel_lee" },
      );
      if (daniel && daniel.length > 0) {
        const bio = daniel[0].get("bio") || "";
        daniel[0].set(
          "bio",
          bio.replace("every Remission Protocol recommendation", "every Met-X recommendation"),
        );
        app.save(daniel[0]);
      }
    } catch (e) {
      if (!e.message.includes("no rows in result set")) throw e;
    }

    try {
      const admin = app.findAuthRecordByEmail("admins", "admin@metxbootcamp.com");
      if (admin && admin.get("name") === "Remission Protocol Admin") {
        admin.set("name", "Met-X Admin");
        app.save(admin);
      }
    } catch (e) {
      if (!e.message.includes("no rows in result set")) throw e;
    }
  },
);
