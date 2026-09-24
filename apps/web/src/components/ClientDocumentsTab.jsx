import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Upload, Download, Loader2, FileCheck } from 'lucide-react';

export default function ClientDocumentsTab({ token }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch('/api/client/documents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load private documents');
      const data = await res.json();
      setFiles(data.files || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/client/documents', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Document upload failed');
      await fetchDocuments();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDownload = (key) => {
    const downloadUrl = `/api/client/documents/${encodeURIComponent(key)}`;
    window.open(downloadUrl, '_blank');
  };

  if (loading) return <div className="text-slate-400 text-sm py-8 text-center">Loading encrypted documents...</div>;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" /> Private Clinical Documents & Labs
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Encrypted R2 Storage · Private Client Partition</p>
        </div>
        <label className="cursor-pointer bg-teal-500 hover:bg-teal-600 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Upload Medical File'}
          <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
        </label>
      </div>

      {error && <p className="text-amber-400 text-xs bg-amber-500/10 p-3 rounded border border-amber-500/20">{error}</p>}

      {files.length === 0 ? (
        <div className="text-center py-10 space-y-2">
          <FileCheck className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm font-medium">No medical records or lab reports uploaded yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800">
          {files.map((file) => (
            <div key={file.key} className="py-3 flex items-center justify-between hover:bg-slate-950/40 px-2 rounded transition">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-slate-200">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB · {new Date(file.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDownload(file.key)}
                className="p-2 text-slate-400 hover:text-teal-400 hover:bg-slate-800 rounded transition"
                title="Download Document"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
