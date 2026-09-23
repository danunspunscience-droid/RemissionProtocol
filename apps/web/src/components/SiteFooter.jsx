import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, ArrowUpRight } from 'lucide-react';

const SiteFooter = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-jewel text-jewel-foreground">
            <div className="container grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
                <div>
                    <div className="flex flex-col leading-none">
                        <span className="font-display text-3xl font-semibold tracking-tight">Remission</span>
                        <span className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-brass">
                            Protocol
                        </span>
                    </div>
                    <p className="mt-6 max-w-sm text-sm leading-relaxed text-jewel-foreground/70">
                        A concierge health coaching service for cancer survivors — physician-guided,
                        coach-delivered, and measured in biomarkers, not promises. For people who
                        refuse to simply manage disease.
                    </p>
                </div>

                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-brass">Explore</h3>
                    <ul className="mt-5 space-y-3 text-sm">
                        <li><Link to="/about" className="text-jewel-foreground/80 transition-colors hover:text-jewel-foreground">About</Link></li>
                        <li><Link to="/#method" className="text-jewel-foreground/80 transition-colors hover:text-jewel-foreground">The Method</Link></li>
                        <li><Link to="/resources" className="text-jewel-foreground/80 transition-colors hover:text-jewel-foreground">Resources</Link></li>
                        <li><Link to="/library" className="text-jewel-foreground/80 transition-colors hover:text-jewel-foreground">Content Library</Link></li>
                        <li><Link to="/members" className="text-jewel-foreground/80 transition-colors hover:text-jewel-foreground">Member Access</Link></li>
                        <li><Link to="/apply" className="text-jewel-foreground/80 transition-colors hover:text-jewel-foreground">Apply for Membership</Link></li>
                        <li><Link to="/consultation" className="text-jewel-foreground/80 transition-colors hover:text-jewel-foreground">Request a Consultation</Link></li>
                        <li><Link to="/login" className="text-jewel-foreground/80 transition-colors hover:text-jewel-foreground">Member Login</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-brass">Contact</h3>
                    <ul className="mt-5 space-y-3 text-sm text-jewel-foreground/80">
                        <li className="flex items-start gap-2">
                            <MapPin size={15} className="mt-0.5 shrink-0 text-brass" />
                            <span>Westlake Hills, Austin, Texas</span>
                        </li>
                        <li>
                            <a href="mailto:hello@metxbootcamp.com" className="flex items-start gap-2 transition-colors hover:text-jewel-foreground">
                                <Mail size={15} className="mt-0.5 shrink-0 text-brass" />
                                <span>hello@metxbootcamp.com</span>
                            </a>
                        </li>
                        <li>
                            <Link to="/consultation" className="inline-flex items-center gap-1 font-medium text-brass transition-colors hover:text-jewel-foreground">
                                Begin the conversation <ArrowUpRight size={14} />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-jewel-foreground/15">
                <div className="container flex flex-col gap-2 py-6 text-xs text-jewel-foreground/50 md:flex-row md:items-center md:justify-between">
                    <p>© {year} Remission Protocol. All rights reserved.</p>
                    <p>Educational content is not a substitute for personalized medical advice.</p>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;
