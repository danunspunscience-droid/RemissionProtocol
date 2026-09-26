import React, { useState, useEffect } from 'react';

export default function AboutPage() {
  const [founders, setFounders] = useState([
    {
      id: 'founder-1',
      name: 'Clinical & Metabolic Leadership',
      role: 'Physician-Guided Care Team',
      bio: 'Our multidisciplinary team unites board-certified physicians, metabolic health strategists, and performance coaches dedicated to survivorship excellence and long-term physiological resilience.',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  useEffect(() => {
    async function loadFounders() {
      try {
        const res = await fetch('/api/founders');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFounders(data);
          }
        }
      } catch (err) {
        console.warn("Using baseline founders data:", err);
      }
    }
    loadFounders();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pt-28 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl md:text-5xl font-serif text-stone-900">
            The Team Behind Remission Protocol
          </h1>
          <p className="text-stone-600 text-base md:text-lg leading-relaxed font-light">
            Physician-guided metabolic medicine requires a unique blend of clinical expertise, elite coaching, and nutritional science. Meet the leadership restoring vitality beyond prognosis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 pt-8">
          {founders.map((founder) => {
            const photoUrl = founder.photo 
              ? (founder.photo.startsWith('http') || founder.photo.startsWith('/api/') 
                  ? founder.photo 
                  : `/api/files/${founder.photo}`)
              : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80';

            return (
              <div key={founder.id || founder.name} className="bg-white rounded-lg border border-stone-200 p-8 shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start">
                <img
                  src={photoUrl}
                  alt={founder.name}
                  className="w-28 h-28 rounded-full object-cover border-2 border-stone-300 flex-shrink-0"
                />
                <div className="space-y-2 text-center md:text-left">
                  <h2 className="text-xl font-serif text-stone-900 font-semibold">{founder.name}</h2>
                  <p className="text-amber-800 text-xs uppercase tracking-wider font-mono font-medium">{founder.role}</p>
                  <p className="text-stone-600 text-sm leading-relaxed font-light">{founder.bio}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
