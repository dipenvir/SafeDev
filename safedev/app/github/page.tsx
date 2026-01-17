'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import GitHubRepoCard from '../../components/GitHubRepoCard';
import Footer from '../../components/Footer';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
}

export default function GitHubPage() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);
    fetch('https://api.github.com/user/repos', {
      headers: { Authorization: `token ${session.accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setRepos(data))
      .finally(() => setLoading(false));
  }, [session]);

  const handleScan = (repoName: string) => {
    // Replace with real backend scan call
    alert(`Scanning repo: ${repoName}`);
  };

  return (
    <div className="font-sans text-gray-900 min-h-screen flex flex-col">
      <div className="flex-1 py-20 px-6 max-w-4xl mx-auto text-center">
        {!session ? (
          <>
            <h2 className="text-3xl font-bold mb-6">Connect with GitHub</h2>
            <p className="mb-6">Sign in with GitHub to scan your repositories for secrets and misconfigurations.</p>
            <button
              onClick={() => signIn('github')}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Sign in with GitHub
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Your GitHub Repositories</h2>
              <button
                onClick={() => signOut()}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Sign out
              </button>
            </div>

            {loading ? (
              <p>Loading repos...</p>
            ) : repos.length === 0 ? (
              <p>No repositories found.</p>
            ) : (
              <div className="space-y-4">
                {repos.map((repo) => (
                  <GitHubRepoCard
                    key={repo.id}
                    name={repo.name}
                    description={repo.description}
                    html_url={repo.html_url}
                    onScan={() => handleScan(repo.name)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
