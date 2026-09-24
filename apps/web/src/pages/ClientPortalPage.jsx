import React, { useEffect, useState } from 'react';
import { Activity, ShieldCheck, FileText, Plus } from 'lucide-react';

export default function ClientPortalPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMetric, setNewMetric] = useState({ metric_type: 'glucose', metric_value: '', unit: 'mg/dL', notes: '' });

  const token = localStorage.getItem('rp_client_token');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('No active session token found. Please log in.');
      return;
    }

    fetch('/api/client/metrics', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject('Unauthorized or session expired')))
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, [token]);

  const handleAddMetric = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/client/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          metric_type: newMetric.metric_type,
          metric_value: parseFloat(newMetric.metric_value),
          unit: newMetric.unit,
          notes: newMetric.notes,
        }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert('Failed to log metric.');
      }
    } catch (err) {
      alert('Error recording metric.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 p-12 text-center">
        Authenticating client session.
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-12 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-md text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-teal-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Client Authentication Required</h2>
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
            <h1 className="text-3xl font-extrabold text-white">Welcome, {data.client.name}</h1>
            <p className="text-slate-400 text-sm mt-1">Encrypted Client Portal & Metabolic Health Record</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-400" />
                <span>Recorded Metabolic Metrics</span>
              </h2>
              {data.metrics.length === 0 ? (
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
                <Plus className="w-4 h-4 text-teal-400" />
                <span>Log Health Metric</span>
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
                type="number"
                step="0.1"
                required
                placeholder="Value"
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200"
                value={newMetric.metric_value}
                onChange={(e) => setNewMetric({ ...newMetric, metric_value: e.target.value })}
              />
              <input
                required
                placeholder="Unit (e.g. mg/dL, mmol/L, lbs)"
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200"
                value={newMetric.unit}
                onChange={(e) => setNewMetric({ ...newMetric, unit: e.target.value })}
              />
              <input
                type="text"
                placeholder="Notes (optional)"
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200"
                value={newMetric.notes}
                onChange={(e) => setNewMetric({ ...newMetric, notes: e.target.value })}
              />
              <button
                type="submit"
                className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold rounded text-sm transition"
              >
                Record Metric
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}