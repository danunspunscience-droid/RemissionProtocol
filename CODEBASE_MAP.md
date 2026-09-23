# Remission Protocol — Codebase Map

## Active Cloudflare Pages Functions (functions/api/)

### Route Summary

| Route | HTTP Method | D1 Table | R2 Bucket | Frontend Consumers |
|-------|-------------|----------|-----------|-------------------|

## Detailed Function Mappings

### 1. functions/api/auth.js
- **GET**: Not defined (fallback returns "Not found")
- **POST**: Handles `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout`
- **D1 Tables**: users, admins
- **R2**: None
- **Frontend**: AuthContext.jsx, AdminPage.jsx

### 2. functions/api/auth/login.js
- **POST**: Authenticates users against D1 users table
- **D1 Table**: users
- **R2**: None
- **Frontend**: AuthContext.jsx, AdminPage.jsx

### 3. functions/api/auth/status.js
- **GET**: Returns current auth status
- **R2**: None
- **Frontend**: AdminPage.jsx

### 4. functions/api/admins.js
- **POST**: Admin authentication
- **D1 Table**: admins
- **R2**: None
- **Frontend**: AdminPage.jsx

### 5. functions/api/contact_requests.js
- **POST**: Submits contact form to D1 contact_requests table
- **D1 Table**: contact_requests
- **R2**: None
- **Frontend**: ConsultationPage.jsx

### 6. functions/api/files/[key].js
- **GET**: Streams files from R2 bucket
- **R2 Binding**: MEDIA_BUCKET || remission_media
- **Frontend**: AdminPage.jsx (mediaUrl, founderPhotoUrl, contentImageUrl)

### 7. functions/api/founders.js
- **GET**: Returns published founders ordered by sort_order
- **POST**: Creates new founder record
- **PUT**: Updates existing founder
- **DELETE**: Deletes founder
- **D1 Table**: founders
- **R2**: None
- **Frontend**: AboutPage.jsx, AdminPage.jsx

### 8. functions/api/hero_media.js
- **GET**: Returns all hero media ordered by created DESC
- **POST**: Creates new hero media entry with R2 upload
- **PUT**: Updates existing hero media
- **DELETE**: Deletes hero media
- **D1 Table**: hero_media
- **R2 Binding**: MEDIA_BUCKET || remission_media
- **Frontend**: HomePage.jsx, AdminPage.jsx

### 9. functions/api/hero_media/[id].js
- **PUT**: Updates specific hero media entry (publishing logic)
- **DELETE**: Deletes specific hero media entry
- **D1 Table**: hero_media
- **R2**: None
- **Frontend**: AdminPage.jsx

### 10. functions/api/library_content.js
- **GET**: Returns library content with formatted mapping for frontend
- **POST**: Creates new library content with R2 upload
- **PUT**: Updates library content
- **DELETE**: Deletes library content
- **D1 Table**: library_content
- **R2 Binding**: MEDIA_BUCKET || remission_media
- **Frontend**: LibraryPage.jsx, AdminPage.jsx

### 11. functions/api/library_content/[id].js
- **PUT**: Updates specific library content (status/featured toggles)
- **DELETE**: Deletes specific library content
- **D1 Table**: library_content
- **R2**: None
- **Frontend**: AdminPage.jsx

### 12. functions/api/podcast_episodes.js
- **GET**: Returns published podcast episodes ordered by publish_date DESC
- **POST**: Creates new podcast episode
- **PUT**: Updates existing podcast episode
- **DELETE**: Deletes podcast episode
- **D1 Table**: podcast_episodes
- **R2**: None
- **Frontend**: LibraryPage.jsx, AdminPage.jsx

### 13. functions/api/resources.js
- **GET**: Returns public resources (members_only = false) ordered by title
- **D1 Table**: resources
- **R2**: None
- **Frontend**: ResourcesPage.jsx, MembersPage.jsx, AdminPage.jsx

## Active Frontend Routes (apps/web/src/pages/)

### Live Pages

| Route | Component | Dynamic Data Sources | PocketBase References |
|-------|-----------|---------------------|---------------------|
| `/` | HomePage | hero_media (PocketBase) | Yes (`pb.collection('hero_media')`) |
| `/about` | AboutPage | founders (PocketBase) | Yes (`pb.collection('founders')`) |
| `/resources` | ResourcesPage | /api/resources (CF Pages) | No |
| `/library` | LibraryPage | /api/library_content, /api/podcast_episodes | No |
| `/members` | MembersPage | resources (PocketBase) | Yes (`pb.collection('resources')`) |
| `/consultation` | ConsultationPage | getProducts (Ecommerce), PocketBase | Yes (`pb.collection('contact_requests')`) |
| `/apply` | ApplyPage | PocketBase | Yes (`pb.collection('membership_applications')`) |
| `/admin` | AdminPage | Various API endpoints | No |
| `/login` | LoginPage | AuthContext | No |
| `/signup` | SignupPage | AuthContext | No |
| `/success` | SuccessPage | Route only | No |

## Data Flow Mapping

### Direct API Consumers
1. **ResourcesPage.jsx**: `fetch('/api/resources')` → functions/api/resources.js
2. **LibraryPage.jsx**: `fetch('/api/library_content')`, `fetch('/api/podcast_episodes')` → functions/api/library_content.js, functions/api/podcast_episodes.js
3. **AdminPage.jsx**: Multiple api calls to various endpoints

### PocketBase Consumers
1. **HomePage.jsx**: `pb.collection('hero_media').getFirstListItem("status='published'")`
2. **AboutPage.jsx**: `pb.collection('founders').getFullList({ sort: 'sort_order' })`
3. **MembersPage.jsx**: `pb.collection('resources').getFullList({ filter: 'members_only = true' })`
4. **ConsultationPage.jsx**: `pb.collection('contact_requests').create(...)`
5. **ApplyPage.jsx**: `pb.collection('membership_applications').create(...)`
6. **AdminPage.jsx**: `pb.files.getURL(rec, rec.photo)` for founder photos

## Media Asset URL Functions

### AdminPage.jsx Helper Functions
- `mediaUrl(rec)`: `/api/files/${rec.file}`
- `founderPhotoUrl(rec)`: `/api/files/${rec.photo}`
- `contentImageUrl(rec)`: `/api/files/${rec.cover_image}`

### Other Components
- **LibraryPage.jsx**: `getAudioUrl(rec)` → PocketBase audio file resolution
- **AboutPage.jsx**: `founderPhotoUrl(founder)` → PocketBase photo resolution

## Summary

**Active Frontend Routes**: 11 pages
**Cloudflare Pages Functions**: 13 endpoints
**D1 Tables**: 15 active tables (including system tables)
**R2 Storage Binding**: MEDIA_BUCKET/remission_media used by 3 functions
**Frontend Data Sources**: Mixed between Cloudflare Pages Functions and PocketBase
**Key Discrepancy**: Heavy reliance on PocketBase for real-time data vs Cloudflare Pages Functions for content management

## Verification Status

- ✅ D1 schema verified against local database
- ✅ All Cloudflare Pages Functions identified and mapped
- ✅ Frontend route consumption patterns catalogued
- ⚠️ Legacy PocketBase integration identified as significant architectural layer
- ⚠️ R2 binding configuration confirmed but space-decoding bug noted in files/[key].js