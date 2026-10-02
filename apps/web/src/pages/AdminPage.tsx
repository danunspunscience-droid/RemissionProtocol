import React, { useState } from 'react';
import { Layout, Sliders, BookOpen, Users, Settings, ArrowLeft } from 'lucide-react';
import HeroAdmin from '../components/admin/HeroAdmin';

type AdminTab = 'hero' | 'library' | 'clients' | 'settings';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('hero');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* System Governance Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-100 leading-tight">Remission Protocol</h1>
              <p className="text-xs text-slate-400">System Governance & CMS Portal</p>
            </div>
          </div>

          <a
            href="/"
            className="flex items-center space-x-2 text-xs text-slate-400 hover:text-slate-200 transition-colors py-1.5 px-3 rounded-md bg-slate-800/50 border border-slate-700/50"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Hub</span>
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1 bg-slate-900/40 p-2 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'hero'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Hero Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'library'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Content Library</span>
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'clients'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Client Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>System Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'hero' && <HeroAdmin />}

          {activeTab === 'library' && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-8 text-center">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-slate-200">Content Library Management</h2>
              <p className="text-sm text-slate-400 mt-1">Stage 4 Content Hub endpoints active. Admin UI controls scheduled next.</p>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-8 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-slate-200">Client Portal Governance</h2>
              <p className="text-sm text-slate-400 mt-1">Worker auth guards active. Client metric dashboards pending Stage 6.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-8 text-center">
              <Settings className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-slate-200">System Configuration</h2>
              <p className="text-sm text-slate-400 mt-1">Global D1 database settings and rotation frequency management.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
