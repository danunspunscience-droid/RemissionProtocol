import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
    Loader2,
    CheckCircle2,
    Send,
    ShieldCheck,
    Clock,
    Stethoscope,
    ArrowRight,
    ArrowUpRight,
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Reveal from '@/components/Reveal';
import { cn } from '@/lib/utils';

const AGE_RANGES = [
    { value: 'under_40', label: 'Under 40' },
    { value: '40_49', label: '40–49' },
    { value: '50_59', label: '50–59' },
    { value: '60_69', label: '60–69' },
    { value: '70_plus', label: '70+' },
];

const PRIMARY_GOALS = [
    { value: 'cancer_prevention', label: 'Cancer prevention' },
    { value: 'cancer_recovery', label: 'Cancer recovery' },
    { value: 'metabolic_reversal', label: 'Metabolic reversal (diabetes, pre-diabetes)' },
    { value: 'longevity', label: 'Longevity & performance' },
    { value: 'executive_health', label: 'Executive health strategy' },
    { value: 'other', label: 'Something else' },
];

const TIMELINES = [
    { value: 'immediate', label: 'Immediately — I have a deadline' },
    { value: 'this_quarter', label: 'Within this quarter' },
    { value: 'six_months', label: 'Within six months' },
    { value: 'exploring', label: 'Exploring for now' },
];

const REFERRAL_SOURCES = [
    { value: 'physician', label: 'Physician referral' },
    { value: 'member_referral', label: 'A Remission Protocol member' },
    { value: 'friend_family', label: 'Friend or family' },
    { value: 'podcast_media', label: 'Podcast or media' },
    { value: 'search', label: 'Web search' },
    { value: 'social', label: 'Social media' },
    { value: 'other', label: 'Other' },
];

const EXPECTATIONS = [
    {
        icon: ShieldCheck,
        title: 'A real review, not a sales call',
        body: 'A physician reads your history and your goals before we ever speak. If Remission Protocol is not the right fit, we tell you — and point you to someone who is.',
    },
    {
        icon: Stethoscope,
        title: 'Physician-guided, coach-delivered',
        body: 'Every plan is co-authored with physician guidance and your head coach, then executed shoulder-to-shoulder. You are never handed a PDF and sent home.',
    },
    {
        icon: Clock,
        title: 'Measured in biomarkers',
        body: 'Quarterly labs, body composition, and continuous glucose monitoring. Progress is read in a lab report — not in how a program feels.',
    },
];

const NEXT_STEPS = [
    { step: '01', title: 'We review your application', body: 'Our physician and head coach read every application personally — usually within two business days.' },
    { step: '02', title: 'A private conversation', body: 'If we see a fit, we invite you to a consultation. Bring your labs, your imaging, and your ambition.' },
    { step: '03', title: 'A plan, or an honest no', body: 'We build your protocol — or, if we cannot meaningfully change your trajectory, we refer you to someone who can.' },
];

const initialForm = {
    name: '',
    email: '',
    phone: '',
    age_range: '',
    location: '',
    primary_goal: '',
    current_health: '',
    recent_diagnosis: '',
    timeline: '',
    referral_source: '',
    why_metx: '',
    expectations: '',
};

const fieldLabel = (label, hint) => (
    <span className="mb-2 block text-sm font-medium text-foreground">
        {label}
        {hint && <span className="ml-1 text-muted-foreground">{hint}</span>}
    </span>
);

const inputClass =
    'w-full rounded-sm border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring';

const ApplyPage = () => {
    const [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formError, setFormError] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError(null);

        if (!form.name.trim() || !form.email.trim()) {
            setFormError('Please share at least your name and email so we can respond.');
            return;
        }
        if (!form.primary_goal) {
            setFormError('Let us know your primary goal — it shapes how we read the rest.');
            return;
        }

        setSubmitting(true);
        try {
            await pb.collection('membership_applications').create({
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                age_range: form.age_range || undefined,
                location: form.location.trim(),
                primary_goal: form.primary_goal,
                current_health: form.current_health.trim(),
                recent_diagnosis: form.recent_diagnosis.trim(),
                timeline: form.timeline || undefined,
                referral_source: form.referral_source || undefined,
                why_metx: form.why_metx.trim(),
                expectations: form.expectations.trim(),
            });
            setSubmitted(true);
            setForm(initialForm);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setFormError(err.message || 'Something went wrong sending your application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Apply for Membership | Remission Protocol — Concierge Health Coaching for Cancer Survivors, Austin TX</title>
                <meta
                    name="description"
                    content="Apply for membership at Remission Protocol, a deliberately small concierge survivorship coaching practice for cancer survivors in Austin, TX. Share your history, your goals, and your timeline — our physician-guided team reviews every application personally."
                />
            </Helmet>

            {/* Hero */}
            <section className="relative overflow-hidden bg-jewel pb-20 pt-40 text-jewel-foreground md:pt-48">
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 18% 22%, var(--brass) 0, transparent 42%), radial-gradient(circle at 82% 70%, var(--brass) 0, transparent 38%)',
                    }}
                    aria-hidden="true"
                />
                <div className="container relative">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brass">
                            Apply for Membership
                        </p>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h1 className="mt-5 max-w-3xl font-display text-4xl font-light leading-[1.05] tracking-tight md:text-6xl">
                            A deliberately small practice.{' '}
                            <em className="font-medium text-brass">Tell us where you stand.</em>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="mt-6 max-w-xl text-base leading-relaxed text-jewel-foreground/75">
                            Remission Protocol accepts a limited number of members so every plan gets
                            physician-guided attention and every session gets a coach. This application is
                            the first step — a thoughtful few minutes that lets our team read your situation
                            before we ever speak.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* Expectations */}
            <section className="border-b border-border bg-card py-20 md:py-24">
                <div className="container">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
                            What to Expect
                        </p>
                        <h2 className="mt-4 max-w-2xl font-display text-3xl font-light tracking-tight text-foreground md:text-4xl">
                            High-touch, honest, and built around your labs — not a sales funnel.
                        </h2>
                    </Reveal>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {EXPECTATIONS.map((item, index) => (
                            <Reveal key={item.title} delay={index * 0.08}>
                                <div className="flex h-full flex-col rounded-sm border border-border bg-background p-7">
                                    <item.icon size={26} className="text-primary" />
                                    <h3 className="mt-5 font-display text-xl font-medium tracking-tight text-foreground">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Application form */}
            <section className="py-20 md:py-24">
                <div className="container">
                    <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
                        {/* Side: what happens next */}
                        <div className="lg:sticky lg:top-28 lg:self-start">
                            <Reveal>
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
                                    What Happens Next
                                </p>
                                <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-foreground md:text-4xl">
                                    From application to plan.
                                </h2>
                                <ol className="mt-10 space-y-8">
                                    {NEXT_STEPS.map((item) => (
                                        <li key={item.step} className="flex gap-5">
                                            <span className="font-display text-3xl font-light text-brass/70">
                                                {item.step}
                                            </span>
                                            <div>
                                                <h3 className="font-display text-lg font-medium tracking-tight text-foreground">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                                    {item.body}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                                <div className="mt-10 rounded-sm border border-brass/30 bg-brass/10 p-6">
                                    <p className="text-sm leading-relaxed text-foreground">
                                        Prefer to start with a paid consultation instead?{' '}
                                        <Link
                                            to="/consultation"
                                            className="font-semibold text-primary transition-colors hover:text-accent"
                                        >
                                            Book a session directly
                                        </Link>
                                        .
                                    </p>
                                </div>
                            </Reveal>
                        </div>

                        {/* Form */}
                        <Reveal delay={0.1}>
                            {submitted ? (
                                <div className="flex h-full flex-col items-start justify-center rounded-sm border border-primary/30 bg-card p-8 md:p-12">
                                    <CheckCircle2 size={36} className="text-primary" />
                                    <h3 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight text-foreground">
                                        Application received.
                                    </h3>
                                    <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                                        Thank you for sharing your story. Our physician and head coach will
                                        review your application personally and respond within two business days.
                                        If we see a fit, we will invite you to a private consultation.
                                    </p>
                                    <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                                        A confirmation has been sent to the email you provided. There is nothing
                                        more you need to do.
                                    </p>
                                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                        <Link
                                            to="/"
                                            className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
                                        >
                                            Return home <ArrowRight size={15} />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setSubmitted(false)}
                                            className="inline-flex h-12 items-center justify-center rounded-sm border border-border px-8 text-sm font-semibold text-foreground transition-all hover:border-primary/50 active:scale-[0.98]"
                                        >
                                            Submit another
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-10 rounded-sm border border-border bg-card p-7 md:p-10"
                                    noValidate
                                >
                                    {/* Section: About you */}
                                    <fieldset className="space-y-5">
                                        <legend className="font-display text-xl font-medium tracking-tight text-foreground">
                                            About you
                                        </legend>
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="apply-name" className="mb-2 block text-sm font-medium text-foreground">
                                                    Full name
                                                </label>
                                                <input
                                                    id="apply-name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    autoComplete="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    className={inputClass}
                                                    placeholder="Your name"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="apply-email" className="mb-2 block text-sm font-medium text-foreground">
                                                    Email
                                                </label>
                                                <input
                                                    id="apply-email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    autoComplete="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    className={inputClass}
                                                    placeholder="you@example.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="apply-phone" className="mb-2 block text-sm font-medium text-foreground">
                                                    Phone <span className="text-muted-foreground">(optional)</span>
                                                </label>
                                                <input
                                                    id="apply-phone"
                                                    name="phone"
                                                    type="tel"
                                                    autoComplete="tel"
                                                    value={form.phone}
                                                    onChange={handleChange}
                                                    className={inputClass}
                                                    placeholder="(512) 555-0100"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="apply-location" className="mb-2 block text-sm font-medium text-foreground">
                                                    City <span className="text-muted-foreground">(optional)</span>
                                                </label>
                                                <input
                                                    id="apply-location"
                                                    name="location"
                                                    type="text"
                                                    value={form.location}
                                                    onChange={handleChange}
                                                    className={inputClass}
                                                    placeholder="Austin, TX"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            {fieldLabel('Age range', '(optional)')}
                                            <select
                                                id="apply-age"
                                                name="age_range"
                                                value={form.age_range}
                                                onChange={handleChange}
                                                className={inputClass}
                                            >
                                                <option value="">Prefer not to say</option>
                                                {AGE_RANGES.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </fieldset>

                                    {/* Section: Your health */}
                                    <fieldset className="space-y-5 border-t border-border pt-8">
                                        <legend className="font-display text-xl font-medium tracking-tight text-foreground">
                                            Your health
                                        </legend>
                                        <div>
                                            {fieldLabel('What is your primary goal?')}
                                            <select
                                                id="apply-goal"
                                                name="primary_goal"
                                                value={form.primary_goal}
                                                onChange={handleChange}
                                                className={inputClass}
                                            >
                                                <option value="">Select a goal</option>
                                                {PRIMARY_GOALS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            {fieldLabel('Where is your health today?', '(optional)')}
                                            <textarea
                                                id="apply-health"
                                                name="current_health"
                                                rows={3}
                                                value={form.current_health}
                                                onChange={handleChange}
                                                className={inputClass}
                                                placeholder="A few sentences on how you feel, what you are managing, and what you have tried."
                                            />
                                        </div>
                                        <div>
                                            {fieldLabel('Any recent diagnosis or labs we should know about?', '(optional)')}
                                            <textarea
                                                id="apply-diagnosis"
                                                name="recent_diagnosis"
                                                rows={2}
                                                value={form.recent_diagnosis}
                                                onChange={handleChange}
                                                className={inputClass}
                                                placeholder="Diagnosis, date, and any recent lab or imaging results that feel relevant."
                                            />
                                        </div>
                                        <div>
                                            {fieldLabel('Your timeline', '(optional)')}
                                            <select
                                                id="apply-timeline"
                                                name="timeline"
                                                value={form.timeline}
                                                onChange={handleChange}
                                                className={inputClass}
                                            >
                                                <option value="">Select a timeline</option>
                                                {TIMELINES.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </fieldset>

                                    {/* Section: The fit */}
                                    <fieldset className="space-y-5 border-t border-border pt-8">
                                        <legend className="font-display text-xl font-medium tracking-tight text-foreground">
                                            The fit
                                        </legend>
                                        <div>
                                            {fieldLabel('Why Remission Protocol, and why now?', '(optional)')}
                                            <textarea
                                                id="apply-why"
                                                name="why_metx"
                                                rows={3}
                                                value={form.why_metx}
                                                onChange={handleChange}
                                                className={inputClass}
                                                placeholder="What brought you to survivorship coaching at this moment in your life?"
                                            />
                                        </div>
                                        <div>
                                            {fieldLabel('What would success look like in a year?', '(optional)')}
                                            <textarea
                                                id="apply-expectations"
                                                name="expectations"
                                                rows={3}
                                                value={form.expectations}
                                                onChange={handleChange}
                                                className={inputClass}
                                                placeholder="The outcome that would make this worth it for you."
                                            />
                                        </div>
                                        <div>
                                            {fieldLabel('How did you find us?', '(optional)')}
                                            <select
                                                id="apply-referral"
                                                name="referral_source"
                                                value={form.referral_source}
                                                onChange={handleChange}
                                                className={inputClass}
                                            >
                                                <option value="">Select a source</option>
                                                {REFERRAL_SOURCES.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </fieldset>

                                    {formError && (
                                        <p className="rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                                            {formError}
                                        </p>
                                    )}

                                    <div className="border-t border-border pt-8">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
                                        >
                                            {submitting ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Send size={15} />
                                            )}
                                            {submitting ? 'Sending application…' : 'Submit application'}
                                        </button>
                                        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                                            Your details are sent securely and reviewed only by our physician and
                                            coaching team. We respond within two business days. Educational
                                            content is not a substitute for personalized medical advice.
                                        </p>
                                    </div>
                                </form>
                            )}
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* CTA band */}
            <section className="relative overflow-hidden bg-oxblood py-20 text-jewel-foreground md:py-24">
                <div className="container relative text-center">
                    <Reveal>
                        <h2 className="mx-auto max-w-2xl font-display text-3xl font-light leading-tight tracking-tight md:text-5xl">
                            Not ready to apply?{' '}
                            <em className="font-medium text-brass">Start with a conversation.</em>
                        </h2>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-jewel-foreground/75">
                            Book a private consultation and bring your history, your labs, and your ambition.
                            We will bring the plan — or an honest referral.
                        </p>
                    </Reveal>
                    <Reveal delay={0.25}>
                        <Link
                            to="/consultation"
                            className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-sm bg-brass px-10 text-sm font-semibold tracking-wide text-white transition-all hover:bg-accent active:scale-[0.98]"
                        >
                            Request a Consultation <ArrowUpRight size={16} />
                        </Link>
                    </Reveal>
                </div>
            </section>
        </>
    );
};

export default ApplyPage;
