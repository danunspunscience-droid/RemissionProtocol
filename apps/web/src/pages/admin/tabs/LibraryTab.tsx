import React from 'react';
import { LibraryContentRecord } from '../../../types/admin';

interface LibraryTabProps {
items: LibraryContentRecord[];
onRefresh: () => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({ items }) => {
return (
<div className="space-y-6">
  <h3 className="text-xl font-semibold text-slate-100">Content Library Management ({items.length})</h3>
  <div className="space-y-4">
    {items.map((item) => (
      <div key={item.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
        <div>
          <div className="font-medium text-slate-200">{item.title}</div>
          <div className="text-xs text-slate-500">{item.content_type} {item.embed_type && `(${item.embed_type})`}</div>
        </div>
        <span className={`px-2 py-1 text-xs rounded ${item.published ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
          {item.published ? 'Published' : 'Draft'}
        </span>
      </div>
    ))}
  </div>
</div>
);
};
