"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ShieldCheck,
  KeyRound,
  ScanSearch,
  BadgeCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Zap,
  Eye,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import GithubIcon from "../components/GithubIcon";

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

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur text-center"
    >
      <div className="text-3xl font-bold text-white md:text-4xl">{value}</div>
      <div className="mt-2 text-sm text-white/60">{label}</div>
    </motion.div>
  );
}

function BenefitItem({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20">
        <Icon className="h-3.5 w-3.5 text-indigo-200" />
      </div>
      <span className="text-white/80">{text}</span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="font-sans text-gray-900">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#070A12] text-white min-h-screen flex items-center">
        {/* Animated background */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          {/* Primary glow */}
          <motion.div
            className="absolute -top-40 left-1/2 h-150 w-150 -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              y: [0, 30, 0], 
              scale: [1, 1.1, 1],
              opacity: [0.25, 0.35, 0.25]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: EASE_IN_OUT }}
          />
          
          {/* Secondary glow */}
          <motion.div
            className="absolute -bottom-56 -left-24 h-130 w-130 rounded-full bg-fuchsia-500/20 blur-3xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              x: [0, 20, 0], 
              scale: [1, 1.08, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: EASE_IN_OUT, delay: 0.5 }}
          />
          
          {/* Tertiary glow */}
          <motion.div
            className="absolute top-1/3 -right-32 h-100 w-100 rounded-full bg-cyan-500/15 blur-3xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              y: [0, -25, 0],
              x: [0, -15, 0],
              scale: [1, 1.05, 1],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: EASE_IN_OUT, delay: 1 }}
          />
          
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(217,70,239,0.14),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.10] bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[56px_56px]" />
          
          {/* Floating particles */}
          {[12, 87, 34, 62, 8, 91, 45, 23, 76, 55, 3, 68, 29, 82, 41, 17, 94, 58, 36, 71, 19, 84, 47, 6].map((left, i) => (
            <motion.div
              key={i}
              className="absolute h-3 w-3 rounded-full bg-white/60"
              style={{
                left: `${left}%`,
                top: `${[15, 72, 38, 85, 9, 53, 67, 24, 91, 42, 78, 31, 63, 5, 88, 47, 19, 74, 56, 33, 81, 12, 65, 28][i]}%`,
              }}
              animate={{
                y: [0, -30 - (i % 6) * 3, 0],
                opacity: [0.4, 0.9, 0.4],
                scale: [1, 1.3, 1],
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

        <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-36">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-3xl text-center"
          >
            {/* Badge with pulse animation */}
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-4 w-4 text-indigo-200" />
              </motion.div>
              Developer-first security platform
            </motion.div>

            {/* Main title with dramatic entrance */}
            <motion.h1
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 }}
              className="text-balance text-5xl font-bold tracking-tight md:text-7xl"
            >
              Secure your code{" "}
              <span className="bg-linear-to-r from-indigo-200 via-white to-fuchsia-200 bg-clip-text text-transparent">
                before it ships
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-white/70 md:text-xl"
            >
              SafeDev scans your GitHub repositories for secrets, validates
              JWTs, and delivers actionable security insights — all in minutes.
            </motion.p>

            {/* CTA buttons with hover effects */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/github"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#070A12] shadow-lg shadow-indigo-500/10 transition hover:bg-white/90 hover:shadow-indigo-500/20"
              >
                <GithubIcon className="h-4 w-4" />
                Start Scanning Free
                <motion.span
                  className="inline-block"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/8 hover:border-white/25"
              >
                How It Works
              </Link>
            </motion.div>

            {/* Feature pills with staggered animation */}
            <motion.div
              variants={fadeUp}
              className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {[
                { icon: Lock, label: "Find secrets in seconds" },
                { icon: Zap, label: "Real-time scanning" },
                { icon: Eye, label: "AI-powered analysis" },
              ].map((it, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/3 px-4 py-3 text-sm text-white/70 backdrop-blur transition-colors"
                >
                  <it.icon className="h-4 w-4 text-indigo-200" />
                  {it.label}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-white/40">Scroll to explore</span>
            <div className="h-6 w-4 rounded-full border border-white/20 p-1">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="h-1.5 w-1.5 rounded-full bg-white/40"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* SOCIAL PROOF / STATS */}
      <section className="bg-[#070A12] py-12">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="grid gap-6 md:grid-cols-4"
          >
            <StatCard value="50+" label="Security Patterns Detected" />
            <StatCard value="<30s" label="Average Scan Time" />
            <StatCard value="100%" label="Private Repo Support" />
            <StatCard value="AI" label="Powered Analysis" />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-[#070A12] py-12">
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
                Core Features
              </div>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-center text-3xl font-bold text-white md:text-4xl"
            >
              Everything you need to ship secure code
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-2xl text-center text-white/65"
            >
              Built for developers who want clarity, speed, and practical
              security guidance.
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

      {/* WHY SAFEDEV */}
      <section className="bg-[#070A12] py-12">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <motion.div
                  variants={fadeUp}
                  className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur"
                >
                  <Zap className="h-4 w-4 text-indigo-200" />
                  Why SafeDev
                </motion.div>

                <motion.h2
                  variants={fadeUp}
                  className="text-3xl font-bold text-white md:text-4xl"
                >
                  Security that fits your workflow
                </motion.h2>

                <motion.p variants={fadeUp} className="mt-4 text-white/70">
                  SafeDev is built for developers who care about security but
                  don&apos;t want it to slow them down. Get actionable insights
                  without the noise.
                </motion.p>

                <motion.div variants={fadeUp} className="mt-8 space-y-4">
                  <BenefitItem
                    icon={CheckCircle2}
                    text="Real-time streaming results — see issues as they're found"
                  />
                  <BenefitItem
                    icon={CheckCircle2}
                    text="AI-powered analysis for deeper security insights"
                  />
                  <BenefitItem
                    icon={CheckCircle2}
                    text="Works with private repositories — your code stays yours"
                  />
                  <BenefitItem
                    icon={CheckCircle2}
                    text="Actionable remediation guidance, not generic advice"
                  />
                  <BenefitItem
                    icon={CheckCircle2}
                    text="No agents, no complex setup — just connect and scan"
                  />
                </motion.div>

                <motion.div variants={fadeUp} className="mt-8">
                  <Link
                    href="/github"
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-200 hover:text-white transition"
                  >
                    Try SafeDev now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>
              </div>

              <motion.div
                variants={fadeUp}
                className="relative rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur"
              >
                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
                      <CheckCircle2 className="h-4 w-4" />
                      Scan Complete
                    </div>
                    <p className="mt-1 text-xs text-emerald-100/70">
                      47 files scanned in 12.3s
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
                      <ShieldCheck className="h-4 w-4" />2 Issues Found
                    </div>
                    <div className="mt-2 space-y-2 text-xs">
                      <div className="rounded-lg bg-white/5 p-2 text-white/70">
                        <code>config/db.ts</code> — AWS Access Key detected
                      </div>
                      <div className="rounded-lg bg-white/5 p-2 text-white/70">
                        <code>.env.local</code> — JWT Secret exposed
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-indigo-200">
                      <BadgeCheck className="h-4 w-4" />
                      Recommended Actions
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-indigo-100/70">
                      <li>• Rotate exposed AWS credentials immediately</li>
                      <li>• Move secrets to environment variables</li>
                      <li>• Add .env files to .gitignore</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#070A12]">
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
              <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20">
                <ShieldCheck className="h-7 w-7 text-indigo-200" />
              </div>

              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Ready to secure your code?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/70">
                Connect your GitHub account and run your first scan in under a
                minute. No credit card required.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/github"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#070A12] shadow-lg shadow-indigo-500/10 transition hover:bg-white/90"
                >
                  <GithubIcon className="h-4 w-4" />
                  Start Scanning Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/8"
                >
                  Learn More
                </Link>
              </div>

              <p className="mt-6 text-xs text-white/50">
                Free for open source • Private repos supported • No data stored
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
