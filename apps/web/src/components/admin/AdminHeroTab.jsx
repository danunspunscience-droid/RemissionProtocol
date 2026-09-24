import React, { useState, useEffect } from 'react';

export function AdminHeroTab() {
  const [copy, setCopy] = useState({
    eyebrow: '', headline_prefix: '', headline_italic: '', subheadline: '',
    primary_cta_text: '', primary_cta_url: '', secondary_cta_text: '', secondary_cta_url: '', bottom_tagline: ''
  });
  const [asset, setAsset] = useState({ asset_url: '', poster_url: '', media_type: 'video', overlay_opacity: 60 });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/hero').then(r => r.json()).then(data => {
      if (data.copy) setCopy(data.copy);
      if (data.asset) setAsset(data.asset);
    }).catch(console.error);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ copy, asset })
      });
      setMsg(res.ok ? 'Hero settings updated successfully.' : 'Failed to save hero settings.');
    } catch (err) {
      setMsg('Error saving hero settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-slate-200">
      {msg && <div className="p-3 bg-teal-500/10 border border-teal-500/30 text-teal-300 rounded text-sm">{msg}</div>}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white">Hero Copy Settings</h3>
        <input className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm" placeholder="Eyebrow Tag" value={copy.eyebrow || ''} onChange={e => setCopy({...copy, eyebrow: e.target.value})} />
        <div className="grid grid-cols-2 gap-4">
          <input className="bg-slate-950 border border-slate-800 p-2 rounded text-sm" placeholder="Headline Prefix (e.g. Live Beyond)" value={copy.headline_prefix || ''} onChange={e => setCopy({...copy, headline_prefix: e.target.value})} />
          <input className="bg-slate-950 border border-slate-800 p-2 rounded text-sm" placeholder="Headline Italic (e.g. the Prognosis.)" value={copy.headline_italic || ''} onChange={e => setCopy({...copy, headline_italic: e.target.value})} />
        </div>
        <textarea className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm h-20" placeholder="Subheadline" value={copy.subheadline || ''} onChange={e => setCopy({...copy, subheadline: e.target.value})} />
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white">Background Asset & Overlay</h3>
        <input className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm" placeholder="Video MP4 Asset URL" value={asset.asset_url || ''} onChange={e => setAsset({...asset, asset_url: e.target.value})} />
        <input className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm" placeholder="Poster Fallback Image URL" value={asset.poster_url || ''} onChange={e => setAsset({...asset, poster_url: e.target.value})} />
        <div>
          <label className="text-xs text-slate-400 block mb-1">Vignette Overlay Opacity ({asset.overlay_opacity}%)</label>
          <input type="range" min="0" max="100" className="w-full" value={asset.overlay_opacity ?? 60} onChange={e => setAsset({...asset, overlay_opacity: parseInt(e.target.value)})} />
        </div>
      </div>

      <button type="submit" disabled={saving} className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded text-sm">
        {saving ? 'Saving...' : 'Save Hero Settings'}
      </button>
    </form>
  );
}