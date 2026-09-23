import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
    Loader2,
    LogOut,
    Trash2,
    Pencil,
    CheckCircle2,
    Circle,
    X,
    Star,
} from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import getAudioUrl from '@/lib/podcastAudio';

const OBJECT_POSITION_PRESETS = [
    { value: 'center', label: 'Center' },
    { value: 'center top', label: 'Top' },
    { value: 'center bottom', label: 'Bottom' },
    { value: 'left center', label: 'Left' },
    { value: 'right center', label: 'Right' },
    { value: 'custom', label: 'Custom…' },
];

const mediaUrl = (rec) => {
    if (!rec || !rec.file) return '';
    return `/api/files/${rec.file}`;
};

const founderPhotoUrl = (rec) => {
    if (!rec || !rec.photo) return '';
    return `/api/files/${rec.photo}`;
};

const contentImageUrl = (rec) => {
    if (!rec || !rec.cover_image) return '';
    return `/api/files/${rec.cover_image}`;
};

const detectMediaType = (file) => {
    if (!file) return '';
    if (typeof file === 'string') {
        if (file.endsWith('.mp4') || file.endsWith('.webm')) return 'video';
        return 'image';
    }
    if (file.type?.startsWith('video/')) return 'video';
    if (file.type?.startsWith('image/')) return 'image';
    return '';
};

const formatDate = (val) => {
    if (!val) return '—';
    try {
        return new Date(val).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch (_) {
        return '—';
    }
};

/* ---------------- Auth / Login Component ---------------- */

const AdminLogin = () => {
    const [email, setEmail] = useState('admin@metxbootcamp.com');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setBusy(true);
        try {
            await api.post('/api/auth/login', { email: email.trim(), password });
            window.location.reload();
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="flex min-h-[100dvh] items-center justify-center bg-jewel px-4 py-24">
            <Helmet>
                <title>Admin Sign In · Remission Protocol</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="w-full max-w-md rounded-sm border border-jewel-foreground/15 bg-card p-8 shadow-2xl">
                <div className="flex flex-col leading-none">
                    <span className="font-display text-3xl font-semibold tracking-tight text-jewel-foreground">
                        Remission
                    </span>
                    <span className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-brass">
                        Protocol · Admin
                    </span>
                </div>
                <h1 className="mt-8 font-display text-2xl font-light text-jewel-foreground">
                    Sign in to manage portal
                </h1>
                <form onSubmit={submit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-foreground">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" disabled={busy} className="btn">
                            {busy ? <Loader2 size={16} className="animate-spin" /> : 'Sign in'}
                        </button>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </form>
            </div>
        </div>
    );
};

/* ---------------- Hero Media Components ---------------- */

const emptyForm = {
    headline: '',
    subheading: '',
    cta_label: '',
    cta_link: '',
    object_position: 'center',
    video_autoplay: false,
    video_muted: true,
    video_loop: true,
    video_controls: false,
    status: 'draft',
    file: undefined,
};

const MediaForm = ({ editing, onCancelEdit, onSaved }) => {
    const [form, setForm] = useState(editing ? { ...editing } : emptyForm);
    const [fileObj, setFileObj] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [busy, setBusy] = useState(false);
    const fileInputRef = useRef(null);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setBusy(true);
        try {
            const fd = new FormData();
            if (fileObj) fd.append('file', fileObj);
            fd.append('headline', form.headline.trim());
            fd.append('subheading', form.subheading.trim());
            fd.append('cta_label', form.cta_label.trim());
            fd.append('cta_link', form.cta_link.trim());
            fd.append('object_position', form.object_position);
            fd.append('status', form.status);

            if (editing && editing.id) {
                await api.putForm(`/api/hero_media/${editing.id}`, fd);
                setSuccess('Hero media updated.');
            } else {
                await api.postForm('/api/hero_media', fd);
                setSuccess('Hero media created.');
            }
            setFileObj(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            onSaved();
        } catch (err) {
            setError(err?.message || 'Save failed.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-medium text-foreground">
                    {editing?.id ? 'Edit Hero Media' : 'New Hero Media'}
                </h2>
                <button type="button" onClick={onCancelEdit} className="p-1 rounded-md hover:bg-accent">
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Headline</label>
                <input
                    type="text"
                    required
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.headline}
                    onChange={(e) => setForm({ ...form, headline: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Subheading</label>
                <input
                    type="text"
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.subheading}
                    onChange={(e) => setForm({ ...form, subheading: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Media File</label>
                <input
                    type="file"
                    accept="video/mp4,image/png,image/jpeg,image/webp"
                    className="block w-full text-sm text-muted-foreground"
                    ref={fileInputRef}
                    onChange={(e) => setFileObj(e.target.files[0] ?? null)}
                />
            </div>

            <div className="flex justify-between">
                <button type="button" onClick={onCancelEdit} className="btn btn-outline">Cancel</button>
                <button type="submit" disabled={busy} className="btn">
                    {busy ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
                </button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-emerald-500">{success}</p>}
        </form>
    );
};

const MediaCard = ({ rec, isLive, onEdit, onPublish, onUnpublish, onDelete, busyId }) => {
    const isBusy = busyId === rec.id;

    return (
        <div className="flex items-center space-x-4 p-4 rounded-md border border-border/50 bg-background/50">
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-medium text-foreground">
                        {rec.headline || 'Untitled'}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs">
                        {isLive && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                LIVE
                            </span>
                        )}
                        <span className="text-muted-foreground">{formatDate(rec.created)}</span>
                    </div>
                </div>
                {rec.subheading && <p className="text-sm text-muted-foreground">{rec.subheading}</p>}
            </div>
            <div className="flex items-center space-x-2 text-xs">
                <button onClick={() => onEdit(rec)} disabled={isBusy} className="p-1.5 rounded-md hover:bg-accent">
                    <Pencil size={16} />
                </button>
                {rec.status === 'published' ? (
                    <button onClick={() => onUnpublish(rec)} disabled={isBusy} className="p-1.5 rounded-md hover:bg-accent">
                        <Circle size={16} />
                    </button>
                ) : (
                    <button onClick={() => onPublish(rec)} disabled={isBusy} className="p-1.5 rounded-md hover:bg-accent">
                        <CheckCircle2 size={16} />
                    </button>
                )}
                <button onClick={() => onDelete(rec)} disabled={isBusy} className="p-1.5 rounded-md hover:bg-accent text-destructive">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

/* ---------------- Content Library Components ---------------- */

const CONTENT_TYPES = [
    { value: 'article', label: 'Article' },
    { value: 'expert_tip', label: 'Expert Tip' },
    { value: 'resource', label: 'Resource' },
    { value: 'video', label: 'Video' },
    { value: 'podcast', label: 'Podcast' },
];

const emptyContentForm = {
    title: '',
    content: '',
    cover_image: undefined,
    status: 'draft',
    type: 'article',
    featured: false,
    youtube_url: '',
};

const ContentForm = ({ editing, onCancelEdit, onSaved }) => {
    const [form, setForm] = useState(editing ? { ...editing } : emptyContentForm);
    const [fileObj, setFileObj] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [busy, setBusy] = useState(false);
    const fileInputRef = useRef(null);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setBusy(true);
        try {
            const fd = new FormData();
            if (fileObj) fd.append('cover_image', fileObj);
            fd.append('title', form.title.trim());
            fd.append('content', form.content);
            fd.append('status', form.status);
            fd.append('type', form.type);
            fd.append('featured', form.featured.toString());
            fd.append('youtube_url', form.youtube_url.trim());

            if (editing && editing.id) {
                await api.putForm(`/api/library_content/${editing.id}`, fd);
                setSuccess('Content updated.');
            } else {
                await api.postForm('/api/library_content', fd);
                setSuccess('Content created.');
            }
            setFileObj(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            onSaved();
        } catch (err) {
            setError(err?.message || 'Save failed.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-medium text-foreground">
                    {editing?.id ? 'Edit Content' : 'New Content Item'}
                </h2>
                <button type="button" onClick={onCancelEdit} className="p-1 rounded-md hover:bg-accent">
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <input
                    type="text"
                    required
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Content</label>
                <textarea
                    rows={6}
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Type</label>
                <select
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                    {CONTENT_TYPES.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex justify-between">
                <button type="button" onClick={onCancelEdit} className="btn btn-outline">Cancel</button>
                <button type="submit" disabled={busy} className="btn">
                    {busy ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
                </button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-emerald-500">{success}</p>}
        </form>
    );
};

const ContentRow = ({ rec, onEdit, onToggleFeatured, onTogglePublish, onDelete, busyId }) => {
    const isBusy = busyId === rec.id;

    return (
        <tr className="border-b hover:bg-accent/50">
            <td className="p-3 text-sm font-medium text-foreground">{rec.title}</td>
            <td className="p-3 text-sm text-muted-foreground">{rec.type}</td>
            <td className="p-3 text-sm text-muted-foreground">{formatDate(rec.created)}</td>
            <td className="p-3 text-sm text-muted-foreground">{rec.featured ? 'Yes' : 'No'}</td>
            <td className="p-3 text-sm text-muted-foreground">{rec.status === 'published' ? 'Published' : 'Draft'}</td>
            <td className="p-3 text-center space-x-2">
                <button onClick={() => onEdit(rec)} disabled={isBusy} className="p-1 rounded-md hover:bg-accent">
                    <Pencil size={16} />
                </button>
                <button onClick={() => onToggleFeatured(rec)} disabled={isBusy} className="p-1 rounded-md hover:bg-accent">
                    <Star size={16} className={rec.featured ? 'text-amber-500 fill-amber-500' : ''} />
                </button>
                <button onClick={() => onTogglePublish(rec)} disabled={isBusy} className="p-1 rounded-md hover:bg-accent">
                    {rec.status === 'published' ? <Circle size={16} /> : <CheckCircle2 size={16} />}
                </button>
                <button onClick={() => onDelete(rec)} disabled={isBusy} className="p-1 rounded-md hover:bg-accent text-destructive">
                    <Trash2 size={16} />
                </button>
            </td>
        </tr>
    );
};

const ContentManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(null);
    const [busyId, setBusyId] = useState(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const list = await api.get('/api/library_content');
            setItems(Array.isArray(list) ? list : []);
        } catch (err) {
            setError('Could not load content library.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const toggleFeatured = async (rec) => {
        setBusyId(rec.id);
        try {
            await api.put(`/api/library_content/${rec.id}`, { featured: !rec.featured });
            await refresh();
        } catch (_) {
            setError('Could not toggle featured status.');
        } finally {
            setBusyId(null);
        }
    };

    const togglePublish = async (rec) => {
        setBusyId(rec.id);
        try {
            await api.put(`/api/library_content/${rec.id}`, {
                status: rec.status === 'published' ? 'draft' : 'published',
            });
            await refresh();
        } catch (_) {
            setError('Could not toggle publish status.');
        } finally {
            setBusyId(null);
        }
    };

    const remove = async (rec) => {
        if (!window.confirm('Are you sure you want to delete this content?')) return;
        setBusyId(rec.id);
        try {
            await api.delete(`/api/library_content/${rec.id}`);
            await refresh();
        } catch (_) {
            setError('Could not delete content.');
        } finally {
            setBusyId(null);
        }
    };

    if (loading) return <div className="py-8 text-center text-muted-foreground">Loading content...</div>;
    if (error) return <div className="py-8 text-center text-destructive">{error}</div>;

    return (
        <div className="space-y-4">
            {editing ? (
                <ContentForm editing={editing} onCancelEdit={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <h3 className="font-display text-lg font-medium text-foreground">Content Library</h3>
                        <button onClick={() => setEditing({ ...emptyContentForm })} className="btn btn-outline">
                            + New Content
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-3">Title</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Featured</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((rec) => (
                                    <ContentRow
                                        key={rec.id}
                                        rec={rec}
                                        onEdit={(r) => setEditing(r)}
                                        onToggleFeatured={toggleFeatured}
                                        onTogglePublish={togglePublish}
                                        onDelete={remove}
                                        busyId={busyId}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

/* ---------------- Podcast Components ---------------- */

const emptyPodcastForm = {
    title: '',
    content: '',
    audio_file: undefined,
    status: 'draft',
    duration: 0,
    episode_number: 1,
};

const PodcastForm = ({ editing, onCancelEdit, onSaved }) => {
    const [form, setForm] = useState(editing ? { ...editing } : emptyPodcastForm);
    const [fileObj, setFileObj] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setBusy(true);
        try {
            const fd = new FormData();
            if (fileObj) fd.append('audio_file', fileObj);
            fd.append('title', form.title.trim());
            fd.append('content', form.content);
            fd.append('status', form.status);
            fd.append('duration', form.duration.toString());
            fd.append('episode_number', form.episode_number.toString());

            if (editing && editing.id) {
                await api.putForm(`/api/podcast_episodes/${editing.id}`, fd);
                setSuccess('Podcast episode updated.');
            } else {
                await api.postForm('/api/podcast_episodes', fd);
                setSuccess('Podcast episode created.');
            }
            onSaved();
        } catch (err) {
            setError(err?.message || 'Save failed.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-medium text-foreground">
                    {editing?.id ? 'Edit Podcast Episode' : 'New Podcast Episode'}
                </h2>
                <button type="button" onClick={onCancelEdit} className="p-1 rounded-md hover:bg-accent">
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <input
                    type="text"
                    required
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Audio File (MP3)</label>
                <input
                    type="file"
                    accept="audio/mpeg"
                    className="block w-full text-sm text-muted-foreground"
                    onChange={(e) => setFileObj(e.target.files[0] ?? null)}
                />
            </div>

            <div className="flex justify-between">
                <button type="button" onClick={onCancelEdit} className="btn btn-outline">Cancel</button>
                <button type="submit" disabled={busy} className="btn">
                    {busy ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
                </button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-emerald-500">{success}</p>}
        </form>
    );
};

const PodcastRow = ({ rec, onEdit, onTogglePublish, onDelete, busyId }) => {
    const isBusy = busyId === rec.id;

    return (
        <tr className="border-b hover:bg-accent/50">
            <td className="p-3 text-sm font-medium text-foreground">{rec.title}</td>
            <td className="p-3 text-sm text-muted-foreground">#{rec.episode_number}</td>
            <td className="p-3 text-sm text-muted-foreground">{formatDate(rec.created)}</td>
            <td className="p-3 text-sm text-muted-foreground">{rec.status === 'published' ? 'Published' : 'Draft'}</td>
            <td className="p-3 text-center space-x-2">
                <button onClick={() => onEdit(rec)} disabled={isBusy} className="p-1 rounded-md hover:bg-accent">
                    <Pencil size={16} />
                </button>
                <button onClick={() => onTogglePublish(rec)} disabled={isBusy} className="p-1 rounded-md hover:bg-accent">
                    {rec.status === 'published' ? <Circle size={16} /> : <CheckCircle2 size={16} />}
                </button>
                <button onClick={() => onDelete(rec)} disabled={isBusy} className="p-1 rounded-md hover:bg-accent text-destructive">
                    <Trash2 size={16} />
                </button>
            </td>
        </tr>
    );
};

const PodcastManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(null);
    const [busyId, setBusyId] = useState(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const list = await api.get('/api/podcast_episodes');
            setItems(Array.isArray(list) ? list : []);
        } catch (err) {
            setError('Could not load podcast episodes.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const togglePublish = async (rec) => {
        setBusyId(rec.id);
        try {
            await api.put(`/api/podcast_episodes/${rec.id}`, {
                status: rec.status === 'published' ? 'draft' : 'published',
            });
            await refresh();
        } catch (_) {
            setError('Could not toggle publish status.');
        } finally {
            setBusyId(null);
        }
    };

    const remove = async (rec) => {
        if (!window.confirm('Are you sure you want to delete this episode?')) return;
        setBusyId(rec.id);
        try {
            await api.delete(`/api/podcast_episodes/${rec.id}`);
            await refresh();
        } catch (_) {
            setError('Could not delete episode.');
        } finally {
            setBusyId(null);
        }
    };

    if (loading) return <div className="py-8 text-center text-muted-foreground">Loading podcasts...</div>;
    if (error) return <div className="py-8 text-center text-destructive">{error}</div>;

    return (
        <div className="space-y-4">
            {editing ? (
                <PodcastForm editing={editing} onCancelEdit={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <h3 className="font-display text-lg font-medium text-foreground">Podcast Episodes</h3>
                        <button onClick={() => setEditing({ ...emptyPodcastForm })} className="btn btn-outline">
                            + New Episode
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-3">Title</th>
                                    <th className="p-3">Episode</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((rec) => (
                                    <PodcastRow
                                        key={rec.id}
                                        rec={rec}
                                        onEdit={(r) => setEditing(r)}
                                        onTogglePublish={togglePublish}
                                        onDelete={remove}
                                        busyId={busyId}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

/* ---------------- Founders Components ---------------- */

const emptyFounderForm = {
    name: '',
    credentials: '',
    title: '',
    bio: '',
    personal_mission: '',
    photo: undefined,
    photo_position: 'center',
    status: 'draft',
};

const FounderForm = ({ editing, onCancelEdit, onSaved }) => {
    const [form, setForm] = useState(editing ? { ...editing } : emptyFounderForm);
    const [fileObj, setFileObj] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setBusy(true);
        try {
            const fd = new FormData();
            if (fileObj) fd.append('photo', fileObj);
            fd.append('name', form.name.trim());
            fd.append('credentials', form.credentials.trim());
            fd.append('title', form.title.trim());
            fd.append('bio', form.bio.trim());
            fd.append('personal_mission', form.personal_mission.trim());
            fd.append('status', form.status);

            if (editing && editing.id) {
                await api.putForm(`/api/founders/${editing.id}`, fd);
                setSuccess('Founder updated.');
            } else {
                await api.postForm('/api/founders', fd);
                setSuccess('Founder created.');
            }
            onSaved();
        } catch (err) {
            setError(err?.message || 'Save failed.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-medium text-foreground">
                    {editing?.id ? 'Edit Founder' : 'New Founder'}
                </h2>
                <button type="button" onClick={onCancelEdit} className="p-1 rounded-md hover:bg-accent">
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name</label>
                <input
                    type="text"
                    required
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <input
                    type="text"
                    className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
            </div>

            <div className="flex justify-between">
                <button type="button" onClick={onCancelEdit} className="btn btn-outline">Cancel</button>
                <button type="submit" disabled={busy} className="btn">
                    {busy ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
                </button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-emerald-500">{success}</p>}
        </form>
    );
};

const FoundersManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(null);
    const [busyId, setBusyId] = useState(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const list = await api.get('/api/founders');
            setItems(Array.isArray(list) ? list : []);
        } catch (err) {
            setError('Could not load founders.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const togglePublish = async (rec) => {
        setBusyId(rec.id);
        try {
            await api.put(`/api/founders/${rec.id}`, {
                status: rec.status === 'published' ? 'draft' : 'published',
            });
            await refresh();
        } catch (_) {
            setError('Could not toggle publish status.');
        } finally {
            setBusyId(null);
        }
    };

    const remove = async (rec) => {
        if (!window.confirm('Are you sure you want to delete this founder?')) return;
        setBusyId(rec.id);
        try {
            await api.delete(`/api/founders/${rec.id}`);
            await refresh();
        } catch (_) {
            setError('Could not delete founder.');
        } finally {
            setBusyId(null);
        }
    };

    if (loading) return <div className="py-8 text-center text-muted-foreground">Loading founders...</div>;
    if (error) return <div className="py-8 text-center text-destructive">{error}</div>;

    return (
        <div className="space-y-4">
            {editing ? (
                <FounderForm editing={editing} onCancelEdit={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <h3 className="font-display text-lg font-medium text-foreground">Founders & Team</h3>
                        <button onClick={() => setEditing({ ...emptyFounderForm })} className="btn btn-outline">
                            + New Founder
                        </button>
                    </div>

                    <div className="space-y-3">
                        {items.map((rec) => (
                            <div key={rec.id} className="flex items-center justify-between p-4 border rounded-md">
                                <div>
                                    <h4 className="font-medium text-foreground">{rec.name}</h4>
                                    <p className="text-sm text-muted-foreground">{rec.title}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => setEditing(rec)} className="p-1 rounded-md hover:bg-accent">
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => togglePublish(rec)} className="p-1 rounded-md hover:bg-accent">
                                        {rec.status === 'published' ? <Circle size={16} /> : <CheckCircle2 size={16} />}
                                    </button>
                                    <button onClick={() => remove(rec)} className="p-1 rounded-md hover:bg-accent text-destructive">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

/* ---------------- Main Admin Dashboard ---------------- */

const AdminDashboard = ({ onLogout }) => {
    const [section, setSection] = useState('hero');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(null);
    const [busyId, setBusyId] = useState(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const list = await api.get('/api/hero_media');
            setItems(Array.isArray(list) ? list : []);
        } catch (err) {
            setError('Could not load hero media.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const liveItem = useMemo(() => items.find((r) => r.status === 'published'), [items]);

    const publish = async (rec) => {
        setBusyId(rec.id);
        try {
            await Promise.all(
                items
                    .filter((r) => r.id !== rec.id && r.status === 'published')
                    .map((r) => api.put(`/api/hero_media/${r.id}`, { status: 'draft' }))
            );
            await api.put(`/api/hero_media/${rec.id}`, {
                status: 'published',
                published_at: new Date().toISOString(),
            });
            await refresh();
        } catch (_) {
            setError('Could not publish.');
        } finally {
            setBusyId(null);
        }
    };

    const unpublish = async (rec) => {
        setBusyId(rec.id);
        try {
            await api.put(`/api/hero_media/${rec.id}`, { status: 'draft' });
            await refresh();
        } catch (_) {
            setError('Could not unpublish.');
        } finally {
            setBusyId(null);
        }
    };

    const remove = async (rec) => {
        if (!window.confirm('Are you sure you want to delete this hero item?')) return;
        setBusyId(rec.id);
        try {
            await api.delete(`/api/hero_media/${rec.id}`);
            await refresh();
        } catch (_) {
            setError('Could not delete hero media.');
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
                <div>
                    <h1 className="font-display text-2xl font-semibold text-foreground">Admin Dashboard</h1>
                    {liveItem && (
                        <p className="text-xs text-emerald-500 mt-1">LIVE HERO: {liveItem.headline}</p>
                    )}
                </div>
                <button onClick={onLogout} className="btn btn-outline flex items-center space-x-2">
                    <LogOut size={16} />
                    <span>Log Out</span>
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2 border-b pb-2">
                <button
                    onClick={() => { setSection('hero'); setEditing(null); }}
                    className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        section === 'hero' ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Hero Media
                </button>
                <button
                    onClick={() => { setSection('content'); setEditing(null); }}
                    className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        section === 'content' ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Content Library
                </button>
                <button
                    onClick={() => { setSection('podcast'); setEditing(null); }}
                    className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        section === 'podcast' ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Podcasts
                </button>
                <button
                    onClick={() => { setSection('founders'); setEditing(null); }}
                    className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        section === 'founders' ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Founders & Team
                </button>
            </div>

            {/* Active Section */}
            <div className="mt-6">
                {section === 'hero' && (
                    <>
                        {loading ? (
                            <div className="py-8 text-center text-muted-foreground">Loading hero media...</div>
                        ) : error ? (
                            <div className="py-8 text-center text-destructive">{error}</div>
                        ) : editing ? (
                            <MediaForm editing={editing} onCancelEdit={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-display text-lg font-medium text-foreground">Hero Media Items</h3>
                                    <button onClick={() => setEditing({ ...emptyForm })} className="btn btn-outline">
                                        + New Hero Media
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {items.map((rec) => (
                                        <MediaCard
                                            key={rec.id}
                                            rec={rec}
                                            isLive={rec.id === liveItem?.id}
                                            onEdit={(r) => setEditing(r)}
                                            onPublish={publish}
                                            onUnpublish={unpublish}
                                            onDelete={remove}
                                            busyId={busyId}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
                {section === 'content' && <ContentManager />}
                {section === 'podcast' && <PodcastManager />}
                {section === 'founders' && <FoundersManager />}
            </div>
        </div>
    );
};

/* ---------------- Main Page Component (Export) ---------------- */

const AdminPage = () => {
    const [authed, setAuthed] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/api/auth/status');
                if (res && res.authed) {
                    setAuthed(true);
                } else {
                    setAuthed(false);
                }
            } catch (_) {
                setAuthed(false);
            } finally {
                setChecked(true);
            }
        };

        checkAuth();
    }, []);

    if (!checked) return null;
    if (!authed) return <AdminLogin />;
    return <AdminDashboard onLogout={() => setAuthed(false)} />;
};

export default AdminPage;