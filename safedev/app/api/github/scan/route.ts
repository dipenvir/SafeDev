import { scanRepo } from "../../../../lib/scanner";
import type { ScanEvent } from "../../../../lib/scanner";
import type { ScanIssue } from "../../../../lib/types";

export async function POST(req: Request) {
  try {
    const { repoName, accessToken } = await req.json();

    // Get the authenticated user's username
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });
    const user = await userRes.json();

    if (!user.login) {
      return new Response(
        JSON.stringify({ type: "error", message: "Failed to get user info" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const repoUrl = `https://github.com/${user.login}/${repoName}`;

    // Create a readable stream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: ScanEvent) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        };

        try {
          await scanRepo(repoUrl, accessToken, undefined, {
            onStatus: (file: string, filesSeen: number) => {
              sendEvent({ type: "status", file, filesSeen });
            },
            onIssue: (issue: ScanIssue) => {
              sendEvent({ type: "issue", issue });
            },
            onDone: (totalIssues: number, totalFiles: number, durationMs: number) => {
              sendEvent({ type: "done", totalIssues, totalFiles, durationMs });
            },
            onError: (message: string) => {
              sendEvent({ type: "error", message });
            },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          sendEvent({ type: "error", message });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ type: "error", message: "Failed to start scan" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}