import { useState } from 'react';
import { Link2, Hash, FileCheck2, Copy, Check, Shield } from 'lucide-react';
import { EVIDENCE_VAULT, shortAddr } from '@/lib/mock-data';

export function EvidenceVault() {
  const [copied, setCopied] = useState<string | null>(null);
  const [anchorDemo, setAnchorDemo] = useState(false);

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8" data-testid="page-evidence-vault">
      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Tamper-evident record</p>
        <h1 className="mt-1 font-serif text-3xl tracking-[-0.03em] md:text-4xl">On-chain evidence vault</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Every case&apos;s evidence pack (wallet trace, AI reasoning log, complaint record) is hashed and the hash is
          anchored on a low-cost testnet with a timestamp — making the package independently verifiable and strengthening
          courtroom admissibility.
        </p>
      </header>

      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-primary" />
            <h2 className="font-semibold">Anchor new evidence pack (demo)</h2>
          </div>
          <button
            type="button"
            onClick={() => setAnchorDemo(true)}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            data-testid="button-anchor-demo"
          >
            Simulate hash + anchor
          </button>
        </div>
        {anchorDemo && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950" data-testid="anchor-demo-result">
            <p className="font-semibold">Demo anchor submitted</p>
            <p className="mt-1 font-mono text-xs break-all">
              hash: 0xdemo{Date.now().toString(16).padStart(56, '0')}
            </p>
            <p className="mt-1 text-xs text-emerald-800/80">Network: Sepolia · Status: confirmed (simulated)</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {EVIDENCE_VAULT.map((rec) => (
          <article key={rec.caseId} className="rounded-xl border border-border bg-card p-5" data-testid={`evidence-${rec.caseId}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Case ID</p>
                <h2 className="font-serif text-xl">{rec.caseId}</h2>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{shortAddr(rec.address)}</p>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-1 font-mono text-[10px] uppercase">{rec.network}</span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Hash size={13} />
                  <span className="font-mono text-[9px] uppercase tracking-wider">Content hash</span>
                </div>
                <p className="mt-1 break-all font-mono text-[11px]">{rec.hash}</p>
                <button
                  type="button"
                  onClick={() => copy(rec.hash, rec.caseId + '-hash')}
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-primary"
                >
                  {copied === rec.caseId + '-hash' ? <Check size={12} /> : <Copy size={12} />}
                  Copy
                </button>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Link2 size={13} />
                  <span className="font-mono text-[9px] uppercase tracking-wider">Anchor tx</span>
                </div>
                <p className="mt-1 break-all font-mono text-[11px]">{rec.txHash ?? 'Pending confirmation'}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Anchored {new Date(rec.anchoredAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">Pack components</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {rec.components.map((c) => (
                  <li key={c} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px]">
                    <FileCheck2 size={12} className="text-emerald-600" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <aside className="mt-8 rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        MVP uses a single smart-contract pattern: <code className="font-mono text-xs">storeHash(bytes32)</code> on a
        public testnet. Production would use a permissioned notary or L2 with LEA-readable events.
      </aside>
    </div>
  );
}
