// Types for the GitHub scan API

export interface ScanIssue {
  file: string;
  issues: string[];
}

export interface ScanResult {
  repoName?: string;
  status: "Scanning..." | "Issues Found" | "Clean" | "Error";
  issuesFound: number;
  details: ScanIssue[];
  error?: string;
  currentFile?: string;
  filesScanned?: number;
}
