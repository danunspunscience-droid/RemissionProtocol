import React, { useEffect, useState } from 'react';
import { ResourceCard } from '../components/ResourceCard';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resources')
    .then((r) => (r.ok? r.json(): []))
    .then((data) => {
      setResources(Array.isArray(data)? Data: []);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Error fetching resources:', err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Public Resources</h1>
          <p className="text-slate-400 mt-2">
            Un-gated metabolic protocols, downloadable guides, and clinical reference materials.
          </p>
        </div>

        {loading? (
          <div className="text-slate-500 py-12 text-center">Loading downloadable resources.</div>
        ): resources.length === 0? (
          <div className="text-slate-500 py-12 text-center">No public resources available.</div>
        ): (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((item, idx) => (
              <ResourceCard key={item.id || idx} resource={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}