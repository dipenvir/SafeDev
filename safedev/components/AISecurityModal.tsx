"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldAlert, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface AISecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: string | null;
  isLoading: boolean;
  error: string | null;
  repoName: string;
}

export default function AISecurityModal({
  isOpen,
  onClose,
  analysis,
  isLoading,
  error,
  repoName,
}: AISecurityModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-4 z-50 m-auto flex max-h-[85vh] max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0c1018] shadow-2xl md:inset-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
                  <ShieldAlert className="h-5 w-5 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">AI Security Analysis</h2>
                  <p className="text-sm text-white/60">{repoName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
                  <p className="mt-4 text-white/70">Analyzing repository with AI...</p>
                  <p className="mt-1 text-sm text-white/50">This may take a moment</p>
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-6">
                  <h3 className="font-semibold text-rose-200">Analysis Failed</h3>
                  <p className="mt-2 text-rose-100/80">{error}</p>
                </div>
              )}

              {analysis && !isLoading && (
                <div className="prose prose-invert max-w-none">
                  <div
                    className="ai-analysis-content text-white/90 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white/90 [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:text-white/80 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_li]:text-white/80 [&_li]:mb-1 [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-indigo-200 [&_code]:text-sm [&_pre]:bg-white/5 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:mb-4 [&_strong]:text-white [&_strong]:font-semibold [&_blockquote]:border-l-2 [&_blockquote]:border-indigo-400/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/70"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(analysis) }}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50">
                  Powered by OpenAI GPT-4o
                </p>
                <button
                  onClick={onClose}
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
  let html = markdown
    // Escape HTML first
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Code blocks (must come before other processing)
    .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Headers
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Lists
    .replace(/^\s*[-*]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/^\s*(\d+)\.\s+(.+)$/gm, "<li>$2</li>")
    // Blockquotes
    .replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>")
    // Paragraphs (double newlines)
    .replace(/\n\n/g, "</p><p>")
    // Single newlines in paragraphs
    .replace(/\n/g, "<br>");

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/(<li>.*?<\/li>)(\s*<li>)/g, "$1$2");
  html = html.replace(/(<li>.*?<\/li>)+/g, "<ul>$&</ul>");

  // Wrap in paragraph tags
  html = `<p>${html}</p>`;

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, "");
  html = html.replace(/<p>\s*<(h[1-4]|ul|ol|pre|blockquote)/g, "<$1");
  html = html.replace(/<\/(h[1-4]|ul|ol|pre|blockquote)>\s*<\/p>/g, "</$1>");

  return html;
}
