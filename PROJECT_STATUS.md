# Remission Protocol — Project Status & Development Roadmap

## Active State
- **Active Branch:** `feature/hero-mobile-lcp-seo-final`
- **Current Stage:** Stage 3 (Decoupled Hero CMS Engine & Performance Optimization)
- **Git Baseline Anchor:** `checkpoint/hero-cms-working-baseline`

---

## Performance Metrics Log (Cloudflare Edge Preview)
- **Desktop PageSpeed Score:** **89–97** | LCP: **2.0s** | TBT: **0ms** | CLS: **0.004**
- **Mobile PageSpeed Score:** **82** (Up from 65) | LCP: **3.6s** (Down from 12.2s) | TBT: **0ms** | CLS: **0.003**
- **Main-Thread CPU/GPU Load:** **0ms Total Blocking Time** (Zero-idle opacity cross-fade engine).

---

## Accomplishments (Current Session)
1. **D1 Color Persistence Bug Fixed:** Converted `functions/api/hero_copy.ts` and `functions/api/hero.ts` to TypeScript with atomic `UPSERT` targeting canonical record `id = 1`. Purged legacy orphan rows (`id > 1`) in D1.
2. **Carousel GPU Stutter Solved:** Eliminated full-bleed scale matrix keyframe calculations in `HeroSection.jsx`. Replaced with GPU-native opacity cross-fades and active-slide layer mounting (`if (!isActive) return null;`).
3. **Tick-Zero LCP Initial Paint:** Re-engineered `HeroSection.jsx` to render baseline hero copy and media on tick zero, deferring `/api/hero` CMS hydration to prevent network waterfalls.
4. **Mobile Asset Payload Optimization:** Generated compressed $800\text{px}$ mobile WebP visual asset (`/assets/hero-1-mobile.webp`, $<60\text{KB}$) and added responsive media-query preloads in `index.html`.

---

## Next Session Roadmap Spec: Sub-2.0s Mobile LCP & 95+ SEO Architecture
To push Mobile PageSpeed from **82** into the **95+** green zone while preserving premium authority and modern aesthetic standards, execute the following:

### 1. Ultra-Dense AVIF Mobile Visual Engine
- Convert `/assets/hero-1-mobile.webp` to Next-Gen `AVIF` format ($<30\text{KB}$ at $800\text{px}$ width).
- Inject `<link rel="preload" as="image" href="/assets/hero-1-mobile.avif" type="image/avif" media="(max-width: 767px)" fetchpriority="high">` into `index.html`.

### 2. Critical Layout CSS Inlining
- Inline baseline typography and hero container bounding-box CSS rules in `index.html` to prevent font-loading layout shifts and ensure instant FCP/LCP paint on slow 4G connections.

### 3. SEO Metadata & Crawler Alignment
- Complete meta tags in `index.html`: `<meta name="description">`, OpenGraph images, canonical URLs, and structured `MedicalBusiness` JSON-LD schema to elevate SEO audit score from 58 to **95+**.

### 4. Stage 3 Lock & Stage 4 Transition
- Re-run PageSpeed Insights on Cloudflare Pages preview.
- Merge `feature/hero-mobile-lcp-seo-final` into `main` after verification.
- Initialize Stage 4: Public Content Hub & CMS Endpoints (PDF resources and video cover overrides).
