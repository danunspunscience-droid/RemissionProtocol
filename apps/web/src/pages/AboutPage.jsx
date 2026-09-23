import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Microscope, Activity, Dna, ShieldCheck } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Reveal from '@/components/Reveal';
import Seo from '@/components/Seo';

const SCIENCE_PILLARS = [
    {
        icon: Microscope,
        title: 'Immuno-Oncology',
        body: 'Protocols informed by the latest research on how training, nutrition, and sleep shape immune surveillance after treatment.',
    },
    {
        icon: Dna,
        title: 'Epigenetic Reprogramming',
        body: 'Lifestyle as signal — the behaviors that influence how your genes express themselves in recovery, not the genes you were born with.',
    },
    {
        icon: Activity,
        title: 'Metabolic Resilience',
        body: 'Reversing the metabolic dysfunction that drives recurrence risk and chronic disease, measured in lab values you can track.',
    },
];

const founderPhotoUrl = (rec) => {
    if (!rec || !rec.photo) return '';
    return pb.files.getURL(rec, rec.photo);
};

const AboutPage = () => {
    const [founders, setFounders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        pb.collection('founders')
            .getFullList({ sort: 'sort_order' })
            .then((list) => {
                setFounders(list.filter((r) => r.status === 'published'));
            })
            .catch(() => setFounders([]))
            .finally(() => setLoading(false));
    }, []);

    const daniel = founders.find((f) => f.slug === 'daniel_lee');
    const steve = founders.find((f) => f.slug === 'steve_hudson');
    const orderedFounders = [daniel, steve].filter(Boolean);

    return (
        <>
            <Helmet>
                <title>About the Founders | Remission Protocol — Concierge Health Coaching for Cancer Survivors, Austin TX</title>
                <meta
                    name="description"
                    content="Remission Protocol was founded by Dr. Daniel Lee, MD, ABOM and elite performance coach Steve Hudson — a rare combination of physician science, elite coaching, and lived survivorship experience. Concierge health coaching for cancer survivors, grounded in immuno-oncology, epigenetic reprogramming, and metabolic resilience."
                />
            </Helmet>
            <Seo
                title="About the Founders | Remission Protocol"
                description="Founded by Dr. Daniel Lee, MD, ABOM and elite performance coach Steve Hudson — physician science, elite coaching, and lived survivorship experience on one team."
                siteName="Remission Protocol"
                type="website"
            />

            {/* Intro */}
            <section className="bg-jewel pb-20 pt-40 text-jewel-foreground md:pb-28 md:pt-48">
                <div className="container">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brass">
                            About Remission Protocol
                        </p>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h1 className="mt-6 max-w-4xl font-display text-4xl font-light leading-[1.05] tracking-tight md:text-6xl lg:text-[4.25rem]">
                            Built by leaders in survivorship{' '}
                            <em className="font-medium text-brass">&amp; elite performance.</em>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-jewel-foreground/80">
                            Remission Protocol exists to bridge the post-treatment gap — the space between
                            oncology discharge and genuine recovery, where high-achievers refuse to simply
                            wait for the next scan. We integrate cutting-edge biomedical research in
                            immuno-oncology, epigenetic reprogramming, and metabolic resilience, and deliver
                            it as bespoke health coaching grounded in the latest science — not guesswork.
                        </p>
                    </Reveal>
                    <Reveal delay={0.3}>
                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <Link
                                to="/consultation"
                                className="inline-flex h-14 items-center justify-center gap-2 rounded-sm bg-brass px-8 text-sm font-semibold tracking-wide text-white transition-all hover:bg-accent active:scale-[0.98]"
                            >
                                Request a Consultation <ArrowRight size={16} />
                            </Link>
                            <Link
                                to="/#method"
                                className="inline-flex h-14 items-center justify-center gap-2 rounded-sm border border-jewel-foreground/40 px-8 text-sm font-semibold tracking-wide text-jewel-foreground transition-all hover:border-jewel-foreground hover:bg-jewel-foreground/10 active:scale-[0.98]"
                            >
                                See the Method
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* Science pillars */}
            <section className="border-b border-border bg-secondary/40 py-20 md:py-24">
                <div className="container">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
                            The Science We Stand On
                        </p>
                    </Reveal>
                    <div className="mt-10 grid gap-10 md:grid-cols-3">
                        {SCIENCE_PILLARS.map((pillar, index) => (
                            <Reveal key={pillar.title} delay={index * 0.08}>
                                <div className="border-t border-border pt-6">
                                    <pillar.icon size={22} className="text-primary" />
                                    <h3 className="mt-4 font-display text-xl font-medium tracking-tight text-foreground">
                                        {pillar.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                        {pillar.body}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Founder bios */}
            <section className="py-24 md:py-32">
                <div className="container">
                    <Reveal>
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
                                The Founders
                            </p>
                            <h2 className="mt-5 font-display text-4xl font-light leading-tight tracking-tight text-foreground md:text-5xl">
                                Two disciplines. One standard.
                            </h2>
                            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                                A rare combination of physician science, elite coaching, and lived
                                survivorship experience — working as one team for every member.
                            </p>
                        </div>
                    </Reveal>

                    {loading ? (
                        <p className="mt-16 text-sm text-muted-foreground">Loading founders…</p>
                    ) : (
                        <div className="mt-16 space-y-24 md:space-y-32">
                            {orderedFounders.map((founder, index) => {
                                const photo = founderPhotoUrl(founder);
                                const reversed = index % 2 === 1;
                                return (
                                    <Reveal key={founder.id} delay={0.05}>
                                        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
                                            {/* Photo */}
                                            <div className={reversed ? 'md:order-2' : ''}>
                                                <div className="relative">
                                                    <div
                                                        className="absolute -right-4 -top-4 h-full w-full rounded-sm border border-brass/40"
                                                        aria-hidden="true"
                                                    />
                                                    {photo ? (
                                                        <img
                                                            src={photo}
                                                            alt={`${founder.name} — ${founder.title || 'Co-Founder'}`}
                                                            className="relative aspect-[4/5] w-full rounded-sm object-cover shadow-2xl"
                                                            style={{
                                                                objectPosition:
                                                                    founder.photo_position || 'center top',
                                                            }}
                                                            loading="lazy"
                                                            decoding="async"
                                                        />
                                                    ) : (
                                                        <div className="relative flex aspect-[4/5] w-full flex-col items-center justify-center rounded-sm border border-dashed border-border bg-secondary/50 text-center">
                                                            <span className="font-display text-6xl font-light text-brass/40">
                                                                {founder.name
                                                                    .split(' ')
                                                                    .map((w) => w[0])
                                                                    .slice(0, 2)
                                                                    .join('')}
                                                            </span>
                                                            <p className="mt-4 max-w-[14rem] text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                                                Professional photo to be uploaded
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bio */}
                                            <div className={reversed ? 'md:order-1' : ''}>
                                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
                                                    {founder.title || 'Co-Founder'}
                                                </p>
                                                <h3 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-foreground md:text-4xl">
                                                    {founder.name}
                                                </h3>
                                                {founder.credentials && (
                                                    <p className="mt-2 text-sm font-medium text-primary">
                                                        {founder.credentials}
                                                    </p>
                                                )}
                                                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                                                    {founder.bio}
                                                </p>
                                                {founder.personal_mission && (
                                                    <blockquote className="mt-8 border-l-2 border-brass pl-6">
                                                        <p className="font-display text-xl font-light leading-snug text-foreground md:text-2xl">
                                                            &ldquo;{founder.personal_mission}&rdquo;
                                                        </p>
                                                        <footer className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                                                            Personal mission
                                                        </footer>
                                                    </blockquote>
                                                )}
                                            </div>
                                        </div>
                                    </Reveal>
                                );
                            })}

                            {orderedFounders.length === 0 && !loading && (
                                <div className="rounded-sm border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                                    Founder profiles are being prepared. Please check back shortly.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Shared vision */}
            <section className="bg-oxblood py-24 text-jewel-foreground md:py-32">
                <div className="container">
                    <div className="grid gap-14 md:grid-cols-[1fr_1.2fr] md:gap-20">
                        <Reveal>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brass">
                                    Shared Vision
                                </p>
                                <h2 className="mt-5 font-display text-4xl font-light leading-tight tracking-tight md:text-5xl">
                                    Why these two.
                                </h2>
                            </div>
                        </Reveal>
                        <Reveal delay={0.15}>
                            <div className="space-y-6 text-base leading-relaxed text-jewel-foreground/80">
                                <p>
                                    Most survivorship resources offer either a physician's expertise or a
                                    coach's encouragement — rarely both, and almost never alongside someone
                                    who has actually lived through treatment. Remission Protocol was built to put all
                                    three on one team: Dr. Lee's physician science, Steve's elite coaching,
                                    and his firsthand survivorship experience.
                                </p>
                                <p>
                                    That combination is why every protocol is evidence-based, every session
                                    is delivered to an elite standard, and every plan is shaped by an
                                    understanding of what recovery actually feels like. We hold ourselves to
                                    the same rigor our members used to build their careers — because
                                    survivorship deserves nothing less.
                                </p>
                                <div className="flex items-center gap-3 pt-2">
                                    <ShieldCheck size={20} className="text-brass" />
                                    <p className="text-sm font-medium text-jewel-foreground">
                                        Committed to excellence and an evidence-based approach — always.
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 md:py-28">
                <div className="container text-center">
                    <Reveal>
                        <h2 className="mx-auto max-w-3xl font-display text-4xl font-light leading-tight tracking-tight text-foreground md:text-5xl">
                            Meet the team built to carry you{' '}
                            <em className="font-medium text-primary">beyond the prognosis.</em>
                        </h2>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                to="/consultation"
                                className="inline-flex h-14 items-center justify-center gap-2 rounded-sm bg-primary px-10 text-sm font-semibold tracking-wide text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
                            >
                                Request a Consultation <ArrowRight size={16} />
                            </Link>
                            <Link
                                to="/apply"
                                className="inline-flex h-14 items-center justify-center gap-2 rounded-sm border border-border px-10 text-sm font-semibold tracking-wide text-foreground transition-all hover:border-primary hover:bg-secondary active:scale-[0.98]"
                            >
                                Apply for Membership <ArrowUpRight size={15} />
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>
        </>
    );
};

export default AboutPage;
