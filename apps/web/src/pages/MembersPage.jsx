import React, { useState, useEffect } from 'react';
import { Download, Lock, ShieldCheck } from 'lucide-react';

export default function MembersPage() {
  const [resources, setResources] = useState([
    {
      id: 'res-1',
      title: 'Metabolic Survivorship Framework',
      description: 'Comprehensive baseline framework for post-treatment physiological restoration and biomarker tracking.',
      category: 'Guides',
      file_path: '/api/files/protocol-guide.pdf',
      members_only: 0
    },
    {
      id: 'res-2',
      title: 'Advanced Biomarker Reference Matrix',
      description: 'Optimal clinical reference ranges for routine laboratory work, metabolic panels, and inflammatory markers.',
      category: 'Clinical Tools',
      file_path: '/api/files/biomarker-matrix.pdf',
      members_only: 1
    }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadResources() {
      try {
        const res = await fetch('/api/resources?all=true');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setResources(data);
          }
        }
      } catch (err) {
        console.warn("Using baseline resources state:", err);
      }
    }
    loadResources();
  }, []);

  const categories = ['All', ...new Set(resources.map(r => r.category || 'General'))];

  const filteredResources = selectedCategory === 'All'
    ? resources
    : resources.filter(r => (r.category || 'General') === selectedCategory);

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 pt-28 pb-20 px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500">
            <ShieldCheck className="w-4 h-4" /> Member Knowledge Vault
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-white">
            Resources & Protocols
          </h1>
          <p className="text-stone-400 text-base md:text-lg font-light leading-relaxed">
            Evidence-based guides, clinical reference tools, and metabolic framework documentation for Remission Protocol members and clinicians.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-medium tracking-wide rounded-sm transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-700 text-white'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((item) => (
            <div
              key={item.id || item.title}
              className="bg-stone-950 border border-stone-800 rounded-sm p-6 flex flex-col justify-between hover:border-stone-700 transition-all shadow-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-stone-500 tracking-wider">
                    {item.category || 'General'}
                  </span>
                  {item.members_only ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-amber-950 text-amber-400 border border-amber-800/60 px-2 py-0.5 rounded-xs">
                      <Lock className="w-3 h-3" /> Members Only
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono uppercase bg-stone-800 text-stone-300 px-2 py-0.5 rounded-xs">
                      Public
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-serif text-stone-100 font-semibold leading-snug">
                  {item.title}
                </h2>

                <p className="text-sm text-stone-400 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-900 flex items-center justify-between">
                <a
                  href={item.file_path ? (item.file_path.startsWith('http') || item.file_path.startsWith('/api/') ? item.file_path : `/api/files/${item.file_path}`) : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors gap-1.5"
                >
                  <Download className="w-4 h-4" /> Access Document
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
