"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    CheckCircle2,
    GitBranch,
    KeyRound,
    ScanSearch,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

type FeatureKey = "jwt-inspector" | "github-scanner" | "security-advisor";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.42, 0, 0.58, 1];

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.6, ease: EASE_OUT },
    },
};

type FeatureData = {
    slug: FeatureKey;
    name: string;
    tagline: string;
    summary: string;
    iconName: "key" | "scan" | "shield";
    bullets: string[];
    works: { title: string; desc: string; iconName: "sparkles" | "git" | "scan" | "badge" | "check" | "shield" }[];
    outputs: { label: string; value: string }[];
    details: { intro: string; sections: { title: string; points: string[] }[] };
    cta: { title: string; desc: string };
    next: FeatureKey;
    prev: FeatureKey;
};

const ICONS = {
    key: KeyRound,
    scan: ScanSearch,
    shield: ShieldCheck,
    sparkles: Sparkles,
    git: GitBranch,
    badge: BadgeCheck,
    check: CheckCircle2,
} as const;

function Pill({ text }: { text: string }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
            <CheckCircle2 className="h-4 w-4 text-indigo-200" />
            {text}
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur">
            <div className="text-xs font-semibold tracking-wide text-white/60">
                {label}
            </div>
            <div className="mt-2 text-base font-semibold text-white">{value}</div>
        </div>
    );
}

export default function FeatureClient({
    feature,
    prev,
    next,
}: {
    feature: FeatureData;
    prev: FeatureData;
    next: FeatureData;
}) {
    const Icon = ICONS[feature.iconName];

    return (
        <div className="font-sans text-gray-900">
            {/* HERO */}
            <section className="relative isolate overflow-hidden bg-[#070A12] text-white min-h-[70vh] flex items-center">
                <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease: EASE_OUT }}
                >
                    {/* Dynamic glows based on feature */}
                    <motion.div
                        className="absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl"
                        animate={{ 
                            y: [0, 20, 0], 
                            scale: [1, 1.08, 1],
                            opacity: [0.25, 0.35, 0.25]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: EASE_IN_OUT }}
                    />
                    <motion.div
                        className="absolute -bottom-56 -left-24 h-120 w-120 rounded-full bg-fuchsia-500/20 blur-3xl"
                        animate={{ 
                            x: [0, 16, 0], 
                            scale: [1, 1.05, 1],
                            opacity: [0.2, 0.28, 0.2]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: EASE_IN_OUT }}
                    />
                    <motion.div
                        className="absolute top-1/4 -right-20 h-75 w-75 rounded-full bg-cyan-500/15 blur-3xl"
                        animate={{ 
                            y: [0, -20, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 9, repeat: Infinity, ease: EASE_IN_OUT, delay: 1 }}
                    />
                    
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(217,70,239,0.14),transparent_55%)]" />
                    <div className="absolute inset-0 opacity-[0.10] bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[56px_56px]" />
                    
                    {/* Animated dots */}
                    {[15, 78, 42, 91, 6, 63, 27, 84, 51, 33, 69, 12, 88, 45, 22, 76, 38, 94, 57, 8].map((left, i) => (
                        <motion.div
                            key={i}
                            className="absolute h-3 w-3 rounded-full bg-white/55"
                            style={{
                                left: `${left}%`,
                                top: `${[31, 72, 14, 58, 89, 23, 67, 41, 85, 9, 52, 78, 36, 93, 18, 64, 47, 81, 27, 73][i]}%`,
                            }}
                            animate={{
                                y: [0, -20 - (i % 5) * 3, 0],
                                opacity: [0.35, 0.85, 0.35],
                            }}
                            transition={{
                                duration: 4 + (i % 5) * 0.3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.15,
                            }}
                        />
                    ))}
                </motion.div>

                <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-24">
                    <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-3xl">
                        <motion.div variants={fadeUp}>
                            <Link
                                href="/about#features"
                                className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition group"
                            >
                                <motion.span whileHover={{ x: -4 }} transition={{ type: "spring", stiffness: 400 }}>
                                    <ArrowLeft className="h-4 w-4" />
                                </motion.span>
                                Back to Features
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur"
                        >
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="h-4 w-4 text-indigo-200" />
                            </motion.div>
                            SafeDev Feature
                        </motion.div>

                        <motion.div variants={fadeUp} className="mt-6 flex items-center gap-4">
                            <motion.div 
                                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
                                whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.2)" }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <motion.div
                                    animate={{ 
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Icon className="h-7 w-7 text-indigo-200" />
                                </motion.div>
                            </motion.div>
                            <div>
                                <motion.h1 
                                    className="text-4xl font-bold tracking-tight md:text-5xl"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                >
                                    {feature.name}
                                </motion.h1>
                                <motion.p 
                                    className="mt-1 text-white/70"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    {feature.tagline}
                                </motion.p>
                            </div>
                        </motion.div>

                        <motion.p variants={fadeUp} className="mt-6 text-lg leading-7 text-white/70">
                            {feature.summary}
                        </motion.p>

                        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                            {feature.bullets.slice(0, 3).map((b, i) => (
                                <motion.div
                                    key={b}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                >
                                    <Pill text={b} />
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-3 sm:flex-row">
                            <motion.a
                                href="/github"
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#070A12] shadow-lg shadow-indigo-500/10 transition hover:bg-white/90"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Try Now
                                <motion.span whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400 }}>
                                    <ArrowRight className="h-4 w-4" />
                                </motion.span>
                            </motion.a>

                            <motion.a
                                href="#details"
                                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/8"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                See Details
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* DETAILS */}
            <section id="details" className="bg-[#070A12] pt-16 pb-20">
                <div className="mx-auto max-w-6xl px-6">
                    <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                        <motion.h2 variants={fadeUp} className="text-center text-3xl font-bold text-white md:text-4xl">
                            What you get
                        </motion.h2>

                        <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-2xl text-center text-white/65">
                            Clear outcomes, practical insights, and steps you can take right away.
                        </motion.p>

                        <div className="mt-12 grid gap-6 md:grid-cols-3">
                            {feature.outputs.map((o) => (
                                <motion.div key={o.label} variants={fadeUp}>
                                    <Stat label={o.label} value={o.value} />
                                </motion.div>
                            ))}
                        </div>
                        <motion.h3
                            variants={fadeUp}
                            className="mt-16 text-2xl font-bold text-white"
                        >
                            What it does?
                        </motion.h3>

                        <motion.p
                            variants={fadeUp}
                            className="mt-3 text-white/65"
                        >
                            {feature.details.intro}
                        </motion.p>

                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                            {feature.details.sections.map((sec: { title: string; points: string[] }) => (
                                <motion.div
                                    key={sec.title}
                                    variants={fadeUp}
                                    className="rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur"
                                >
                                    <h4 className="text-lg font-semibold text-white">{sec.title}</h4>
                                    <ul className="mt-3 space-y-2 text-sm leading-6 text-white/70">
                                        {sec.points.map((p: string) => (
                                            <li key={p} className="flex gap-2">
                                                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-indigo-300/80" />
                                                <span>{p}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>

                        <motion.h3 variants={fadeUp} className="mt-16 text-2xl font-bold text-white">
                            How it works
                        </motion.h3>

                        <div className="mt-6 grid gap-6 md:grid-cols-3">
                            {feature.works.map((s) => {
                                const StepIcon = ICONS[s.iconName];
                                return (
                                    <motion.div
                                        key={s.title}
                                        variants={fadeUp}
                                        className="rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur"
                                    >
                                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/90 text-white">
                                            <StepIcon className="h-5 w-5" />
                                        </div>
                                        <h4 className="mt-4 text-lg font-semibold text-white">{s.title}</h4>
                                        <p className="mt-2 text-sm leading-6 text-white/70">{s.desc}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA + NAV */}
            <section className="bg-[#070A12] py-20">
                <div className="mx-auto max-w-4xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, ease: EASE_OUT }}
                        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/4 p-10 text-center backdrop-blur"
                    >
                        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
                        <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

                        <div className="relative">
                            <h2 className="text-3xl font-bold text-white md:text-4xl">{feature.cta.title}</h2>
                            <p className="mx-auto mt-3 max-w-2xl text-white/70">{feature.cta.desc}</p>

                            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Link
                                    href="/github"
                                    className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-[#070A12] shadow-lg shadow-indigo-500/10 transition hover:bg-white/90"
                                >
                                    Get Started
                                </Link>

                                <Link
                                    href="/about"
                                    className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/8"
                                >
                                    Explore all features
                                </Link>
                            </div>

                            <div className="mt-10 grid gap-3 sm:grid-cols-2">
                                <Link
                                    href={`/features/${prev.slug}`}
                                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/4 p-5 text-left backdrop-blur transition hover:bg-white/8"
                                >
                                    <div>
                                        <div className="text-xs font-semibold text-white/50">Previous</div>
                                        <div className="mt-1 text-base font-semibold text-white">{prev.name}</div>
                                    </div>
                                    <ArrowLeft className="h-5 w-5 text-white/50 transition group-hover:-translate-x-0.5" />
                                </Link>

                                <Link
                                    href={`/features/${next.slug}`}
                                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/4 p-5 text-left backdrop-blur transition hover:bg-white/8"
                                >
                                    <div>
                                        <div className="text-xs font-semibold text-white/50">Next</div>
                                        <div className="mt-1 text-base font-semibold text-white">{next.name}</div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-white/50 transition group-hover:translate-x-0.5" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
