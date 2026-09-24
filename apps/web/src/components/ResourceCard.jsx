import React from 'react';
import { Download, FileText } from 'lucide-react';

export function ResourceCard({ resource }) {
  const downloadUrl = resource.file_key
    ? `/api/files/${resource.file_key}`
    : resource.file || resource.url || '#';

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition duration-200">
      <div className="space-y-3">
        <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-white">{resource.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{resource.description}</p>
      </div>

      <div className="pt-6 mt-4 border-t border-slate-800/80">
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="inline-flex items-center space-x-2 text-sm font-semibold text-teal-400 hover:text-teal-300 transition duration-150"
        >
          <Download className="w-4 h-4" />
          <span>Download Resource (Direct)</span>
        </a>
      </div>
    </div>
  );
}
