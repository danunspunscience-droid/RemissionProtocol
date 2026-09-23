import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
    ArrowUpRight,
    Loader2,
    Lock,
    BookOpen,
    ClipboardList,
    FileText,
    ShieldCheck,
    Sparkles,
    KeyRound,
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext';
import Reveal from '@/components/Reveal';

const FORMAT_META = {
    guide: { label: 'Guide', icon: BookOpen },
    protocol: { label: 'Protocol', icon: ClipboardList },
    checklist: { label: 'Checklist', icon: FileText },
    video: { label: 'Video', icon: BookOpen },
    podcast: { label: 'Podcast', icon: BookOpen },
};

const CATEGORY_LABELS = {
    foundations: 'Foundations',
    nutrition: 'Nutrition',
    movement: 'Movement',
    sleep: 'Sleep & Recovery',
    metabolic: 'Metabolic Health',
    biomarkers: 'Biomarkers',
    mindset: 'Mindset',
};

const PERKS = [
    {
        icon: ClipboardList,
        title: 'Training Protocols',
        body: 'The exact zone 2, resistance, and mobility blueprints we prescribe — with heart-rate targets, progression rules, and deload logic.',
    },
    {
        icon: ShieldCheck,
        title: 'Metabolic Assessments',
        body: 'How to read your quarterly panel the way our physician does: the 40+ markers, the thresholds, and what each trend means.',
    },
    {
        icon: Sparkles,
        title: 'Nutrition Guidelines',
        body: 'Periodized nutrition and fasting protocols sequenced around your training blocks and lab cycles — not generic meal plans.',
    },
];

const MemberResourceCard = ({ resource }) => {
    const meta = FORMAT_META[resource.format] || FORMAT_META.guide;
    const Icon = meta.icon;

    return (
        <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col rounded-sm border border-brass/25 bg-jewel-foreground/[0.04] p-6 transition-all hover:-translate-y-1 hover:border-brass/60 hover:bg-jewel-foreground/[0.07]"
        >
            <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brass">
                    <Icon size={14} /> {meta.label}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-jewel-foreground/45">
                    {CATEGORY_LABELS[resource.category] || resource.category}
                </span>
            </div>
            <h3 className="mt-4 font-display text-xl font-medium leading-snug tracking-tight text-jewel-foreground">
                {resource.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-jewel-foreground/65">{resource.summary}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brass transition-colors group-hover:text-jewel-foreground">
                Open resource <ArrowUpRight size={14} />
            </span>
        </a>
    );
};

const MembersPage = () => {
    const { user, isAuthed } = useAuth();
    const [resources, setResources] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        setError(null);

        pb.collection('resources')
            .getFullList({ filter: 'members_only = true', sort: '-created' })
            .then((records) => {
                if (!cancelled) setResources(records);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message || 'Could not load the member library.');
            });

        return () => {
            cancelled = true;
        };
    }, [isAuthed]);

    return (
        <>
            <Helmet>
                <title>Member Access | Remission Protocol — Protocols, Assessments & Blueprints</title>
                <meta
                    name="description"
                    content="The Remission Protocol member library: exclusive training protocols, metabolic assessments, and nutrition guidelines — the same documents our survivorship coaching clients use between sessions."
                />
            </Helmet>

            {/* Hero */}
            <section className="relative overflow-hidden bg-jewel pb-24 pt-40 text-jewel-foreground md:pt-48">
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 20%, var(--brass) 0, transparent 40%), radial-gradient(circle at 80% 60%, var(--brass) 0, transparent 35%)',
                    }}
                    aria-hidden="true"
                />
                <div className="container relative">
                    <Reveal>
                        <span className="inline-flex items-center gap-2 rounded-sm border border-brass/40 bg-brass/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brass">
                            <KeyRound size={14} /> Member Access
                        </span>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h1 className="mt-6 max-w-3xl font-display text-4xl font-light leading-tight tracking-tight md:text-6xl">
                            The library we build{' '}
                            <em className="font-medium text-brass">our members around.</em>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="mt-6 max-w-xl text-base leading-relaxed text-jewel-foreground/75">
                            This is the working material behind every Remission Protocol plan — the protocols, assessments,
                            and blueprints our physician and coaching team use between sessions. Reserved for
                            members of the practice.
                        </p>
                    </Reveal>
                    <Reveal delay={0.3}>
                        <p className="mt-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-jewel-foreground/55">
                            <ShieldCheck size={14} className="text-brass" />
                            {user?.email ? `Signed in as ${user.email}` : 'Signed in'}
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* Perks */}
            <section className="border-b border-border bg-card py-20 md:py-24">
                <div className="container">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
                            What&apos;s inside
                        </p>
                        <h2 className="mt-4 max-w-2xl font-display text-3xl font-light tracking-tight text-foreground md:text-4xl">
                            Three categories of high-value, practice-tested material.
                        </h2>
                    </Reveal>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {PERKS.map((perk, index) => (
                            <Reveal key={perk.title} delay={index * 0.08}>
                                <div className="flex h-full flex-col rounded-sm border border-border bg-background p-7">
                                    <perk.icon size={26} className="text-primary" />
                                    <h3 className="mt-5 font-display text-xl font-medium tracking-tight text-foreground">
                                        {perk.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{perk.body}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Member library */}
            <section className="bg-jewel py-20 text-jewel-foreground md:py-24">
                <div className="container">
                    <Reveal>
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brass">
                                    <Lock size={14} /> Member library
                                </span>
                                <h2 className="mt-4 font-display text-3xl font-light tracking-tight md:text-4xl">
                                    Protocols, checklists &amp; blueprints
                                </h2>
                            </div>
                            <p className="max-w-sm text-sm leading-relaxed text-jewel-foreground/60">
                                Updated each quarter alongside our member lab cycles. Open any document to
                                read, download, or print.
                            </p>
                        </div>
                    </Reveal>

                    {resources === null && !error && (
                        <div className="mt-14 flex items-center gap-3 text-jewel-foreground/70">
                            <Loader2 className="h-5 w-5 animate-spin" /> Loading the member library…
                        </div>
                    )}

                    {error && (
                        <p className="mt-14 rounded-sm border border-oxblood/50 bg-oxblood/20 p-4 text-sm text-jewel-foreground">
                            {error} Please refresh the page to try again.
                        </p>
                    )}

                    {resources !== null && resources.length === 0 && !error && (
                        <p className="mt-14 text-sm text-jewel-foreground/60">
                            Member resources are being prepared. Check back soon.
                        </p>
                    )}

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {resources &&
                            resources.map((resource, index) => (
                                <Reveal key={resource.id} delay={index * 0.06}>
                                    <MemberResourceCard resource={resource} />
                                </Reveal>
                            ))}
                    </div>

                    <Reveal delay={0.1}>
                        <div className="mt-16 flex flex-col items-start gap-6 rounded-sm border border-brass/30 bg-brass/10 p-8 md:flex-row md:items-center md:justify-between md:p-10">
                            <div className="max-w-xl">
                                <h3 className="font-display text-2xl font-light leading-snug md:text-3xl">
                                    Want the full coaching experience?
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-jewel-foreground/70">
                                    These documents are the reference layer. The work happens in consultation
                                    and coaching — physician-guided, coach-delivered, measured in biomarkers.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                                <Link
                                    to="/apply"
                                    className="inline-flex h-12 shrink-0 items-center justify-center rounded-sm bg-brass px-8 text-sm font-semibold text-white transition-all hover:bg-accent active:scale-[0.98]"
                                >
                                    Apply for Membership
                                </Link>
                                <Link
                                    to="/consultation"
                                    className="inline-flex h-12 shrink-0 items-center justify-center rounded-sm border border-jewel-foreground/40 px-8 text-sm font-semibold text-jewel-foreground transition-all hover:border-jewel-foreground hover:bg-jewel-foreground/10 active:scale-[0.98]"
                                >
                                    Request a Consultation
                                </Link>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>
        </>
    );
};

export default MembersPage;
