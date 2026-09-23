import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, BookOpen, Video, Podcast, Quote, Play, Pause, Headphones, Loader2 } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { cn } from '@/lib/utils';

const LIBRARY_IMAGE = 'https://images.hostinger.com/8b77b712-e53f-4bbe-9f9f-f01f13b0b639.png';

/* ---------- Helpers ---------- */

// Convert any common YouTube URL into an embeddable /embed/ URL.
const youtubeEmbed = (url) => {
    if (!url) return '';
    try {
        const u = new URL(url);
        const host = u.hostname.replace('www.', '');
        if (host === 'youtu.be') {
            return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
        }
        if (host === 'youtube.com' || host === 'm.youtube.com') {
            if (u.pathname === '/watch') return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
            if (u.pathname.startsWith('/embed/')) return url;
            if (u.pathname.startsWith('/shorts/')) {
                return `https://www.youtube.com/embed/${u.pathname.split('/')[2]}`;
            }
        }
    } catch (_) {
        return '';
    }
    return '';
};

const isYouTube = (url) => /youtube\.com|youtu\.be/i.test(url || '');

const imageUrl = (rec) => {
    if (!rec || !rec.featured_image) return '';
    return rec.featured_image;
};

const getAudioUrl = (rec) => {
    if (!rec || !rec.audio_file) return '';
    return rec.audio_file;
};

const authorLabel = (rec) => {
    const name = rec?.author_name?.trim();
    const creds = rec?.author_credentials?.trim();
    if (!name && !creds) return 'Remission Protocol';
    if (name && creds) return `${name}, ${creds}`;
    return name || creds;
};

const formatDate = (val) => {
    if (!val) return '';
    try {
        return new Date(val).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch (_) {
        return '';
    }
};

/* ---------- Sub-components ---------- */

const SectionHeading = ({ icon: Icon, eyebrow, title, note }) => (
    <div className="flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:items-end md:justify-between">
        <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                <Icon size={15} /> {eyebrow}
            </span>
            <h2 className="mt-3 font-display text-3xl font-light tracking-tight text-foreground md:text-4xl">
                {title}
            </h2>
        </div>
        {note && <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{note}</p>}
    </div>
);

const FeaturedCard = ({ rec }) => {
    const img = imageUrl(rec);
    const embed = youtubeEmbed(rec.youtube_url);
    return (
        <a
            href={rec.external_url || rec.youtube_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative grid overflow-hidden rounded-sm border border-border bg-card lg:grid-cols-12"
        >
            <div className="relative min-h-[300px] overflow-hidden bg-muted lg:col-span-7">
                {embed ? (
                    <iframe
                        src={embed}
                        title={rec.title}
                        className="h-full w-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : img ? (
                    <img
                        src={img}
                        alt={rec.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary/40 text-muted-foreground">
                        <BookOpen size={48} />
                    </div>
                )}
                <div className="absolute top-4 left-4 rounded-sm bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
                    Featured Insight
                </div>
            </div>
            <div className="flex flex-col justify-between p-8 lg:col-span-5 lg:p-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="uppercase tracking-[0.2em] text-accent">{rec.category || 'Clinical'}</span>
                        <span>•</span>
                        <span>{formatDate(rec.published_at || rec.created)}</span>
                    </div>
                    <h3 className="font-display text-2xl font-light tracking-tight text-foreground transition-colors group-hover:text-accent md:text-3xl">
                        {rec.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {rec.summary}
                    </p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-6">
                    <span className="text-xs text-muted-foreground">{authorLabel(rec)}</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent transition-transform group-hover:translate-x-1">
                        Read Analysis <ArrowUpRight size={14} />
                    </span>
                </div>
            </div>
        </a>
    );
};

const ContentGridCard = ({ rec }) => {
    const img = imageUrl(rec);
    const isVid = isYouTube(rec.youtube_url) || rec.format === 'video';
    const isPod = rec.format === 'podcast';

    return (
        <a
            href={rec.external_url || rec.youtube_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between overflow-hidden rounded-sm border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
        >
            <div>
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    {img ? (
                        <img
                            src={img}
                            alt={rec.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary/30 text-muted-foreground">
                            {isVid ? <Video size={32} /> : isPod ? <Podcast size={32} /> : <BookOpen size={32} />}
                        </div>
                    )}
                    <div className="absolute top-3 left-3 rounded-sm bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur-sm">
                        {rec.format || 'Article'}
                    </div>
                </div>
                <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground uppercase tracking-widest">
                        <span>{rec.category || 'General'}</span>
                        <span>•</span>
                        <span>{formatDate(rec.published_at || rec.created)}</span>
                    </div>
                    <h3 className="font-display text-xl font-light tracking-tight text-foreground transition-colors group-hover:text-accent">
                        {rec.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {rec.summary}
                    </p>
                </div>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 px-6 py-4 text-xs text-muted-foreground">
                <span>{authorLabel(rec)}</span>
                <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-[0.15em] text-accent">
                    View <ArrowRight size={12} />
                </span>
            </div>
        </a>
    );
};

const LibraryPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tab, setTab] = useState('all');
    const [episodes, setEpisodes] = useState([]);
    const [activeEpisode, setActiveEpisode] = useState(null);

    useEffect(() => {
        let active = true;
        fetch('/api/library_content')
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to load library');
                const data = await res.json();
                if (active) setItems(data.items || []);
            })
            .catch(() => {
                if (active) setError('Could not load the content library.');
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    // Fetch published audio podcast episodes (newest first) and auto-select the first.
    useEffect(() => {
        let active = true;
        fetch('/api/podcast_episodes')
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to load podcasts');
                const data = await res.json();
                if (!active) return;
                const list = data.items || [];
                setEpisodes(list);
                if (list.length > 0) setActiveEpisode(list[0]);
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, []);

    const references = useMemo(
        () => items.filter((r) => r.is_reference).sort((a, b) => {
            const da = new Date(a.published_at || a.created).getTime();
            const db = new Date(b.published_at || b.created).getTime();
            return da - db;
        }),
        [items],
    );

    const featuredItem = useMemo(
        () => items.find((r) => r.featured) || items[0],
        [items],
    );

    const filteredItems = useMemo(() => {
        if (tab === 'all') return items.filter((r) => r.id !== featuredItem?.id);
        if (tab === 'articles') return items.filter((r) => r.format === 'article' || r.format === 'guide');
        if (tab === 'videos') return items.filter((r) => r.format === 'video' || isYouTube(r.youtube_url));
        if (tab === 'podcasts') return items.filter((r) => r.format === 'podcast');
        if (tab === 'references') return items.filter((r) => r.is_reference);
        return items;
    }, [items, tab, featuredItem]);

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <Helmet>
                <title>Clinical Library & Evidence | Remission Protocol</title>
                <meta
                    name="description"
                    content="Explore our clinical library of rigorous guides, video briefings, and podcast discussions on cancer survivorship, metabolic health, and longevity science."
                />
            </Helmet>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                        <BookOpen size={15} /> Clinical Evidence & Library
                    </span>
                    <h1 className="mt-4 font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl md:text-6xl">
                        Rigorous analysis for informed survivorship.
                    </h1>
                    <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                        We translate primary literature, oncology breakthroughs, and metabolic science into actionable clinical frameworks. No hype—just mechanism, data, and protocols.
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
                        {/* Featured Item */}
                        {featuredItem && tab === 'all' && (
                            <div className="mt-16">
                                <FeaturedCard rec={featuredItem} />
                            </div>
                        )}

                        {/* Filter Tabs */}
                        <div className="mt-16 flex flex-wrap items-center justify-center gap-2 border-b border-border pb-6">
                            {[
                                { id: 'all', label: 'All Library' },
                                { id: 'articles', label: 'Articles & Guides' },
                                { id: 'videos', label: 'Video Briefings' },
                                { id: 'podcasts', label: 'Podcast' },
                                { id: 'references', label: 'Key References' },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.id)}
                                    className={cn(
                                        'rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all',
                                        tab === t.id
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
                                    )}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Content Grid */}
                        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredItems.map((rec) => (
                                <ContentGridCard key={rec.id} rec={rec} />
                            ))}
                        </div>

                        {filteredItems.length === 0 && (
                            <div className="py-20 text-center text-muted-foreground">
                                No clinical content found in this category.
                            </div>
                        )}

                        {/* Podcast Showcase Section */}
                        <div className="mt-28">
                            <SectionHeading
                                icon={Headphones}
                                eyebrow="Audio Series"
                                title="The Remission Protocol Podcast"
                                note="Deep-dive conversations with oncologists, metabolic researchers, and patients navigating advanced survivorship."
                            />

                            <div className="mt-10 grid gap-8 lg:grid-cols-12">
                                {/* Episode Player / Featured */}
                                <div className="rounded-sm border border-border bg-card p-8 lg:col-span-7 flex flex-col justify-between">
                                    {activeEpisode ? (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase tracking-widest">
                                                <span className="text-accent font-semibold">Episode {activeEpisode.episode_number || '—'}</span>
                                                <span>•</span>
                                                <span>{formatDate(activeEpisode.publish_date || activeEpisode.created)}</span>
                                                <span>•</span>
                                                <span>{activeEpisode.duration || '45 min'}</span>
                                            </div>
                                            <h3 className="font-display text-2xl font-light text-foreground sm:text-3xl">
                                                {activeEpisode.title}
                                            </h3>
                                            <p className="text-sm leading-relaxed text-muted-foreground">
                                                {activeEpisode.description}
                                            </p>
                                            {activeEpisode.audio_file ? (
                                                <div className="pt-4">
                                                    <audio
                                                        controls
                                                        className="w-full"
                                                        src={getAudioUrl(activeEpisode)}
                                                    >
                                                        Your browser does not support the audio element.
                                                    </audio>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-muted-foreground italic">Audio stream coming soon.</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex h-48 items-center justify-center text-muted-foreground">
                                            Select an episode to begin listening.
                                        </div>
                                    )}
                                </div>

                                {/* Episode List */}
                                <div className="rounded-sm border border-border bg-card p-6 lg:col-span-5 max-h-[450px] overflow-y-auto space-y-3">
                                    <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                                        All Episodes
                                    </h4>
                                    {episodes.map((ep) => (
                                        <button
                                            key={ep.id}
                                            onClick={() => setActiveEpisode(ep)}
                                            className={cn(
                                                'w-full text-left rounded-sm p-4 transition-all border',
                                                activeEpisode?.id === ep.id
                                                    ? 'border-accent bg-accent/5 text-foreground'
                                                    : 'border-border/60 bg-muted/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-accent mb-1">
                                                <span>Ep. {ep.episode_number || '—'}</span>
                                                <span>{formatDate(ep.publish_date || ep.created)}</span>
                                            </div>
                                            <div className="font-display text-base font-light line-clamp-1">
                                                {ep.title}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* References Section */}
                        {references.length > 0 && (
                            <div className="mt-28 border-t border-border pt-16">
                                <SectionHeading
                                    icon={Quote}
                                    eyebrow="Evidence Base"
                                    title="Primary Literature & Citations"
                                    note="Every protocol and clinical thesis we publish is anchored in peer-reviewed oncology, metabolism, and longevity research."
                                />

                                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                                    {references.map((ref, idx) => (
                                        <div
                                            key={ref.id || idx}
                                            className="flex flex-col justify-between rounded-sm border border-border/80 bg-card/60 p-6"
                                        >
                                            <div className="space-y-2">
                                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                                                    Citation [{idx + 1}]
                                                </span>
                                                <h4 className="font-display text-lg font-light text-foreground">
                                                    {ref.title}
                                                </h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {ref.summary}
                                                </p>
                                            </div>
                                            {ref.external_url && (
                                                <div className="mt-6 pt-4 border-t border-border/40">
                                                    <a
                                                        href={ref.external_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-accent hover:underline"
                                                    >
                                                        View Source <ExternalLink size={12} />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LibraryPage;
