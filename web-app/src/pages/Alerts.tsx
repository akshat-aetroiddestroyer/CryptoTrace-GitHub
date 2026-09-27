import { useState } from 'react';
import { AlertTriangle, Clock, Shield, Radio, CheckCircle2, Ban } from 'lucide-react';
import { GOLDEN_HOUR_ALERTS, shortAddr } from '@/lib/mock-data';

export function Alerts() {
  const [selected, setSelected] = useState(GOLDEN_HOUR_ALERTS[0]?.id ?? null);
  const active = GOLDEN_HOUR_ALERTS.find((a) => a.id === selected) ?? GOLDEN_HOUR_ALERTS[0];

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8" data-testid="page-alerts">
      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Time-critical operations</p>
        <h1 className="mt-1 font-serif text-3xl tracking-[-0.03em] md:text-4xl">Golden-hour freeze alerts</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          When a trace resolves to a live exchange or VASP deposit path within the critical early window after a fraud
          report, CryptoTrace raises an urgent alert so investigators can act before funds are withdrawn.
        </p>
      </header>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle size={16} />
            <span className="font-mono text-[10px] uppercase tracking-wider">Urgent (&lt; 30 min)</span>
          </div>
          <p className="mt-2 font-serif text-3xl text-red-900">
            {GOLDEN_HOUR_ALERTS.filter((a) => a.status === 'urgent').length}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <Clock size={16} />
            <span className="font-mono text-[10px] uppercase tracking-wider">Active (&lt; 60 min)</span>
          </div>
          <p className="mt-2 font-serif text-3xl text-amber-950">
            {GOLDEN_HOUR_ALERTS.filter((a) => a.status === 'active').length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Ban size={16} />
            <span className="font-mono text-[10px] uppercase tracking-wider">Window expired</span>
          </div>
          <p className="mt-2 font-serif text-3xl">
            {GOLDEN_HOUR_ALERTS.filter((a) => a.status === 'expired').length}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3">
          {GOLDEN_HOUR_ALERTS.map((alert) => {
            const isSel = alert.id === selected;
            const border =
              alert.status === 'urgent'
                ? 'border-red-300'
                : alert.status === 'active'
                  ? 'border-amber-300'
                  : 'border-border';
            return (
              <button
                key={alert.id}
                type="button"
                onClick={() => setSelected(alert.id)}
                className={`w-full rounded-xl border bg-card p-4 text-left transition-shadow ${border} ${
                  isSel ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
                }`}
                data-testid={`alert-card-${alert.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs font-medium">{shortAddr(alert.address)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      → {alert.exchange} · {alert.hopCount} hops · {alert.amountEth} ETH
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      alert.status === 'urgent'
                        ? 'bg-red-100 text-red-800'
                        : alert.status === 'active'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} /> {alert.minutesSinceReport} min since report
                  </span>
                  <span>Risk {alert.riskScore}/100</span>
                </div>
              </button>
            );
          })}
        </div>

        {active && (
          <section className="rounded-xl border border-border bg-card p-6" data-testid="alert-detail">
            <div className="flex items-center gap-2 text-primary">
              <Radio size={18} />
              <h2 className="font-serif text-xl">Investigator action card</h2>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-muted-foreground">Suspect wallet</dt>
                <dd className="font-mono text-xs">{active.address}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-muted-foreground">Nearest VASP / exchange</dt>
                <dd className="font-semibold">{active.exchange}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-muted-foreground">Observed amount</dt>
                <dd>{active.amountEth} ETH</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-muted-foreground">Layering hops</dt>
                <dd>{active.hopCount}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-muted-foreground">Golden-hour clock</dt>
                <dd className={active.minutesSinceReport < 30 ? 'font-bold text-red-700' : ''}>
                  {active.minutesSinceReport} minutes elapsed
                </dd>
              </div>
            </dl>

            <div className="mt-6 space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Recommended actions</p>
              <ul className="space-y-2 text-sm leading-6">
                <li className="flex gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                  Notify exchange compliance / freeze desk with case ID and wallet address.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                  Preserve full fund-flow graph and AI risk rationale as evidence.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                  File / update NCRP complaint and request LEA formal freeze order.
                </li>
                <li className="flex gap-2">
                  <Shield size={15} className="mt-0.5 shrink-0 text-primary" />
                  Cross-check wallet against Suspect Registry for linked cases.
                </li>
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg bg-red-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-800"
                data-testid="button-dispatch-freeze"
              >
                Dispatch freeze request (demo)
              </button>
              <button
                type="button"
                className="rounded-lg border border-border px-4 py-2.5 text-xs font-semibold hover:bg-muted"
              >
                Export alert PDF
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
