import React from 'react';
import { FileText, Download, ShieldCheck } from 'lucide-react';

export default function ClientVault({ userId }) {
  // Demo protected document reference mapped to stage 6 R2 structure
  const clientFiles = [
    {
      id: 'doc-1',
      name: 'Metabolic & Lab Protocol Summary 2026.pdf',
      r2_key: `private/clients/${userId || 'client-demo-1'}/lab-summary-2026.pdf`,
      size: '2.4 MB',
      uploaded_at: '2026-09-20'
    }
  ];

  const handleDownload = (key) => {
    const downloadUrl = `/api/client/files/${encodeURIComponent(key)}`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-sm p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Auth-Guarded Document Vault
        </div>
      </div>

      <div className="space-y-3">
        {clientFiles.map((file) => (
          <div key={file.id} className="p-4 bg-stone-950 border border-stone-850 rounded-sm flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-900 border border-stone-800 rounded-sm text-amber-500">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-stone-200">{file.name}</p>
                <p className="text-[10px] font-mono text-stone-500">
                  {file.size} • Uploaded: {file.uploaded_at}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDownload(file.r2_key)}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-mono uppercase rounded-sm flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}