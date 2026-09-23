-- 1. Site Settings
INSERT OR REPLACE INTO site_settings (id, copy_rotation_frequency, copy_manual_index, asset_rotation_frequency, asset_manual_index)
VALUES ('global', 'daily', 0, 'daily', 0);

-- 2. Admin User
INSERT OR REPLACE INTO admins (id, email, name, password, tokenKey, verified)
VALUES ('hcch53cu6cpo1gr', 'admin@metxbootcamp.com', 'Remission Protocol Admin', '$2a$10$2bhckT6Gg9GlznShrIY5HOwFDfzSC/8/jFb0agzk2HlfLFn7nsR.i', '6kODhiEvJsT92PSFQuG7VwM5HU9EZBTVLjIsxCRhSVGlAF40h8', 1);

-- 3. Decoupled Hero Copy
INSERT OR REPLACE INTO hero_copy (id, headline, subhead, is_active)
VALUES 
  ('copy-1', 'Evidence-Based Metabolic Remission', 'Targeting root causes of chronic disease through lifestyle and clinical precision.', 1),
  ('copy-2', 'Precision Medicine Meets Daily Habits', 'Personalized protocols engineered for cardiometabolic health and gut microbiome restoration.', 1);

-- 4. Decoupled Hero Assets
INSERT OR REPLACE INTO hero_assets (id, image_url, media_type, overlay_opacity, is_active, display_order)
VALUES 
  ('asset-1', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1920&q=80', 'image', 45, 1, 1),
  ('asset-2', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80', 'image', 35, 1, 2);

-- 5. Founders & Team
INSERT OR REPLACE INTO founders (id, name, title, credentials, bio, personal_mission, photo, photo_position, slug, sort_order, status)
VALUES 
  ('jo85p9fykwjlwah', 'Daniel Lee, MD, ABOM', 'Co-Founder · Physician-Researcher', 'MD, ABOM', 'Daniel Lee is a board-certified physician with a background in nuclear medicine and radiology...', 'To close the gap between no evidence of disease and genuine recovery...', '', 'center top', 'daniel_lee', 1, 'published'),
  ('emmi61vmjqcvznh', 'Steve Hudson', 'Co-Founder · Elite Performance Coach', 'Elite Performance Coach', 'Steve Hudson is an elite strength and conditioning coach and a cancer survivor himself...', 'To prove that survivorship is not a smaller life organized around a diagnosis...', '', 'center top', 'steve_hudson', 2, 'published');

-- 6. Research Profiles (Library Content)
INSERT OR REPLACE INTO library_content (id, title, excerpt, author_name, author_credentials, external_url, content_type, status, featured, is_reference, key_insight)
VALUES 
  ('lk22jhuxi78djb2', 'Diet, Lifestyle, and Chronic Disease Prevention', 'Walter C. Willett, MD, DrPH, is Professor of Epidemiology and Nutrition at the Harvard T.H. Chan School of Public Health...', 'Walter C. Willett', 'MD, DrPH — Harvard T.H. Chan School of Public Health', 'https://hsph.harvard.edu/profile/walter-c-willett/', 'blog', 'published', 1, 1, 'Key insight — Build the diet around whole plant foods...'),
  ('lmq6w3508rrqm5r', 'Dietary Patterns and Cardiometabolic Disease', 'Frank B. Hu, MD, PhD, is Chair of the Department of Nutrition at the Harvard T.H. Chan School of Public Health...', 'Frank B. Hu', 'MD, PhD — Harvard T.H. Chan School of Public Health', 'https://hsph.harvard.edu/profile/frank-b-hu/', 'blog', 'published', 1, 1, 'Key insight — Overall dietary patterns matter more than single nutrients...'),
  ('fru37bebnb8mids', 'Personalized Nutrition and the Gut Microbiome', 'Tim D. Spector, MD, is Professor of Genetic Epidemiology at King College London...', 'Tim D. Spector', 'MD — King''s College London', 'https://www.kcl.ac.uk/people/professor-tim-spector', 'blog', 'published', 1, 1, 'Key insight — Personalized nutrition, informed by an individual''s gut microbiome...'),
  ('6zgt31jm995kiti', 'Healthy Low-Fat vs Low-Carbohydrate Diets (DIETFITS)', 'Christopher D. Gardner, PhD, is a Professor of Medicine at Stanford University...', 'Christopher D. Gardner', 'PhD — Stanford University', 'https://jamanetwork.com/journals/jama/fullarticle/2673150', 'blog', 'published', 1, 1, 'Key insight — Diet quality mattered more than macronutrient ratio...');

-- 7. Public Resources
INSERT OR REPLACE INTO resources (id, category, format, members_only, summary, title, url)
VALUES 
  ('7hzo2o4fy9vide5', 'foundations', 'guide', 0, 'What lifestyle medicine actually is...', 'The Upstream Primer: Lifestyle Medicine 101', 'https://lifestylemedicine.org/'),
  ('no3b02iuij1gizh', 'movement', 'guide', 0, 'The global minimums for movement...', 'WHO Physical Activity Guidelines, Decoded', 'https://www.who.int/news-room/fact-sheets/detail/physical-activity'),
  ('24r0upxb0sek74o', 'metabolic', 'video', 0, 'Glucose, insulin, triglycerides...', 'Understanding Metabolic Health', 'https://www.levelshealth.com/blog'),
  ('u32op7x6j7fl2c7', 'sleep', 'podcast', 0, 'The neuroscience of sleep...', 'Sleep: The Master Recovery Lever', 'https://www.hubermanlab.com/podcast'),
  ('tjqa6yyx4ays41d', 'biomarkers', 'protocol', 1, 'The 40+ markers we track quarterly...', 'Remission Protocol Biomarker Playbook', 'https://peterattiamd.com/blog/'),
  ('qme8t7q9bhogd8r', 'movement', 'protocol', 1, 'The exact aerobic base protocol...', 'Zone 2 Training Blueprint', 'https://peterattiamd.com/podcast/'),
  ('glig3fi1xqlm8d3', 'nutrition', 'protocol', 1, 'How we sequence nutrition interventions...', 'Fasting & Nutrition Periodization, Member Edition', 'https://www.foundmyfitness.com/'),
  ('m7lpl92was3ktib', 'biomarkers', 'checklist', 1, 'The one-page checklist we walk through...', 'Quarterly Review Checklist', 'https://www.bluezones.com/');