import { LiveFundFlowGraph } from '@/components/features/LiveFundFlowGraph';
import { useMemo, useState } from 'react';
import { ExternalLink, FileWarning, Info, LoaderCircle, MessageSquareText, Network, RefreshCw, Search, ShieldAlert, ShieldCheck, SlidersHorizontal, Trash2 } from 'lucide-react';
import { getGetCryptoTraceQueryKey, useAskCryptoTraceAssistant, useGetCryptoTrace } from '@workspace/api-client-react';
import type { CryptoTraceNode, CryptoTraceResult, CryptoTraceTransaction } from '@workspace/api-client-react';

type DashboardProps = {
  status?: { chatbotConfigured: boolean; chatbotProvider: string; source?: string };
};

const ADDRESS_PATTERN = /^0x[a-f-f0-9]{40}$/i;
const HISTORY_KEY = 'cryptotrace-local-address-history';

function shortAddress(address: string) {
  return `${address.slice(0, 7)}…${address.slice(-5)}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return 'Timestamp unavailable';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? 'Timestamp unavailable' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function formatEth(value: string | null | undefined) {
  if (value === null || value === undefined || value === '') return 'Not reported';
  return `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 6 })} ETH`;
}

function assistantErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === 'object' && data !== null && 'error' in data) {
      const message = (data as { error?: unknown }).error;
      if (typeof message === 'string' && message.trim()) return message;
    }
  }
  return 'The assistant could not answer. Try again with a narrower question.';
}

function RiskPill({ level }: { level: string }) {
  const styles = level === 'high'
    ? 'border-red-200 bg-red-50 text-red-700'
    : level === 'moderate'
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700';
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.13em] ${styles}`} data-testid="status-risk-level">{level}</span>;
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} aria-hidden="true" />;
}

function Graph({ result }: { result: CryptoTraceResult }) {
  const points = useMemo(() => {
    const nodes = result.nodes.slice(0, 24);
    const centerX = 350;
    const centerY = 124;
    const radiusX = Math.min(260, 90 + nodes.length * 12);
    const radiusY = Math.min(86, 40 + nodes.length * 5);
    return new Map(nodes.map((node, index) => {
      if (node.kind === 'subject') return [node.address, { x: centerX, y: centerY, node }];
      const angle = (index / Math.max(nodes.length - 1, 1)) * Math.PI * 2 - Math.PI / 2;
      return [node.address, { x: centerX + Math.cos(angle) * radiusX, y: centerY + Math.sin(angle) * radiusY, node }];
    }));
  }, [result.nodes]);

  if (!result.nodes.length) {
    return <div className="flex h-[260px] items-center justify-center rounded-lg border border-dashed border-border bg-background/60 text-center text-sm text-muted-foreground" data-testid="empty-graph">No graph nodes were returned for this address.</div>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#f4f0e6] p-2 dark:bg-[#1d242a]" data-testid="graph-transaction-network">
      <svg viewBox="0 0 700 250" className="h-[250px] w-full" role="img" aria-label="Transaction network graph">
        <defs>
          <marker id="trace-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7" fill="none" stroke="hsl(221 29% 35%)" strokeWidth="1" />
          </marker>
        </defs>
        {result.edges.slice(0, 40).map((edge) => {
          const from = points.get(edge.from);
          const to = points.get(edge.to);
          if (!from || !to) return null;
          return <line key={edge.hash} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="hsl(18 69% 48% / .48)" strokeWidth="1.5" markerEnd="url(#trace-arrow)" />;
        })}
        {[...points.values()].map(({ x, y, node }) => {
          const subject = node.kind === 'subject';
          const flagged = node.sourceFlaggedScam;
          return (
            <g key={node.address}>
              <circle cx={x} cy={y} r={subject ? 18 : 13} fill={subject ? 'hsl(221 29% 18%)' : flagged ? 'hsl(2 63% 45%)' : 'hsl(38 33% 97%)'} stroke={subject ? 'hsl(18 69% 57%)' : flagged ? 'hsl(2 63% 45%)' : 'hsl(221 29% 45% / .5)'} strokeWidth="2" />
              <text x={x} y={y + 3.5} textAnchor="middle" fill={subject || flagged ? 'hsl(38 33% 97%)' : 'hsl(221 29% 18%)'} fontSize="9" fontFamily="DM Mono">{subject ? 'S' : node.kind.slice(0, 1).toUpperCase()}</text>
              <text x={x} y={y + 29} textAnchor="middle" fill="hsl(221 29% 30%)" fontSize="9" fontFamily="DM Mono">{node.label || shortAddress(node.address)}</text>
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/70 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.11em] text-muted-foreground">
        <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-primary" />Subject</span>
        <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full border border-foreground/50 bg-card" />Observed node</span>
        <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-red-600" />Provider flagged</span>
      </div>
    </div>
  );
}

function SourceFacts({ result }: { result: CryptoTraceResult }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-[0_10px_35px_hsl(221_29%_18%_/_0.04)]" data-testid="section-source-facts">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Sourced record</p>
          <h2 className="mt-1 font-serif text-2xl tracking-[-0.03em]">Account facts</h2>
        </div>
        <a href={result.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline" data-testid="link-account-source">
          Open source <ExternalLink size={13} />
        </a>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
        <div><dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Network</dt><dd className="mt-1 text-sm font-semibold">{result.network}</dd></div>
        <div><dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Balance</dt><dd className="mt-1 text-sm font-semibold">{formatEth(result.balanceEth)}</dd></div>
        <div><dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Account type</dt><dd className="mt-1 text-sm font-semibold">{result.isContract ? 'Contract' : 'Externally owned'}</dd></div>
        <div><dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Fetched</dt><dd className="mt-1 text-sm font-semibold">{formatDate(result.fetchedAt)}</dd></div>
      </dl>
      <div className="mt-6 flex flex-wrap gap-2">
        {result.accountLabel && <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold">{result.accountLabel}</span>}
        {result.sourceFlaggedScam && <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700"><ShieldAlert size={13} />Provider flagged scam</span>}
        {!result.sourceFlaggedScam && <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><ShieldCheck size={13} />No provider flag returned</span>}
      </div>
      <p className="mt-5 border-t border-border pt-4 font-mono text-[10px] leading-relaxed text-muted-foreground">Source: {result.source} · This record reflects observed provider data at fetch time.</p>
    </section>
  );
}

function TransactionRow({ transaction }: { transaction: CryptoTraceTransaction }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-border/75 px-4 py-4 last:border-0 sm:grid-cols-[1.3fr_.8fr_.8fr_1fr_auto] sm:items-center" data-testid={`row-transaction-${transaction.hash}`}>
      <div className="min-w-0">
        <a href={transaction.explorerUrl} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1.5 font-mono text-xs font-medium text-primary hover:underline" data-testid={`link-transaction-${transaction.hash}`}>
          <span className="truncate">{shortAddress(transaction.hash)}</span><ExternalLink size={11} className="shrink-0" />
        </a>
        <p className="mt-1 text-[11px] text-muted-foreground">{formatDate(transaction.timestamp)}</p>
      </div>
      <span className={`justify-self-end rounded-full px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] sm:justify-self-start ${transaction.direction === 'incoming' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{transaction.direction}</span>
      <span className="hidden font-mono text-xs text-foreground/75 sm:block">{formatEth(transaction.valueEth)}</span>
      <span className="hidden font-mono text-[10px] text-muted-foreground sm:block">Block {transaction.blockNumber.toLocaleString()}</span>
      <span className="col-span-2 text-right text-[11px] text-muted-foreground sm:col-span-1 sm:text-left">{transaction.status}</span>
    </div>
  );
}

function DetailPanel({ result, onRetry }: { result?: CryptoTraceResult; onRetry: () => void }) {
  if (!result) {
    return (
      <div className="paper-grid rounded-xl border border-dashed border-border bg-card/65 px-6 py-16 text-center" data-testid="empty-investigation">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background text-primary"><FileWarning size={24} /></div>
        <h2 className="mt-5 font-serif text-2xl tracking-[-0.03em]">No address under review</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Enter a checksummed Ethereum address above. CryptoTrace will show only the evidence returned by the connected data provider.</p>
      </div>
    );
  }
  return (
    <div className="animate-rise space-y-5" data-testid="investigation-result">
      <SourceFacts result={result} />
      <div className="grid gap-5">
        <section className="rounded-xl border border-border bg-card p-5" data-testid="section-risk-assessment">
          <div className="flex items-start justify-between gap-4">
            <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Analytical layer</p><h2 className="mt-1 font-serif text-2xl tracking-[-0.03em]">Risk assessment</h2></div>
            <RiskPill level={result.riskLevel} />
          </div>
          <div className="mt-7 flex items-end gap-5">
            <div className="font-mono text-6xl leading-none tracking-[-0.08em] text-foreground">{result.riskScore}<span className="ml-1 text-2xl text-muted-foreground">/100</span></div>
            <div className="mb-1 flex-1"><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${result.riskLevel === 'high' ? 'bg-red-600' : result.riskLevel === 'moderate' ? 'bg-amber-500' : 'bg-emerald-600'}`} style={{ width: `${Math.min(100, Math.max(0, result.riskScore))}%` }} /></div><p className="mt-2 text-xs text-muted-foreground">Score is an inference from returned signals, not a finding of wrongdoing.</p></div>
          </div>
          <div className="mt-7 space-y-2">
            {result.riskSignals.length ? result.riskSignals.map((signal, index) => <div key={`${signal}-${index}`} className="flex gap-3 rounded-lg bg-background px-3 py-2.5 text-sm leading-5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{signal}</div>) : <p className="text-sm text-muted-foreground">No risk signals were returned.</p>}
          </div>
          <p className="mt-5 flex gap-2 border-t border-border pt-4 text-[11px] leading-5 text-muted-foreground"><Info size={14} className="mt-0.5 shrink-0 text-primary" />A label, exchange identity, or scam attribution is not inferred when the provider has not returned one.</p>
        </section>
        <section className="rounded-xl border border-border bg-card p-5" data-testid="section-network-graph">
          <div className="mb-4 flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Observed connections</p><h2 className="mt-1 font-serif text-2xl tracking-[-0.03em]">Live animated fund-flow graph</h2></div><Network size={19} className="text-primary" /></div>
          <LiveFundFlowGraph result={result} autoPlay />
          <p className="mt-3 text-[11px] leading-5 text-muted-foreground">Edges are sourced transfers. Node labels appear only when returned by the provider.</p>
        </section>
      </div>
      <section className="rounded-xl border border-border bg-card" data-testid="section-transactions">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border p-5"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Evidence ledger</p><h2 className="mt-1 font-serif text-2xl tracking-[-0.03em]">Transactions</h2></div><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{result.transactions.length} shown · {result.transactionsAnalyzed} analyzed</span></div>
        <div className="hidden grid-cols-[1.3fr_.8fr_.8fr_1fr_auto] gap-3 border-b border-border bg-background/60 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground sm:grid"><span>Hash / timestamp</span><span>Direction</span><span>Value</span><span>Block</span><span>Status</span></div>
        {result.transactions.length ? result.transactions.map((transaction) => <TransactionRow key={transaction.hash} transaction={transaction} />) : <p className="px-5 py-10 text-center text-sm text-muted-foreground">No transactions were returned for this address.</p>}
      </section>
      <section className="rounded-xl border border-amber-200 bg-amber-50/70 p-5" data-testid="section-limitations">
        <div className="flex gap-3"><SlidersHorizontal size={17} className="mt-0.5 shrink-0 text-amber-700" /><div><h2 className="font-semibold text-amber-900">Read before relying on this record</h2><ul className="mt-2 space-y-1.5 text-sm leading-5 text-amber-900/75">{result.limitations.length ? result.limitations.map((limitation, index) => <li key={`${limitation}-${index}`}>• {limitation}</li>) : <li>Provider returned no additional limitations.</li>}</ul></div></div>
      </section>
      <button onClick={onRetry} className="mx-auto flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground" data-testid="button-refresh-trace"><RefreshCw size={13} /> Refresh this trace</button>
    </div>
  );
}

function Assistant({ address, configured, provider }: { address: string; configured: boolean; provider: string }) {
  const [question, setQuestion] = useState('');
  const assistant = useAskCryptoTraceAssistant();
  const submit = () => {
    if (!question.trim() || !configured || assistant.isPending) return;
    assistant.mutate({ data: { address, question: question.trim() } });
  };
  return (
    <section className="rounded-xl border border-border bg-card p-5" data-testid="section-assistant">
       <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary"><MessageSquareText size={18} /></div><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Contextual assistant</p><h2 className="mt-1 font-serif text-2xl tracking-[-0.03em]">Ask about this address</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Grok answers from a fresh trace context; demo mode stays grounded in the same live evidence.</p></div></div>
      {!configured && <div className="mt-5 rounded-lg border border-dashed border-border bg-background p-3 text-xs text-muted-foreground">Assistant unavailable: the configured provider has not been reported as ready.</div>}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row"><textarea value={question} onChange={(event) => setQuestion(event.target.value)} disabled={!configured || assistant.isPending} maxLength={1200} rows={2} placeholder="What should I look at first in this transaction history?" className="min-h-[72px] flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60" data-testid="input-assistant-question" /><button onClick={submit} disabled={!configured || !question.trim() || assistant.isPending} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45 sm:self-end" data-testid="button-ask-assistant">{assistant.isPending ? <LoaderCircle size={14} className="animate-spin" /> : <MessageSquareText size={14} />} Ask assistant</button></div>
       {assistant.isError && <p className="mt-3 text-xs text-destructive" data-testid="error-assistant">{assistantErrorMessage(assistant.error)}</p>}
      {assistant.data && <div className="mt-5 rounded-lg border border-border bg-background p-4" data-testid="assistant-answer"><p className="whitespace-pre-wrap text-sm leading-6">{assistant.data.answer}</p><div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground"><span>Model: {assistant.data.model}</span><span>{assistant.data.transactionsAnalyzed} transactions in context</span><a href={assistant.data.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline" data-testid="link-assistant-source">Source <ExternalLink size={11} /></a></div></div>}
      <p className="mt-4 text-[10px] text-muted-foreground">Provider: {provider || 'Not reported'} · Do not treat generated text as evidence.</p>
    </section>
  );
}

export function Dashboard({ status }: DashboardProps) {
  const [addressInput, setAddressInput] = useState('');
  const [submittedAddress, setSubmittedAddress] = useState('');
  const [limit, setLimit] = useState(10);
  const [history, setHistory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as string[]; } catch { return []; }
  });
  const params = useMemo(() => ({ address: submittedAddress, limit }), [submittedAddress, limit]);
  const trace = useGetCryptoTrace(params, { query: { enabled: Boolean(submittedAddress), queryKey: getGetCryptoTraceQueryKey(params) } });
  const result = trace.data;
  const valid = ADDRESS_PATTERN.test(addressInput.trim());

  const runTrace = () => {
    const value = addressInput.trim();
    if (!ADDRESS_PATTERN.test(value)) return;
    setSubmittedAddress(value);
    setHistory((current) => {
      const next = [value, ...current.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 8);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };
  const selectHistory = (address: string) => { setAddressInput(address); setSubmittedAddress(address); };
  const clearHistory = () => { localStorage.removeItem(HISTORY_KEY); setHistory([]); };

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:px-12 lg:py-11">
      <div className="animate-rise flex flex-col justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-end">
        <div><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Investigation workspace</div><h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.4rem,5vw,4.8rem)] leading-[.94] tracking-[-0.055em]">Follow the money.<br /><em className="text-primary">Name the evidence.</em></h1><p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">Trace recent Ethereum activity against live provider data. Every sourced fact and analytical inference stays visibly separate.</p></div>
        <div className="max-w-[220px] border-l-2 border-primary pl-4 text-xs leading-5 text-muted-foreground">Built for the first hour after a victim reports a wallet address.</div>
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card p-4 shadow-[0_16px_40px_hsl(221_29%_18%_/_0.05)] sm:p-5" data-testid="section-trace-search">
         <div className="flex flex-col gap-3 lg:flex-row lg:items-end"><label className="flex-1"><span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Ethereum address</span><div className="relative"><Search size={17} className="pointer-events-none absolute left-3 top-3.5 text-muted-foreground" /><input value={addressInput} onChange={(event) => setAddressInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') runTrace(); }} placeholder="0x…" spellCheck={false} className="h-12 w-full rounded-lg border border-input bg-background pl-10 pr-3 font-mono text-sm outline-none transition-colors placeholder:text-muted-foreground/45 focus:border-primary focus:ring-2 focus:ring-primary/15" data-testid="input-wallet-address" /></div></label><label className="w-full lg:w-[150px]"><span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Transactions</span><select value={limit} onChange={(event) => setLimit(Number(event.target.value))} className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary"><option value={10}>10 recent</option><option value={25}>25 recent</option></select></label><button onClick={runTrace} disabled={!valid || trace.isFetching} className="h-12 rounded-lg bg-primary px-6 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40" data-testid="button-run-trace">{trace.isFetching ? 'Tracing…' : 'Trace address'}</button></div>
        {addressInput && !valid && <p className="mt-2 font-mono text-[10px] text-destructive" data-testid="error-address-format">Enter a valid 42-character Ethereum address beginning with 0x.</p>}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3"><p className="text-[11px] text-muted-foreground">Only public-chain activity is queried. No wallet connection required.</p>{history.length > 0 && <div className="flex items-center gap-2"><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Local history</span><button onClick={clearHistory} className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-destructive" data-testid="button-clear-history"><Trash2 size={11} />Clear</button></div>}</div>
        {history.length > 0 && <div className="mt-3 flex flex-wrap gap-2" data-testid="list-local-history">{history.map((item) => <button key={item} onClick={() => selectHistory(item)} className="rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-[10px] text-muted-foreground transition-colors hover:border-primary hover:text-primary" data-testid={`button-history-${item}`}>{shortAddress(item)}</button>)}</div>}
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">Address history is stored locally in this browser only.</p>
      </section>

      <div className="mt-8">
        {trace.isLoading && <div className="space-y-5" data-testid="state-trace-loading"><div className="grid gap-5 md:grid-cols-2"><Skeleton className="h-52" /><Skeleton className="h-52" /></div><Skeleton className="h-72" /></div>}
        {trace.isError && <div className="rounded-xl border border-red-200 bg-red-50 p-7 text-center" data-testid="state-trace-error"><ShieldAlert size={24} className="mx-auto text-red-600" /><h2 className="mt-3 font-serif text-2xl text-red-900">Trace unavailable</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-800/75">The data provider did not return a usable trace. Check the address and try again; no conclusion can be drawn from a failed request.</p><button onClick={() => trace.refetch()} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 text-xs font-bold text-white hover:opacity-90" data-testid="button-retry-trace"><RefreshCw size={14} />Retry request</button></div>}
        {!trace.isLoading && !trace.isError && <DetailPanel result={result} onRetry={() => trace.refetch()} />}
      </div>
      {result && <div className="mt-5"><Assistant address={result.address} configured={status?.chatbotConfigured ?? false} provider={status?.chatbotProvider ?? 'Not reported'} /></div>}
    </div>
  );
}