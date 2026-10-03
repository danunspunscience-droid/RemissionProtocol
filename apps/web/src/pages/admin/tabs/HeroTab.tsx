import React from 'react';
import { HeroCopyRecord, HeroMediaRecord } from '../../../types/admin';

interface HeroTabProps {
copy: HeroCopyRecord | null;
media: HeroMediaRecord[];
onRefresh: () => void;
}

export const HeroTab: React.FC<HeroTabProps> = ({ copy, media }) => {
return (
<div className="space-y-6">
  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
    <h3 className="text-xl font-semibold text-slate-100 mb-4">Hero Copy Management (D1 Singleton)</h3>
    {copy ? (
      <div className="space-y-3 text-sm text-slate-300">
        <div><span className="text-slate-500 font-mono">Badge:</span> {copy.badge_text}</div>
        <div><span className="text-slate-500 font-mono">Headline:</span> {copy.headline}</div>
        <div><span className="text-slate-500 font-mono">Subheadline:</span> {copy.subheadline}</div>
      </div>
    ) : (
      <div className="text-slate-500 text-sm">No hero copy loaded.</div>
    )}
  </div>

  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
    <h3 className="text-xl font-semibold text-slate-100 mb-4">Hero Visual Assets ({media.length})</h3>
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
