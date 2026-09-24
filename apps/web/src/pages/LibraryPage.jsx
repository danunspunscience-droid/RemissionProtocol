import React, { useEffect, useState } from 'react';
import { ContentCard } from '../components/ContentCard';

export default function LibraryPage() {
  const [content, setContent] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/library_content').then((r) => (r.ok? r.json(): [])),
      fetch('/api/podcast_episodes').then((r) => (r.ok? r.json(): [])),
    ])
    .then(([libData, podData]) => {
      setContent(Array.isArray(libData)? LibData: []);
      setPodcasts(Array.isArray(podData)? PodData: []);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Error loading library:', err);
      setLoading(false);
    });
  }, []);

  const allItems = [...content, ...podcasts.map((p) => ({...p, category: 'Podcast' }))];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Content Library</h1>
          <p className="text-slate-400 mt-2">
            Peer-reviewed protocols, clinical monographs, and therapeutic video analyses.
          </p>
        </div>

        {loading? (
          <div className="text-slate-500 py-12 text-center">Loading library content.</div>
        ): allItems.length === 0? (
          <div className="text-slate-500 py-12 text-center">No published content available.</div>
        ): (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allItems.map((item, idx) => (
              <ContentCard key={item.id || idx} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}