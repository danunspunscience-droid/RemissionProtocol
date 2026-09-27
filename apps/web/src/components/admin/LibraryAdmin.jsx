import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Plus, Play } from 'lucide-react';
import { compressImage } from '../../lib/imageCompression';

export default function LibraryAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', category: 'Metabolic Medicine', description: '', video_url: '', custom_cover_url: '' });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/library', { credentials: 'include' });
      if (res.ok) setItems(await res.json());
    } catch (e) { console.error('Failed to load library items', e); }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 1280, maxHeight: 720, quality: 0.85 });
      const imageBlob = compressed instanceof Blob ? compressed : (compressed.blob || compressed.file || compressed);
      const filename = `cover-${Date.now()}.webp`;

      const res = await fetch(`/api/files/public/covers/${filename}`, {
        method: 'POST',
        body: imageBlob,
        headers: { 'Content-Type': 'image/webp' },
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setForm({ ...form, custom_cover_url: data.url || `/api/files/public/covers/${filename}` });
        setMsg('Custom cover uploaded successfully.');
      }
    } catch (err) { setMsg('Cover upload failed: ' + err.message); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include'
      });
      if (res.ok) {
        setForm({ title: '', category: 'Metabolic Medicine', description: '', video_url: '', custom_cover_url: '' });
        setMsg('Library item published.');
        fetchItems();
      }
    } catch (err) { setMsg('Failed to publish item.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/library?id=${id}`, { method: 'DELETE', credentials: 'include' });
    fetchItems();
  };

  return (
    <div className="space-y-8 text-foreground">
      <form onSubmit={handleSubmit} className="rounded-sm border border-border bg-card p-6 space-y-4">
        <h3 className="font-display text-xl font-medium text-primary">Add Video Lecture / Clinical Breakdown</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="rounded-sm border px-3 py-2 text-sm bg-background text-foreground" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-sm border px-3 py-2 text-sm bg-background text-foreground">
            <option value="Metabolic Medicine">Metabolic Medicine</option>
            <option value="Survivorship Protocols">Survivorship Protocols</option>
            <option value="Clinical Lecture">Clinical Lecture</option>
          </select>
        </div>
        <input type="url" placeholder="YouTube or Vimeo Embed URL" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="w-full rounded-sm border px-3 py-2 text-sm bg-background text-foreground" />
        <textarea rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-sm border px-3 py-2 text-sm bg-background text-foreground" />

        <div className="flex items-center justify-between pt-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-input bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted">
            <Upload size={14} /> {uploading ? 'Uploading Cover...' : form.custom_cover_url ? 'Change Cover Override' : 'Upload Cover Override (WebP)'}
            <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading} className="hidden" />
          </label>
          <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Plus size={16} /> {submitting ? 'Publishing...' : 'Publish to Library'}
          </button>
        </div>
        {msg && <p className="text-xs font-semibold text-brass">{msg}</p>}
      </form>

      <div className="rounded-sm border border-border bg-card p-6">
        <h3 className="font-display text-xl font-medium text-primary">Published Library Content ({items.length})</h3>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-sm border p-4 bg-background">
              <div className="flex items-center gap-4">
                {item.custom_cover_url ? (
                  <img src={item.custom_cover_url} alt="" className="h-12 w-20 rounded-sm object-cover" />
                ) : (
                  <div className="flex h-12 w-20 items-center justify-center rounded-sm bg-muted text-muted-foreground"><Play size={20} /></div>
                )}
                <div>
                  <span className="text-[10px] uppercase font-semibold text-brass">{item.category}</span>
                  <h4 className="font-medium text-sm text-foreground">{item.title}</h4>
                </div>
              </div>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-destructive hover:opacity-80"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
