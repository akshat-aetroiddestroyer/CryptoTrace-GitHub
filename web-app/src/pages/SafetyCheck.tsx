import { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, ShieldQuestion, Info } from 'lucide-react';
import { lookupRegistry, shortAddr } from '@/lib/mock-data';

const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

export function SafetyCheck() {
  const [address, setAddress] = useState('');
  const [checked, setChecked] = useState<string | null>(null);
  const [error, setError] = useState('');

  const runCheck = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = address.trim();
    if (!ADDRESS_PATTERN.test(trimmed)) {
      setError('Enter a valid Ethereum address (0x + 40 hex characters).');
      setChecked(null);
      return;
    }
    setError('');
    setChecked(trimmed);
  };

  const hit = checked ? lookupRegistry(checked) : null;

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 lg:px-8" data-testid="page-safety-check">
      <header className="mb-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Prevention layer</p>
        <h1 className="mt-1 font-serif text-3xl tracking-[-0.03em] md:text-4xl">Pre-transaction wallet safety check</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Check a wallet address before sending funds. Verdict is sourced from the Suspect Registry — the same shared
          memory used by investigators across cases.
        </p>
      </header>

      <form onSubmit={runCheck} className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Wallet address</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x…"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-sm outline-none ring-primary focus:ring-2"
            data-testid="input-safety-address"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground"
            data-testid="button-run-safety-check"
          >
            <Search size={14} />
            Check safety
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <p className="mt-3 text-[11px] text-muted-foreground">
          Try a registry address e.g. <button type="button" className="font-mono text-primary underline" onClick={() => setAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1')}>0x742d35Cc…</button>
        </p>
      </form>

      {checked && (
        <div className="mt-6" data-testid="safety-result">
          {hit ? (
            <div
              className={`rounded-xl border p-6 ${
                hit.riskLevel === 'high'
                  ? 'border-red-300 bg-red-50'
                  : hit.riskLevel === 'moderate'
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-emerald-300 bg-emerald-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <ShieldAlert
                  size={28}
                  className={hit.riskLevel === 'high' ? 'text-red-700' : hit.riskLevel === 'moderate' ? 'text-amber-700' : 'text-emerald-700'}
                />
                <div>
                  <h2 className="font-serif text-2xl">
                    {hit.riskLevel === 'high' ? 'Flagged — high risk' : hit.riskLevel === 'moderate' ? 'Flagged — moderate risk' : 'Previously reviewed'}
                  </h2>
                  <p className="mt-1 font-mono text-xs">{shortAddr(checked)}</p>
                  <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">Risk score</dt>
                      <dd className="font-semibold">{hit.riskScore}/100</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Linked cases</dt>
                      <dd className="font-semibold">{hit.caseCount}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Typologies</dt>
                      <dd>{hit.typologies.join(', ')}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Status</dt>
                      <dd className="capitalize">{hit.status.replace('_', ' ')}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm leading-6">{hit.notes}</p>
                  <p className="mt-4 flex gap-2 text-[11px] leading-5 text-muted-foreground">
                    <Info size={13} className="mt-0.5 shrink-0" />
                    Do not send funds. If you already paid, file a complaint and preserve the transaction hash.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck size={28} className="text-emerald-700" />
                <div>
                  <h2 className="font-serif text-2xl text-emerald-950">Not currently flagged</h2>
                  <p className="mt-1 font-mono text-xs">{shortAddr(checked)}</p>
                  <p className="mt-3 text-sm leading-6 text-emerald-900/80">
                    This address does not appear in the CryptoTrace suspect registry. Absence of a flag is not a guarantee
                    of safety — new scams appear continuously. Verify the counterparty through independent channels.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!checked && (
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <ShieldQuestion size={18} className="mt-0.5 shrink-0" />
          <p>
            Same check is designed for a future browser extension and WhatsApp bot: detect an address on any page or chat
            and query this registry instantly before a transaction is signed.
          </p>
        </div>
      )}
    </div>
  );
}
