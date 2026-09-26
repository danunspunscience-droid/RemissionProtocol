import React, { useState, useEffect } from 'react';
import { Activity, Plus, RefreshCw, AlertCircle } from 'lucide-react';

export default function ClientMetricsView() {
 const [metrics, setMetrics] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [formData, setFormData] = useState({
   Metric_type: 'hrv',
   Value: '',
   Unit: 'ms',
   Notes: ''
 });

 const fetchMetrics = async () => {
   setLoading(true);
   try {
     const res = await fetch('/api/client/metrics');
     if (!res.ok) throw new Error('Failed to fetch metrics.');
     const data = await res.json();
     setMetrics(data);
   } catch (err) {
     setError(err.message);
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   fetchMetrics();
 }, []);

 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     const res = await fetch('/api/client/metrics', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ ...formData, value: parseFloat(formData.value) })
     });
     if (!res.ok) throw new Error('Failed to record metric.');
     setFormData({ metric_type: 'hrv', value: '', unit: 'ms', notes: '' });
     fetchMetrics();
   } catch (err) {
     setError(err.message);
   }
 };

 return (
   <div className="bg-stone-900 border border-stone-800 rounded-sm p-6 space-y-6">
     <div className="flex items-center justify-between border-b border-stone-800 pb-4">
       <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase tracking-wider">
         <Activity className="w-4 h-4" /> Physical & Metabolic Metrics
       </div>
       <button onClick={fetchMetrics} className="text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1 font-mono">
         <RefreshCw className="w-3 h-3" /> Refresh
       </button>
     </div>

     {error && (
       <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-sm flex items-center gap-2">
         <AlertCircle className="w-4 h-4" />
         <span>{error}</span>
       </div>
     )}

     <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-stone-950 p-4 border border-stone-850 rounded-sm">
       <div>
         <label className="block text-[10px] font-mono uppercase text-stone-400 mb-1">Metric Type</label>
         <select
           value={formData.metric_type}
           onChange={(e) => setFormData({ ...formData, metric_type: e.target.value })}
           className="w-full bg-stone-900 border border-stone-800 text-stone-100 px-2 py-1.5 text-xs rounded-sm focus:border-amber-600 outline-none"
         >
           <option value="hrv">HRV (ms)</option>
           <option value="sleep_score">Sleep Score (%)</option>
           <option value="fasting_glucose">Fasting Glucose (mg/dL)</option>
           <option value="metabolic_volume">Metabolic Vol (kcal)</option>
         </select>
       </div>
       <div>
         <label className="block text-[10px] font-mono uppercase text-stone-400 mb-1">Value</label>
         <input
           type="number"
           step="any"
           value={formData.value}
           onChange={(e) => setFormData({ ...formData, value: e.target.value })}
           placeholder="e.g. 65"
           className="w-full bg-stone-900 border border-stone-800 text-stone-100 px-2 py-1.5 text-xs rounded-sm focus:border-amber-600 outline-none"
           required
         />
       </div>
       <div>
         <label className="block text-[10px] font-mono uppercase text-stone-400 mb-1">Unit</label>
         <input
           type="text"
           value={formData.unit}
           onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
           className="w-full bg-stone-900 border border-stone-800 text-stone-100 px-2 py-1.5 text-xs rounded-sm focus:border-amber-600 outline-none"
           required
         />
       </div>
       <button type="submit" className="py-1.5 bg-amber-700 hover:bg-amber-600 text-white text-xs font-mono uppercase rounded-sm flex items-center justify-center gap-1">
         <Plus className="w-3.5 h-3.5" /> Log Entry
       </button>
     </form>

     <div className="space-y-2">
       <h4 className="text-xs font-mono uppercase text-stone-400">Recent Telemetry ({metrics.length})</h4>
       {loading ? (
         <p className="text-xs font-mono text-stone-500 py-4 text-center">Loading client telemetry.</p>
       ) : metrics.length === 0 ? (
         <p className="text-xs font-mono text-stone-500 py-4 text-center">No metabolic entries logged yet.</p>
       ) : (
         <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
           {metrics.map((m) => (
             <div key={m.id} className="p-3 bg-stone-950 border border-stone-850 rounded-sm flex items-center justify-between text-xs">
               <div>
                 <span className="font-mono text-amber-500 font-semibold uppercase">{m.metric_type}</span>
                 <p className="text-stone-400 text-[11px]">{m.notes || 'Routine check-in'}</p>
               </div>
               <div className="text-right">
                 <span className="font-mono text-stone-100 font-bold">{m.value} {m.unit}</span>
                 <p className="text-[10px] font-mono text-stone-500">{new Date(m.recorded_at).toLocaleString()}</p>
               </div>
             </div>
           ))}
         </div>
       )}
     </div>
   </div>
 );
}