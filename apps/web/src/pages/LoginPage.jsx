import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            await login(email, password);
            navigate('/members');
        } catch (err) {
            setError('We could not sign you in with those credentials. Please check your email and password.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Member Login | Remission Protocol</title>
                <meta
                    name="description"
                    content="Sign in to your Remission Protocol member account to access the private resource library."
                />
            </Helmet>

            <section className="flex min-h-[80vh] items-center bg-jewel px-4 pb-20 pt-32">
                <div className="mx-auto w-full max-w-md">
                    <div className="rounded-sm border border-border bg-card p-8 shadow-xl md:p-10">
                        <h1 className="font-display text-3xl font-light tracking-tight text-foreground">
                            Member <em className="font-medium text-primary">login</em>
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Access the member resource library.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-foreground">
                                    Email
                                </label>
                                <input
                                    id="login-email"
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
                                <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <input
                                    id="login-password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    className="w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Your password"
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
                                {submitting ? 'Signing in…' : 'Sign in'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            No account yet?{' '}
                            <Link to="/signup" className="font-semibold text-primary transition-colors hover:text-accent">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LoginPage;
