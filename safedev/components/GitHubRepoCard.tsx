// /components/GitHubRepoCard.tsx
'use client';

interface GitHubRepoCardProps {
  name: string;
  description: string | null;
  html_url: string;
  onScan: () => void;
}

export default function GitHubRepoCard({ name, description, html_url, onScan }: GitHubRepoCardProps) {
  return (
    <div className="border-l-4 border-indigo-600 bg-indigo-50 p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center">
      <div className="mb-3 md:mb-0">
        <a href={html_url} target="_blank" className="font-semibold text-indigo-900 hover:underline text-lg">
          {name}
        </a>
        <p className="text-gray-700">{description || "No description"}</p>
      </div>
      <button
        onClick={onScan}
        className="mt-2 md:mt-0 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
      >
        Scan Repo
      </button>
    </div>
  );
}
