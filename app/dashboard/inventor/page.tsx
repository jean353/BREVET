'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { PatentCard } from '@/components/patents/PatentCard';
import { PatentListSkeleton } from '@/components/ui/Skeleton';
import {
  Plus, X, ChevronRight, ChevronLeft, Loader2,
  LayoutDashboard, PlusCircle, FileText,
} from 'lucide-react';
import { PATENT_CATEGORIES } from '@/lib/utils';
import { cn } from '@/lib/utils';

// ── Zod schemas per step ──────────────────────────────
const step1Schema = z.object({
  title:       z.string().min(5,  'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category:    z.enum(PATENT_CATEGORIES as unknown as [string, ...string[]]),
  country:     z.string().min(2,  'Country required'),
});
const step2Schema = z.object({
  patentNumber: z.string().optional(),
  filingDate:   z.string().optional(),
  techDetails:  z.string().optional(),
  tags:         z.string().optional(),
});
const step3Schema = z.object({
  price:       z.coerce.number().min(1, 'Price must be positive'),
  currency:    z.string().default('USD'),
  licenseType: z.enum(['SELL', 'LICENSE', 'BOTH']),
});

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;
type Step3 = z.infer<typeof step3Schema>;

const STEPS = ['General', 'Technical', 'Financial', 'Review'];

// ── Main page ─────────────────────────────────────────
export default function InventorDashboard() {
  const { data: session } = useSession();
  const [view,     setView]     = useState<'list' | 'create'>('list');
  const [patents,  setPatents]  = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [step,     setStep]     = useState(0);
  const [formData, setFormData] = useState<Partial<Step1 & Step2 & Step3>>({});
  const [submitting, setSubmitting] = useState(false);

  const form1 = useForm<Step1>({ resolver: zodResolver(step1Schema), defaultValues: formData });
  const form2 = useForm<Step2>({ resolver: zodResolver(step2Schema), defaultValues: formData });
  const form3 = useForm<Step3>({ resolver: zodResolver(step3Schema), defaultValues: formData as any });

  const fetchPatents = async () => {
    setLoading(true);
    const res = await fetch('/api/patents?status=&inventorOnly=true');
    if (res.ok) { const d = await res.json(); setPatents(d.patents ?? []); }
    setLoading(false);
  };

  useEffect(() => { fetchPatents(); }, []);

  const next1 = form1.handleSubmit(d => { setFormData(p => ({ ...p, ...d })); setStep(1); });
  const next2 = form2.handleSubmit(d => { setFormData(p => ({ ...p, ...d })); setStep(2); });
  const next3 = form3.handleSubmit(d => { setFormData(p => ({ ...p, ...d })); setStep(3); });

  const submit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags:      formData.tags ? (formData.tags as any).split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        filingDate: formData.filingDate ? new Date(formData.filingDate) : undefined,
        status:    'PENDING',
      };
      const res = await fetch('/api/patents', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success('Patent submitted for review!');
      setView('list'); setStep(0); setFormData({});
      form1.reset(); form2.reset(); form3.reset();
      fetchPatents();
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const user = session?.user as any;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display">
            Inventor <span className="text-gold-gradient">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name}!</p>
        </div>
        <button
          id="new-patent-btn"
          onClick={() => { setView('create'); setStep(0); }}
          className="btn-gold flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> New Patent
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl w-fit">
        {[{ id: 'list', label: 'My Patents', icon: LayoutDashboard }, { id: 'create', label: 'Submit Patent', icon: FileText }].map(t => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            onClick={() => { setView(t.id as any); setStep(0); }}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all', view === t.id ? 'bg-gold-500/20 text-gold-400' : 'text-muted-foreground hover:text-foreground')}
          >
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {/* ── LIST VIEW ── */}
      {view === 'list' && (
        <div className="space-y-6">
          {loading ? <PatentListSkeleton count={3} /> : patents.length === 0 ? (
            <div className="text-center py-20 glass rounded-2xl">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No patents yet</h3>
              <p className="text-muted-foreground mb-6">Submit your first patent to get started.</p>
              <button onClick={() => setView('create')} className="btn-gold inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Submit a Patent
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {patents.map(p => <PatentCard key={p.id} patent={p} showStatus />)}
            </div>
          )}
        </div>
      )}

      {/* ── CREATE VIEW — MULTI-STEP ── */}
      {view === 'create' && (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
          {/* Progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-muted-foreground">
              {STEPS.map((s, i) => (
                <span key={s} className={cn('font-medium', i === step ? 'text-gold-400' : i < step ? 'text-foreground' : '')}>{s}</span>
              ))}
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
            </div>
          </div>

          <div className="glass rounded-2xl p-8 border-gold-glow space-y-6">
            {/* STEP 1 — General */}
            {step === 0 && (
              <form onSubmit={next1} className="space-y-5">
                <h2 className="text-xl font-semibold">General Information</h2>
                <Field label="Patent Title" error={form1.formState.errors.title?.message}>
                  <input id="patent-title" {...form1.register('title')} className="input-dark" placeholder="e.g. Quantum Error Correction Method" />
                </Field>
                <Field label="Description" error={form1.formState.errors.description?.message}>
                  <textarea id="patent-desc" {...form1.register('description')} rows={5} className="input-dark resize-none" placeholder="Describe your invention in detail…" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Category" error={form1.formState.errors.category?.message}>
                    <select id="patent-category" {...form1.register('category')} className="input-dark">
                      <option value="">Select category</option>
                      {PATENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Country" error={form1.formState.errors.country?.message}>
                    <input id="patent-country" {...form1.register('country')} className="input-dark" placeholder="e.g. United States" />
                  </Field>
                </div>
                <StepNav step={step} setStep={setStep} isLast={false} />
              </form>
            )}

            {/* STEP 2 — Technical */}
            {step === 1 && (
              <form onSubmit={next2} className="space-y-5">
                <h2 className="text-xl font-semibold">Technical Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Patent Number (optional)">
                    <input id="patent-number" {...form2.register('patentNumber')} className="input-dark" placeholder="e.g. US1234567" />
                  </Field>
                  <Field label="Filing Date (optional)">
                    <input id="patent-filing" {...form2.register('filingDate')} type="date" className="input-dark" />
                  </Field>
                </div>
                <Field label="Technical Specifications (optional)">
                  <textarea id="patent-tech" {...form2.register('techDetails')} rows={5} className="input-dark resize-none" placeholder="Claims, technical breakdown, implementation details…" />
                </Field>
                <Field label="Tags (comma-separated)">
                  <input id="patent-tags" {...form2.register('tags')} className="input-dark" placeholder="e.g. AI, machine learning, neural networks" />
                </Field>
                <StepNav step={step} setStep={setStep} isLast={false} />
              </form>
            )}

            {/* STEP 3 — Financial */}
            {step === 2 && (
              <form onSubmit={next3} className="space-y-5">
                <h2 className="text-xl font-semibold">Pricing & Licensing</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Asking Price" error={(form3.formState.errors.price as any)?.message}>
                    <input id="patent-price" {...form3.register('price')} type="number" min="0" className="input-dark" placeholder="e.g. 250000" />
                  </Field>
                  <Field label="Currency">
                    <select id="patent-currency" {...form3.register('currency')} className="input-dark">
                      {['USD', 'EUR', 'GBP', 'JPY', 'CAD'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="License Type" error={form3.formState.errors.licenseType?.message}>
                  <select id="patent-license" {...form3.register('licenseType')} className="input-dark">
                    <option value="">Select type</option>
                    <option value="SELL">Outright Sale</option>
                    <option value="LICENSE">Licensing Only</option>
                    <option value="BOTH">Sale or License</option>
                  </select>
                </Field>
                <StepNav step={step} setStep={setStep} isLast={false} />
              </form>
            )}

            {/* STEP 4 — Review */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold">Review & Submit</h2>
                <div className="space-y-3 text-sm">
                  {[
                    ['Title',       formData.title],
                    ['Category',    formData.category],
                    ['Country',     formData.country],
                    ['Price',       `${formData.price} ${formData.currency}`],
                    ['License',     formData.licenseType],
                    ['Patent #',    formData.patentNumber || '—'],
                    ['Filing Date', formData.filingDate   || '—'],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium">{v as string}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(2)} className="btn-outline-gold flex items-center gap-2 flex-1 justify-center">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    id="submit-patent-btn"
                    type="button"
                    onClick={submit}
                    disabled={submitting}
                    className="btn-gold flex-1 flex items-center justify-center gap-2"
                  >
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : 'Submit for Review'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function StepNav({ step, setStep, isLast }: { step: number; setStep: (n: number) => void; isLast: boolean }) {
  return (
    <div className="flex gap-3 pt-2">
      {step > 0 && (
        <button type="button" onClick={() => setStep(step - 1)} className="btn-outline-gold flex items-center gap-2 flex-1 justify-center">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      )}
      <button type="submit" className="btn-gold flex items-center gap-2 flex-1 justify-center">
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
