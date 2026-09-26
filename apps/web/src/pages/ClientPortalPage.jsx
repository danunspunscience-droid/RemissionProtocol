import React, { useState } from 'react';
import { Activity, FileText, Calendar, LogOut, User } from 'lucide-react';
import ClientAuth from '../components/client/ClientAuth';
import ClientMetricsView from '../components/client/ClientMetricsView';
import ClientVault from '../components/client/ClientVault';
import ClientAppointments from '../components/client/ClientAppointments';

export default function ClientPortalPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('metrics');

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 pt-28 pb-20 px-6 font-sans">
        <ClientAuth onLoginSuccess={(u) => setUser(u)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pt-28 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-stone-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500">
              <User className="w-4 h-4" /> Client Portal • {user.full_name}
            </div>
            <h1 className="text-3xl font-serif text-white">Metabolic Telemetry & Vault</h1>
          </div>
          <button
            onClick={() => setUser(null)}
            className="px-3 py-1.5 border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-stone-200 text-xs font-mono uppercase rounded-sm flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        <div className="flex gap-2 border-b border-stone-800">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'metrics' ? 'border-amber-500 text-amber-500' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Metrics & Telemetry
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'vault' ? 'border-amber-500 text-amber-500' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Private Vault
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'appointments' ? 'border-amber-500 text-amber-500' : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Consultations
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'metrics' && <ClientMetricsView />}
          {activeTab === 'vault' && <ClientVault userId={user.id} />}
          {activeTab === 'appointments' && <ClientAppointments />}
        </div>
      </div>
    </div>
  );
}
