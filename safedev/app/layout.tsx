// /app/layout.tsx
import './globals.css';
import Footer from '../components/Footer';
import SessionProviderWrapper from '../components/SessionProviderWrapper';

export const metadata = {
  title: 'SecureScan',
  description: 'Scan GitHub repos and JWTs for security issues',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 min-h-screen flex flex-col">
        {/* Client Component wrapper */}
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
        <Footer />
      </body>
    </html>
  );
}
