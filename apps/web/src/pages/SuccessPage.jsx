import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Reveal from '@/components/Reveal';

const SuccessPage = () => {
    return (
        <>
            <Helmet>
                <title>Consultation Confirmed | Remission Protocol</title>
                <meta
                    name="description"
                    content="Your Remission Protocol consultation is confirmed. We look forward to meeting you in Austin."
                />
            </Helmet>

            <section className="flex min-h-[80vh] items-center bg-jewel px-4 pb-20 pt-32 text-jewel-foreground">
                <div className="mx-auto w-full max-w-2xl text-center">
                    <Reveal>
                        <CheckCircle2 size={56} className="mx-auto text-brass" />
                        <h1 className="mt-8 font-display text-4xl font-light leading-tight tracking-tight md:text-6xl">
                            You&apos;re <em className="font-medium text-brass">booked.</em>
                        </h1>
                        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-jewel-foreground/75">
                            Your consultation is confirmed and a receipt is on its way to your inbox. Before
                            we meet, gather any recent labs, imaging, or medication lists — the more data we
                            have, the sharper the conversation.
                        </p>
                        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                to="/resources"
                                className="inline-flex items-center justify-center gap-2 rounded-sm bg-brass px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent active:scale-[0.98]"
                            >
                                Browse the Resource Hub <ArrowRight size={15} />
                            </Link>
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 rounded-sm border border-jewel-foreground/40 px-8 py-3.5 text-sm font-semibold text-jewel-foreground transition-all hover:border-jewel-foreground hover:bg-jewel-foreground/10 active:scale-[0.98]"
                            >
                                Return home
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>
        </>
    );
};

export default SuccessPage;
