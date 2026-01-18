import { NextResponse } from "next/server";
import { scanRepo } from "../../../../lib/scanner";

export async function POST(req: Request) {
  try {
    const { repoName, accessToken } = await req.json();

    // Get the authenticated user's username
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });
    const user = await userRes.json();
    
    if (!user.login) {
      return NextResponse.json({ status: "Error", issuesFound: 0, details: [], error: "Failed to get user info" }, { status: 400 });
    }

    const repoUrl = `https://github.com/${user.login}/${repoName}`;
    const results = await scanRepo(repoUrl, accessToken);

    return NextResponse.json({
      repoName,
      status: results.length > 0 ? "Issues Found" : "Clean",
      issuesFound: results.length,
      details: results,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "Error", issuesFound: 0, details: [] });
  }
}
