import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function ClientAppointments() {
 const appointments = [
   {
     id: 'app-1',
     title: 'Quarterly Metabolic Review Consultation',
     status: 'scheduled',
     scheduled_at: '2026-10-05T14:00:00Z',
     notes: 'Review fasting blood glucose trends and HRV trajectory.'
   }
 ];

 return (
   <div className="bg-stone-900 border border-stone-800 rounded-sm p-6 space-y-6">
     <div className="flex items-center justify-between border-b border-stone-800 pb-4">
       <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase tracking-wider">
         <Calendar className="w-4 h-4" /> Consultation Schedule
       </div>
     </div>

     <div className="space-y-3">
       {appointments.map((app) => (
         <div key={app.id} className="p-4 bg-stone-950 border border-stone-850 rounded-sm space-y-2">
           <div className="flex items-center justify-between">
             <h4 className="text-xs font-medium text-stone-200">{app.title}</h4>
             <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono uppercase rounded-xs">
               {app.status}
             </span>
           </div>
           <div className="flex items-center gap-1 text-[11px] font-mono text-stone-400">
             <Clock className="w-3.5 h-3.5 text-amber-500" />
             <span>{new Date(app.scheduled_at).toLocaleString()}</span>
           </div>
           <p className="text-xs text-stone-500">{app.notes}</p>
         </div>
       ))}
     </div>
   </div>
 );
}