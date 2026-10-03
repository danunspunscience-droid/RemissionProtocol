import React, { useState, useEffect } from 'react';
import { HeroCopyRecord, HeroMediaRecord } from '../../../types/admin';

interface HeroTabProps {
  copy: HeroCopyRecord | null;
  media: HeroMediaRecord[];
  onRefresh: () => void;
}

export const HeroTab: React.FC<HeroTabProps> = ({ copy, media, onRefresh }) => {
  const [formData, setFormData] = useState<Partial<HeroCopyRecord>>({});
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (copy) {
      setFormData(copy);
    }
  }, [copy]);

  const handleCopySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/hero_copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = (await res.json()) as { success: boolean; error?: string };
      if (res.ok && result.success) {
        setStatusMsg('Hero copy saved successfully (canonical record id = 1).');
        onRefresh();
      } else {
        setStatusMsg(`Error: ${result.error || 'Failed to save hero copy'}`);
      }
    } catch (err: any) {
      setStatusMsg(`Network error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCopySubmit} className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-100">Hero Copy Editor</h3>
            <p className="text-xs text-slate-400 mt-0.5">Atomic D1 SQLite Singleton Target (id = 1)</p>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-medium text-sm rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {statusMsg && (
          <div className={`p-3 rounded-lg text-xs ${statusMsg.startsWith('Error') || statusMsg.startsWith('Network') ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'}`}>
            {statusMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Badge Text</label>
            <input
              type="text"
              value={formData.badge_text || ''}
              onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Headline</label>
            <input
              type="text"
              value={formData.headline || ''}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Subheadline</label>
          <textarea
            rows={3}
            value={formData.subheadline || ''}
            onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Primary CTA Label</label>
            <input
              type="text"
              value={formData.cta_primary_text || ''}
              onChange={(e) => setFormData({ ...formData, cta_primary_text: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Primary CTA URL</label>
            <input
              type="text"
              value={formData.cta_primary_url || ''}
              onChange={(e) => setFormData({ ...formData, cta_primary_url: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </form>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Hero Visual Media ({media.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {media.map((m) => (
            <div key={m.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
              <div className="font-medium text-slate-200">{m.title}</div>
              <div className="text-xs text-slate-500">Type: {m.media_type} | Opacity: {m.overlay_opacity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
