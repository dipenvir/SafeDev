// /lib/scanner.ts
export interface ScanIssue {
  file: string;
  issues: string[];
}

type GithubContentsItem = {
  type: "file" | "dir" | "submodule" | "symlink";
  name: string;
  path: string;
  download_url: string | null;
  url: string; // API URL for this content item
  size?: number;
};

function isProbablyBinary(path: string) {
  return /\.(png|jpe?g|gif|webp|ico|pdf|zip|gz|tar|tgz|7z|rar|mp4|mov|mp3|wav|woff2?|ttf|eot|exe|dmg)$/i.test(
    path
  );
}

function detectIssues(content: string, fileName: string) {
  const fileIssues: string[] = [];

  // --- Secrets Detection ---
  if (/AKIA[0-9A-Z]{16}/.test(content)) fileIssues.push("AWS Access Key found");
  if (/ghp_[0-9a-zA-Z]{36}/.test(content))
    fileIssues.push("GitHub Personal Access Token found");
  if (/SECRET_KEY\s*=\s*["'].*["']/.test(content))
    fileIssues.push("Secret key detected");
  if (/JWT_SECRET\s*=\s*["'].*["']/.test(content))
    fileIssues.push("JWT Secret detected");

  // --- Security Misconfigurations ---
  if (fileName === "package.json") {
    if (/["']debug["']\s*:\s*true/.test(content))
      fileIssues.push("Debug mode enabled in package.json");
  }

  if (fileName === "Dockerfile") {
    if (/FROM\s+.*:latest/.test(content))
      fileIssues.push("Dockerfile uses latest tag, may be unsafe");
  }

  if (fileName.endsWith(".yaml") || fileName.endsWith(".yml")) {
    if (/privileged:\s*true/.test(content))
      fileIssues.push("Privileged mode enabled in YAML");
  }

  // --- Optional Checks (filename-based) ---
  if (fileName === ".env") fileIssues.push(".env file present, may contain secrets");
  if (fileName === ".gitignore") fileIssues.push(".gitignore file found (good!)");

  return fileIssues;
}

/**
 * Scans a GitHub repo by owner/repo (recommended) or full repo URL.
 * repoRef can be:
 *  - "owner/repo"
 *  - "https://github.com/owner/repo"
 */
export async function scanRepo(
  repoRef: string,
  accessToken: string,
  opts?: { maxFiles?: number; maxBytesPerFile?: number }
): Promise<ScanIssue[]> {
  const issues: ScanIssue[] = [];

  const maxFiles = opts?.maxFiles ?? 200; // prevent timeouts
  const maxBytesPerFile = opts?.maxBytesPerFile ?? 300_000; // ~300KB

  const cleaned = repoRef.replace("https://github.com/", "").replace(/^\/+|\/+$/g, "");
  const [owner, repo] = cleaned.split("/");

  if (!owner || !repo) {
    throw new Error(`Invalid repoRef. Expected "owner/repo" or GitHub URL. Got: ${repoRef}`);
  }

  const headers: Record<string, string> = {
    Authorization: `token ${accessToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  let filesSeen = 0;

  async function fetchDir(path: string): Promise<GithubContentsItem[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents${path ? `/${encodeURIComponent(path).replace(/%2F/g, "/")}` : ""}`;
    const res = await fetch(url, { headers });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err?.message || `GitHub API error ${res.status}`;
      // Return empty list so scanning doesn’t crash
      console.warn("fetchDir failed:", url, msg);
      return [];
    }

    const json = await res.json();

    // If it's not an array, it's not a directory listing
    if (!Array.isArray(json)) return [];

    return json as GithubContentsItem[];
  }

  async function fetchFileText(item: GithubContentsItem): Promise<string | null> {
    // Skip binaries and huge files
    if (isProbablyBinary(item.path)) return null;
    if (typeof item.size === "number" && item.size > maxBytesPerFile) return null;

    // Prefer API content (base64) so private repos work reliably
    const res = await fetch(item.url, { headers });
    if (!res.ok) return null;

    const json: any = await res.json();
    if (!json?.content || json?.encoding !== "base64") return null;

    const buff = Buffer.from(json.content.replace(/\n/g, ""), "base64");
    // rough check: if it contains lots of null bytes, treat as binary
    const sample = buff.subarray(0, 2000);
    if (sample.includes(0)) return null;

    return buff.toString("utf8");
  }

  async function walk(path: string) {
    if (filesSeen >= maxFiles) return;

    const items = await fetchDir(path);

    for (const item of items) {
      if (filesSeen >= maxFiles) break;

      if (item.type === "dir") {
        await walk(item.path);
        continue;
      }

      if (item.type !== "file") continue;

      filesSeen++;

      // filename-only checks without reading file
      const nameOnly = item.name;
      if (nameOnly === ".env") {
        issues.push({ file: item.path, issues: [".env file present, may contain secrets"] });
        continue;
      }

      const content = await fetchFileText(item);
      if (!content) continue;

      const fileIssues = detectIssues(content, nameOnly);
      if (fileIssues.length > 0) issues.push({ file: item.path, issues: fileIssues });
    }
  }

  // Start at repo root
  await walk("");

  return issues;
}
