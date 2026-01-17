import { useState } from 'react';

export default function CTA() {
  const [email, setEmail] = useState('');

  return (
    <section id="signup" className="py-20 px-6 max-w-2xl mx-auto text-center bg-gray-50 rounded-lg shadow">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Early Access</h2>
      <p className="mb-6">Sign up now to be the first to use our security tools.</p>
      <form
        className="flex flex-col sm:flex-row gap-4 justify-center"
        onSubmit={(e) => {
          e.preventDefault();
          console.log('Email submitted:', email);
        }}
      >
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
  );
}
