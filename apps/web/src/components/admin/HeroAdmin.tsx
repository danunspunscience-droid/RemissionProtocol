import React, { useState, useEffect } from 'react';

interface HeroCopyState {
  eyebrow_tag: string;
  headline_prefix: string;
  headline_italic: string;
  subheadline: string;
  headline_color: string;
  italic_color: string;
  subheadline_color: string;
  text_shadow_enabled: boolean;
}

interface HeroSlideState {
  id: string;
  image_url: string;
  sort_order: number;
  display_duration_ms: number;
  transition_speed_ms: number;
  overlay_opacity: number;
  overlay_color: string;
  object_position: string;
  active: number;
  ken_burns_mode: string;
  zoom_scale: number;
}

interface HeroAdminApiResponse {
  copy?: Omit<Partial<HeroCopyState>, 'text_shadow_enabled'> & { text_shadow_enabled?: number | boolean };
  slides?: Array<Partial<HeroSlideState> & { url?: string }>;
}

interface ApiErrorResponse {
  error?: string;
  success?: boolean;
}

export const HeroAdmin: React.FC = () => {
  const [copy, setCopy] = useState<HeroCopyState>({
    eyebrow_tag: '',
    headline_prefix: '',
    headline_italic: '',
    subheadline: '',
    headline_color: '#ffffff',
    italic_color: '#dc2626',
    subheadline_color: '#3b82f6',
    text_shadow_enabled: true,
  });

  const [slides, setSlides] = useState<HeroSlideState[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    try {
      const res = await fetch('/api/hero');
      if (!res.ok) throw new Error('Failed to fetch hero settings');
      const data = (await res.json()) as HeroAdminApiResponse;
      if (data.copy) {
        setCopy({
          eyebrow_tag: data.copy.eyebrow_tag || '',
          headline_prefix: data.copy.headline_prefix || '',
          headline_italic: data.copy.headline_italic || '',
          subheadline: data.copy.subheadline || '',
          headline_color: data.copy.headline_color || '#ffffff',
          italic_color: data.copy.italic_color || '#dc2626',
          subheadline_color: data.copy.subheadline_color || '#3b82f6',
          text_shadow_enabled: data.copy.text_shadow_enabled === 1 || data.copy.text_shadow_enabled === true,
        });
      }
      if (Array.isArray(data.slides)) {
        setSlides(
          data.slides.map((s: any) => ({
            id: String(s.id),
            image_url: s.image_url || s.url || '',
            sort_order: s.sort_order ?? 1,
            display_duration_ms: s.display_duration_ms ?? 6000,
            transition_speed_ms: s.transition_speed_ms ?? 1200,
            overlay_opacity: s.overlay_opacity ?? 60,
            overlay_color: s.overlay_color || '#022C22',
            object_position: s.object_position || 'center 30%',
            active: s.active ?? 1,
            ken_burns_mode: s.ken_burns_mode || 'Zoom In',
            zoom_scale: s.zoom_scale ?? 1.08,
          }))
        );
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error loading settings' });
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/hero_slides', {
        method: 'POST',
        body: formData,
      });

      const data = (await res.json()) as ApiErrorResponse;
      if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');

      setStatusMessage({ type: 'success', text: 'Hero image uploaded successfully.' });
      loadAdminData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Upload failed' });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSaveChanges() {
    setStatusMessage(null);
    try {
      const copyRes = await fetch('/api/hero_copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copy),
      });

      if (!copyRes.ok) {
        const errData = (await copyRes.json()) as ApiErrorResponse;
        throw new Error(`Failed to save copy: ${errData.error || copyRes.statusText}`);
      }

      const slidesRes = await fetch('/api/hero_slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slides),
      });

      if (!slidesRes.ok) {
        const errData = (await slidesRes.json()) as ApiErrorResponse;
        throw new Error(`Failed to save slides: ${errData.error || slidesRes.statusText}`);
      }

      setStatusMessage({ type: 'success', text: 'Hero section settings saved successfully.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: `Save failed: ${err.message}` });
    }
  }

  function updateSlide(index: number, field: keyof HeroSlideState, value: any) {
    const updated = [...slides];
    const current = updated[index];
    if (current) {
      updated[index] = { ...current, [field]: value } as HeroSlideState;
      setSlides(updated);
    }
  }

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-serif font-bold text-stone-900">Hero Section Settings</h2>

      {statusMessage && (
        <div
          className={`p-4 rounded border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Copy Settings Form */}
      <div className="bg-white p-6 rounded border border-stone-200 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Eyebrow Tag</label>
          <input
            type="text"
            className="w-full border p-2 rounded text-sm"
            value={copy.eyebrow_tag}
            onChange={(e) => setCopy({ ...copy, eyebrow_tag: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Headline Prefix</label>
            <input
              type="text"
              className="w-full border p-2 rounded text-sm"
              value={copy.headline_prefix}
              onChange={(e) => setCopy({ ...copy, headline_prefix: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Headline Italic</label>
            <input
              type="text"
              className="w-full border p-2 rounded text-sm"
              value={copy.headline_italic}
              onChange={(e) => setCopy({ ...copy, headline_italic: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Subheadline</label>
          <textarea
            className="w-full border p-2 rounded text-sm"
            rows={3}
            value={copy.subheadline}
            onChange={(e) => setCopy({ ...copy, subheadline: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Headline Color</label>
            <input
              type="text"
              className="w-full border p-2 rounded text-sm"
              value={copy.headline_color}
              onChange={(e) => setCopy({ ...copy, headline_color: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Italic Color</label>
            <input
              type="text"
              className="w-full border p-2 rounded text-sm"
              value={copy.italic_color}
              onChange={(e) => setCopy({ ...copy, italic_color: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Slide Carousel Settings Form */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-stone-900">Hero Slides</h3>
        {slides.map((slide, idx) => (
          <div key={slide.id} className="bg-white p-6 rounded border border-stone-200 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">Slide {idx + 1}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Image URL</label>
              <input
                type="text"
                className="w-full border p-2 rounded text-sm bg-stone-50"
                value={slide.image_url}
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Display Duration (ms)</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded text-sm"
                  value={slide.display_duration_ms}
                  onChange={(e) => updateSlide(idx, 'display_duration_ms', parseInt(e.target.value) || 6000)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Transition Speed (ms)</label>
                <input
                  type="number"
                  className="w-full border p-2 rounded text-sm"
                  value={slide.transition_speed_ms}
                  onChange={(e) => updateSlide(idx, 'transition_speed_ms', parseInt(e.target.value) || 1200)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Overlay Opacity (%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full"
                  value={slide.overlay_opacity}
                  onChange={(e) => updateSlide(idx, 'overlay_opacity', parseInt(e.target.value) || 60)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-600 mb-1">Overlay Color</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded text-sm"
                  value={slide.overlay_color}
                  onChange={(e) => updateSlide(idx, 'overlay_color', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`active-${slide.id}`}
                checked={slide.active === 1}
                onChange={(e) => updateSlide(idx, 'active', e.target.checked ? 1 : 0)}
              />
              <label htmlFor={`active-${slide.id}`} className="text-sm font-medium text-stone-700">
                Active
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Upload Card */}
      <div className="bg-white p-6 rounded border border-stone-200">
        <h4 className="font-serif font-bold text-lg mb-2">Hero Slide Upload</h4>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveChanges}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default HeroAdmin;