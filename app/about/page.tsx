import type { Metadata } from 'next';
import Link from 'next/link';
import { Scale, Target, Globe, Shield, Users, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Brevet Hub',
  description: 'Learn about Brevet Hub — the world\'s most trusted intellectual property marketplace connecting inventors with buyers globally.',
};

const TEAM = [
  { name: 'Alexandra Chen',   role: 'CEO & Co-Founder',       emoji: '👩‍💼' },
  { name: 'Marcus Okonkwo',   role: 'CTO & Co-Founder',       emoji: '👨‍💻' },
  { name: 'Isabelle Dupont',  role: 'Head of IP Verification', emoji: '👩‍⚖️' },
  { name: 'Raj Patel',        role: 'Head of Partnerships',    emoji: '🤝' },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

      {/* Mission */}
      <section className="text-center space-y-6 animate-fade-in">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 items-center justify-center mx-auto shadow-lg">
          <Scale className="w-8 h-8 text-midnight-900" />
        </div>
        <h1 className="text-5xl font-display">
          About <span className="text-gold-gradient">Brevet Hub</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          We exist to unlock the economic potential of human ingenuity — connecting inventors with
          the right buyers and licensees to bring innovations to life.
        </p>
      </section>

      <div className="divider-gold" />

      {/* Values */}
      <section id="inventors" className="space-y-10">
        <h2 className="text-3xl font-display text-center">Our <span className="text-gold-gradient">Values</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Target,  title: 'Precision',    desc: 'Every patent is manually reviewed by our IP experts before reaching the marketplace.' },
            { icon: Globe,   title: 'Accessibility', desc: 'Breaking geographic barriers so innovators from 87+ countries can participate.' },
            { icon: Shield,  title: 'Trust',         desc: 'Verified identities, secure transactions, and full compliance with international IP law.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-2xl p-8 text-center space-y-4 hover:border-gold-500/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto">
                <Icon className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For Inventors */}
      <section className="glass rounded-3xl p-10 space-y-6">
        <h2 className="text-2xl font-display">For <span className="text-gold-gradient">Inventors</span></h2>
        <div className="grid sm:grid-cols-2 gap-6 text-sm text-muted-foreground">
          {[
            'List your patent in under 10 minutes with our guided multi-step form.',
            'Reach qualified buyers and licensees from 87+ countries worldwide.',
            'Our expert team verifies and promotes your listing across the platform.',
            'Track views, inquiries, and offer status from your personal dashboard.',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <p className="leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
        <Link href="/register?role=INVENTOR" className="btn-gold inline-flex items-center gap-2">
          List Your Patent <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* For Buyers */}
      <section id="buyers" className="glass rounded-3xl p-10 space-y-6">
        <h2 className="text-2xl font-display">For <span className="text-gold-gradient">Buyers</span></h2>
        <div className="grid sm:grid-cols-2 gap-6 text-sm text-muted-foreground">
          {[
            'Browse thousands of verified patents with advanced search and filters.',
            'Contact inventors directly through our secure in-platform messaging.',
            'Access full technical documentation and legal status of any patent.',
            'Negotiate licensing or outright purchase with confidence and safety.',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              <p className="leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
        <Link href="/patents" className="btn-gold inline-flex items-center gap-2">
          Browse Patents <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Team */}
      <section className="space-y-10">
        <h2 className="text-3xl font-display text-center flex items-center justify-center gap-3">
          <Users className="w-7 h-7 text-gold-400" /> Our Team
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {TEAM.map(({ name, role, emoji }) => (
            <div key={name} className="glass rounded-2xl p-6 text-center space-y-3 hover:-translate-y-1 transition-transform duration-300">
              <div className="text-4xl">{emoji}</div>
              <div>
                <p className="font-semibold text-sm">{name}</p>
                <p className="text-xs text-gold-400 mt-0.5">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
