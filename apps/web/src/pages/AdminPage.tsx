import React, { useState } from 'react';
import { useAdminData } from '../hooks/useAdminData';
import { HeroTab } from './admin/tabs/HeroTab';
import { LibraryTab } from './admin/tabs/LibraryTab';
import { ResourcesTab } from './admin/tabs/ResourcesTab';
import { FoundersTab } from './admin/tabs/FoundersTab';
import { SettingsTab } from './admin/tabs/SettingsTab';

type AdminTab = 'hero' | 'library' | 'resources' | 'founders' | 'settings';

export const AdminPage: React.FC = () => {
const [activeTab, setActiveTab] = useState<AdminTab>('hero');
const { loading, error, heroCopy, heroMedia, resources, libraryContent, founders, refresh } = useAdminData();

const navItems: { id: AdminTab; label: string }[] = [
{ id: 'hero', label: 'Hero Engine' },
{ id: 'library', label: 'Content Library' },
{ id: 'resources', label: 'Public Resources' },
{ id: 'founders', label: 'Founders' },
{ id: 'settings', label: 'Settings' },
];

if (loading) {
return (
<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
  Loading Admin CMS Engine...
</div>
);
}

return (
<div className="min-h-screen bg-slate-950 text-slate-100 p-8">
  <div className="max-w-7xl mx-auto space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Remission Protocol CMS</h1>
        <p className="text-sm text-slate-400">D1 Singleton Engine & R2 Asset Control Panel</p>
      </div>
      <button
        onClick={refresh}
        className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
      >
        Revalidate Data
      </button>
    </div>

    {error && (
      <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-sm">
        {error}
      </div>
    )}

    <div className="flex space-x-2 border-b border-slate-800 pb-2">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            activeTab === item.id
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>

    <main className="mt-6">
      {activeTab === 'hero' && <HeroTab copy={heroCopy} media={heroMedia} onRefresh={refresh} />}
      {activeTab === 'library' && <LibraryTab items={libraryContent} onRefresh={refresh} />}
      {activeTab === 'resources' && <ResourcesTab resources={resources} onRefresh={refresh} />}
      {activeTab === 'founders' && <FoundersTab founders={founders} onRefresh={refresh} />}
      {activeTab === 'settings' && <SettingsTab />}
    </main>
  </div>
</div>
);
};

export default AdminPage;
