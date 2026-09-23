import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle2, Send, ArrowUpRight } from 'lucide-react';
import { getProducts } from '@/api/EcommerceApi';
import pb from '@/lib/pocketbaseClient';
import BookingSlotPicker from '@/components/BookingSlotPicker';
import Reveal from '@/components/Reveal';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const TOPICS = [
    { value: 'consultation', label: 'Consultation request' },
    { value: 'membership', label: 'Membership inquiry' },
    { value: 'speaking', label: 'Speaking & press' },
    { value: 'other', label: 'Something else' },
];

const initialForm = { name: '', email: '', phone: '', topic: 'consultation', message: '' };

const ConsultationPage = () => {
    const { toast } = useToast();
    const [products, setProducts] = useState(null);
    const [loadError, setLoadError] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        getProducts()
            .then((response) => {
                if (cancelled) return;
                const bookings = response.products.filter(
                    (product) => product.type?.value === 'booking' && product.purchasable,
                );
                setProducts(bookings);
                setSelectedId(bookings[0]?.id ?? null);
            })
            .catch((err) => {
                if (!cancelled) setLoadError(err.message || 'Could not load consultations.');
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('checkout') === 'cancel') {
            toast({
                title: 'Checkout cancelled',
                description: 'No charge was made. Choose a time whenever you are ready.',
            });
            params.delete('checkout');
            const search = params.toString();
            window.history.replaceState({}, '', `${window.location.pathname}${search ? `?${search}` : ''}`);
        }
    }, [toast]);

    const selectedProduct = useMemo(
        () => (products || []).find((product) => product.id === selectedId) || null,
        [products, selectedId],
    );
    const selectedVariant = selectedProduct?.variants?.[0] || null;

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

        setSubmitting(true);
        try {
            await pb.collection('contact_requests').create({
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                topic: form.topic,
                message: form.message.trim(),
            });
            setSubmitted(true);
            setForm(initialForm);
        } catch (err) {
            setFormError(err.message || 'Something went wrong sending your request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Request a Consultation | Remission Protocol — Austin, TX</title>
                <meta
                    name="description"
                    content="Book a private concierge health coaching consultation with the Remission Protocol physician-guided team in Austin, TX. Choose a date and time, reserve online, and begin the work of thriving after treatment."
                />
            </Helmet>

            <section className="bg-jewel pb-20 pt-40 text-jewel-foreground">
                <div className="container">
                    <Reveal>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brass">
                            Begin Here
                        </p>
                        <h1 className="mt-5 max-w-3xl font-display text-4xl font-light leading-tight tracking-tight md:text-6xl">
                            Request your <em className="font-medium text-brass">consultation.</em>
                        </h1>
                        <p className="mt-6 max-w-xl text-base leading-relaxed text-jewel-foreground/75">
                            Choose a session, pick a time that respects your calendar, and reserve it online.
                            Every consultation is private, unhurried, and led by our physician-guided coaching
                            team together.
                        </p>
                    </Reveal>
                </div>
            </section>

            <section className="py-20 md:py-24">
                <div className="container grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
                    <div>
                        <Reveal>
                            <h2 className="font-display text-2xl font-light tracking-tight text-foreground md:text-3xl">
                                1 · Choose your session
                            </h2>
                        </Reveal>

                        {products === null && !loadError && (
                            <div className="mt-10 flex items-center gap-3 text-muted-foreground">
                                <Loader2 className="h-5 w-5 animate-spin" /> Loading sessions…
                            </div>
                        )}

                        {loadError && (
                            <p className="mt-10 rounded-sm border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                                {loadError} Please refresh the page to try again.
                            </p>
                        )}

                        {products !== null && products.length === 0 && !loadError && (
                            <p className="mt-10 text-sm text-muted-foreground">
                                Online booking is temporarily unavailable — please use the request form below
                                and we will schedule you personally.
                            </p>
                        )}

                        <div className="mt-8 space-y-4">
                            {(products || []).map((product, index) => {
                                const variant = product.variants?.[0];
                                const isSelected = product.id === selectedId;

                                return (
                                    <Reveal key={product.id} delay={index * 0.08}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedId(product.id)}
                                            aria-pressed={isSelected}
                                            className={cn(
                                                'w-full rounded-sm border p-6 text-left transition-all active:scale-[0.99]',
                                                isSelected
                                                    ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                                                    : 'border-border bg-card hover:border-primary/50',
                                            )}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="font-display text-xl font-medium leading-snug tracking-tight">
                                                        {product.title}
                                                    </h3>
                                                    <p
                                                        className={cn(
                                                            'mt-2 text-sm leading-relaxed',
                                                            isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground',
                                                        )}
                                                    >
                                                        {product.subtitle || 'Private session with the Remission Protocol physician-guided coaching team.'}
                                                    </p>
                                                </div>
                                                {variant && (
                                                    <span
                                                        className={cn(
                                                            'shrink-0 font-display text-2xl font-light',
                                                            isSelected ? 'text-brass' : 'text-accent',
                                                        )}
                                                    >
                                                        {variant.sale_price_formatted || variant.price_formatted}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <Reveal delay={0.1}>
                            <h2 className="font-display text-2xl font-light tracking-tight text-foreground md:text-3xl">
                                2 · Pick your time
                            </h2>
                            <div className="mt-8 rounded-sm border border-border bg-card p-6 md:p-8">
                                {selectedProduct && selectedVariant ? (
                                    <BookingSlotPicker
                                        key={selectedProduct.id}
                                        product={selectedProduct}
                                        variant={selectedVariant}
                                    />
                                ) : (
                                    products !== null && (
                                        <p className="text-sm text-muted-foreground">
                                            Select a session to see available times.
                                        </p>
                                    )
                                )}
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            <section className="pb-24 md:pb-32">
                <div className="container grid gap-12 rounded-sm bg-secondary/60 p-8 md:p-14 lg:grid-cols-[1fr_1.2fr]">
                    <Reveal>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
                                Prefer a conversation first?
                            </p>
                            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-foreground md:text-4xl">
                                Tell us where you are. We&apos;ll tell you honestly if we can help.
                            </h2>
                            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                                Share a few details and our team will respond within one business day. If
                                Remission Protocol isn&apos;t the right fit for your situation, we will say so — and
                                suggest who is.
                            </p>
                            <Link
                                to="/apply"
                                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
                            >
                                Looking for full membership? Apply here <ArrowUpRight size={14} />
                            </Link>
                        </div>
                    </Reveal>

                    <Reveal delay={0.1}>
                        {submitted ? (
                            <div className="flex h-full flex-col items-start justify-center rounded-sm border border-primary/30 bg-card p-8">
                                <CheckCircle2 size={32} className="text-primary" />
                                <h3 className="mt-4 font-display text-2xl font-medium tracking-tight text-foreground">
                                    Request received.
                                </h3>
                                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                                    Thank you for reaching out. A member of our team will respond within one
                                    business day.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSubmitted(false)}
                                    className="mt-6 text-sm font-semibold text-primary transition-colors hover:text-accent"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-foreground">
                                            Full name
                                        </label>
                                        <input
                                            id="contact-name"
                                            name="name"
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={handleChange}
                                            className="w-full rounded-sm border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-foreground">
                                            Email
                                        </label>
                                        <input
                                            id="contact-email"
                                            name="email"
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={handleChange}
                                            className="w-full rounded-sm border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium text-foreground">
                                            Phone <span className="text-muted-foreground">(optional)</span>
                                        </label>
                                        <input
                                            id="contact-phone"
                                            name="phone"
                                            type="tel"
                                            value={form.phone}
                                            onChange={handleChange}
                                            className="w-full rounded-sm border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="(512) 555-0100"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-topic" className="mb-2 block text-sm font-medium text-foreground">
                                            Topic
                                        </label>
                                        <select
                                            id="contact-topic"
                                            name="topic"
                                            value={form.topic}
                                            onChange={handleChange}
                                            className="w-full rounded-sm border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            {TOPICS.map((topic) => (
                                                <option key={topic.value} value={topic.value}>
                                                    {topic.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-foreground">
                                        What should we know?
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        rows={4}
                                        value={form.message}
                                        onChange={handleChange}
                                        className="w-full rounded-sm border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        placeholder="Your goals, your diagnosis, your timeline — whatever feels relevant."
                                    />
                                </div>

                                {formError && (
                                    <p className="rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                                        {formError}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60"
                                >
                                    {submitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send size={15} />
                                    )}
                                    {submitting ? 'Sending…' : 'Send request'}
                                </button>
                            </form>
                        )}
                    </Reveal>
                </div>
            </section>
        </>
    );
};

export default ConsultationPage;
