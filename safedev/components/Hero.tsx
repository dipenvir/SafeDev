// /components/Hero.tsx
export default function Hero() {
  return (
    <section className="bg-indigo-600 text-white py-32 px-6 min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-5xl md:text-6xl font-bold mb-6">
        Secure Your Code and Tokens Effortlessly
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-2xl">
        Scan your GitHub repos, inspect JWTs, and get actionable security insights in minutes.
      </p>
      <a
        href="#signup"
        className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
      >
        Get Early Access
      </a>
    </section>
  );
}
