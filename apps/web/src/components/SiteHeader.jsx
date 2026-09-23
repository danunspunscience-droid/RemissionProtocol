import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
    { to: '/about', label: 'About' },
    { to: '/#method', label: 'The Method' },
    { to: '/resources', label: 'Resources' },
    { to: '/library', label: 'Content Library' },
    { to: '/members', label: 'Member Access' },
    { to: '/apply', label: 'Apply' },
];

const Wordmark = ({ onDark }) => (
    <Link to="/" className="flex flex-col leading-none" aria-label="Remission Protocol home">
        <span className={cn(
            'font-display text-2xl font-semibold tracking-tight',
            onDark ? 'text-jewel-foreground' : 'text-primary',
        )}>
            Remission
        </span>
        <span className={cn(
            'text-[0.6rem] font-medium uppercase tracking-[0.35em]',
            onDark ? 'text-brass' : 'text-accent',
        )}>
            Protocol
        </span>
    </Link>
);

const SiteHeader = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthed, logout } = useAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 32);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname, location.hash]);

    const onDarkHero = location.pathname === '/' && !scrolled && !menuOpen;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
                onDarkHero
                    ? 'bg-transparent'
                    : 'border-b border-border bg-background/95 backdrop-blur',
            )}
        >
            <div className="container flex h-20 items-center justify-between gap-6">
                <Wordmark />

                <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            className={cn(
                                'text-sm font-medium tracking-wide transition-colors',
                                onDarkHero
                                    ? 'text-jewel-foreground/85 hover:text-jewel-foreground'
                                    : 'text-foreground/75 hover:text-foreground',
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {isAuthed ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className={cn(
                                'inline-flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors',
                                onDarkHero
                                    ? 'text-jewel-foreground/85 hover:text-jewel-foreground'
                                    : 'text-foreground/75 hover:text-foreground',
                            )}
                        >
                            <LogOut size={14} /> Sign out
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className={cn(
                                'text-sm font-medium tracking-wide transition-colors',
                                onDarkHero
                                    ? 'text-jewel-foreground/85 hover:text-jewel-foreground'
                                    : 'text-foreground/75 hover:text-foreground',
                            )}
                        >
                            Member Login
                        </Link>
                    )}
                    <Link
                        to="/consultation"
                        className={cn(
                            'inline-flex h-11 items-center gap-2 rounded-sm px-5 text-sm font-semibold tracking-wide transition-all active:scale-[0.98]',
                            onDarkHero
                                ? 'bg-brass text-white hover:bg-accent'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90',
                        )}
                    >
                        Request a Consultation <ArrowRight size={15} />
                    </Link>
                </nav>

                <button
                    type="button"
                    className={cn(
                        'inline-flex h-11 w-11 items-center justify-center md:hidden',
                        onDarkHero ? 'text-jewel-foreground' : 'text-foreground',
                    )}
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {menuOpen && (
                <div className="border-b border-border bg-background md:hidden">
                    <nav className="container flex flex-col gap-1 py-4" aria-label="Mobile">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="rounded-sm px-2 py-3 text-base font-medium text-foreground/80 hover:bg-muted"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAuthed ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-sm px-2 py-3 text-left text-base font-medium text-foreground/80 hover:bg-muted"
                            >
                                Sign out
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="rounded-sm px-2 py-3 text-base font-medium text-foreground/80 hover:bg-muted"
                            >
                                Member Login
                            </Link>
                        )}
                        <Link
                            to="/consultation"
                            className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-5 text-sm font-semibold text-primary-foreground"
                        >
                            Request a Consultation <ArrowRight size={15} />
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default SiteHeader;
