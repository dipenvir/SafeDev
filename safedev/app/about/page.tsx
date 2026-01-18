"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ShieldCheck,
  Heart,
  Target,
  Users,
  Lightbulb,
  ArrowRight,
  Code2,
  Lock,
  Zap,
  Globe,
  ScanSearch,
  KeyRound,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.42, 0, 0.58, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function ValueCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
        <Icon className="h-6 w-6 text-indigo-200" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/70">{description}</p>
    </motion.div>
  );
}

function PrincipleItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div variants={fadeUp} className="flex gap-4">
      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20">
        <div className="h-2 w-2 rounded-full bg-indigo-200" />
      </div>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="mt-1 text-sm text-white/70">{description}</p>
      </div>
    </motion.div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        variants={fadeUp}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-xl h-full"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
        </div>

        <div className="relative">
          <div className="mb-4 inline-flex rounded-xl border border-white/10 bg-white/5 p-3">
            <Icon className="h-6 w-6 text-indigo-200" />
          </div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/70">{description}</p>

          <div className="mt-5 flex items-center gap-2 text-sm font-medium text-indigo-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Learn more <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function AboutPage() {
  return (
    <div className="font-sans text-gray-900">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#070A12] text-white">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          <motion.div
            className="absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl"
            animate={{ y: [0, 18, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: EASE_IN_OUT }}
          />
          <motion.div
            className="absolute -bottom-56 -right-24 h-130 w-130 rounded-full bg-fuchsia-500/20 blur-3xl"
            animate={{ x: [0, -16, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: EASE_IN_OUT }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(217,70,239,0.14),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.10] bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[56px_56px]" />
        </motion.div>

        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur"
            >
              <Heart className="h-4 w-4 text-indigo-200" />
              About SafeDev
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-balance text-4xl font-bold tracking-tight md:text-6xl"
            >
              Security should{" "}
              <span className="bg-linear-to-r from-indigo-200 via-white to-fuchsia-200 bg-clip-text text-transparent">
                empower developers
              </span>
              , not slow them down
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-white/70"
            >
              We built SafeDev because we believe security tools should be fast,
              clear, and designed for the people who write code — not just the
              people who audit it.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="bg-[#070A12] py-20">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div variants={fadeUp} className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
                <Lightbulb className="h-4 w-4 text-indigo-200" />
                Our Story
              </div>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-center text-3xl font-bold text-white md:text-4xl"
            >
              Why we built SafeDev
            </motion.h2>

            <motion.div
              variants={fadeUp}
              className="mt-8 space-y-6 text-lg leading-8 text-white/70"
            >
              <p>
                We&apos;ve all been there: a leaked API key in a commit history,
                a JWT with no expiration, a secret accidentally pushed to a
                public repo. These mistakes are easy to make and painful to fix.
              </p>
              <p>
                Most security tools are built for security teams — complex
                dashboards, overwhelming alerts, and reports that require a PhD
                to understand. Developers are left piecing together context from
                scattered tools and generic advice.
              </p>
              <p>
                <strong className="text-white">SafeDev is different.</strong>{" "}
                We built it from the ground up for developers who want to ship
                secure code without becoming full-time security engineers.
                Real-time scanning, clear explanations, and actionable fixes —
                all designed to fit into your existing workflow.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-[#070A12] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div variants={fadeUp} className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-indigo-200" />
                Our Features
              </div>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-center text-3xl font-bold text-white md:text-4xl"
            >
              Tools to secure your code
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-2xl text-center text-white/65"
            >
              Explore our suite of security tools designed for modern developers.
            </motion.p>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon={ScanSearch}
                title="GitHub Scanner"
                description="Detect hardcoded secrets, API keys, and risky patterns across your repositories with real-time streaming results."
                href="/features/github-scanner"
              />

              <FeatureCard
                icon={KeyRound}
                title="JWT Inspector"
                description="Decode, validate, and analyze JWTs for expiry issues, weak algorithms, and claim vulnerabilities."
                href="/features/jwt-inspector"
              />

              <FeatureCard
                icon={ShieldCheck}
                title="Security Advisor"
                description="Get a clear security score with prioritized remediation steps tailored to your codebase."
                href="/features/security-advisor"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="bg-[#070A12] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div variants={fadeUp} className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
                <Target className="h-4 w-4 text-indigo-200" />
                Our Values
              </div>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-center text-3xl font-bold text-white md:text-4xl"
            >
              What we believe in
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-2xl text-center text-white/65"
            >
              These principles guide everything we build at SafeDev.
            </motion.p>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <ValueCard
                icon={Code2}
                title="Developer-First"
                description="Built by developers, for developers. We optimize for your workflow, not ours."
              />
              <ValueCard
                icon={Zap}
                title="Speed Matters"
                description="Security shouldn't slow you down. Get answers in seconds, not hours."
              />
              <ValueCard
                icon={Lock}
                title="Privacy by Default"
                description="Your code is yours. We don't store it, sell it, or train on it."
              />
              <ValueCard
                icon={Globe}
                title="Open & Transparent"
                description="Clear explanations, honest limitations, and no security theater."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* OUR PRINCIPLES */}
      <section className="bg-[#070A12] py-20">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div variants={fadeUp} className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-indigo-200" />
                How We Work
              </div>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-center text-3xl font-bold text-white md:text-4xl"
            >
              Our approach to security
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-2xl text-center text-white/65"
            >
              We don&apos;t just find problems — we help you understand and fix
              them.
            </motion.p>

            <div className="mt-12 space-y-8">
              <PrincipleItem
                title="Actionable over comprehensive"
                description="We focus on issues you can actually fix, prioritized by real-world impact. No noise, no false positives drowning out real risks."
              />
              <PrincipleItem
                title="Context, not just alerts"
                description="Every finding comes with explanation: what it means, why it matters, and exactly how to fix it. No cryptic error codes or generic advice."
              />
              <PrincipleItem
                title="Shift left, but realistically"
                description="Catch issues early without breaking your flow. We integrate where you already work — your IDE, your CI, your GitHub workflow."
              />
              <PrincipleItem
                title="Continuous improvement"
                description="Security isn't a checkbox. Track your progress, measure improvements, and build better habits over time."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* TEAM / OPEN SOURCE */}
      <section className="bg-[#070A12] py-20">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div variants={fadeUp} className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
                <Users className="h-4 w-4 text-indigo-200" />
                Open Source
              </div>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-center text-3xl font-bold text-white md:text-4xl"
            >
              Built in the open
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-2xl text-center text-white/65"
            >
              SafeDev is open source because security tools should be
              transparent. You can inspect our code, contribute improvements,
              and trust what we&apos;re doing with your data.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <a
                href="https://github.com/dipenvir/SafeDev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#070A12] transition hover:bg-white/90"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View on GitHub
              </a>
              <Link
                href="/github"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/8"
              >
                Try SafeDev
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#070A12] py-20">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/4 p-10 text-center backdrop-blur"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Ready to secure your code?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/70">
                Start scanning your repositories in under a minute. No setup
                required, no credit card needed.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/github"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#070A12] shadow-lg shadow-indigo-500/10 transition hover:bg-white/90"
                >
                  Start Scanning Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/8"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
