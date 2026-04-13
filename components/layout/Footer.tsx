import Link from 'next/link';
import { Scale, Github, Twitter, Linkedin } from 'lucide-react';

const LINKS = {
  Marketplace: [
    { label: 'Browse Patents', href: '/patents' },
    { label: 'Categories',     href: '/patents?category=TECHNOLOGY' },
    { label: 'Featured',       href: '/patents?sort=featured' },
  ],
  Platform: [
    { label: 'List a Patent', href: '/register' },
    { label: 'For Inventors',  href: '/about#inventors' },
    { label: 'For Buyers',     href: '/about#buyers' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use',   href: '/terms' },
    { label: 'Cookie Policy',  href: '/cookies' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <Scale className="w-4 h-4 text-midnight-900" />
              </div>
              <span className="font-display text-lg font-bold text-gold-gradient">Brevet Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              The world's most trusted marketplace for intellectual property — where innovations find their future.
            </p>
            <div className="flex items-center gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-muted-foreground hover:text-gold-400 hover:border-gold-500/40 transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">{heading}</h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider-gold my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Brevet Hub. All rights reserved.</p>
          <p>Built for innovators, by innovators.</p>
        </div>
      </div>
    </footer>
  );
}
