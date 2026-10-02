import React, { useState, useEffect } from 'react';
import { Save, Upload, Trash2, ArrowUp, ArrowDown, CheckCircle, AlertCircle } from 'lucide-react';

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

interface HeroSlide {
  id: number;
  image_url: string;
  sort_order: number;
  display_duration_ms: number;
  overlay_opacity: number;
  overlay_color: string;
  object_position: string;
  ken_burns_mode: string;
  zoom_scale: number;
  active: number;
}

export const HeroAdmin: React.FC = () => {
  const [copy, setCopy] = useState<HeroCopyState>({
    eyebrow_tag: 'CONCIERGE HEALTH COACHING · CANCER SURVIVORS · AUSTIN, TX',
    headline_prefix: 'Live Beyond',
    headline_italic: 'the Prognosis.',
    subheadline: 'For high-achievers who have cleared active treatment and refuse to wait.',
    headline_color: '#ffffff',
    italic_color: '#dc2626',
    subheadline_color: '#3b82f6',
    text_shadow_enabled: true,
  });

  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/hero');
      if (res.ok) {
        const data = await res.json() as { copy?: any; slides?: HeroSlide[] };
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
        if (data.slides) {
          setSlides(data.slides);
        }
      }
    } catch (err) {
      showToast('error', 'Failed to load Hero settings from edge');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/hero_copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copy),
      });

      if (!res.ok) throw new Error('Failed to save hero copy');

      const data = await res.json() as { success?: boolean; copy?: any };
      if (data.copy) {
        setCopy({
          eyebrow_tag: data.copy.eyebrow_tag,
          headline_prefix: data.copy.headline_prefix,
          headline_italic: data.copy.headline_italic,
          subheadline: data.copy.subheadline,
          headline_color: data.copy.headline_color,
          italic_color: data.copy.italic_color,
          subheadline_color: data.copy.subheadline_color,
          text_shadow_enabled: data.copy.text_shadow_enabled === 1 || data.copy.text_shadow_enabled === true,
        });
      }

      showToast('success', 'Hero Copy & Settings saved successfully.');
    } catch (err: any) {
      showToast('error', err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-8 text-center text-slate-400">
        Loading Hero CMS configuration...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {toast && (
        <div
          className={`p-4 rounded-lg flex items-center space-x-3 text-sm border ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Hero Copy Settings */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-bold text-slate-100">Hero Copy Settings & Typography Formatting</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Eyebrow Tag</label>
            <input
              type="text"
              value={copy.eyebrow_tag}
              onChange={(e) => setCopy({ ...copy, eyebrow_tag: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Headline Prefix</label>
              <input
                type="text"
                value={copy.headline_prefix}
                onChange={(e) => setCopy({ ...copy, headline_prefix: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Headline Italic Accent</label>
              <input
                type="text"
                value={copy.headline_italic}
                onChange={(e) => setCopy({ ...copy, headline_italic: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Subheadline Body</label>
            <textarea
              rows={3}
              value={copy.subheadline}
              onChange={(e) => setCopy({ ...copy, subheadline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Headline Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={copy.headline_color}
                  onChange={(e) => setCopy({ ...copy, headline_color: e.target.value })}
                  className="w-10 h-10 rounded border border-slate-800 bg-slate-950 cursor-pointer"
                />
                <input
                  type="text"
                  value={copy.headline_color}
                  onChange={(e) => setCopy({ ...copy, headline_color: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Italic Accent Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={copy.italic_color}
                  onChange={(e) => setCopy({ ...copy, italic_color: e.target.value })}
                  className="w-10 h-10 rounded border border-slate-800 bg-slate-950 cursor-pointer"
                />
                <input
                  type="text"
                  value={copy.italic_color}
                  onChange={(e) => setCopy({ ...copy, italic_color: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Subheadline Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={copy.subheadline_color}
                  onChange={(e) => setCopy({ ...copy, subheadline_color: e.target.value })}
                  className="w-10 h-10 rounded border border-slate-800 bg-slate-950 cursor-pointer"
                />
                <input
                  type="text"
                  value={copy.subheadline_color}
                  onChange={(e) => setCopy({ ...copy, subheadline_color: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 uppercase"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="contrast_drop_shadow"
              checked={copy.text_shadow_enabled}
              onChange={(e) => setCopy({ ...copy, text_shadow_enabled: e.target.checked })}
              className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500/20"
            />
            <label htmlFor="contrast_drop_shadow" className="text-xs text-slate-300">
              Contrast Drop-Shadow Effect
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Hero Settings'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HeroAdmin;