// /app/about/page.tsx
import Hero from '../../components/Hero';
import FeatureCard from '../../components/FeatureCard';
import CTA from '../../components/CTA';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <div className="font-sans text-gray-900">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Secure Your Code and Tokens Effortlessly
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Scan your GitHub repos, inspect JWTs, and get actionable security insights in minutes.
          </p>
          <a
            href="#signup"
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Get Early Access
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="JWT Inspector"
            description="Decode, validate, and highlight common JWT issues quickly."
          />
          <FeatureCard
            title="GitHub Scanner"
            description="Detect hardcoded secrets, tokens, and misconfigurations in your repos."
          />
          <FeatureCard
            title="Security Advisor"
            description="Receive a clear security score and actionable remediation tips."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div>
            <div className="text-indigo-600 font-bold text-4xl mb-4">1</div>
            <h3 className="text-xl font-semibold mb-2">Scan</h3>
            <p>Scan your repos or JWTs securely using our easy tools.</p>
          </div>
          <div>
            <div className="text-indigo-600 font-bold text-4xl mb-4">2</div>
            <h3 className="text-xl font-semibold mb-2">Detect</h3>
            <p>Identify security misconfigurations, hardcoded secrets, and token issues.</p>
          </div>
          <div>
            <div className="text-indigo-600 font-bold text-4xl mb-4">3</div>
            <h3 className="text-xl font-semibold mb-2">Fix</h3>
            <p>Get clear, actionable advice to remediate issues and secure your projects.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="signup" className="py-20 px-6 max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Early Access</h2>
        <p className="mb-6">Sign up now to be the first to use our security tools.</p>
        <form className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg border border-gray-300 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
        </form>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
