'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import {
  Scale, Menu, X, ChevronDown, LogOut, User,
  LayoutDashboard, ShieldCheck, MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/patents',  label: 'Marketplace' },
  { href: '/about',   label: 'About' },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const user = session?.user as any;

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 glass">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg group-hover:shadow-gold-500/30 transition-shadow">
            <Scale className="w-4 h-4 text-midnight-900" />
          </div>
          <span className="font-display text-lg font-bold text-gold-gradient">Brevet Hub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn('nav-link text-sm', pathname.startsWith(l.href) && 'active text-foreground')}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-white/5 transition-colors text-sm"
              >
                <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 text-xs font-bold">
                  {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <span className="text-foreground max-w-[120px] truncate">{user?.name}</span>
                <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', dropOpen && 'rotate-180')} />
              </button>
              {dropOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 glass rounded-xl border border-white/10 shadow-2xl overflow-hidden animate-fade-in" onMouseLeave={() => setDropOpen(false)}>
                  <div className="px-3 py-2.5 border-b border-white/5">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                    <span className="text-xs text-gold-400 font-medium">{user?.role}</span>
                  </div>
                  <div className="py-1">
                    {user?.role === 'INVENTOR' && (
                      <Link href="/dashboard/inventor" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors" onClick={() => setDropOpen(false)}>
                        <LayoutDashboard className="w-4 h-4 text-muted-foreground" /> Dashboard
                      </Link>
                    )}
                    {user?.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors" onClick={() => setDropOpen(false)}>
                        <ShieldCheck className="w-4 h-4 text-muted-foreground" /> Admin Panel
                      </Link>
                    )}
                    <Link href="/messages" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors" onClick={() => setDropOpen(false)}>
                      <MessageSquare className="w-4 h-4 text-muted-foreground" /> Messages
                    </Link>
                    <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors" onClick={() => setDropOpen(false)}>
                      <User className="w-4 h-4 text-muted-foreground" /> Profile
                    </Link>
                    <div className="border-t border-white/5 mt-1 pt-1">
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-outline-gold text-sm">Sign in</Link>
              <Link href="/register" className="btn-gold text-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button className="md:hidden p-2 rounded-lg hover:bg-white/5" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-4 space-y-2 animate-fade-in">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="block py-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/5 flex gap-3">
            {session ? (
              <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-outline-gold text-sm w-full">Sign out</button>
            ) : (
              <>
                <Link href="/login" className="btn-outline-gold text-sm flex-1 text-center" onClick={() => setOpen(false)}>Sign in</Link>
                <Link href="/register" className="btn-gold text-sm flex-1 text-center" onClick={() => setOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
