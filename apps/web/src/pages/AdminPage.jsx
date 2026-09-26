import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Image, FileText, Video, LogOut } from 'lucide-react';
import HeroAdmin from '../components/admin/HeroAdmin';
import ResourceAdmin from '../components/admin/ResourceAdmin';
import BlogAdmin from '../components/admin/BlogAdmin';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/admin/verify')
      .then((res) => {
        if (res.ok) setAuthenticated(true);
        else navigate('/login');
      })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-400 font-mono text-xs flex items-center justify-center">
        Verifying administrative authorization...
      </div>
    );
  }

  if (!authenticated) return null;

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      setAuthenticated(false);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pt-28 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500">
              <Shield className="w-4 h-4" /> Administrative Control Hub
            </div>
            <h1 className="text-3xl font-serif text-white">Remission Protocol CMS</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200 text-xs font-mono uppercase rounded-sm flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Exit
          </button>
        </div>

        <div className="flex gap-2 border-b border-stone-800">
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'hero' ? 'border-amber-500 text-amber-500' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Image className="w-3.5 h-3.5" /> Hero Engine
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'resources' ? 'border-amber-500 text-amber-500' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Resources
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'blog' ? 'border-amber-500 text-amber-500' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" /> Blogs & Vlogs
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'hero' && <HeroAdmin />}
          {activeTab === 'resources' && <ResourceAdmin />}
          {activeTab === 'blog' && <BlogAdmin />}
        </div>
      </div>
    </div>
  );
}
