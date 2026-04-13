import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 animate-fade-in">
        <p className="text-8xl font-display text-gold-gradient">404</p>
        <div>
          <h1 className="text-3xl font-display mb-2">Page Not Found</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn-outline-gold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <Link href="/patents" className="btn-gold flex items-center gap-2">
            <Search className="w-4 h-4" /> Browse Patents
          </Link>
        </div>
      </div>
    </div>
  );
}
