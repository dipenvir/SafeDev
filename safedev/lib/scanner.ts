// /lib/scanner.ts
export interface ScanIssue {
  file: string;
  issues: string[];
}

export async function scanRepo(repoUrl: string, accessToken: string): Promise<ScanIssue[]> {
  const issues: ScanIssue[] = [];
  const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/");

  // Fetch root contents
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
    headers: { Authorization: `token ${accessToken}` },
  });
  const files: any[] = await res.json();

  for (const file of files) {
    if (file.type !== "file") continue;

    // Fetch file content
    const contentRes = await fetch(file.download_url, {
      headers: { Authorization: `token ${accessToken}` },
    });
    const content = await contentRes.text();

    const fileIssues: string[] = [];

    // --- Secrets Detection ---
    if (/AKIA[0-9A-Z]{16}/.test(content)) fileIssues.push("AWS Access Key found");
    if (/ghp_[0-9a-zA-Z]{36}/.test(content)) fileIssues.push("GitHub Personal Access Token found");
    if (/SECRET_KEY\s*=\s*["'].*["']/.test(content)) fileIssues.push("Secret key detected");
    if (/JWT_SECRET\s*=\s*["'].*["']/.test(content)) fileIssues.push("JWT Secret detected");

    // --- Security Misconfigurations ---
    if (file.name === "package.json") {
      if (/["']debug["']\s*:\s*true/.test(content)) fileIssues.push("Debug mode enabled in package.json");
    }
    if (file.name === "Dockerfile") {
      if (/FROM\s+.*:latest/.test(content)) fileIssues.push("Dockerfile uses latest tag, may be unsafe");
    }
    if (file.name.endsWith(".yaml") || file.name.endsWith(".yml")) {
      if (/privileged:\s*true/.test(content)) fileIssues.push("Privileged mode enabled in YAML");
    }

    // --- Optional Checks ---
    if (file.name === ".env") fileIssues.push(".env file present, may contain secrets");
    if (file.name === ".gitignore") fileIssues.push(".gitignore file found (good!)");

    if (fileIssues.length > 0) issues.push({ file: file.path, issues: fileIssues });
  }

  return issues;
}
