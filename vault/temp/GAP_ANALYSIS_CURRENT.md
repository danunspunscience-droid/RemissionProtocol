# GAP ANALYSIS CURRENT - Admin Portal Hero Carousel Disconnect

## Phase 1: Codebase Mapping

### File: `apps/web/src/pages/AdminPage.jsx`
- Lines 1-12: Imports React, useNavigate, lucide icons, and admin components.
- Line 4: `import HeroAdmin from '../components/admin/HeroAdmin';`
- Line 5: `import ResourceAdmin from '../components/admin/ResourceAdmin';`
- Line 6: `import BlogAdmin from '../components/admin/BlogAdmin';`
- Lines 8-22: Auth verification effect.
- Lines 61-84: Tab button group for Hero, Resources, Blog.
- Lines 88-92: Conditional rendering based on `activeTab` state:
  - `{activeTab === 'hero' && <HeroAdmin />}`
  - `{activeTab === 'resources' && <ResourceAdmin />}`
  - `{activeTab === 'blog' && <BlogAdmin />}`

### File: `apps/web/src/components/admin/HeroAdmin.jsx`
- Lines 1-4: Imports React hooks, lucide icons, imageCompression.
- Line 5: `export default function HeroAdmin() {`
- State:
  - `copy`: hero copy fields (eyebrow, headline_prefix, headline_italic, subheadline, primary_cta_text, primary_cta_url)
  - `slides`: array for carousel slides (each with image_url, sort_order, display_duration_ms, transition_speed_ms, overlay_opacity, object_position, active)
  - `uploading`, `saving`, `msg` booleans/status.
- Effects:
  - `useEffect` calls `fetchHeroData` on mount.
- Functions:
  - `fetchHeroData`: GET `/api/hero` to populate copy and slides.
  - `handleImageUpload`: compresses image, uploads to R2, adds new slide to `slides`.
  - `updateSlide`, `moveSlide`, `deleteSlide`: slide manipulation.
  - `handleSaveAll`: POST copy to `/api/hero_copy`, POST new slides, PUT all slides to `/api/hero_slides`.
- Render:
  - Hero Copy Settings form (eyebrow, headline prefix, headline italic, subheadline, CTA).
  - Hero Carousel Images section:
    - Upload button (image/* accepts, triggers handleImageUpload).
    - Map over `slides` to render each slide preview with controls for display duration, fade speed, overlay opacity, object position, active toggle, move up/down, delete.

### File: `apps/web/src/components/admin/AdminHeroTab.jsx`
- Legacy component (not imported by AdminPage).
- State:
  - `copy`: includes eyebrow, headline_prefix, headline_italic, subheadline, primary/secondary CTA texts/urls, bottom_tagline.
  - `asset`: single asset with `asset_url`, `poster_url`, `media_type`, `overlay_opacity`.
- Render:
  - Hero Copy Settings (similar fields).
  - Hero Asset Settings: single URL input for "Background Asset", poster URL, media type select (image/video), overlay opacity slider.

### File: `apps/web/src/components/admin/ResourceAdmin.jsx`
- Placeholder.

### File: `apps/web/src/components/admin/BlogAdmin.jsx`
- Blog entry form with title, content type, video URL, cover URL upload.

### Build & Exports
- `AdminPage.jsx` correctly imports `HeroAdmin` from the relative path `../components/admin/HeroAdmin`.
- The exported `HeroAdmin` function is the default export in `HeroAdmin.jsx`.
- No typos or mismatched names observed.
- The `AdminHeroTab` component is exported but not used in `AdminPage`.

## Phase 2: Gap Analysis

### Expected Behavior
The `/admin` portal should render the multi-image carousel manager (HeroAdmin) allowing:
- Upload of multiple hero slides.
- Per-slide configuration (duration, fade, overlay, position, active).
- Save of copy and slides via API endpoints (`/api/hero_copy`, `/api/hero_slides`).

### Observed Behavior (User Report)
The `/admin` portal renders legacy single-asset inputs:
- Fields labeled "Background Asset & Overlay" with a single URL text field.
- No carousel/slide management UI.

### Root Cause Diagnosis
1. **Component Isolation Verified**:
   - `AdminPage` imports and renders `HeroAdmin` (not `AdminHeroTab`).
   - The current `HeroAdmin.jsx` file on disk contains the multi-image carousel implementation (slides array, upload handling, slide controls).

2. **Possible Sources of Disconnect**:
   - **Stale Vite/HMR Cache**: The browser may be serving a cached version of `HeroAdmin.jsx` from before the carousel implementation was written.
   - **Build Artifact Mismatch**: The deployed/build version might be using an older copy of the file.
   - **Module Resolution Confusion**: Though unlikely, there could be another `HeroAdmin.jsx` elsewhere in the module path being picked up (search shows only one).
   - **Server-Side Rendering / Prerendering**: If the admin page is prerendered, it might not reflect latest changes (but this is a SPA).

3. **Evidence from Logs**:
   - `SESSION_JOURNAL.md` contains repeated Vite reload failures for `/src/components/admin/HeroAdmin.jsx` due to syntax errors or missing modules (indicating recent attempts to modify the file that may have broken the module temporarily).
   - However, the current file reads without syntax error (we inspected).

4. **Git Status**:
   - `HeroAdmin.jsx` shows modifications (staged? not staged) indicating local changes exist.
   - The diff shows a complete rewrite from the old `AdminHeroTab` import/render to the new carousel implementation.

### Conclusion
The most probable cause is a **stale client-side bundle** due to Vite caching or an incomplete build step. The source code on disk correctly implements the multi-image carousel manager, but the served content may be an older version.

### Recommended Verification Steps (For Daniel)
1. **Hard reload** the admin page (Ctrl+Shift+R) to bypass Vite/HMR cache.
2. **Clear Vite cache**: delete `node_modules/.vite` or restart the dev server.
3. **Rebuild**: run `npm run build --prefix apps/web` and serve the dist to verify the built output contains the carousel code.
4. **Check network tab** in dev tools to confirm the served `HeroAdmin.jsx` chunk source matches the current file.

### Immediate Next Actions (Halt for Approval)
- No file modifications made during this analysis (read-only compliance).
- Await approval to proceed with implementation fixes (e.g., cache busting, forcing rebuild, or if a deeper issue is found).

---
Analysis completed at: $(date)