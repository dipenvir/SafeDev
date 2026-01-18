"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  LogOut,
  Search,
  ShieldCheck,
  Sparkles,
  Loader2,
  ArrowRight,
  FolderGit2,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Clock,
  Files,
} from "lucide-react";
import GitHubRepoCard from "../../components/GitHubRepoCard";
import GithubIcon from "../../components/GithubIcon";
import AISecurityModal from "../../components/AISecurityModal";
import type { ScanResult, ScanIssue } from "../../lib/types";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  html_url: string;
}

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

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(0);
  return `${minutes}m ${remainingSeconds}s`;
}

function StatusPill({ result }: { result?: ScanResult }) {
  if (!result) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
        <Search className="h-3.5 w-3.5 text-indigo-200" />
        Ready to scan
      </span>
    );
  }

  const status = (result.status || "").toLowerCase();
  const scanning = status.includes("scan");
  const ok =
    status.includes("done") ||
    status.includes("complete") ||
    status.includes("success") ||
    status.includes("clean") ||
    status.includes("issues found");
  const error = status.includes("error") || status.includes("fail");

  if (scanning) {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-200" />
          Scanning… {result.filesScanned ? `(${result.filesScanned} files)` : ""}
        </span>
        {result.currentFile && (
          <span className="inline-flex items-center gap-1.5 text-[10px] text-white/50 max-w-50 truncate">
            <FileCode className="h-3 w-3 shrink-0" />
            <span className="truncate">{result.currentFile}</span>
          </span>
        )}
      </div>
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
      <div className="flex flex-col items-end gap-1">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Clean
        </span>
        <ScanStats filesScanned={result.filesScanned} durationMs={result.durationMs} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-100">
        <ShieldCheck className="h-3.5 w-3.5" />
        {result.issuesFound} issue{result.issuesFound === 1 ? "" : "s"}
      </span>
      <ScanStats filesScanned={result.filesScanned} durationMs={result.durationMs} />
    </div>
  );
}

function ScanStats({ filesScanned, durationMs }: { filesScanned?: number; durationMs?: number }) {
  if (!filesScanned && !durationMs) return null;

  return (
    <div className="flex items-center gap-3 text-[10px] text-white/50">
      {filesScanned !== undefined && (
        <span className="inline-flex items-center gap-1">
          <Files className="h-3 w-3" />
          {filesScanned} files
        </span>
      )}
      {durationMs !== undefined && (
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDuration(durationMs)}
        </span>
      )}
    </div>
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

  // AI Security Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiRepoName, setAiRepoName] = useState("");

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchRepos = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
          headers: { Authorization: `token ${session.accessToken}` },
        });
        const data = await res.json();
        setRepos(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [session]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return repos;
    return repos.filter((r) => r.name.toLowerCase().includes(q));
  }, [repos, query]);

  // Calculate total stats
  const totalStats = useMemo(() => {
    const completedScans = Object.values(scanResults).filter(
      (r) => r.status && !r.status.toLowerCase().includes("scan")
    );
    const totalFiles = completedScans.reduce((sum, r) => sum + (r.filesScanned || 0), 0);
    const totalDuration = completedScans.reduce((sum, r) => sum + (r.durationMs || 0), 0);
    const totalIssues = completedScans.reduce((sum, r) => sum + (r.issuesFound || 0), 0);
    return { totalFiles, totalDuration, totalIssues, completedScans: completedScans.length };
  }, [scanResults]);

  const handleScan = useCallback(async (repoFullName: string) => {
    if (!session?.accessToken) return;

    setScanResults((prev) => ({
      ...prev,
      [repoFullName]: { status: "Scanning...", issuesFound: 0, details: [], currentFile: "", filesScanned: 0 },
    }));

    try {
      const res = await fetch("/api/github/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName: repoFullName, accessToken: session.accessToken }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Failed to start scan");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const collectedIssues: ScanIssue[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6);
          try {
            const event = JSON.parse(jsonStr);

            if (event.type === "status") {
              setScanResults((prev) => ({
                ...prev,
                [repoFullName]: {
                  ...prev[repoFullName],
                  status: "Scanning...",
                  currentFile: event.file,
                  filesScanned: event.filesSeen,
                },
              }));
            } else if (event.type === "issue") {
              collectedIssues.push(event.issue);
              setScanResults((prev) => ({
                ...prev,
                [repoFullName]: {
                  ...prev[repoFullName],
                  status: "Scanning...",
                  issuesFound: collectedIssues.length,
                  details: [...collectedIssues],
                },
              }));
            } else if (event.type === "done") {
              setScanResults((prev) => ({
                ...prev,
                [repoFullName]: {
                  ...prev[repoFullName],
                  status: collectedIssues.length > 0 ? "Issues Found" : "Clean",
                  issuesFound: event.totalIssues,
                  details: [...collectedIssues],
                  filesScanned: event.totalFiles,
                  durationMs: event.durationMs,
                  currentFile: undefined,
                },
              }));
            } else if (event.type === "error") {
              setScanResults((prev) => ({
                ...prev,
                [repoFullName]: {
                  ...prev[repoFullName],
                  status: "Error",
                  error: event.message,
                },
              }));
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } catch (err) {
      console.error(err);
      setScanResults((prev) => ({
        ...prev,
        [repoFullName]: { status: "Error", issuesFound: 0, details: [] },
      }));
    }
  }, [session?.accessToken]);

  const handleAIAnalysis = useCallback(async (repoFullName: string) => {
    if (!session?.accessToken) return;

    setAiRepoName(repoFullName);
    setAiModalOpen(true);
    setAiLoading(true);
    setAiError(null);
    setAiAnalysis(null);

    try {
      const res = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName: repoFullName, accessToken: session.accessToken }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setAiError(data.error || "Failed to analyze repository");
      } else {
        setAiAnalysis(data.analysis);
      }
    } catch (err) {
      console.error(err);
      setAiError("Failed to connect to AI service");
    } finally {
      setAiLoading(false);
    }
  }, [session?.accessToken]);

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
            className="absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl"
            animate={{ y: [0, 18, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: EASE_IN_OUT }}
          />
          <motion.div
            className="absolute -bottom-56 -left-24 h-130 w-130 rounded-full bg-fuchsia-500/20 blur-3xl"
            animate={{ x: [0, 16, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: EASE_IN_OUT }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(217,70,239,0.14),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.10] bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-size-[56px_56px]" />
        </motion.div>

        <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 md:pb-12 md:pt-20">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
                  <GithubIcon className="h-6 w-6 text-indigo-200" />
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
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/8"
                >
                  Learn more <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-8 grid gap-4 md:grid-cols-4"
            >
              <div className="rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
                  <FolderGit2 className="h-4 w-4 text-indigo-200" />
                  Repositories
                </div>
                <div className="mt-2 text-2xl font-bold">{repos.length}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
                  <Files className="h-4 w-4 text-indigo-200" />
                  Files Scanned
                </div>
                <div className="mt-2 text-2xl font-bold">{totalStats.totalFiles}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
                  <Clock className="h-4 w-4 text-indigo-200" />
                  Total Scan Time
                </div>
                <div className="mt-2 text-2xl font-bold">
                  {totalStats.totalDuration > 0 ? formatDuration(totalStats.totalDuration) : "—"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
                  <ShieldCheck className="h-4 w-4 text-indigo-200" />
                  Issues Found
                </div>
                <div className={`mt-2 text-2xl font-bold flex items-center gap-2 ${totalStats.totalIssues === 0 && totalStats.completedScans > 0 ? 'text-emerald-400' : ''}`}>
                  {totalStats.totalIssues === 0 && totalStats.completedScans > 0 && (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                  {totalStats.totalIssues}
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
                <div className="rounded-3xl border border-white/10 bg-white/3 p-10 text-center backdrop-blur-xl">
                  <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white backdrop-blur">
                    <GithubIcon className="h-7 w-7 text-indigo-200" />
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
                      <GithubIcon className="h-4 w-4" />
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
                    bg-white/3 p-6 backdrop-blur-xl
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
                          bg-white/3 pl-9 pr-4 text-sm text-white
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
                        backdrop-blur transition hover:bg-white/6
                      "
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="space-y-4">
                  {loading ? (
                    <div className="rounded-3xl border border-white/10 bg-white/3 p-8 text-center backdrop-blur-xl">
                      <div className="mx-auto flex w-fit items-center gap-2 text-white/80">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading repositories…
                      </div>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="rounded-3xl border border-white/10 bg-white/3 p-8 text-center backdrop-blur-xl">
                      <p className="text-white/80">
                        No repositories found{query ? " for that search." : "."}
                      </p>
                      {query ? (
                        <button
                          onClick={() => setQuery("")}
                          className="mt-4 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/3 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/6"
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
                            bg-white/2 p-5 backdrop-blur-xl
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
                                    <span className="text-white/60 font-normal">{repo.owner.login}/</span>{repo.name}
                                  </div>
                                  <div className="truncate text-sm text-white/60">
                                    {repo.description || "No description"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <StatusPill result={scanResults[repo.full_name]} />
                              <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noreferrer"
                                className="
                                  hidden sm:inline-flex h-9 items-center justify-center
                                  rounded-xl border border-white/10 bg-white/3 px-3
                                  text-sm font-semibold text-white/80
                                  backdrop-blur transition hover:bg-white/6
                                "
                              >
                                View
                              </a>
                            </div>
                          </div>

                          {/* Dark glass GitHubRepoCard */}
                          <GitHubRepoCard
                            name={repo.name}
                            owner={repo.owner.login}
                            description={repo.description}
                            html_url={repo.html_url}
                            onScan={() => handleScan(repo.full_name)}
                            onAIAnalysis={() => handleAIAnalysis(repo.full_name)}
                            scanResult={scanResults[repo.full_name]}
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

      {/* AI Security Modal */}
      <AISecurityModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        analysis={aiAnalysis}
        isLoading={aiLoading}
        error={aiError}
        repoName={aiRepoName}
      />
    </div>
  );
}