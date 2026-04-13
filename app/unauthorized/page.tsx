import Link from 'next/link';
import { ShieldX, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="inline-flex w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 items-center justify-center mx-auto">
          <ShieldX className="w-10 h-10 text-red-400" />
        </div>
        <div>
          <h1 className="text-4xl font-display mb-2">Access Denied</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            You don't have permission to view this page. Please sign in with an authorized account.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn-outline-gold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Home
          </Link>
          <Link href="/login" className="btn-gold">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
