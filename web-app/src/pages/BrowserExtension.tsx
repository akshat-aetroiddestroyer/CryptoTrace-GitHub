import { useState } from 'react';
import {
  Puzzle,
  ShieldAlert,
  ShieldCheck,
  ClipboardCopy,
  Globe,
  Zap,
  Chrome,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { lookupRegistry, shortAddr } from '@/lib/mock-data';

/** Simulated page content where a crypto address appears (exchange, chat, DApp) */
const DEMO_PAGES = [
  {
    id: 'chat',
    title: 'Telegram / chat message',
    url: 'web.telegram.org',
    body: 'Send the remaining amount to this wallet so we can unlock your withdrawal: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
  },
  {
    id: 'exchange',
    title: 'Exchange deposit instructions',
    url: 'example-exchange.io/deposit',
    body: 'Deposit ETH to: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  },
  {
    id: 'dapp',
    title: 'Unknown DApp “claim” page',
    url: 'airdrop-claim-now.xyz',
    body: 'Connect wallet and approve spending for claim contract 0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
  },
];

export function BrowserExtension() {
  const [activePage, setActivePage] = useState(DEMO_PAGES[0]);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const hit = lookupRegistry(activePage.address);
  const isFlagged = !!hit && hit.status !== 'cleared';

  const simulateCopy = async () => {
    setCopied(true);
    setBannerVisible(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8" data-testid="page-browser-extension">
      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Prevention at the moment of risk
        </p>
        <h1 className="mt-1 font-serif text-3xl tracking-[-0.03em] md:text-4xl">
          Browser extension — real-time address safety check
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          “Safe Browsing”-style protection wherever crypto addresses appear. The extension detects any wallet address
          copied, pasted, or shown on a page (exchange, chat app, website) and checks it against the Suspect Registry
          instantly, showing a warning banner if it has prior fraud flags.
        </p>
      </header>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Globe, title: 'DOM + clipboard scan', desc: 'Detects 0x addresses in page text, inputs, and clipboard events.' },
          { icon: Zap, title: 'One registry API call', desc: 'Queries the same Suspect Registry used by investigators.' },
          { icon: ShieldAlert, title: 'Inline warning banner', desc: 'Blocks the “send before think” moment with a clear risk flag.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-4">
            <Icon size={18} className="text-primary" />
            <h3 className="mt-2 text-sm font-semibold">{title}</h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      {/* Interactive demo */}
      <section className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Puzzle size={15} className="text-primary" />
            <span className="text-xs font-semibold">Extension demo (in-page simulation)</span>
          </div>
          <div className="flex gap-1.5">
            {DEMO_PAGES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setActivePage(p);
                  setBannerVisible(true);
                }}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                  activePage.id === p.id ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground border border-border'
                }`}
              >
                {p.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Fake browser chrome */}
        <div className="border-b border-border bg-slate-100 px-3 py-2 dark:bg-slate-900">
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
            <Chrome size={12} />
            <span className="truncate">{activePage.url}</span>
          </div>
        </div>

        {/* Warning banner from extension */}
        {bannerVisible && (
          <div
            className={`flex flex-wrap items-start gap-3 border-b px-4 py-3 ${
              isFlagged ? 'border-red-200 bg-red-50 text-red-950' : 'border-emerald-200 bg-emerald-50 text-emerald-950'
            }`}
            data-testid="extension-banner"
          >
            {isFlagged ? <ShieldAlert size={20} className="mt-0.5 shrink-0 text-red-700" /> : <ShieldCheck size={20} className="mt-0.5 shrink-0 text-emerald-700" />}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">
                {isFlagged
                  ? `CryptoTrace: flagged wallet · risk ${hit?.riskScore}/100`
                  : 'CryptoTrace: no registry flags for this address'}
              </p>
              <p className="mt-0.5 font-mono text-[11px] opacity-80">{shortAddr(activePage.address)}</p>
              {isFlagged && hit && (
                <p className="mt-1 text-xs leading-5">
                  {hit.caseCount} linked case(s) · {hit.typologies.join(', ')}
                  {hit.exchangeHint ? ` · ${hit.exchangeHint}` : ''}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setBannerVisible(false)}
              className="text-[11px] font-semibold opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Page content */}
        <div className="p-5">
          <h2 className="font-serif text-lg">{activePage.title}</h2>
          <p className="mt-3 text-sm leading-7 text-foreground/90">
            {activePage.body.split(activePage.address).map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <mark className="rounded bg-amber-200/80 px-1 font-mono text-[12px] text-amber-950 dark:bg-amber-500/30 dark:text-amber-100">
                    {activePage.address}
                  </mark>
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
          <button
            type="button"
            onClick={simulateCopy}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
            data-testid="button-simulate-copy"
          >
            <ClipboardCopy size={14} />
            {copied ? 'Copied — extension re-checked clipboard' : 'Simulate copy address'}
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Architecture (MVP)</h2>
          <ol className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-mono text-[10px] text-primary">01</span>
              Content script scans DOM text nodes and input fields for <code className="font-mono text-xs">0x[a-fA-F0-9]{'{40}'}</code>
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-[10px] text-primary">02</span>
              Clipboard listener on <code className="font-mono text-xs">copy</code> / <code className="font-mono text-xs">paste</code>
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-[10px] text-primary">03</span>
              Single HTTPS call to CryptoTrace registry API
            </li>
            <li className="flex gap-2">
              <span className="font-mono text-[10px] text-primary">04</span>
              Inject non-blocking banner; never auto-sign or send transactions
            </li>
          </ol>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Install path (post-hackathon)</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
            <li className="flex gap-2">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
              Chrome / Edge Manifest V3 extension
            </li>
            <li className="flex gap-2">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
              Optional Firefox port
            </li>
            <li className="flex gap-2">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" />
              Same API as Pre-tx safety check & public registry
            </li>
            <li className="flex gap-2">
              <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-600" />
              Privacy: only addresses are sent; no full page content leaves the browser
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
