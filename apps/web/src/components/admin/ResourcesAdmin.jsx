import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Plus, FileText } from 'lucide-react';

export default function ResourcesAdmin() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ title: '', category: 'Survivorship Protocols', description: '', file_url: '', file_size_bytes: 0 });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchResources(); }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch('/api/resources', { credentials: 'include' });
      if (res.ok) setResources(await res.json());
    } catch (e) { console.error('Failed to load resources', e); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const filename = `protocol-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const res = await fetch(`/api/files/public/resources/${filename}`, {
        method: 'POST',
        body: file,
        headers: { 'Content-Type': file.type || 'application/pdf' },
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setForm({
          ...form,
          file_url: data.url || `/api/files/public/resources/${filename}`,
          file_size_bytes: file.size
        });
        setMsg(`Uploaded document (${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
      }
    } catch (err) { setMsg('File upload failed: ' + err.message); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.file_url) {
      setMsg('Please provide a title and upload a document.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include'
      });
      if (res.ok) {
        setForm({ title: '', category: 'Survivorship Protocols', description: '', file_url: '', file_size_bytes: 0 });
        setMsg('Resource protocol published.');
        fetchResources();
      }
    } catch (err) { setMsg('Failed to publish resource.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    await fetch(`/api/resources?id=${id}`, { method: 'DELETE', credentials: 'include' });
    fetchResources();
  };

  return (
    <div className="space-y-8 text-foreground">
      <form onSubmit={handleSubmit} className="rounded-sm border border-border bg-card p-6 space-y-4">
        <h3 className="font-display text-xl font-medium text-primary">Upload Clinical Resource / Protocol PDF</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <input type="text" placeholder="Protocol Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="rounded-sm border px-3 py-2 text-sm bg-background text-foreground" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-sm border px-3 py-2 text-sm bg-background text-foreground">
            <option value="Survivorship Protocols">Survivorship Protocols</option>
            <option value="Metabolic Toolkits">Metabolic Toolkits</option>
            <option value="Clinical Guidelines">Clinical Guidelines</option>
          </select>
        </div>
        <textarea rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-sm border px-3 py-2 text-sm bg-background text-foreground" />

        <div className="flex items-center justify-between pt-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-input bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted">
            <Upload size={14} /> {uploading ? 'Uploading PDF...' : form.file_url ? 'Replace Document' : 'Upload Document File (PDF)'}
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={uploading} className="hidden" />
          </label>
          <button type="submit" disabled={submitting || !form.file_url} className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40">
            <Plus size={16} /> {submitting ? 'Publishing...' : 'Publish Protocol'}
          </button>
        </div>
        {msg && <p className="text-xs font-semibold text-brass">{msg}</p>}
      </form>

      <div className="rounded-sm border border-border bg-card p-6">
        <h3 className="font-display text-xl font-medium text-primary">Published Protocols ({resources.length})</h3>
        <div className="mt-4 space-y-3">
          {resources.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-sm border p-4 bg-background">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-sm bg-muted text-brass"><FileText size={20} /></div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-brass">{item.category}</span>
                  <h4 className="font-medium text-sm text-foreground">{item.title}</h4>
                </div>
              </div>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-destructive hover:opacity-80"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
