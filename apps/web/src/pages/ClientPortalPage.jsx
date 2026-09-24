import React, { useEffect, useState, useCallback } from 'react';
import { Activity, ShieldCheck, Plus, WifiOff, RefreshCw, FileText } from 'lucide-react';
import { saveOfflineMetric, getOfflineMetrics, clearOfflineMetrics } from '../lib/offlineDb';
import ClientDocumentsTab from '../components/ClientDocumentsTab';

export default function ClientPortalPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('telemetry');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [newMetric, setNewMetric] = useState({ metric_type: 'glucose', metric_value: '', unit: 'mg/dL', notes: '' });

  const token = localStorage.getItem('rp_client_token');

  const updatePendingCount = async () => {
    const pending = await getOfflineMetrics();
    setPendingCount(pending.length);
  };

  const fetchMetrics = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError('No active session token found. Please log in.');
      return;
    }

    try {
      const res = await fetch('/api/client/metrics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Unauthorized or session expired');
      const resData = await res.json();
      setData(resData);
      setError(null);
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }, [token]);

  const syncOfflineQueue = useCallback(async () => {
    if (!navigator.onLine || !token) return;
    const pending = await getOfflineMetrics();
    if (pending.length === 0) return;

    for (const item of pending) {
      try {
        await fetch('/api/client/metrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            metric_type: item.metric_type,
            metric_value: parseFloat(item.metric_value),
            unit: item.unit,
            notes: item.notes,
          }),
        });
      } catch (e) {
        console.error('Failed to sync item:', item, e);
      }
    }
    await clearOfflineMetrics();
    await updatePendingCount();
    fetchMetrics();
  }, [token, fetchMetrics]);

  useEffect(() => {
    const handleOnline = () => { setIsOffline(false); syncOfflineQueue(); };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    fetchMetrics();
    syncOfflineQueue();
    updatePendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchMetrics, syncOfflineQueue]);

  const handleAddMetric = async (e) => {
    e.preventDefault();
    const payload = { ...newMetric, metric_value: parseFloat(newMetric.metric_value) };

    if (!navigator.onLine) {
      await saveOfflineMetric(payload);
      await updatePendingCount();
      setNewMetric({ metric_type: 'glucose', metric_value: '', unit: 'mg/dL', notes: '' });
      alert('Offline: Metric saved to local device queue. It will auto-sync when back online.');
      return;
    }

    try {
      const res = await fetch('/api/client/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setNewMetric({ metric_type: 'glucose', metric_value: '', unit: 'mg/dL', notes: '' });
        fetchMetrics();
      } else {
        await saveOfflineMetric(payload);
        await updatePendingCount();
        alert('Network error. Metric queued offline for background sync.');
      }
    } catch (err) {
      await saveOfflineMetric(payload);
      await updatePendingCount();
      alert('Network offline. Metric queued locally for sync.');
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-slate-400 p-12 text-center">Authenticating client session.</div>;

  if (error && !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-12 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-md text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-teal-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Client Portal Access</h2>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Welcome, {data?.client?.name || 'Client'}</h1>
            <p className="text-slate-400 text-sm mt-1">Encrypted Client Portal & Metabolic Health Record</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border ${activeTab === 'telemetry' ? 'bg-teal-500/10 border-teal-500/40 text-teal-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
            >
              <Activity className="w-4 h-4" /> Telemetry
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border ${activeTab === 'documents' ? 'bg-teal-500/10 border-teal-500/40 text-teal-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
            >
              <FileText className="w-4 h-4" /> Documents & Labs
            </button>
            {isOffline && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full">
                <WifiOff className="w-3.5 h-3.5" /> ({pendingCount})
              </span>
            )}
          </div>
        </div>

        {activeTab === 'documents' ? (
          <ClientDocumentsTab token={token} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-400" /> Recorded Metabolic Metrics
                </h2>
                {pendingCount > 0 && !isOffline && (
                  <button onClick={syncOfflineQueue} className="text-xs text-teal-400 flex items-center gap-1 hover:underline">
                    <RefreshCw className="w-3.5 h-3.5" /> Sync {pendingCount} Queued
                  </button>
                )}
              </div>
              {(!data?.metrics || data.metrics.length === 0) ? (
                <p className="text-slate-500 text-sm py-4">No health metrics recorded yet.</p>
              ) : (
                <div className="divide-y divide-slate-800">
                  {data.metrics.map((m) => (
                    <div key={m.id} className="py-3 flex justify-between items-center text-sm">
                      <div>
                        <span className="font-semibold text-white capitalize">{m.metric_type}</span>
                        {m.notes && <p className="text-xs text-slate-400">{m.notes}</p>}
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-teal-400 font-bold">{m.metric_value}</span>{' '}
                        <span className="text-slate-400 text-xs">{m.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleAddMetric} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-400" /> Log Health Metric
              </h3>
              <select
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200"
                value={newMetric.metric_type}
                onChange={(e) => setNewMetric({ ...newMetric, metric_type: e.target.value })}
              >
                <option value="glucose">Fasting Glucose</option>
                <option value="ketones">Blood Ketones</option>
                <option value="weight">Body Weight</option>
                <option value="vo2_max">VO2 Max Estimate</option>
              </select>
              <input
                type="number" step="0.1" required placeholder="Value"
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200"
                value={newMetric.metric_value}
                onChange={(e) => setNewMetric({ ...newMetric, metric_value: e.target.value })}
              />
              <input
                required placeholder="Unit (e.g. mg/dL, mmol/L, lbs)"
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200"
                value={newMetric.unit}
                onChange={(e) => setNewMetric({ ...newMetric, unit: e.target.value })}
              />
              <button type="submit" className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded text-sm transition">
                {isOffline ? 'Queue Metric Offline' : 'Record Metric'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
