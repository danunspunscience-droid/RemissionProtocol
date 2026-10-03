import React from 'react';
import { FounderRecord } from '../../../types/admin';

interface FoundersTabProps {
founders: FounderRecord[];
onRefresh: () => void;
}

export const FoundersTab: React.FC<FoundersTabProps> = ({ founders }) => {
return (
<div className="space-y-6">
  <h3 className="text-xl font-semibold text-slate-100">Founders & Leadership Bios ({founders.length})</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {founders.map((f) => (
      <div key={f.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="font-medium text-slate-200">{f.name}</div>
        <div className="text-xs text-slate-500">{f.title}</div>
      </div>
    ))}
  </div>
</div>
);
};
