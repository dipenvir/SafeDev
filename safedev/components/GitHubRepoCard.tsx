// /components/GitHubRepoCard.tsx
'use client';

interface GitHubRepoCardProps {
    name: string;
    description: string | null;
    html_url: string;
    onScan: () => void;
    scanResult?: { status: string; issuesFound: number; details: any[] };
}

export default function GitHubRepoCard({ name, description, html_url, onScan, scanResult }: GitHubRepoCardProps) {
    return (
        <div className="border-l-4 border-indigo-600 bg-indigo-50 p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-3 md:mb-0">
                <a href={html_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-900 hover:underline text-lg">
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
            {scanResult?.details && scanResult.details.length > 0 && (
                <div className="mt-2 text-left">
                    <p className="font-semibold">Issues found:</p>
                    <ul className="list-disc list-inside text-sm text-red-600">
                        {scanResult.details.map((d) => (
                            <li key={d.file}>
                                {d.file}: {d.issues.join(", ")}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>

    );
}
