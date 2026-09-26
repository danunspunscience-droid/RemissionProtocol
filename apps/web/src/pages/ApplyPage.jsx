import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    health_goals: ''
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) {
      setErrorMessage('Please provide both your full name and email address.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/membership_applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ full_name: '', email: '', health_goals: '' });
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit application.');
      }
    } catch (err) {
      console.error('Membership application error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 pt-28 pb-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500">
            <ShieldCheck className="w-4 h-4" /> Concierge Survivorship
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-white">
            Apply for Membership
          </h1>
          <p className="text-stone-400 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto">
            Remission Protocol limits active coaching cohorts to maintain high-touch physician collaboration and personalized metabolic monitoring.
          </p>
        </div>

        <div className="bg-stone-950 border border-stone-800 rounded-sm p-8 shadow-xl">
          {status === 'success' ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-amber-500 mx-auto" />
              <h2 className="text-2xl font-serif text-white">Application Submitted</h2>
              <p className="text-stone-400 text-sm max-w-md mx-auto leading-relaxed">
                Your application has been logged into our queue. Our clinical team will review your responses and reach out regarding cohort availability.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 inline-flex items-center px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono uppercase tracking-wider rounded-sm transition-all"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="bg-red-950/60 border border-red-800/80 p-4 rounded-sm flex items-start gap-3 text-red-200 text-sm">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                  Full Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  required
                  className="w-full bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-sm focus:outline-none focus:border-amber-600 transition-colors text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                  Email Address <span className="text-amber-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  required
                  className="w-full bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-sm focus:outline-none focus:border-amber-600 transition-colors text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-400">
                  Health & Vitality Goals
                </label>
                <textarea
                  name="health_goals"
                  rows={5}
                  value={formData.health_goals}
                  onChange={handleChange}
                  placeholder="Describe your primary metabolic, physical performance, or health restoration objectives..."
                  className="w-full bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-sm focus:outline-none focus:border-amber-600 transition-colors text-sm leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 bg-amber-700 hover:bg-amber-600 disabled:bg-stone-800 text-white font-medium text-sm tracking-wide rounded-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <span>Submitting Application...</span>
                ) : (
                  <>
                    <span>Submit Membership Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
