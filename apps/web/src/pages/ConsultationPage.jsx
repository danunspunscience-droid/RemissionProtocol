import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ConsultationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setErrorMessage('Please provide both your name and email address.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact_requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit consultation request.');
      }
    } catch (err) {
      console.error('Consultation submission error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 pt-28 pb-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="space-y-4 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-amber-500">
            Physician Guidance & Coaching
          </p>
          <h1 className="text-3xl md:text-5xl font-serif text-white">
            Request a Consultation
          </h1>
          <p className="text-stone-400 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto">
            Connect directly with the Remission Protocol team to discuss your health history, survivorship goals, and integrative metabolic strategy.
          </p>
        </div>

        <div className="bg-stone-950 border border-stone-800 rounded-sm p-8 shadow-xl">
          {status === 'success' ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-amber-500 mx-auto" />
              <h2 className="text-2xl font-serif text-white">Request Received</h2>
              <p className="text-stone-400 text-sm max-w-md mx-auto leading-relaxed">
                Thank you for reaching out. A member of our clinical coordination team will review your inquiry and follow up within one business day.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 inline-flex items-center px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono uppercase tracking-wider rounded-sm transition-all"
              >
                Submit Another Request
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
                  name="name"
                  value={formData.name}
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
                  Message / Health Context
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Briefly share your current stage of survivorship, primary goals, or questions..."
                  className="w-full bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-sm focus:outline-none focus:border-amber-600 transition-colors text-sm leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 bg-amber-700 hover:bg-amber-600 disabled:bg-stone-800 text-white font-medium text-sm tracking-wide rounded-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <span>Submitting Request...</span>
                ) : (
                  <>
                    <span>Submit Consultation Request</span>
                    <Send className="w-4 h-4" />
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