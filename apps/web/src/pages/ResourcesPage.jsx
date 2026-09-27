import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Download, FileText } from 'lucide-react';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resources')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setResources(data))
      .catch((err) => console.error('Failed to load resources:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <Helmet>
        <title>Resources & Protocols | Remission Protocol</title>
      </Helmet>
      <div className="max-w-3xl">
        <p className="text-xs font-semibold tracking-widest text-brass uppercase">OPEN ACCESS ARCHIVE</p>
        <h1 className="mt-2 font-display text-4xl font-light md:text-5xl">Clinical Resources</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Freely accessible protocols, metabolic guidelines, and survivorship toolkits. No email gates or lead capture required.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading resource archive.</p>
        ) : resources.length === 0 ? (
          <p className="text-sm text-muted-foreground">No public protocols available yet.</p>
        ) : (
          resources.map((item) => (
            <div key={item.id} className="flex flex-col justify-between rounded-sm border border-border bg-card p-6">
              <div>
                <div className="flex items-center gap-2 text-brass">
                  <FileText size={18} />
                  <span className="text-[10px] font-semibold tracking-wider uppercase">{item.category}</span>
                </div>
                <h3 className="mt-2 font-display text-xl font-medium text-primary">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div className="mt-6 border-t border-border/40 pt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {item.file_size_bytes ? `${(item.file_size_bytes / (1024 * 1024)).toFixed(1)} MB` : 'PDF Guide'}
                </span>
                <a
                  href={item.file_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-brass px-4 py-2 text-xs font-semibold text-white hover:bg-accent"
                >
                  <Download size={14} /> Download Protocol
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
