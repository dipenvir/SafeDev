// /components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} SecureScan. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#signup" className="hover:text-white transition">Sign Up</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </div>
      </div>
    </footer>
  );
}
