"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ShieldCheck,
  KeyRound,
  ScanSearch,
  BadgeCheck,
  GitBranch,
  Sparkles,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";

// ✅ Typed easing tuples (fixes TS errors in newer framer-motion types)
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

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-xl"
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
  );
}

function Step({
  num,
  title,
  text,
  icon: Icon,
}: {
  num: string;
  title: string;
  text: string;
  icon: LucideIcon;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-semibold tracking-wide text-indigo-600">
              STEP {num}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-200">{num}</div>
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-600">{text}</p>
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="font-sans text-gray-900">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#070A12] text-white">
        {/* Animated background */}
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
            className="absolute -bottom-56 -left-24 h-130 w-130 rounded-full bg-fuchsia-500/20 blur-3xl"
            animate={{ x: [0, 16, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: EASE_IN_OUT }}
          />

          {/* Subtle gradient + grid */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(217,70,239,0.14),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.10] bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[56px_56px]" />
        </motion.div>

        <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-32">
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
              <Sparkles className="h-4 w-4 text-indigo-200" />
              SafeDev — Developer-first security
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-balance text-5xl font-bold tracking-tight md:text-6xl"
            >
              Secure your code and tokens with{" "}
              <span className="bg-linear-to-r from-indigo-200 via-white to-fuchsia-200 bg-clip-text text-transparent">
                SafeDev
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-white/70 md:text-xl"
            >
              Scan GitHub repositories, inspect JWTs, and get clear, actionable
              security guidance in minutes.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <a
                href="#signup"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#070A12] shadow-lg shadow-indigo-500/10 transition hover:bg-white/90"
              >
                Get Early Access
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/8"
              >
                View Features
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {[
                { icon: ShieldCheck, label: "Secure-by-design" },
                { icon: GitBranch, label: "GitHub-native workflows" },
                { icon: BadgeCheck, label: "Actionable remediation" },
              ].map((it, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white/70 backdrop-blur"
                >
                  <it.icon className="h-4 w-4 text-indigo-200" />
                  {it.label}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-[#070A12] pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.h2
              variants={fadeUp}
              className="text-center text-3xl font-bold text-white md:text-4xl"
            >
              SafeDev Features
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-2xl text-center text-white/65"
            >
              Built for developers who want clarity, speed, and practical next
              steps.
            </motion.p>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Link href="/features/jwt-inspector" className="block">
                <Feature
                  icon={KeyRound}
                  title="JWT Inspector"
                  description="Decode, validate, and analyze JWTs for expiry, claims, and signing risks."
                />
              </Link>

              <Link href="/features/github-scanner" className="block">
                <Feature
                  icon={ScanSearch}
                  title="GitHub Scanner"
                  description="Detect hardcoded secrets, tokens, and insecure patterns across repositories."
                />
              </Link>

              <Link href="/features/security-advisor" className="block">
                <Feature
                  icon={ShieldCheck}
                  title="Security Advisor"
                  description="Receive a clear security score with prioritized remediation steps."
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.h2
              variants={fadeUp}
              className="text-center text-3xl font-bold text-gray-900 md:text-4xl"
            >
              How SafeDev Works
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-2xl text-center text-gray-600"
            >
              Three simple steps to reduce risk and ship with confidence.
            </motion.p>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Step
                num="1"
                icon={GitBranch}
                title="Scan"
                text="Connect repositories or paste tokens securely. No heavy setup required."
              />
              <Step
                num="2"
                icon={ScanSearch}
                title="Detect"
                text="Identify secrets, misconfigurations, and token vulnerabilities."
              />
              <Step
                num="3"
                icon={BadgeCheck}
                title="Fix"
                text="Apply clear remediation guidance and verify improvements instantly."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section id="signup" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-200/50 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-fuchsia-200/40 blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Get Early Access to SafeDev
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-gray-600">
                Join the waitlist and secure your projects before issues ship to
                production.
              </p>

              <form
                className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="h-12 flex-1 rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                >
                  Join Waitlist
                </button>
              </form>

              <p className="mt-4 text-xs text-gray-500">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
