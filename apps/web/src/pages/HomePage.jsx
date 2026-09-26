import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Stethoscope, Dumbbell, Salad } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import CinematicHero from '@/components/CinematicHero';

// Cinematic looping hero sequence: a fit, accomplished individual in their
// 50s (alternating male/female perspectives) captured in iconic global
// locations through dramatic, artistic camera work — low-angle shots, Dutch
// angles, and low-key high-contrast grading. Plays as the default hero when
// no admin media is published; a real MP4 uploaded via /admin overrides it.
const HERO_SCENES = [
    {
        // Austin / Lake Travis hillside — golden hour, low-angle, woman.
        src: 'https://images.hostinger.com/f58a44dc-1cf9-4cd0-95c9-b795f6833088.png',
        tilt: 0,
        position: 'center 30%',
    },
    {
        // San Francisco — Golden Gate Bridge, Dutch angle, man.
        src: 'https://images.hostinger.com/fd7b5292-29b4-4353-9dfc-d6affecc1f17.png',
        tilt: 18,
        position: 'center 35%',
    },
    {
        // Manhattan — skyline + street energy, low-angle, woman.
        src: 'https://images.hostinger.com/90cf1522-7572-4716-bc53-790a2c9cc3ec.png',
        tilt: 0,
        position: 'center 25%',
    },
    {
        // Paris — Seine / Eiffel Tower district, contemplative, man.
        src: 'https://images.hostinger.com/a19a3a6e-565e-4b18-be23-b9cfcfc7d955.png',
        tilt: -16,
        position: 'center 40%',
    },
    {
        // Singapore — Marina Bay Sands, low-angle, woman.
        src: 'https://images.hostinger.com/b441b629-f42e-4018-af82-00bdea8cd2f2.png',
        tilt: 0,
        position: 'center 30%',
    },
];

const METHOD_IMAGE = 'https://images.hostinger.com/a288af13-bc7f-44d3-84d6-9d1b2107d057.png';
const STILL_LIFE_IMAGE = 'https://images.hostinger.com/a3d9bceb-a6a8-44ed-8db6-9c4ca1e38e02.png';
const PORTRAIT_IMAGE = 'https://images.hostinger.com/170a311f-d036-4ce7-a8ba-b0123a16e434.png';
const AUSTIN_IMAGE = 'https://images.hostinger.com/8f3e3cf8-4147-4238-8b26-0ac491a13936.png';

const MARQUEE_ITEMS = [
    'Post-Treatment Survivorship',
    'Cancer Recovery',
    'NED & Beyond',
    'Metabolic Reversal',
    'Type 2 Diabetes',
    'Functional Thriving',
];

const PILLARS = [
    {
        number: '01',
        icon: Stethoscope,
        title: 'Measure',
        body: 'Survivorship starts with truth, not reassurance. Quarterly biomarker panels, body composition, VO2, and continuous glucose monitoring give your physician-guided team a living map of your physiology — so every protocol is aimed at what your body needs now, not what it needed during treatment.',
    },
    {
        number: '02',
        icon: Dumbbell,
        title: 'Move',
        body: 'Strength and conditioning engineered by elite coaches and prescribed with intention. Zone 2 base work, resistance protocols, and mobility — scaled precisely to what your labs and your recovery can absorb, rebuilding the capacity treatment may have taken.',
    },
    {
        number: '03',
        icon: Salad,
        title: 'Mend',
        body: 'Nutrition, sleep, and stress protocols co-signed by physician guidance and your coach. This is where metabolic syndrome, pre-diabetes, and the inflammation of recovery stop being managed — and start being reversed. Functional thriving, not disease management.',
    },
];

const STATS = [
    { value: 40, suffix: '+', label: 'Biomarkers tracked quarterly' },
    { value: 2, suffix: '', label: 'Dedicated experts per member' },
    { value: 12, suffix: '-wk', label: 'Intensive onboarding block' },
    { value: 1, suffix: ':1', label: 'Every session, every time' },
];

const TESTIMONIALS = [
    {
        quote: 'After my diagnosis, every specialist told me what to avoid. Remission Protocol was the first team to tell me what to build.',
        name: 'M.R.',
        role: 'Founder, Austin',
    },
    {
        quote: 'My A1c is normal for the first time in nine years. My coach and my physician actually talk to each other every week. That is the difference.',
        name: 'D.K.',
        role: 'Executive, Westlake',
    },
];

const HomePage = () => {
    const [liveHero, setLiveHero] = useState(null);

    useEffect(() => {
    async function loadHeroMedia() {
      try {
        const res = await fetch('/api/hero_media');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const published = data.find(item => item.is_published) || data[0];
            if (published) {
              setLiveHero(published);
            }
          }
        }
      } catch (err) {
        console.warn("Using default hero baseline assets:", err);
      }
    }
    loadHeroMedia();
  }, []);

    const heroHeadline = liveHero?.headline || 'Live Beyond the Prognosis.';
    const heroSubheading =
        liveHero?.subheading ||
        'For high-achievers who have cleared active treatment and refuse to simply wait. Physician guidance and elite coaching on one team — reclaiming vitality after cancer, metabolic syndrome, and serious illness. Not disease management. Survivorship excellence.';
    const heroCtaLabel = liveHero?.cta_label || 'Request a Consultation';
    const heroCtaLink = liveHero?.cta_link || '/consultation';
    const heroFileUrl = liveHero?.file ? (liveHero.file.startsWith('http') || liveHero.file.startsWith('/api/') ? liveHero.file : `/api/files/${liveHero.file}`) : null;
    const heroPosition = liveHero?.object_position || 'center';

    return (
        <>
            <Helmet>
                <title>Remission Protocol | Concierge Health Coaching for Cancer Survivors — Austin, TX</title>
                <meta
                    name="description"
                    content="Remission Protocol is a concierge health coaching service for cancer survivors in Austin, TX. Physician-guided, coach-delivered programs for cancer recovery, post-treatment survivorship, metabolic health, and reclaiming vitality after serious illness."
                />
            </Helmet>

            {/* Hero */}
            <section className="relative flex min-h-[100dvh] items-end overflow-hidden bg-jewel">
                {liveHero && liveHero.media_type === 'video' && heroFileUrl ? (
                    <video
                        src={heroFileUrl}
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{ objectPosition: heroPosition }}
                        autoPlay={liveHero.video_autoplay ?? true}
                        muted={liveHero.video_muted ?? true}
                        loop={liveHero.video_loop ?? true}
                        controls={liveHero.video_controls ?? false}
                        playsInline
                        aria-label={liveHero.headline || 'Remission Protocol hero video'}
                    />
                ) : liveHero && liveHero.media_type === 'image' && heroFileUrl ? (
                    <img
                        src={heroFileUrl}
                        alt="Remission Protocol hero"
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{ objectPosition: heroPosition }}
                        loading="eager"
                        decoding="async"
                    />
                ) : (
                    <CinematicHero
                        scenes={HERO_SCENES}
                        alt="Fit, accomplished people in their fifties captured in Austin, San Francisco, Manhattan, Paris, and Singapore through cinematic low-angle and Dutch-angle cinematography"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-jewel via-jewel/55 to-jewel/15" />
                <div className="container relative pb-20 pt-40 md:pb-28">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brass">
                            Concierge Health Coaching · Cancer Survivors · Austin, TX
                        </p>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h1 className="mt-6 max-w-4xl font-display text-5xl font-light leading-[1.02] tracking-tight text-jewel-foreground md:text-7xl lg:text-[5.25rem]">
                            {heroHeadline.includes('the Prognosis') ? (
                                <>
                                    Live Beyond{' '}
                                    <em className="font-medium text-brass">the Prognosis.</em>
                                </>
                            ) : (
                                heroHeadline
                            )}
                        </h1>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="mt-8 max-w-xl text-lg leading-relaxed text-jewel-foreground/80">
                            {heroSubheading}
                        </p>
                    </Reveal>
                    <Reveal delay={0.3}>
                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <Link
                                to={heroCtaLink}
                                className="inline-flex h-14 items-center justify-center gap-2 rounded-sm bg-brass px-8 text-sm font-semibold tracking-wide text-white transition-all hover:bg-accent active:scale-[0.98]"
                            >
                                {heroCtaLabel} <ArrowRight size={16} />
                            </Link>
                            <Link
                                to="/resources"
                                className="inline-flex h-14 items-center justify-center gap-2 rounded-sm border border-jewel-foreground/40 px-8 text-sm font-semibold tracking-wide text-jewel-foreground transition-all hover:border-jewel-foreground hover:bg-jewel-foreground/10 active:scale-[0.98]"
                            >
                                Explore Our Resources
                            </Link>
                        </div>
                    </Reveal>
                    <Reveal delay={0.4}>
                        <p className="mt-12 text-xs font-medium uppercase tracking-[0.25em] text-jewel-foreground/50">
                            Physician-guided · Coach-delivered · Built for life after treatment
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* Marquee */}
            <div className="overflow-hidden border-y border-brass/25 bg-jewel py-4" aria-hidden="true">
                <div className="flex w-max animate-marquee">
                    {[0, 1].map((copy) => (
                        <div key={copy} className="flex shrink-0 items-center">
                            {MARQUEE_ITEMS.map((item) => (
                                <span
                                    key={`${copy}-${item}`}
                                    className="flex items-center text-xs font-semibold uppercase tracking-[0.3em] text-brass"
                                >
                                    <span className="px-8">{item}</span>
                                    <span className="text-jewel-foreground/40">·</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Upstream philosophy */}
            <section className="py-24 md:py-32">
                <div className="container grid items-center gap-14 md:grid-cols-2">
                    <Reveal>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
                                The Gap We Close
                            </p>
                            <h2 className="mt-5 font-display text-4xl font-light leading-tight tracking-tight text-foreground md:text-5xl">
                                Active treatment ends.{' '}
                                <em className="font-medium text-primary">The work of thriving begins.</em>
                            </h2>
                            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
                                When your oncologist declares NED — no evidence of disease — follow-up often
                                becomes passive surveillance: periodic scans, watchful waiting, and the quiet
                                implication that the work is done. It isn&apos;t. &ldquo;No evidence&rdquo; is
                                not a guarantee. For the people we serve, it is the starting line.
                            </p>
                            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                                Remission Protocol exists for the gap between oncology discharge and optimal recovery — the
                                space where high-achievers refuse to simply manage a diagnosis or wait for the
                                next scan. We turn survivorship into an active, bespoke pursuit of excellence,
                                with the same rigor that carried you through treatment.
                            </p>
                            <Link
                                to="/#method"
                                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent"
                            >
                                See the method <ArrowUpRight size={15} />
                            </Link>
                        </div>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <div className="relative">
                            <div className="absolute -left-4 -top-4 h-full w-full rounded-sm border border-brass/40" aria-hidden="true" />
                            <img
                                src={METHOD_IMAGE}
                                alt="Remission Protocol physician and strength coach reviewing biomarker reports together"
                                className="relative aspect-[3/2] w-full rounded-sm object-cover shadow-2xl"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Method pillars */}
            <section id="method" className="bg-secondary/60 py-24 md:py-32">
                <div className="container">
                    <Reveal>
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
                                The Method
                            </p>
                            <h2 className="mt-5 font-display text-4xl font-light leading-tight tracking-tight text-foreground md:text-5xl">
                                Bespoke survivorship coaching for people who demand the best.
                            </h2>
                            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                                This is a premium-only service for a deliberately small number of members. We
                                are not a clinic, and we do not practice medicine or replace your oncology
                                team. We are elite health coaches working with physician guidance — building
                                the lifestyle architecture that turns survival into thriving.
                            </p>
                            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                                We serve high-achieving adults who have completed active treatment for cancer,
                                metabolic syndrome, or type 2 diabetes — founders, executives, physicians,
                                athletes — people who measure themselves by capability, not by diagnosis.
                                Success here is functional thriving: strength returned, biomarkers optimized,
                                and the energy to live the life you built before illness — not a smaller life
                                organized around managing it.
                            </p>
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <div className="mt-8 max-w-2xl rounded-sm border border-brass/30 bg-brass/[0.07] p-6">
                            <p className="text-sm leading-relaxed text-foreground">
                                <span className="font-semibold text-primary">A coaching practice, not a clinic.</span>{' '}
                                Remission Protocol does not diagnose, treat, or replace your physician. Every protocol is
                                educational and designed to run alongside your existing care — never instead
                                of it.
                            </p>
                        </div>
                    </Reveal>

                    <div className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
                        <div>
                            {PILLARS.map((pillar, index) => (
                                <Reveal key={pillar.number} delay={index * 0.08}>
                                    <div className="flex gap-6 border-t border-border py-10 first:border-t-0 first:pt-0 md:gap-10">
                                        <span className="font-display text-5xl font-light text-brass/70">
                                            {pillar.number}
                                        </span>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <pillar.icon size={20} className="text-primary" />
                                                <h3 className="font-display text-2xl font-medium tracking-tight text-foreground">
                                                    {pillar.title}
                                                </h3>
                                            </div>
                                            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                                                {pillar.body}
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                        <Reveal delay={0.2}>
                            <div className="lg:sticky lg:top-28">
                                <img
                                    src={STILL_LIFE_IMAGE}
                                    alt="Biomarker report, training journal, and whole foods on dark green linen"
                                    className="aspect-[3/2] w-full rounded-sm object-cover shadow-xl lg:aspect-[4/5]"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <p className="mt-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                    Data in. Protocol out. Reviewed quarterly.
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* Outcomes */}
            <section className="bg-jewel py-24 text-jewel-foreground md:py-32">
                <div className="container">
                    <Reveal>
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brass">
                                Proof, Not Promises
                            </p>
                            <h2 className="mt-5 font-display text-4xl font-light leading-tight tracking-tight md:text-5xl">
                                Outcomes you can read in a lab report.
                            </h2>
                        </div>
                    </Reveal>

                    <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 border-t border-jewel-foreground/15 pt-12 lg:grid-cols-4">
                        {STATS.map((stat, index) => (
                            <Reveal key={stat.label} delay={index * 0.08}>
                                <div>
                                    <p className="font-display text-5xl font-light text-brass md:text-6xl">
                                        <CountUp value={stat.value} suffix={stat.suffix} />
                                    </p>
                                    <p className="mt-3 text-sm leading-snug text-jewel-foreground/70">{stat.label}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
                        <Reveal>
                            <img
                                src={PORTRAIT_IMAGE}
                                alt="Vibrant Remission Protocol member in her sixties, training outdoors in Austin"
                                className="aspect-[3/4] w-full rounded-sm object-cover shadow-2xl"
                                loading="lazy"
                                decoding="async"
                            />
                        </Reveal>
                        <div className="flex flex-col justify-center gap-12">
                            {TESTIMONIALS.map((testimonial, index) => (
                                <Reveal key={testimonial.name} delay={index * 0.1}>
                                    <blockquote className="border-l-2 border-brass pl-6 md:pl-8">
                                        <p className="font-display text-2xl font-light leading-snug md:text-3xl">
                                            &ldquo;{testimonial.quote}&rdquo;
                                        </p>
                                        <footer className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-jewel-foreground/60">
                                            {testimonial.name} · {testimonial.role}
                                        </footer>
                                    </blockquote>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Austin */}
            <section className="py-24 md:py-32">
                <div className="container grid items-center gap-14 md:grid-cols-2">
                    <Reveal>
                        <img
                            src={AUSTIN_IMAGE}
                            alt="Austin, Texas skyline at golden hour across Lady Bird Lake"
                            className="aspect-[16/9] w-full rounded-sm object-cover shadow-xl"
                            loading="lazy"
                            decoding="async"
                        />
                    </Reveal>
                    <Reveal delay={0.15}>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
                                Rooted in Austin
                            </p>
                            <h2 className="mt-5 font-display text-4xl font-light leading-tight tracking-tight text-foreground md:text-5xl">
                                Built for the people who run this city.
                            </h2>
                            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
                                Founders, physicians, investors, creators — Austin runs on people who push,
                                and many of them are rebuilding after serious illness. Remission Protocol is a
                                deliberately small concierge survivorship coaching practice in Westlake Hills, accepting
                                a limited number of members so every plan gets physician-guided attention and
                                every session gets a coach.
                            </p>
                            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                                Inclusion begins with a consultation. If we can&apos;t meaningfully change
                                your trajectory, we&apos;ll tell you — and point you to someone who can.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* CTA band */}
            <section className="relative overflow-hidden bg-oxblood py-24 text-jewel-foreground md:py-28">
                <div className="container relative text-center">
                    <Reveal>
                        <h2 className="mx-auto max-w-3xl font-display text-4xl font-light leading-tight tracking-tight md:text-6xl">
                            The work of thriving begins{' '}
                            <em className="font-medium text-brass">where treatment ends.</em>
                        </h2>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-jewel-foreground/75">
                            Request a consultation to be considered for the practice. Bring your history,
                            your labs, and your ambition — we&apos;ll bring the plan.
                        </p>
                    </Reveal>
                    <Reveal delay={0.25}>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                to="/consultation"
                                className="inline-flex h-14 items-center justify-center gap-2 rounded-sm bg-brass px-10 text-sm font-semibold tracking-wide text-white transition-all hover:bg-accent active:scale-[0.98]"
                            >
                                Request a Consultation <ArrowRight size={16} />
                            </Link>
                            <Link
                                to="/apply"
                                className="inline-flex h-14 items-center justify-center rounded-sm border border-jewel-foreground/40 px-10 text-sm font-semibold tracking-wide text-jewel-foreground transition-all hover:border-jewel-foreground hover:bg-jewel-foreground/10 active:scale-[0.98]"
                            >
                                Apply for Membership
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>
        </>
    );
};

export default HomePage;
