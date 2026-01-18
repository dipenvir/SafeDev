// /app/github/page.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Github,
  LogOut,
  Search,
  ShieldCheck,
  Sparkles,
  Loader2,
  ArrowRight,
  FolderGit2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import GitHubRepoCard from "../../components/GitHubRepoCard";
import Footer from "../../components/Footer";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
}

type ScanResult = { status: string; issuesFound: number; details: any[] };

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.42, 0, 0.58, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

function StatusPill({ result }: { result?: ScanResult }) {
  if (!result) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/70">
        <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
        Ready
      </span>
    );
  }

  const status = (result.status || "").toLowerCase();
  const scanning = status.includes("scan");
  const ok =
    status.includes("done") ||
    status.includes("complete") ||
    status.includes("success");
  const error = status.includes("error") || status.includes("fail");

  if (scanning) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/70">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-200" />
        Scanning…
      </span>
    );
  }

  if (error) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-xs text-rose-100">
        <AlertTriangle className="h-3.5 w-3.5" />
        Error
      </span>
    );
  }

  if (ok && result.issuesFound === 0) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Clean
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-100">
      <ShieldCheck className="h-3.5 w-3.5" />
      {result.issuesFound} issue{result.issuesFound === 1 ? "" : "s"}
    </span>
  );
}

export default function GitHubPage() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [scanResults, setScanResults] = useState<Record<string, ScanResult>>(
    {}
  );

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);
    fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: { Authorization: `token ${session.accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setRepos(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [session]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return repos;
    return repos.filter((r) => r.name.toLowerCase().includes(q));
  }, [repos, query]);

  const handleScan = async (repoName: string) => {
    if (!session?.accessToken) return;

    setScanResults((prev) => ({
      ...prev,
      [repoName]: { status: "Scanning...", issuesFound: 0, details: [] },
    }));

    try {
      const res = await fetch("/api/github/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName, accessToken: session.accessToken }),
      });

      const data = await res.json();
      setScanResults((prev) => ({ ...prev, [repoName]: data }));
    } catch (err) {
      console.error(err);
      setScanResults((prev) => ({
        ...prev,
        [repoName]: { status: "Error", issuesFound: 0, details: [] },
      }));
    }
  };

  const isAuthed = !!session;

  return (
    <div className="min-h-screen font-sans">
      {/* Top gradient background */}
      <div className="relative overflow-hidden bg-[#070A12] text-white">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <motion.div
            className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl"
            animate={{ y: [0, 18, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: EASE_IN_OUT }}
          />
          <motion.div
            className="absolute -bottom-56 -left-24 h-[520px] w-[520px] rounded-full bg-fuchsia-500/20 blur-3xl"
            animate={{ x: [0, 16, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: EASE_IN_OUT }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(217,70,239,0.14),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:56px_56px]" />
        </motion.div>

        <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 md:pb-12 md:pt-20">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur">
                  <Github className="h-6 w-6 text-indigo-200" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    GitHub Scanner
                  </h1>
                  <p className="mt-1 text-white/70">
                    Connect your account and scan repositories for secrets and
                    risky patterns.
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/about#features"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/[0.08]"
                >
                  Learn more <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 grid gap-4 md:grid-cols-3"
            >
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
                  <FolderGit2 className="h-4 w-4 text-indigo-200" />
                  Repositories
                </div>
                <div className="mt-2 text-2xl font-bold">{repos.length}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <div className="text-xs font-semibold text-white/60">Scans</div>
                <div className="mt-2 text-2xl font-bold">
                  {Object.keys(scanResults).length}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <div className="text-xs font-semibold text-white/60">Status</div>
                <div className="mt-2">
                  <StatusPill
                    result={
                      Object.values(scanResults).find((r) =>
                        (r.status || "").toLowerCase().includes("scan")
                      ) || undefined
                    }
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main content (dark, no white cards) */}
      <main className="bg-[#070A12] text-white">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
          <AnimatePresence mode="wait">
            {!isAuthed ? (
              <motion.section
                key="logged-out"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                className="mx-auto max-w-2xl"
              >
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur-xl">
                  <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white backdrop-blur">
                    <Github className="h-7 w-7 text-indigo-200" />
                  </div>

                  <h2 className="mt-6 text-3xl font-bold">Connect GitHub</h2>
                  <p className="mt-3 text-white/70">
                    Sign in with GitHub to list your repositories and run SafeDev
                    scans.
                  </p>

                  <div className="mt-8">
                    <button
                      onClick={() => signIn("github")}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#070A12] transition hover:bg-white/90"
                    >
                      <Github className="h-4 w-4" />
                      Sign in with GitHub
                    </button>
                  </div>

                  <p className="mt-4 text-xs text-white/50">
                    We request GitHub access only to read repositories you choose
                    to scan.
                  </p>
                </div>
              </motion.section>
            ) : (
              <motion.section
                key="logged-in"
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                <motion.div
                  variants={fadeUp}
                  className="
                    flex flex-col gap-4 rounded-3xl border border-white/10
                    bg-white/[0.03] p-6 backdrop-blur-xl
                    md:flex-row md:items-center md:justify-between
                  "
                >
                  <div>
                    <h2 className="text-2xl font-bold md:text-3xl">
                      Your repositories
                    </h2>
                    <p className="mt-1 text-sm text-white/70">
                      Search, pick a repo, and run a scan.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search repos..."
                        className="
                          h-11 w-full rounded-xl border border-white/10
                          bg-white/[0.03] pl-9 pr-4 text-sm text-white
                          outline-none backdrop-blur
                          transition focus:border-indigo-400/40 focus:ring-4 focus:ring-indigo-500/20
                          placeholder:text-white/40
                          sm:w-64
                        "
                      />
                    </div>

                    <button
                      onClick={() => signOut()}
                      className="
                        inline-flex h-11 items-center justify-center gap-2 rounded-xl
                        border border-white/10 bg-red-500 px-4
                        text-sm font-semibold text-white/80
                        backdrop-blur transition hover:bg-white/[0.06]
                      "
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="space-y-4">
                  {loading ? (
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl">
                      <div className="mx-auto flex w-fit items-center gap-2 text-white/80">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading repositories…
                      </div>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-xl">
                      <p className="text-white/80">
                        No repositories found{query ? " for that search." : "."}
                      </p>
                      {query ? (
                        <button
                          onClick={() => setQuery("")}
                          className="mt-4 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/[0.06]"
                        >
                          Clear search
                        </button>
                      ) : null}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filtered.map((repo, i) => (
                        <motion.div
                          key={repo.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            ease: EASE_OUT,
                            delay: Math.min(i * 0.02, 0.25),
                          }}
                          className="
                            rounded-3xl border border-white/10
                            bg-white/[0.02] p-5 backdrop-blur-xl
                          "
                        >
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-200">
                                  <FolderGit2 className="h-5 w-5" />
                                </span>

                                <div className="min-w-0">
                                  <div className="truncate text-lg font-semibold text-white">
                                    {repo.name}
                                  </div>
                                  <div className="truncate text-sm text-white/60">
                                    {repo.description || "No description"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <StatusPill result={scanResults[repo.name]} />
                              <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noreferrer"
                                className="
                                  hidden sm:inline-flex h-9 items-center justify-center
                                  rounded-xl border border-white/10 bg-white/[0.03] px-3
                                  text-sm font-semibold text-white/80
                                  backdrop-blur transition hover:bg-white/[0.06]
                                "
                              >
                                View
                              </a>
                            </div>
                          </div>

                          {/* Dark glass GitHubRepoCard */}
                          <GitHubRepoCard
                            name={repo.name}
                            description={repo.description}
                            html_url={repo.html_url}
                            onScan={() => handleScan(repo.name)}
                            scanResult={scanResults[repo.name]}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
