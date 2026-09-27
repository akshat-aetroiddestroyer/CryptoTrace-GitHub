import { useMemo, useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, BookOpen, ExternalLink, Filter } from 'lucide-react';
import { CASE_LAW, SUSPECT_REGISTRY, shortAddr, type SuspectWallet } from '@/lib/mock-data';

function RiskBadge({ level }: { level: string }) {
  const cls =
    level === 'high'
      ? 'border-red-200 bg-red-50 text-red-700'
      : level === 'moderate'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-emerald-200 bg-emerald-50 text-emerald-700';
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${cls}`}>
      {level}
    </span>
  );
}

function StatusBadge({ status }: { status: SuspectWallet['status'] }) {
  const map: Record<string, string> = {
    flagged: 'bg-red-100 text-red-800',
    frozen: 'bg-blue-100 text-blue-800',
    under_review: 'bg-amber-100 text-amber-900',
    cleared: 'bg-emerald-100 text-emerald-800',
  };
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${map[status] ?? 'bg-muted'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export function Registry() {
  const [query, setQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'moderate' | 'low'>('all');
  const [tab, setTab] = useState<'wallets' | 'caselaw'>('wallets');

  const wallets = useMemo(() => {
    return SUSPECT_REGISTRY.filter((w) => {
      const matchQ =
        !query ||
        w.address.toLowerCase().includes(query.toLowerCase()) ||
        w.typologies.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
        (w.exchangeHint ?? '').toLowerCase().includes(query.toLowerCase());
      const matchR = riskFilter === 'all' || w.riskLevel === riskFilter;
      return matchQ && matchR;
    });
  }, [query, riskFilter]);

  const cases = useMemo(() => {
    if (!query) return CASE_LAW;
    const q = query.toLowerCase();
    return CASE_LAW.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8" data-testid="page-registry">
      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Public source of truth</p>
        <h1 className="mt-1 font-serif text-3xl tracking-[-0.03em] md:text-4xl">Fraud-wallet & case-law registry</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Searchable database of wallets previously flagged in fraud complaints, plus curated Supreme Court / High Court
          crypto-fraud judgments. Built for investigators, journalists, and ordinary users.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === 'wallets' ? 'Search address, typology, exchange…' : 'Search judgment, tag, court…'}
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none ring-primary focus:ring-2"
            data-testid="input-registry-search"
          />
        </div>
        <div className="flex rounded-lg border border-border p-0.5">
          <button
            type="button"
            onClick={() => setTab('wallets')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${tab === 'wallets' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
          >
            Flagged wallets
          </button>
          <button
            type="button"
            onClick={() => setTab('caselaw')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${tab === 'caselaw' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
          >
            Case law
          </button>
        </div>
      </div>

      {tab === 'wallets' && (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Filter size={14} className="text-muted-foreground" />
            {(['all', 'high', 'moderate', 'low'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRiskFilter(r)}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium capitalize ${
                  riskFilter === r ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                }`}
              >
                {r}
              </button>
            ))}
            <span className="ml-auto font-mono text-[10px] text-muted-foreground">{wallets.length} records</span>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="hidden grid-cols-[1.4fr_.7fr_.6fr_.8fr_1fr] gap-3 border-b border-border bg-muted/40 px-4 py-2 font-mono text-[9px] uppercase tracking-wider text-muted-foreground sm:grid">
              <span>Wallet</span>
              <span>Risk</span>
              <span>Cases</span>
              <span>Status</span>
              <span>Exchange hint</span>
            </div>
            {wallets.map((w) => (
              <div
                key={w.address}
                className="grid gap-2 border-b border-border px-4 py-3 last:border-0 sm:grid-cols-[1.4fr_.7fr_.6fr_.8fr_1fr] sm:items-center sm:gap-3"
                data-testid={`row-wallet-${w.address}`}
              >
                <div>
                  <p className="font-mono text-xs font-medium">{shortAddr(w.address)}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{w.typologies.join(' · ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBadge level={w.riskLevel} />
                  <span className="font-mono text-[11px] text-muted-foreground">{w.riskScore}</span>
                </div>
                <p className="text-sm font-semibold">{w.caseCount}</p>
                <StatusBadge status={w.status} />
                <p className="text-xs text-muted-foreground">{w.exchangeHint ?? '—'}</p>
              </div>
            ))}
            {!wallets.length && (
              <p className="px-4 py-10 text-center text-sm text-muted-foreground">No wallets match this filter.</p>
            )}
          </div>
        </>
      )}

      {tab === 'caselaw' && (
        <div className="grid gap-4 md:grid-cols-2">
          {cases.map((c) => (
            <article key={c.id} className="rounded-xl border border-border bg-card p-5" data-testid={`card-caselaw-${c.id}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-primary">
                  <BookOpen size={16} />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{c.court}</span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">{c.year}</span>
              </div>
              <h2 className="mt-3 font-serif text-lg leading-snug tracking-[-0.02em]">{c.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{c.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                <ExternalLink size={11} /> {c.citation}
              </p>
            </article>
          ))}
        </div>
      )}

      <aside className="mt-8 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950">
        <div className="flex gap-2">
          <ShieldAlert size={16} className="mt-0.5 shrink-0" />
          <p>
            Registry entries are investigative signals, not judicial findings of guilt. Always corroborate with primary
            chain data and official complaint systems (NCRP / local cyber cell) before taking action.
          </p>
        </div>
      </aside>
    </div>
  );
}
