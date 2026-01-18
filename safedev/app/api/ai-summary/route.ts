import OpenAI from "openai";

type GithubContentsItem = {
  type: "file" | "dir" | "submodule" | "symlink";
  name: string;
  path: string;
  url: string;
  size?: number;
};

function isProbablyBinary(path: string) {
  return /\.(png|jpe?g|gif|webp|ico|pdf|zip|gz|tar|tgz|7z|rar|mp4|mov|mp3|wav|woff2?|ttf|eot|exe|dmg|lock|svg)$/i.test(
    path
  );
}

function shouldSkipFile(path: string) {
  // Skip common non-essential files/directories
  const skipPatterns = [
    /node_modules/,
    /\.git\//,
    /dist\//,
    /build\//,
    /\.next\//,
    /coverage\//,
    /\.cache\//,
    /package-lock\.json$/,
    /yarn\.lock$/,
    /pnpm-lock\.yaml$/,
  ];
  return skipPatterns.some((pattern) => pattern.test(path));
}

async function collectRepoContents(
  owner: string,
  repo: string,
  accessToken: string,
  maxFiles = 50,
  maxBytesPerFile = 100_000
): Promise<string> {
  const headers: Record<string, string> = {
    Authorization: `token ${accessToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const collectedFiles: { path: string; content: string }[] = [];
  let filesSeen = 0;

  async function fetchDir(path: string): Promise<GithubContentsItem[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents${path ? `/${encodeURIComponent(path).replace(/%2F/g, "/")}` : ""}`;
    const res = await fetch(url, { headers });

    if (!res.ok) return [];

    const json = await res.json();
    if (!Array.isArray(json)) return [];

    return json as GithubContentsItem[];
  }

  async function fetchFileText(item: GithubContentsItem): Promise<string | null> {
    if (isProbablyBinary(item.path)) return null;
    if (shouldSkipFile(item.path)) return null;
    if (typeof item.size === "number" && item.size > maxBytesPerFile) return null;

    const res = await fetch(item.url, { headers });
    if (!res.ok) return null;

    const json = await res.json();
    if (!json?.content || json?.encoding !== "base64") return null;

    const buff = Buffer.from(json.content.replace(/\n/g, ""), "base64");
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
        if (!shouldSkipFile(item.path)) {
          await walk(item.path);
        }
        continue;
      }

      if (item.type !== "file") continue;
      if (shouldSkipFile(item.path)) continue;

      filesSeen++;

      const content = await fetchFileText(item);
      if (content) {
        collectedFiles.push({ path: item.path, content });
      }
    }
  }

  await walk("");

  // Compile all files into a single string
  let compiledContent = `# Repository: ${owner}/${repo}\n\n`;
  compiledContent += `## Files analyzed: ${collectedFiles.length}\n\n`;

  for (const file of collectedFiles) {
    compiledContent += `### File: ${file.path}\n\`\`\`\n${file.content}\n\`\`\`\n\n`;
  }

  return compiledContent;
}

export async function POST(req: Request) {
  try {
    const { repoName, accessToken } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get the authenticated user's username
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });
    const user = await userRes.json();

    if (!user.login) {
      return new Response(
        JSON.stringify({ error: "Failed to get user info" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Collect repo contents
    const repoContent = await collectRepoContents(user.login, repoName, accessToken);

    // Send to OpenAI for analysis
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a senior security engineer reviewing code for security vulnerabilities and best practices. 
Provide a comprehensive security analysis including:
1. **Critical Issues**: Any severe vulnerabilities that need immediate attention
2. **Security Warnings**: Potential security risks that should be addressed
3. **Best Practice Recommendations**: Suggestions for improving security posture
4. **Positive Findings**: Good security practices already in place

Format your response in clear markdown with sections. Be specific about file names and line references when possible.
Keep the response concise but thorough - aim for actionable advice.`,
        },
        {
          role: "user",
          content: `Please analyze the following repository for security issues and provide recommendations:\n\n${repoContent}`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const analysis = completion.choices[0]?.message?.content || "No analysis available";

    return new Response(
      JSON.stringify({ analysis, filesAnalyzed: repoContent.split("### File:").length - 1 }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("AI Summary error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
