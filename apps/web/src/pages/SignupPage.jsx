import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SignupPage = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (password.length < 10) {
            setError('Please choose a password of at least 10 characters.');
            return;
        }

        setSubmitting(true);

        try {
            await signup(email, password, { name });
            navigate('/members');
        } catch (err) {
            setError(
                err?.response?.data?.email?.message ||
                    'We could not create your account. If you already have one, try signing in instead.',
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Create a Member Account | Remission Protocol</title>
                <meta
                    name="description"
                    content="Create a free Remission Protocol member account to unlock the private library of survivorship coaching protocols, checklists, and training blueprints."
                />
            </Helmet>

            <section className="flex min-h-[80vh] items-center bg-jewel px-4 pb-20 pt-32">
                <div className="mx-auto w-full max-w-md">
                    <div className="rounded-sm border border-border bg-card p-8 shadow-xl md:p-10">
                        <h1 className="font-display text-3xl font-light tracking-tight text-foreground">
                            Create your <em className="font-medium text-primary">member account</em>
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Free access to the Met-X protocol library.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label htmlFor="signup-name" className="mb-2 block text-sm font-medium text-foreground">
                                    Full name
                                </label>
                                <input
                                    id="signup-name"
                                    type="text"
                                    required
                                    autoComplete="name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    className="w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="signup-email" className="mb-2 block text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <input
                                    id="signup-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="signup-password" className="mb-2 block text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <input
                                    id="signup-password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    className="w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="At least 10 characters"
                                />
                            </div>

                            {error && (
                                <p className="rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60"
                            >
                                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {submitting ? 'Creating account…' : 'Create account'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Already a member?{' '}
                            <Link to="/login" className="font-semibold text-primary transition-colors hover:text-accent">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SignupPage;
