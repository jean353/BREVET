'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Scale, User, Mail, Lock, Building2, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Role = 'BUYER' | 'INVENTOR';

function RegisterContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const defaultRole  = (searchParams.get('role') as Role) ?? 'BUYER';

  const [form, setForm] = useState({
    name: '', email: '', password: '', role: defaultRole as Role,
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Registration failed');

      // Auto sign-in after registration
      await signIn('credentials', { email: form.email, password: form.password, redirect: false });
      router.push(form.role === 'INVENTOR' ? '/dashboard/inventor' : '/patents');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roles: { id: Role; label: string; desc: string; icon: typeof User }[] = [
    { id: 'BUYER',    label: 'Buyer / Licensee', desc: 'Browse and acquire patents',   icon: Building2 },
    { id: 'INVENTOR', label: 'Inventor',          desc: 'List and sell your patents',   icon: Scale },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="glass rounded-2xl p-8 border-gold-glow space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 items-center justify-center shadow-lg mb-2">
              <Scale className="w-7 h-7 text-midnight-900" />
            </div>
            <h1 className="text-2xl font-display">Create your account</h1>
            <p className="text-sm text-muted-foreground">Join the world's leading IP marketplace</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3">
            {roles.map(({ id, label, desc, icon: Icon }) => (
              <button
                key={id}
                type="button"
                id={`role-${id.toLowerCase()}`}
                onClick={() => setForm(f => ({ ...f, role: id }))}
                className={cn(
                  'rounded-xl p-4 text-left border transition-all duration-200',
                  form.role === id
                    ? 'border-gold-500/60 bg-gold-500/10'
                    : 'border-white/8 hover:border-white/20 bg-white/2'
                )}
              >
                <div className="flex items-start justify-between">
                  <Icon className={cn('w-5 h-5 mt-0.5', form.role === id ? 'text-gold-400' : 'text-muted-foreground')} />
                  {form.role === id && <CheckCircle className="w-4 h-4 text-gold-400" />}
                </div>
                <p className={cn('font-medium text-sm mt-2', form.role === id ? 'text-foreground' : 'text-muted-foreground')}>{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: 'reg-name',     key: 'name',     label: 'Full Name', type: 'text',     icon: User,  placeholder: 'Jane Doe' },
              { id: 'reg-email',    key: 'email',    label: 'Email',     type: 'email',    icon: Mail,  placeholder: 'you@example.com' },
              { id: 'reg-password', key: 'password', label: 'Password',  type: 'password', icon: Lock,  placeholder: '8+ characters' },
            ].map(({ id, key, label, type, icon: Icon, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id={id}
                    type={type}
                    required
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="input-dark pl-10"
                    placeholder={placeholder}
                    minLength={key === 'password' ? 8 : undefined}
                  />
                </div>
              </div>
            ))}

            <button id="register-submit" type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 py-3 mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-muted-foreground">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
