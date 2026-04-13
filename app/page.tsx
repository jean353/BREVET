import Link from 'next/link';
import {
  Scale, ArrowRight, TrendingUp, Shield, Globe, Zap,
  BarChart3, Star, CheckCircle,
} from 'lucide-react';

const STATS = [
  { label: 'Patents Listed',    value: '12,400+' },
  { label: 'Transactions',      value: '$2.1B+' },
  { label: 'Countries',         value: '87' },
  { label: 'Verified Inventors',value: '4,200+' },
];

const FEATURES = [
  {
    icon:  Shield,
    title: 'Verified & Secure',
    desc:  'Every patent is manually reviewed and verified by our expert team before listing.',
  },
  {
    icon:  Globe,
    title: 'Global Reach',
    desc:  'Connect with inventors and buyers from 87+ countries in one unified marketplace.',
  },
  {
    icon:  Zap,
    title: 'Fast Transactions',
    desc:  'Streamlined licensing and sale processes with built-in messaging and docs.',
  },
  {
    icon:  BarChart3,
    title: 'Market Insights',
    desc:  'Real-time valuation data and analytics to help you make informed IP decisions.',
  },
];

const CATEGORIES = [
  { name: 'Technology',     emoji: '💻', count: '2,340' },
  { name: 'Biotech',        emoji: '🧬', count: '1,890' },
  { name: 'Software',       emoji: '⚙️',  count: '3,100' },
  { name: 'Medical',        emoji: '🏥', count: '980' },
  { name: 'Energy',         emoji: '⚡', count: '760' },
  { name: 'Aerospace',      emoji: '🚀', count: '430' },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">

      {/* ── HERO ─────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 py-24 bg-hero-pattern">
        <div className="hero-glow top-0 left-1/2 -translate-x-1/2 -translate-y-1/3" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-gold-glow text-sm text-gold-400 font-medium mb-4">
            <Star className="w-3.5 h-3.5" fill="currentColor" />
            #1 Intellectual Property Marketplace
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display leading-tight">
            Where <span className="text-gold-gradient">Inventions</span>
            <br />Find Their Future
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Buy, sell, and license patents from verified inventors worldwide. 
            From software to biotech — your next breakthrough starts here.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/patents" id="hero-browse-btn" className="btn-gold text-base px-8 py-3.5 flex items-center gap-2">
              Browse Patents <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/register?role=INVENTOR" id="hero-list-btn" className="btn-outline-gold text-base px-8 py-3.5 flex items-center gap-2">
              List Your Patent <Scale className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mt-16 glass rounded-2xl overflow-hidden border-gold-glow">
            {STATS.map((s) => (
              <div key={s.label} className="px-6 py-5 flex flex-col items-center hover:bg-white/3 transition-colors">
                <span className="text-2xl sm:text-3xl font-bold text-gold-gradient">{s.value}</span>
                <span className="text-xs text-muted-foreground mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display mb-4">Why <span className="text-gold-gradient">Brevet Hub</span>?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">The most trusted platform for IP professionals, innovators, and forward-thinking companies.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`glass rounded-2xl p-6 space-y-4 hover:border-gold-500/20 transition-all duration-300 animate-fade-in delay-${i * 100}`}>
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                <f.icon className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display">Browse <span className="text-gold-gradient">Categories</span></h2>
              <p className="text-muted-foreground mt-2">Explore patents by industry vertical</p>
            </div>
            <Link href="/patents" className="text-sm text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/patents?category=${cat.name.toUpperCase()}`}
                className="glass rounded-xl p-5 text-center group hover:border-gold-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{cat.emoji}</div>
                <p className="font-medium text-sm">{cat.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{cat.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center glass rounded-3xl p-16 border-gold-glow relative overflow-hidden">
          <div className="hero-glow inset-0 m-auto opacity-50" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-center gap-2 text-gold-400 mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-widest">Ready to monetize?</span>
            </div>
            <h2 className="text-4xl font-display">Turn Your Invention Into Income</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Join 4,200+ inventors who've already listed their patents on Brevet Hub and reached global buyers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              {['Free listing', 'Expert review', 'Secure escrow', 'Global reach'].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-gold-400" /> {item}
                </span>
              ))}
            </div>
            <Link href="/register?role=INVENTOR" id="cta-inventor-btn" className="btn-gold inline-flex items-center gap-2 text-base px-8 py-3.5 mt-2">
              Start Listing Today <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
