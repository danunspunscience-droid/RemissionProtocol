import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { LogOut, Image, Video, FileText } from 'lucide-react';
import HeroAdmin from '../components/admin/HeroAdmin';
import LibraryAdmin from '../components/admin/LibraryAdmin';
import ResourcesAdmin from '../components/admin/ResourcesAdmin';

export default function AdminPage() {
  const [tab, setTab] = useState('hero');

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
      <Helmet>
        <title>Admin CMS | Remission Protocol</title>
      </Helmet>

      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <span className="text-[10px] font-semibold tracking-widest text-brass uppercase">ADMINISTRATIVE CONTROL HUB</span>
          <h1 className="font-display text-3xl font-light md:text-4xl">Remission Protocol CMS</h1>
        </div>
        <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-card hover:text-foreground">
          <LogOut size={14} /> Exit
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-8 flex border-b border-border gap-6">
        <button
          onClick={() => setTab('hero')}
          className={`flex items-center gap-2 pb-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition ${
            tab === 'hero' ? 'border-brass text-brass' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Image size={16} /> Hero Engine
        </button>
        <button
          onClick={() => setTab('library')}
          className={`flex items-center gap-2 pb-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition ${
            tab === 'library' ? 'border-brass text-brass' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Video size={16} /> Content Library
        </button>
        <button
          onClick={() => setTab('resources')}
          className={`flex items-center gap-2 pb-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition ${
            tab === 'resources' ? 'border-brass text-brass' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText size={16} /> Clinical Resources
        </button>
      </div>

      <div className="mt-8">
        {tab === 'hero' && <HeroAdmin />}
        {tab === 'library' && <LibraryAdmin />}
        {tab === 'resources' && <ResourcesAdmin />}
      </div>
    </div>
  );
}
