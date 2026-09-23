PRAGMA foreign_keys=OFF;
CREATE TABLE `_migrations` (file VARCHAR(255) PRIMARY KEY NOT NULL, applied INTEGER NOT NULL);
CREATE TABLE `_params` (
			`id`      TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL,
			`value`   JSON DEFAULT NULL,
			`created` TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
			`updated` TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL
		);
CREATE TABLE `_collections` (
				`id`         TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL,
				`system`     BOOLEAN DEFAULT FALSE NOT NULL,
				`type`       TEXT DEFAULT "base" NOT NULL,
				`name`       TEXT UNIQUE NOT NULL,
				`fields`     JSON DEFAULT "[]" NOT NULL,
				`indexes`    JSON DEFAULT "[]" NOT NULL,
				`listRule`   TEXT DEFAULT NULL,
				`viewRule`   TEXT DEFAULT NULL,
				`createRule` TEXT DEFAULT NULL,
				`updateRule` TEXT DEFAULT NULL,
				`deleteRule` TEXT DEFAULT NULL,
				`options`    JSON DEFAULT "{}" NOT NULL,
				`created`    TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL,
				`updated`    TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL
			);
CREATE TABLE `_mfas` (`collectionRef` TEXT DEFAULT '' NOT NULL, `created` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `method` TEXT DEFAULT '' NOT NULL, `recordRef` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
ANALYZE sqlite_schema;
INSERT INTO sqlite_stat1 VALUES('_migrations','sqlite_autoindex__migrations_1','1 1');
INSERT INTO sqlite_stat1 VALUES('_superusers','idx_email_pbc_3142635823','1 1');
INSERT INTO sqlite_stat1 VALUES('_superusers','idx_tokenKey_pbc_3142635823','1 1');
INSERT INTO sqlite_stat1 VALUES('_superusers','sqlite_autoindex__superusers_1','1 1');
INSERT INTO sqlite_stat1 VALUES('_params','sqlite_autoindex__params_1','1 1');
INSERT INTO sqlite_stat1 VALUES('resources','idx_resources_members_only','8 4');
INSERT INTO sqlite_stat1 VALUES('resources','sqlite_autoindex_resources_1','8 1');
INSERT INTO sqlite_stat1 VALUES('admins','idx_email_pbc_3841632486','1 1');
INSERT INTO sqlite_stat1 VALUES('admins','idx_tokenKey_pbc_3841632486','1 1');
INSERT INTO sqlite_stat1 VALUES('admins','sqlite_autoindex_admins_1','1 1');
INSERT INTO sqlite_stat1 VALUES('_collections','idx__collections_type','11 6');
INSERT INTO sqlite_stat1 VALUES('_collections','sqlite_autoindex__collections_2','11 1');
INSERT INTO sqlite_stat1 VALUES('_collections','sqlite_autoindex__collections_1','11 1');
INSERT INTO sqlite_stat1 VALUES('library_content','idx_library_content_type','4 4');
INSERT INTO sqlite_stat1 VALUES('library_content','idx_library_content_status','4 4');
INSERT INTO sqlite_stat1 VALUES('library_content','sqlite_autoindex_library_content_1','4 1');
ANALYZE sqlite_schema;
CREATE TABLE `_otps` (`collectionRef` TEXT DEFAULT '' NOT NULL, `created` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `password` TEXT DEFAULT '' NOT NULL, `recordRef` TEXT DEFAULT '' NOT NULL, `sentTo` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
CREATE TABLE `_externalAuths` (`collectionRef` TEXT DEFAULT '' NOT NULL, `created` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `provider` TEXT DEFAULT '' NOT NULL, `providerId` TEXT DEFAULT '' NOT NULL, `recordRef` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
CREATE TABLE `_authOrigins` (`collectionRef` TEXT DEFAULT '' NOT NULL, `created` TEXT DEFAULT '' NOT NULL, `fingerprint` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `recordRef` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
CREATE TABLE `_superusers` (`created` TEXT DEFAULT '' NOT NULL, `email` TEXT DEFAULT '' NOT NULL, `emailVisibility` BOOLEAN DEFAULT FALSE NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `password` TEXT DEFAULT '' NOT NULL, `tokenKey` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL, `verified` BOOLEAN DEFAULT FALSE NOT NULL);
CREATE TABLE `users` (`avatar` TEXT DEFAULT '' NOT NULL, `created` TEXT DEFAULT '' NOT NULL, `email` TEXT DEFAULT '' NOT NULL, `emailVisibility` BOOLEAN DEFAULT FALSE NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `name` TEXT DEFAULT '' NOT NULL, `password` TEXT DEFAULT '' NOT NULL, `tokenKey` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL, `verified` BOOLEAN DEFAULT FALSE NOT NULL);
CREATE TABLE `contact_requests` (`created` TEXT DEFAULT '' NOT NULL, `email` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `message` TEXT DEFAULT '' NOT NULL, `name` TEXT DEFAULT '' NOT NULL, `phone` TEXT DEFAULT '' NOT NULL, `topic` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
CREATE TABLE `resources` (`category` TEXT DEFAULT '' NOT NULL, `created` TEXT DEFAULT '' NOT NULL, `format` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `members_only` BOOLEAN DEFAULT FALSE NOT NULL, `summary` TEXT DEFAULT '' NOT NULL, `title` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL, `url` TEXT DEFAULT '' NOT NULL);
INSERT INTO resources VALUES('foundations','2026-09-05 21:36:05.520Z','guide','7hzo2o4fy9vide5',0,'What lifestyle medicine actually is, what the evidence says, and why it sits at the center of the Remission Protocol method.','The Upstream Primer: Lifestyle Medicine 101','2026-09-06 16:50:14.230Z','https://lifestylemedicine.org/');
INSERT INTO resources VALUES('movement','2026-09-05 21:36:05.520Z','guide','no3b02iuij1gizh',0,'The global minimums for movement that protect against cancer, diabetes, and cardiovascular disease — translated into plain English.','WHO Physical Activity Guidelines, Decoded','2026-09-05 21:36:05.520Z','https://www.who.int/news-room/fact-sheets/detail/physical-activity');
INSERT INTO resources VALUES('metabolic','2026-09-05 21:36:05.520Z','video','24r0upxb0sek74o',0,'Glucose, insulin, triglycerides, and why only a minority of adults are metabolically healthy. Start here before your first panel.','Understanding Metabolic Health','2026-09-05 21:36:05.520Z','https://www.levelshealth.com/blog');
INSERT INTO resources VALUES('sleep','2026-09-05 21:36:05.520Z','podcast','u32op7x6j7fl2c7',0,'The neuroscience of sleep and the protocols that actually move it — the same foundation we build before any training block.','Sleep: The Master Recovery Lever','2026-09-05 21:36:05.520Z','https://www.hubermanlab.com/podcast');
INSERT INTO resources VALUES('biomarkers','2026-09-05 21:36:05.521Z','protocol','tjqa6yyx4ays41d',1,'The 40+ markers we track quarterly, what each one means, and the thresholds we intervene on — our internal reference, annotated for members.','Remission Protocol Biomarker Playbook','2026-09-06 16:50:14.229Z','https://peterattiamd.com/blog/');
INSERT INTO resources VALUES('movement','2026-09-05 21:36:05.521Z','protocol','qme8t7q9bhogd8r',1,'The exact aerobic base protocol we prescribe in the first 12 weeks: frequency, duration, heart-rate targets, and progression rules.','Zone 2 Training Blueprint','2026-09-05 21:36:05.521Z','https://peterattiamd.com/podcast/');
INSERT INTO resources VALUES('nutrition','2026-09-05 21:36:05.533Z','protocol','glig3fi1xqlm8d3',1,'How we sequence nutrition interventions around training blocks and lab cycles — including when fasting is appropriate and when it is not.','Fasting & Nutrition Periodization, Member Edition','2026-09-05 21:36:05.533Z','https://www.foundmyfitness.com/');
INSERT INTO resources VALUES('biomarkers','2026-09-05 21:36:05.533Z','checklist','m7lpl92was3ktib',1,'The one-page checklist we walk through with every member each quarter: labs, body composition, strength benchmarks, and goals.','Quarterly Review Checklist','2026-09-05 21:36:05.533Z','https://www.bluezones.com/');
CREATE TABLE `membership_applications` (`age_range` TEXT DEFAULT '' NOT NULL, `created` TEXT DEFAULT '' NOT NULL, `current_health` TEXT DEFAULT '' NOT NULL, `email` TEXT DEFAULT '' NOT NULL, `expectations` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `location` TEXT DEFAULT '' NOT NULL, `name` TEXT DEFAULT '' NOT NULL, `phone` TEXT DEFAULT '' NOT NULL, `primary_goal` TEXT DEFAULT '' NOT NULL, `recent_diagnosis` TEXT DEFAULT '' NOT NULL, `referral_source` TEXT DEFAULT '' NOT NULL, `timeline` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL, `why_metx` TEXT DEFAULT '' NOT NULL);
CREATE TABLE `admins` (`email` TEXT DEFAULT '' NOT NULL, `emailVisibility` BOOLEAN DEFAULT FALSE NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `name` TEXT DEFAULT '' NOT NULL, `password` TEXT DEFAULT '' NOT NULL, `tokenKey` TEXT DEFAULT '' NOT NULL, `verified` BOOLEAN DEFAULT FALSE NOT NULL);
INSERT INTO admins VALUES('admin@metxbootcamp.com',0,'hcch53cu6cpo1gr','Remission Protocol Admin','$2a$10$2bhckT6Gg9GlznShrIY5HOwFDfzSC/8/jFb0agzk2HlfLFn7nsR.i','6kODhiEvJsT92PSFQuG7VwM5HU9EZBTVLjIsxCRhSVGlAF40h8',1);
CREATE TABLE `hero_media` (`created` TEXT DEFAULT '' NOT NULL, `cta_label` TEXT DEFAULT '' NOT NULL, `cta_link` TEXT DEFAULT '' NOT NULL, `file` TEXT DEFAULT '' NOT NULL, `headline` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `media_type` TEXT DEFAULT '' NOT NULL, `object_position` TEXT DEFAULT '' NOT NULL, `published_at` TEXT DEFAULT '' NOT NULL, `status` TEXT DEFAULT '' NOT NULL, `subheading` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL, `video_autoplay` BOOLEAN DEFAULT FALSE NOT NULL, `video_controls` BOOLEAN DEFAULT FALSE NOT NULL, `video_loop` BOOLEAN DEFAULT FALSE NOT NULL, `video_muted` BOOLEAN DEFAULT FALSE NOT NULL);
CREATE TABLE `library_content` (`author_credentials` TEXT DEFAULT '' NOT NULL, `author_name` TEXT DEFAULT '' NOT NULL, `content_type` TEXT DEFAULT '' NOT NULL, `created` TEXT DEFAULT '' NOT NULL, `excerpt` TEXT DEFAULT '' NOT NULL, `external_url` TEXT DEFAULT '' NOT NULL, `featured` BOOLEAN DEFAULT FALSE NOT NULL, `featured_image` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `published_at` TEXT DEFAULT '' NOT NULL, `read_time` TEXT DEFAULT '' NOT NULL, `status` TEXT DEFAULT '' NOT NULL, `title` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL, `youtube_url` TEXT DEFAULT '' NOT NULL, "is_reference" BOOLEAN DEFAULT FALSE NOT NULL, "key_insight" TEXT DEFAULT '' NOT NULL);
INSERT INTO library_content VALUES('MD, DrPH — Harvard T.H. Chan School of Public Health','Walter C. Willett','blog','2026-09-06 10:03:09.130Z','Walter C. Willett, MD, DrPH, is Professor of Epidemiology and Nutrition at the Harvard T.H. Chan School of Public Health. Over five decades he has published more than 2,000 studies on how diet and lifestyle shape the risk of heart disease, cancer, and diabetes, leading the Nurses'' Health Study and Health Professionals Follow-up Study. His work helped build the evidence base for plant-forward dietary patterns and long-term disease prevention.','https://hsph.harvard.edu/profile/walter-c-willett/',1,'','lk22jhuxi78djb2','2026-09-06 00:00:00.000Z','Research profile','published','Diet, Lifestyle, and Chronic Disease Prevention','2026-09-06 10:03:09.130Z','',1,'Key insight — Build the diet around whole plant foods (whole grains, vegetables, fruits, nuts, and legumes) and minimize red and processed meat; this pattern is consistently linked to lower risk of chronic disease and greater longevity.');
INSERT INTO library_content VALUES('MD, PhD — Harvard T.H. Chan School of Public Health','Frank B. Hu','blog','2026-09-06 10:03:09.131Z','Frank B. Hu, MD, PhD, is Chair of the Department of Nutrition at the Harvard T.H. Chan School of Public Health. His research focuses on the epidemiology and prevention of cardiometabolic diseases through diet and lifestyle, including gene-environment interactions and precision nutrition. He has led detailed analyses of dietary patterns, sugar-sweetened beverages, and the Mediterranean diet in relation to type 2 diabetes and cardiovascular risk.','https://hsph.harvard.edu/profile/frank-b-hu/',1,'','lmq6w3508rrqm5r','2026-09-06 00:00:00.000Z','Research profile','published','Dietary Patterns and Cardiometabolic Disease','2026-09-06 10:03:09.131Z','',1,'Key insight — Overall dietary patterns matter more than single nutrients; Mediterranean and other plant-rich patterns are strongly associated with lower risk of type 2 diabetes and cardiovascular disease.');
INSERT INTO library_content VALUES('MD — King''s College London','Tim D. Spector','blog','2026-09-06 10:03:09.131Z','Tim D. Spector, MD, is Professor of Genetic Epidemiology at King''s College London and scientific founder of ZOE. He leads research on the gut microbiome, personalized nutrition, and metabolic health, including the PREDICT studies of individual metabolic responses to food. His work demonstrates that responses to identical meals vary widely between people and are shaped by the microbiome.','https://www.kcl.ac.uk/people/professor-tim-spector',1,'','fru37bebnb8mids','2026-09-06 00:00:00.000Z','Research profile','published','Personalized Nutrition and the Gut Microbiome','2026-09-06 10:03:09.131Z','',1,'Key insight — Personalized nutrition, informed by an individual''s gut microbiome and post-meal metabolic responses, can improve cardiometabolic health more effectively than one-size-fits-all diet advice.');
INSERT INTO library_content VALUES('PhD — Stanford University','Christopher D. Gardner','blog','2026-09-06 10:03:09.131Z','Christopher D. Gardner, PhD, is a Professor of Medicine at Stanford University and Director of Nutrition Studies at the Stanford Prevention Research Center. His research tests dietary interventions in free-living adults, including the DIETFITS randomized trial comparing healthy low-fat and healthy low-carbohydrate diets. He studies ''food as medicine'' and how diet quality shapes metabolic recovery.','https://jamanetwork.com/journals/jama/fullarticle/2673150',1,'','6zgt31jm995kiti','2026-09-06 00:00:00.000Z','Peer-reviewed study','published','Healthy Low-Fat vs Low-Carbohydrate Diets (DIETFITS)','2026-09-06 10:03:09.131Z','',1,'Key insight — Diet quality mattered more than macronutrient ratio: in the DIETFITS trial, healthy low-fat and healthy low-carb diets produced similar 12-month weight loss, underscoring whole, minimally processed foods as the common denominator.');
CREATE TABLE `podcast_episodes` (`audio_file` TEXT DEFAULT '' NOT NULL, `author_credentials` TEXT DEFAULT '' NOT NULL, `author_name` TEXT DEFAULT '' NOT NULL, `created` TEXT DEFAULT '' NOT NULL, `description` TEXT DEFAULT '' NOT NULL, `duration` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `publish_date` TEXT DEFAULT '' NOT NULL, `status` TEXT DEFAULT '' NOT NULL, `title` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
CREATE TABLE `founders` (`bio` TEXT DEFAULT '' NOT NULL, `created` TEXT DEFAULT '' NOT NULL, `credentials` TEXT DEFAULT '' NOT NULL, `id` TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL, `name` TEXT DEFAULT '' NOT NULL, `personal_mission` TEXT DEFAULT '' NOT NULL, `photo` TEXT DEFAULT '' NOT NULL, `photo_position` TEXT DEFAULT '' NOT NULL, `slug` TEXT DEFAULT '' NOT NULL, `sort_order` NUMERIC DEFAULT 0 NOT NULL, `status` TEXT DEFAULT '' NOT NULL, `title` TEXT DEFAULT '' NOT NULL, `updated` TEXT DEFAULT '' NOT NULL);
INSERT INTO founders VALUES('Daniel Lee is a board-certified physician with a background in nuclear medicine and radiology, and board certification in obesity and lifestyle medicine. His work centers on post-treatment optimization — translating cutting-edge biomedical research in immuno-oncology, epigenetic reprogramming, and metabolic resilience into protocols survivors can actually follow. He pairs deep imaging and physiology literacy with a researcher''s discipline, ensuring every Remission Protocol recommendation is grounded in evidence, not guesswork.','2026-09-06 16:33:28.827Z','MD, ABOM','jo85p9fykwjlwah','Daniel Lee, MD, ABOM','To close the gap between ''no evidence of disease'' and genuine recovery — giving survivors the same scientific rigor after treatment that carried them through it.','','center top','daniel_lee',1,'published','Co-Founder · Physician-Researcher','2026-09-06 16:50:14.230Z');
INSERT INTO founders VALUES('Steve Hudson is an elite strength and conditioning coach and a cancer survivor himself. His lived survivorship experience informs a condition-specific approach to fitness programming — rebuilding the strength, capacity, and confidence that serious illness and treatment can take. Steve has trained high-performing executives, athletes, and founders for decades, and now applies that same elite standard to recovery: training scaled precisely to what each member''s labs, body, and recovery can absorb.','2026-09-06 16:33:28.827Z','Elite Performance Coach','emmi61vmjqcvznh','Steve Hudson','To prove that survivorship is not a smaller life organized around a diagnosis — it is the starting line for rebuilding something stronger.','','center top','steve_hudson',2,'published','Co-Founder · Elite Performance Coach','2026-09-06 16:33:28.827Z');
CREATE INDEX idx__collections_type on `_collections` (`type`);
CREATE INDEX `idx_mfas_collectionRef_recordRef` ON `_mfas` (
  `collectionRef`,
  `recordRef`
);
CREATE INDEX `idx_otps_collectionRef_recordRef` ON `_otps` (
  `collectionRef`,
  `recordRef`
);
CREATE UNIQUE INDEX `idx_externalAuths_record_provider` ON `_externalAuths` (
  `collectionRef`,
  `recordRef`,
  `provider`
);
CREATE UNIQUE INDEX `idx_externalAuths_collection_provider` ON `_externalAuths` (
  `collectionRef`,
  `provider`,
  `providerId`
);
CREATE UNIQUE INDEX `idx_authOrigins_unique_pairs` ON `_authOrigins` (
  `collectionRef`,
  `recordRef`,
  `fingerprint`
);
CREATE UNIQUE INDEX `idx_tokenKey_pbc_3142635823` ON `_superusers` (`tokenKey`);
CREATE UNIQUE INDEX `idx_email_pbc_3142635823` ON `_superusers` (`email`) WHERE `email` != '';
CREATE UNIQUE INDEX `idx_tokenKey__pb_users_auth_` ON `users` (`tokenKey`);
CREATE UNIQUE INDEX `idx_email__pb_users_auth_` ON `users` (`email`) WHERE `email` != '';
CREATE INDEX `idx_resources_members_only` ON `resources` (`members_only`);
CREATE UNIQUE INDEX `idx_tokenKey_pbc_3841632486` ON `admins` (`tokenKey`);
CREATE UNIQUE INDEX `idx_email_pbc_3841632486` ON `admins` (`email`) WHERE `email` != '';
CREATE INDEX `idx_hero_media_status` ON `hero_media` (`status`);
CREATE INDEX `idx_library_content_status` ON `library_content` (`status`);
CREATE INDEX `idx_library_content_type` ON `library_content` (`content_type`);
CREATE INDEX `idx_podcast_episodes_status` ON `podcast_episodes` (`status`);
CREATE UNIQUE INDEX `idx_founders_slug` ON `founders` (`slug`);
CREATE INDEX `idx_founders_status` ON `founders` (`status`);
