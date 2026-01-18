// /components/GitHubRepoCard.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  ScanSearch,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  BrainCircuit,
} from "lucide-react";
import GithubIcon from "./GithubIcon";
import type { ScanResult } from "../lib/types";

interface GitHubRepoCardProps {
  name: string;
  owner?: string;
  description: string | null;
  html_url: string;
  onScan: () => void;
  onAIAnalysis?: () => void;
  scanResult?: ScanResult;
}

function getSeverity(issues: string[]) {
  if (
    issues.some((x) =>
      /(AWS Access Key|GitHub Personal Access Token|JWT Secret|Secret key)/i.test(x)
    )
  ) {
    return "high";
  }

  if (
    issues.some((x) =>
      /(Privileged mode|latest tag|Debug mode)/i.test(x)
    )
  ) {
    return "warning";
  }

  return "good";
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

function statusMeta(scanResult?: ScanResult) {
  if (!scanResult) {
    return {
      label: "Ready to scan",
      tone: "border-white/10 bg-white/[0.04] text-white/75 ring-white/10" as const,
      icon: ShieldCheck,
    };
  }

  const s = (scanResult.status || "").toLowerCase();

  if (s.includes("scan")) {
    return {
      label: "Scanning…",
      tone: "border-indigo-400/20 bg-indigo-500/10 text-indigo-200 ring-indigo-400/20" as const,
      icon: ScanSearch,
    };
  }

  if (s.includes("error") || s.includes("fail")) {
    return {
      label: "Scan error",
      tone: "border-rose-400/25 bg-rose-500/10 text-rose-200 ring-rose-400/25" as const,
      icon: AlertTriangle,
    };
  }

  if (
    (s.includes("done") || s.includes("complete") || s.includes("success")) &&
    scanResult.issuesFound === 0
  ) {
    return {
      label: "No issues found",
      tone: "border-emerald-400/25 bg-emerald-500/10 text-emerald-200 ring-emerald-400/25" as const,
      icon: CheckCircle2,
    };
  }

  return {
    label: `${scanResult.issuesFound} issue${scanResult.issuesFound === 1 ? "" : "s"} found`,
    tone: "border-amber-400/25 bg-amber-500/10 text-amber-200 ring-amber-400/25" as const,
    icon: AlertTriangle,
  };
}

export default function GitHubRepoCard({
  name,
  owner,
  description,
  html_url,
  onScan,
  onAIAnalysis,
  scanResult,
}: GitHubRepoCardProps) {
  const meta = statusMeta(scanResult);
  const Icon = meta.icon;

  const hasDetails = !!scanResult?.details && scanResult.details.length > 0;
  const isScanning = (scanResult?.status || "").toLowerCase().includes("scan");

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
      className="
        group relative overflow-hidden rounded-2xl
        border border-white/10
        bg-white/3 backdrop-blur-xl
        p-5
        transition
        hover:border-white/20
      "
    >
      {/* subtle hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-indigo-500/12 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/4 text-indigo-200">
                <GithubIcon className="h-5 w-5" />
              </span>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <a
                    href={html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-lg font-semibold text-white hover:underline"
                    title={name}
                  >
                    {name}
                  </a>

                  <a
                    href={html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/3 px-2 py-1 text-xs font-semibold text-white/70 hover:bg-white/6"
                    aria-label="Open on GitHub"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    GitHub
                  </a>
                </div>

                <p className="mt-1 line-clamp-2 text-sm text-white/60">
                  {description || "No description provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <span
              className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ring-1",
                meta.tone,
              ].join(" ")}
            >
              <Icon className={`h-3.5 w-3.5 ${isScanning ? "animate-pulse" : ""}`} />
              {meta.label}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onScan}
                disabled={isScanning}
                className="
                  inline-flex h-10 items-center justify-center gap-2 rounded-xl
                  bg-indigo-600 px-4 text-sm font-semibold text-white
                  transition
                  hover:bg-indigo-700
                  disabled:cursor-not-allowed disabled:opacity-60
                  focus:outline-none focus:ring-4 focus:ring-indigo-500/25
                "
              >
                <ScanSearch className="h-4 w-4" />
                {isScanning ? "Scanning..." : "Scan"}
              </button>

              {onAIAnalysis && (
                <button
                  onClick={onAIAnalysis}
                  disabled={isScanning}
                  className="
                    inline-flex h-10 items-center justify-center gap-2 rounded-xl
                    border border-fuchsia-400/30 bg-fuchsia-500/15 px-4 text-sm font-semibold text-fuchsia-200
                    transition
                    hover:bg-fuchsia-500/25 hover:border-fuchsia-400/50
                    disabled:cursor-not-allowed disabled:opacity-60
                    focus:outline-none focus:ring-4 focus:ring-fuchsia-500/25
                  "
                  title="Get AI security advice for this repository"
                >
                  <BrainCircuit className="h-4 w-4" />
                  AI Analysis
                </button>
              )}

              {hasDetails ? (
                <span className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-xs font-semibold text-white/70">
                  Details <ChevronDown className="h-4 w-4" />
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Details */}
        <AnimatePresence>
          {hasDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="mt-5 overflow-hidden"
            >
              <div className="rounded-2xl border border-white/10 bg-white/2 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">
                    Findings ({scanResult?.issuesFound ?? 0})
                  </p>
                  <p className="text-xs text-white/50">
                    Review and remediate the items below
                  </p>
                </div>

                <ul className="mt-3 space-y-3">
                  {scanResult!.details.map((d, idx: number) => {
                    const severity = getSeverity(d.issues || []);
                    return (
                      <li
                        key={d.file ?? idx}
                        className="rounded-xl border border-white/10 bg-white/3 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {d.file}
                            </p>
                            <p className="mt-1 text-xs text-white/60">
                              {(d.issues || []).join(", ")}
                            </p>
                          </div>

                          <span
                            className={[
                              "inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold",
                              severity === "high"
                                ? "border-rose-400/25 bg-rose-500/10 text-rose-200"
                                : severity === "warning"
                                ? "border-amber-400/25 bg-amber-500/10 text-amber-200"
                                : "border-emerald-400/25 bg-emerald-500/10 text-emerald-200",
                            ].join(" ")}
                          >
                            {severity === "high"
                              ? "High"
                              : severity === "warning"
                              ? "Warning"
                              : "Good"}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
