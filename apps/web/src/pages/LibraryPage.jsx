import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Play } from 'lucide-react';

export default function LibraryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/library')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setItems(data))
      .catch((err) => console.error('Failed to load library:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <Helmet>
        <title>Content Library | Remission Protocol</title>
      </Helmet>
      <div className="max-w-3xl">
        <p className="text-xs font-semibold tracking-widest text-brass uppercase">MEDICINE & SURVIVORSHIP</p>
        <h1 className="mt-2 font-display text-4xl font-light md:text-5xl">Content Library</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Evidence-based video lectures, clinical breakdowns, and metabolic strategies.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading video archives.</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published videos found.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="group rounded-sm border border-border bg-card overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {item.custom_cover_url ? (
                  <img src={item.custom_cover_url} alt={item.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-card text-muted-foreground"><Play size={32} /></div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <a href={item.video_url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-brass p-3 text-white"><Play size={20} /></a>
                </div>
              </div>
              <div className="p-5">
                <span className="text-[10px] font-semibold tracking-wider text-brass uppercase">{item.category}</span>
                <h3 className="mt-1 font-display text-lg font-medium text-primary">{item.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{item.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
