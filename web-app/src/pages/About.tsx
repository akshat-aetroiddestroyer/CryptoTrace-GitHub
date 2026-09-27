import { Link } from 'wouter';
import {
  AlertTriangle,
  ArrowRight,
  Eye,
  Layers,
  Network,
  Shield,
  Timer,
  Wallet,
  FileWarning,
  Landmark,
} from 'lucide-react';

const FRAUD_TYPES = [
  {
    title: 'Investment scams',
    detail:
      'Fake trading platforms, guaranteed-return schemes, and “VIP desks” that collect deposits into fraudster-controlled wallets.',
  },
  {
    title: 'Task-based frauds',
    detail:
      'Apps or chat handlers that pay small “tasks” then demand larger deposits to unlock withdrawals.',
  },
  {
    title: 'Sextortion',
    detail:
      'Threats to publish intimate material unless cryptocurrency is paid — often to temporary burner wallets.',
  },
  {
    title: 'Ransomware',
    detail:
      'Malware or intrusion that locks systems/data and demands crypto for restoration keys.',
  },
  {
    title: 'Phishing',
    detail:
      'Imitation sites or messages that trick victims into signing transactions or revealing seed phrases.',
  },
  {
    title: 'Darknet transactions',
    detail:
      'Illicit marketplaces and services settled in crypto, often via mixers, bridges, or privacy rails.',
  },
  {
    title: 'Organized cyber-enabled financial crime',
    detail:
      'Coordinated networks using mule accounts, layering hops, and multi-chain paths to launder proceeds.',
  },
];

const INVESTIGATION_GAPS = [
  {
    icon: Wallet,
    title: 'Non-custodial & burner wallets',
    text: 'Reported addresses are often temporary, self-custodied, or used only for a single collection hop.',
  },
  {
    icon: Layers,
    title: 'Intermediary layering',
    text: 'Funds move through peel-chains, split wallets, and intermediate addresses before reaching an exchange.',
  },
  {
    icon: Network,
    title: 'Multi-chain & DeFi complexity',
    text: 'Manual tracing struggles with bridges, mixers/tumblers, DeFi protocols, and privacy-enhancing mechanisms.',
  },
  {
    icon: Timer,
    title: 'Golden-hour window',
    text: 'Once funds leave a VASP or are withdrawn, recovery becomes near-zero. Speed of attribution is critical.',
  },
];

const SYSTEM_CAPABILITIES = [
  'Ingest wallet addresses reported through cybercrime complaint systems',
  'Automatically perform blockchain tracing',
  'Identify associated exchanges or VASPs',
  'Detect fund-movement and layering patterns',
  'Generate actionable intelligence for investigators',
  'Support real-time fund-flow visualization and risk categorization',
];

export function About() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8" data-testid="page-about">
      <header className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Problem context · SIH 2026
        </p>
        <h1 className="mt-1 font-serif text-3xl tracking-[-0.03em] md:text-4xl">
          Cyber fraud, crypto wallets & the attribution gap
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
          Cyber fraud victims increasingly report suspect cryptocurrency wallet addresses used by fraudsters for
          collection of funds. During investigations those addresses are often non-custodial, temporary burner wallets,
          or intermediary wallets used for layering and laundering. The inability to quickly identify the cryptocurrency
          exchange or VASP associated with these wallets delays freezing of assets, preservation of evidence, tracing of
          fund flows, and victim fund recovery.
        </p>
      </header>

      {/* Fraud typologies */}
      <section className="mb-12">
        <div className="mb-4 flex items-center gap-2">
          <FileWarning size={18} className="text-primary" />
          <h2 className="font-serif text-2xl tracking-[-0.02em]">Reported fraud typologies</h2>
        </div>
        <p className="mb-5 max-w-2xl text-sm text-muted-foreground">
          CryptoTrace is designed around the categories most frequently seen in Indian cybercrime complaints involving
          cryptocurrency settlement rails.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {FRAUD_TYPES.map((f, i) => (
            <article key={f.title} className="rounded-xl border border-border bg-card p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-1 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{f.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Why tracing fails */}
      <section className="mb-12">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-600" />
          <h2 className="font-serif text-2xl tracking-[-0.02em]">Why manual tracing is too slow</h2>
        </div>
        <p className="mb-5 max-w-2xl text-sm leading-6 text-muted-foreground">
          Manual blockchain analysis requires significant technical expertise and time — especially when funds move
          across chains, through DeFi, mixers, bridges, or privacy tools. Every hour after the first deposit reduces the
          chance of a successful freeze at an exchange.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {INVESTIGATION_GAPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3 rounded-xl border border-border bg-card p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon size={16} className="text-primary" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Proposed solution */}
      <section className="mb-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
        <div className="flex items-center gap-2 text-primary">
          <Shield size={20} />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em]">Proposed solution</p>
        </div>
        <h2 className="mt-2 font-serif text-2xl tracking-[-0.02em] md:text-3xl">
          Real-Time Crypto Fraud Attribution System
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          CryptoTrace automatically analyzes victim-reported wallet addresses, identifies the nearest exchange or VASP
          receiving direct deposits, detects fund-movement patterns, and generates actionable intelligence for law
          enforcement — within the golden hour when freezes are still possible.
        </p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {SYSTEM_CAPABILITIES.map((c) => (
            <li key={c} className="flex gap-2 text-sm leading-6">
              <Eye size={14} className="mt-1.5 shrink-0 text-primary" />
              {c}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground"
          >
            Open live trace <ArrowRight size={14} />
          </Link>
          <Link
            href="/alerts"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-xs font-semibold"
          >
            Golden-hour alerts
          </Link>
          <Link
            href="/safety-check"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-xs font-semibold"
          >
            Pre-tx safety check
          </Link>
        </div>
      </section>

      {/* Expected outcomes */}
      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Landmark size={18} className="text-primary" />
          <h2 className="font-serif text-2xl tracking-[-0.02em]">Expected outcomes for LEAs</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            'Reduce response time in cyber fraud investigations',
            'Improve freezing of proceeds of crime at VASPs',
            'Enhance coordination with exchanges and compliance desks',
            'Strengthen digital evidence collection and courtroom readiness',
            'Standardized investigation reports and risk categorization',
            'Path to NCRP / SAHYOG / CCTNS integration (roadmap)',
          ].map((item) => (
            <div key={item} className="rounded-lg border border-border bg-card px-4 py-3 text-sm leading-6">
              {item}
            </div>
          ))}
        </div>
      </section>

      <aside className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm leading-6 text-amber-950">
        CryptoTrace is an investigation-support platform. Risk scores and registry flags are analytical signals, not
        findings of guilt. Always corroborate with primary chain data and official complaint systems before enforcement
        action.
      </aside>
    </div>
  );
}
