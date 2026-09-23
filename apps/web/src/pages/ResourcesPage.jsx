import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
    ArrowUpRight,
    ArrowRight,
    Loader2,
    Lock,
    BookOpen,
    ClipboardList,
    FileText,
    Video,
    Podcast,
    KeyRound,
} from 'lucide-react';
import Reveal from '@/components/Reveal';

const FORMAT_META = {
    guide: { label: 'Guide', icon: BookOpen },
    protocol: { label: 'Protocol', icon: ClipboardList },
    checklist: { label: 'Checklist', icon: FileText },
    video: { label: 'Video', icon: Video },
    podcast: { label: 'Podcast', icon: Podcast },
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

const ResourceCard = ({ resource }) => {
    const meta = FORMAT_META[resource.format] || FORMAT_META.guide;
    const Icon = meta.icon;

    return (
        <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col rounded-sm border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    <Icon size={14} /> {meta.label}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                    {CATEGORY_LABELS[resource.category] || resource.category}
                </span>
            </div>
            <h3 className="mt-4 font-display text-xl font-light text-foreground group-hover:text-accent transition-colors">
                {resource.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                {resource.description}
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs font-semibold uppercase tracking-widest text-accent">
                <span>Access Resource</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
        </a>
    );
};

const ResourcesPage = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        let cancelled = false;
        setError(null);

        fetch('/api/resources')
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to load resources');
                const data = await res.json();
                if (!cancelled) setResources(data.items || []);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message || 'Could not load resources.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const freeResources = useMemo(() => resources || [], [resources]);

    const filteredResources = useMemo(() => {
        if (selectedCategory === 'all') return freeResources;
        return freeResources.filter((r) => r.category === selectedCategory);
    }, [freeResources, selectedCategory]);

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <Helmet>
                <title>Free Clinical Protocols & Resources | Remission Protocol</title>
                <meta
                    name="description"
                    content="Download open-access guides, checklists, and foundational protocols for cancer survivorship and metabolic optimization."
                />
            </Helmet>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                        <BookOpen size={15} /> Open Clinical Resources
                    </span>
                    <h1 className="mt-4 font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl md:text-6xl">
                        Tools for your survivorship journey.
                    </h1>
                    <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                        Access our foundational guides, movement protocols, and biomarker checklists, designed to give you immediate structure after treatment.
                    </p>
                </div>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="animate-spin text-accent" size={32} />
                    </div>
                ) : error ? (
                    <div className="mt-16 rounded-sm border border-destructive/30 bg-destructive/10 p-6 text-center text-destructive">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Category Filter */}
                        <div className="mt-16 flex flex-wrap items-center justify-center gap-2 border-b border-border pb-6">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all ${
                                    selectedCategory === 'all'
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                All Resources
                            </button>
                            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedCategory(key)}
                                    className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all ${
                                        selectedCategory === key
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredResources.map((resource) => (
                                <ResourceCard key={resource.id} resource={resource} />
                            ))}
                        </div>

                        {filteredResources.length === 0 && (
                            <div className="py-20 text-center text-muted-foreground">
                                No resources found in this category.
                            </div>
                        )}
                    </>
                )}

                {/* Callout to Members */}
                <div className="mt-28 rounded-sm border border-border bg-card p-8 md:p-12 text-center relative overflow-hidden">
                    <div className="mx-auto max-w-2xl space-y-4">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                            <Lock size={14} /> Advanced Protocols
                        </span>
                        <h2 className="font-display text-3xl font-light text-foreground">
                            Looking for our precise prescription blueprints?
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Members receive our complete clinical dosing guides, quarterly lab analysis frameworks, and direct physician Q&A access.
                        </p>
                        <div className="pt-4">
                            <Link
                                to="/members"
                                className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90"
                            >
                                Explore Membership <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourcesPage;
