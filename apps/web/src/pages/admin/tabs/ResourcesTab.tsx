import React from 'react';
import { ResourceRecord } from '../../../types/admin';

interface ResourcesTabProps {
resources: ResourceRecord[];
onRefresh: () => void;
}

export const ResourcesTab: React.FC<ResourcesTabProps> = ({ resources }) => {
return (
<div className="space-y-6">
  <h3 className="text-xl font-semibold text-slate-100">Public Downloadable Resources ({resources.length})</h3>
  <div className="space-y-4">
    {resources.map((res) => (
      <div key={res.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
        <div>
          <div className="font-medium text-slate-200">{res.title}</div>
          <div className="text-xs text-slate-500">Downloads: {res.download_count} | Key: {res.r2_key}</div>
        </div>
        <span className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-400">Public Asset</span>
      </div>
    ))}
  </div>
</div>
);
};
