import React, { useState } from 'react';
import { ResourceRecord } from '../../../types/admin';

interface ResourcesTabProps {
  resources: ResourceRecord[];
  onRefresh: () => void;
}

export const ResourcesTab: React.FC<ResourcesTabProps> = ({ resources, onRefresh }) => {
  const [editingResource, setEditingResource] = useState<Partial<ResourceRecord> | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource?.title || !editingResource?.r2_key) return;
    setSaving(true);
    setStatusMsg(null);
    try {
      const isNew = !editingResource.id;
      const url = isNew ? '/api/resources' : `/api/resources/${editingResource.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingResource),
      });
      const result = (await res.json()) as { success: boolean; error?: string };
      if (res.ok && result.success) {
        setStatusMsg(`Resource ${isNew ? 'created' : 'updated'} successfully.`);
        setEditingResource(null);
        onRefresh();
      } else {
        setStatusMsg(`Error: ${result.error || 'Failed to save resource'}`);
      }
    } catch (err: any) {
      setStatusMsg(`Network error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (resource: ResourceRecord, field: 'published' | 'members_only') => {
    try {
      const res = await fetch(`/api/resources/${resource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !resource[field] }),
      });
      if (res.ok) onRefresh();
    } catch (err) {
      console.error('Failed to update resource status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Public Downloadable Resources</h3>
          <p className="text-xs text-slate-400 mt-0.5">Non-Lead Magnet PDF guides, protocols, and medical documents</p>
        </div>
        <button
          onClick={() => setEditingResource({ category: 'Protocol', published: true, members_only: false })}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg transition"
        >
          + Add Resource
        </button>
      </div>

      {statusMsg && (
        <div className={`p-3 rounded-lg text-xs ${statusMsg.startsWith('Error') ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'}`}>
          {statusMsg}
        </div>
      )}

      {editingResource && (
        <form onSubmit={handleSave} className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h4 className="text-base font-semibold text-slate-100">{editingResource.id ? 'Edit Resource' : 'New Public Resource'}</h4>
            <button type="button" onClick={() => setEditingResource(null)} className="text-xs text-slate-400 hover:text-slate-200">Cancel</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Title</label>
              <input
                type="text"
                required
                value={editingResource.title || ''}
                onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">R2 Object Key (e.g. /public/guides/metabolic.pdf)</label>
              <input
                type="text"
                required
                value={editingResource.r2_key || ''}
                onChange={(e) => setEditingResource({ ...editingResource, r2_key: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Category</label>
              <input
                type="text"
                value={editingResource.category || 'Protocol'}
                onChange={(e) => setEditingResource({ ...editingResource, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Description</label>
              <input
                type="text"
                value={editingResource.description || ''}
                onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-100"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded">
              {saving ? 'Saving...' : 'Save Resource'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {resources.map((res) => (
          <div key={res.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
            <div className="space-y-1">
              <div className="font-medium text-slate-200 text-sm">{res.title}</div>
              <div className="text-xs text-slate-500">
                <span className="text-sky-400 font-semibold">{res.category}</span> • Downloads: {res.download_count} • Key: <code className="text-slate-400">{res.r2_key}</code>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => setEditingResource(res)} className="text-xs text-slate-400 hover:text-slate-200">Edit</button>
              <button
                onClick={() => toggleStatus(res, 'published')}
                className={`px-2.5 py-1 text-xs rounded font-medium ${res.published ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}
              >
                {res.published ? 'Published' : 'Draft'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
