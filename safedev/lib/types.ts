export interface ScanIssue {
  file: string;
  issues: string[];
}

export interface ScanResult {
  status: string;
  issuesFound: number;
  details: ScanIssue[];
  currentFile?: string;
  filesScanned?: number;
  durationMs?: number;
  error?: string;
}