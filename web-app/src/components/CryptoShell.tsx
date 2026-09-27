import { Link, useLocation } from 'wouter';
import {
  BookOpen,
  ChevronRight,
  CircleHelp,
  FileSearch,
  Fingerprint,
  ShieldCheck,
  Radio,
  Mic,
  Database,
  Link2,
  Puzzle,
  Info,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { CryptoTraceStatus } from '@workspace/api-client-react';

type CryptoShellProps = {
  children: ReactNode;
  status?: CryptoTraceStatus;
  health?: { status: string };
  statusLoading?: boolean;
};

function formatCheckedAt(value?: string) {
  if (!value) return 'Awaiting source check';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

const NAV = [
  { href: '/about', label: 'Problem & cybercrime context', icon: Info, testId: 'link-nav-about' },
  { href: '/', label: 'Trace & live graph', icon: FileSearch, testId: 'link-nav-trace' },
  { href: '/alerts', label: 'Golden-hour alerts', icon: Radio, testId: 'link-nav-alerts' },
  { href: '/registry', label: 'Suspect & case-law registry', icon: Database, testId: 'link-nav-registry' },
  { href: '/safety-check', label: 'Pre-tx safety check', icon: ShieldCheck, testId: 'link-nav-safety-check' },
  { href: '/extension', label: 'Browser extension', icon: Puzzle, testId: 'link-nav-extension' },
  { href: '/voice', label: 'Voice complaint intake', icon: Mic, testId: 'link-nav-voice' },
  { href: '/evidence', label: 'Evidence vault', icon: Link2, testId: 'link-nav-evidence' },
  { href: '/safety', label: 'Safety library', icon: BookOpen, testId: 'link-nav-safety' },
];

export function CryptoShell({ children, status, health, statusLoading }: CryptoShellProps) {
  const [location] = useLocation();
  const sourceOnline = health?.status === 'ok' || health?.status === 'healthy' || !!status?.blockchainProvider;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[270px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3 border-b border-sidebar-border px-6 py-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Fingerprint size={20} />
          </span>
          <div>
            <p className="font-serif text-xl tracking-[-0.03em]">CryptoTrace</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-sidebar-foreground/45">
              Fraud attribution
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-2 px-2 font-mono text-[9px] uppercase tracking-[0.16em] text-sidebar-foreground/40">
            Platform
          </p>
          <nav className="space-y-0.5">
            {NAV.map(({ href, label, icon: Icon, testId }) => {
              const active = location === href || (href !== '/' && location.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors ${
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                  }`}
                  data-testid={testId}
                >
                  <Icon size={15} className={active ? 'text-sidebar-primary' : ''} />
                  <span className="font-medium leading-snug">{label}</span>
                  {active && <ChevronRight size={13} className="ml-auto opacity-40" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 rounded-xl border border-sidebar-border bg-sidebar-accent/55 p-4">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  statusLoading ? 'bg-sidebar-foreground/35' : sourceOnline ? 'bg-emerald-400' : 'bg-amber-300'
                }`}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-sidebar-foreground/55">
                Source status
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold">{status?.blockchainProvider || 'Provider not reported'}</p>
            <p className="mt-1 text-xs text-sidebar-foreground/55">{status?.network || 'Network not reported'}</p>
            <p className="mt-4 border-t border-sidebar-border pt-3 font-mono text-[9px] leading-relaxed text-sidebar-foreground/40">
              {formatCheckedAt(status?.checkedAt)}
            </p>
          </div>
        </div>

        <div className="border-t border-sidebar-border px-6 py-4">
          <Link
            href="/safety"
            className="flex items-center gap-2 text-xs font-semibold text-sidebar-foreground/55 transition-colors hover:text-sidebar-foreground"
            data-testid="link-help"
          >
            <CircleHelp size={14} />
            Need help with a scam?
          </Link>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.13em] text-sidebar-foreground/30">
            SIH 2026 · Facts first
          </p>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="flex h-[60px] items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5" data-testid="link-mobile-brand">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Fingerprint size={16} />
            </span>
            <span className="font-serif text-xl tracking-[-0.03em]">CryptoTrace</span>
          </Link>
          <Link href="/about" className="text-xs font-semibold text-muted-foreground" data-testid="link-mobile-about">
            About
          </Link>
        </div>
        <div className="flex gap-1 overflow-x-auto px-3 pb-2">
          {NAV.map(({ href, label, testId }) => {
            const active = location === href || (href !== '/' && location.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium ${
                  active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
                data-testid={`mobile-${testId}`}
              >
                {label.split(' ')[0]}
              </Link>
            );
          })}
        </div>
      </header>

      <main className="min-h-[calc(100dvh-100px)] lg:ml-[270px] lg:min-h-[100dvh]">{children}</main>
    </div>
  );
}
