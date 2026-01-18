import { NextResponse } from "next/server";
import { scanRepo } from "../../../../lib/scanner";
import type { ScanResult } from "../../../../lib/types";

export async function POST(req: Request) {
  try {
    const { repoName, accessToken } = await req.json();

    // Get the authenticated user's username
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });
    const user = await userRes.json();
    
    if (!user.login) {
      const errorResponse: ScanResult = { status: "Error", issuesFound: 0, details: [], error: "Failed to get user info" };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const repoUrl = `https://github.com/${user.login}/${repoName}`;
    const results = await scanRepo(repoUrl, accessToken);

    const response: ScanResult = {
      repoName,
      status: results.length > 0 ? "Issues Found" : "Clean",
      issuesFound: results.length,
      details: results,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    const errorResponse: ScanResult = { status: "Error", issuesFound: 0, details: [] };
    return NextResponse.json(errorResponse);
  }
}
