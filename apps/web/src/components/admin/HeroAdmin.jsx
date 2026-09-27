import React, { useState, useEffect } from 'react';
import { Upload, Trash2, ArrowUp, ArrowDown, Save, ImageOff } from 'lucide-react';
import { compressImage } from '../../lib/imageCompression';

export default function HeroAdmin() {
  const [copy, setCopy] = useState({ eyebrow_tag: '', headline_prefix: '', headline_italic: '', subheadline: '', cta_label: '', cta_link: '' });
  const [slides, setSlides] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [failedPreviews, setFailedPreviews] = useState(new Set());

  useEffect(() => { fetchHeroData(); }, []);

  const fetchHeroData = async () => {
    try {
      const res = await fetch('/api/hero', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.copy) setCopy(data.copy);
        if (data.slides) setSlides(data.slides);
      }
    } catch (e) { console.error('Failed to load hero settings', e); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || slides.length >= 10) return;
    setUploading(true);
    setMsg('');
    try {
      const compressedResult = await compressImage(file, { maxWidth: 1920, maxHeight: 1920, quality: 0.82 });
      const imageBlob = compressedResult instanceof Blob ? compressedResult : (compressedResult?.blob || compressedResult?.file || compressedResult);
      const filename = `hero-${Date.now()}.webp`;
      const uploadRes = await fetch(`/api/files/public/hero/${filename}`, {
        method: 'POST',
        body: imageBlob,
        headers: { 'Content-Type': 'image/webp' },
        credentials: 'include'
      });
      if (uploadRes.ok) {
        const data = await uploadRes.json();
        const newSlide = {
          id: 'temp-' + Date.now(),
          image_url: data.url || `/api/files/public/hero/${filename}`,
          sort_order: slides.length,
          display_duration_ms: 6000,
          transition_speed_ms: 1200,
          overlay_opacity: 60,
          object_position: 'center 30%',
          ken_burns_mode: 'zoom-in',
          zoom_scale: 1.08,
          active: 1
        };
        setSlides([...slides, newSlide]);
        setMsg(`Uploaded successfully (${data.size || imageBlob.size || 0} bytes).`);
      }
    } catch (err) { setMsg('Upload failed: ' + err.message); }
    finally { setUploading(false); }
  };

  const updateSlide = (index, field, val) => {
    const updated = [...slides];
    updated[index][field] = val;
    setSlides(updated);
  };

  const moveSlide = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= slides.length) return;
    const updated = [...slides];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    updated.forEach((s, i) => (s.sort_order = i));
    setSlides(updated);
  };

  const deleteSlide = async (index, id) => {
    if (typeof id === 'number') {
      await fetch(`/api/hero_slides?id=${id}`, { method: 'DELETE', credentials: 'include' });
    }
    setSlides(slides.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMsg('');
    try {
      await fetch('/api/hero_copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copy),
        credentials: 'include'
      });

      for (const s of slides) {
        if (typeof s.id === 'string' && s.id.startsWith('temp-')) {
          await fetch('/api/hero_slides', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(s),
            credentials: 'include'
          });
        }
      }

      await fetch('/api/hero_slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides }),
        credentials: 'include'
      });

      setMsg('Hero Copy & Carousel Settings saved.');
      fetchHeroData();
    } catch (err) { setMsg('Failed to save settings.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-8 text-foreground">
      <div className="rounded-sm border border-border bg-card p-6">
        <h3 className="font-display text-xl font-medium text-primary">Hero Copy Settings</h3>
        <div className="mt-4 grid gap-4">
          <input type="text" placeholder="Eyebrow Tag" value={copy.eyebrow_tag || ''} onChange={(e) => setCopy({...copy, eyebrow_tag: e.target.value })} className="rounded-sm border px-3 py-2 text-sm bg-background text-foreground" />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Headline Prefix" value={copy.headline_prefix || ''} onChange={(e) => setCopy({...copy, headline_prefix: e.target.value })} className="rounded-sm border px-3 py-2 text-sm bg-background text-foreground" />
            <input type="text" placeholder="Headline Italic" value={copy.headline_italic || ''} onChange={(e) => setCopy({...copy, headline_italic: e.target.value })} className="rounded-sm border px-3 py-2 text-sm bg-background text-foreground" />
          </div>
          <textarea rows={3} placeholder="Subheadline" value={copy.subheadline || ''} onChange={(e) => setCopy({...copy, subheadline: e.target.value })} className="rounded-sm border px-3 py-2 text-sm bg-background text-foreground" />
        </div>
      </div>

      <div className="rounded-sm border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-medium text-primary">Hero Carousel Images ({slides.length}/10)</h3>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm bg-brass px-4 py-2 text-sm font-semibold text-white hover:bg-accent">
            <Upload size={16} /> {uploading ? 'Compressing.' : 'Upload Image (Auto WebP)'}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading || slides.length >= 10} className="hidden" />
          </label>
        </div>

        <div className="mt-6 space-y-4">
          {slides.map((slide, idx) => (
            <div key={slide.id || idx} className="flex flex-col gap-4 rounded-sm border border-border bg-background p-4 md:flex-row md:items-center">
              {failedPreviews.has(slide.image_url) ? (
                <div className="flex h-16 w-24 items-center justify-center rounded-sm bg-muted text-muted-foreground"><ImageOff size={20} /></div>
              ) : (
                <img src={slide.image_url} alt="Preview" className="h-16 w-24 rounded-sm object-cover" onError={() => setFailedPreviews((prev) => new Set(prev).add(slide.image_url))} />
              )}
              <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-6">
                <div>
                  <label className="text-[10px] uppercase text-muted-foreground">Display (ms)</label>
                  <input type="number" value={slide.display_duration_ms} onChange={(e) => updateSlide(idx, 'display_duration_ms', Number(e.target.value))} className="w-full rounded-sm border px-2 py-1 text-sm bg-background text-foreground" />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-muted-foreground">Position</label>
                  <input type="text" value={slide.object_position} onChange={(e) => updateSlide(idx, 'object_position', e.target.value)} className="w-full rounded-sm border px-2 py-1 text-sm bg-background text-foreground" />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-muted-foreground">Ken Burns</label>
                  <select value={slide.ken_burns_mode || 'zoom-in'} onChange={(e) => updateSlide(idx, 'ken_burns_mode', e.target.value)} className="w-full rounded-sm border px-2 py-1 text-sm bg-background text-foreground">
                    <option value="zoom-in">Zoom In</option>
                    <option value="zoom-out">Zoom Out</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase text-muted-foreground">Zoom ({slide.zoom_scale || 1.08}x)</label>
                  <input type="range" min="1.02" max="1.30" step="0.01" value={slide.zoom_scale || 1.08} onChange={(e) => updateSlide(idx, 'zoom_scale', Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-muted-foreground">Opacity ({slide.overlay_opacity}%)</label>
                  <input type="range" min="0" max="100" value={slide.overlay_opacity} onChange={(e) => updateSlide(idx, 'overlay_opacity', Number(e.target.value))} className="w-full" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => moveSlide(idx, -1)} disabled={idx === 0} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"><ArrowUp size={16} /></button>
                <button onClick={() => moveSlide(idx, 1)} disabled={idx === slides.length - 1} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"><ArrowDown size={16} /></button>
                <button onClick={() => deleteSlide(idx, slide.id)} className="p-1 text-destructive hover:opacity-80"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        {msg && <p className="text-sm font-semibold text-primary">{msg}</p>}
        <button onClick={handleSaveAll} disabled={saving} className="ml-auto inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Save size={16} /> {saving ? 'Saving.' : 'Save All Hero Settings'}
        </button>
      </div>
    </div>
  );
}