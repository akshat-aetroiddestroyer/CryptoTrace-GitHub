import { Link } from 'wouter';
import { ArrowUpRight, BookOpen, CheckCircle2, FileText, LockKeyhole, PhoneCall, ShieldAlert } from 'lucide-react';

const typologies = [
  { title: 'Investment and task fraud', marker: '01', description: 'Promises of guaranteed returns, fake trading dashboards, or paid “tasks” that require a deposit before a withdrawal.', steps: ['Stop sending funds, even if a dashboard shows a balance.', 'Save the full conversation, domains, wallet addresses, and payment instructions.', 'Report the receiving address and preserve the transaction hash.'] },
  { title: 'Sextortion', marker: '02', description: 'Threats to publish intimate material unless cryptocurrency is sent. Paying does not reliably stop the threats.', steps: ['Do not negotiate or send additional funds.', 'Capture threats and account identifiers without forwarding intimate material.', 'Contact local law enforcement or a specialist support service.'] },
  { title: 'Ransomware', marker: '03', description: 'Malware or an intrusion blocks access to systems or data and demands cryptocurrency for restoration.', steps: ['Isolate affected devices from networks if safe to do so.', 'Preserve ransom notes, logs, wallet addresses, and timestamps.', 'Use a known-good device to contact your incident response or national cyber authority.'] },
  { title: 'Phishing', marker: '04', description: 'A message or imitation website tricks someone into revealing credentials, signing a transaction, or sending assets.', steps: ['Revoke approvals and move remaining assets to a secure wallet if a signing key may be exposed.', 'Change credentials from a clean device and enable multi-factor authentication.', 'Keep the original message, sender details, URL, and signed transaction.'] },
  { title: 'Darknet-enabled fraud', marker: '05', description: 'Fraud, stolen data, or illicit goods are marketed through hidden services and settled through cryptocurrency.', steps: ['Do not attempt to contact or investigate operators yourself.', 'Preserve marketplace handles, URLs, order details, and blockchain evidence.', 'Report through the relevant law-enforcement channel.'] },
  { title: 'Organized cyber-enabled financial crime', marker: '06', description: 'Coordinated groups use multiple identities, wallets, mule accounts, or services to move and conceal proceeds.', steps: ['Record the sequence of contacts and every payment rail involved.', 'Separate what you directly observed from what you were told.', 'Share a concise timeline and original evidence with investigators.'] },
];

export function Safety() {
  return (
    <div className="mx-auto max-w-[1220px] px-5 py-8 sm:px-8 lg:px-12 lg:py-14">
      <div className="animate-rise border-b border-border pb-10">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary"><BookOpen size={13} />Safety library · SIH typology set</div>
        <div className="mt-5 grid gap-7 lg:grid-cols-[1.2fr_.8fr] lg:items-end"><h1 className="max-w-3xl font-serif text-[clamp(2.8rem,6vw,5.9rem)] leading-[.9] tracking-[-0.06em]">When the wallet<br /><em className="text-primary">is not the whole story.</em></h1><p className="max-w-sm text-sm leading-6 text-muted-foreground">A practical field guide for victims, supporters, and investigators. Preserve first. Attribute carefully. Escalate safely.</p></div>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3" data-testid="section-immediate-actions">
        <div className="rounded-xl border border-border bg-card p-5"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary"><LockKeyhole size={17} /></div><h2 className="mt-5 font-serif text-xl">Secure</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Stop contact and do not send another payment. If a key or approval may be exposed, move remaining assets using a clean device.</p></div>
        <div className="rounded-xl border border-border bg-card p-5"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary"><FileText size={17} /></div><h2 className="mt-5 font-serif text-xl">Preserve</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Keep original messages, URLs, usernames, wallet addresses, hashes, receipts, timestamps, and screenshots with context.</p></div>
        <div className="rounded-xl border border-border bg-card p-5"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary"><PhoneCall size={17} /></div><h2 className="mt-5 font-serif text-xl">Escalate</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Contact your local law-enforcement or cybercrime reporting channel. Use a known official website or phone number.</p></div>
      </section>

      <div className="mt-14 flex items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Reference index</p><h2 className="mt-2 font-serif text-3xl tracking-[-0.04em]">Fraud typologies</h2></div><span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:block">Six patterns · practical response</span></div>
      <section className="mt-5 divide-y divide-border rounded-xl border border-border bg-card" data-testid="list-fraud-typologies">
        {typologies.map((item) => <article key={item.marker} className="grid gap-5 p-5 sm:grid-cols-[70px_1fr_1fr] sm:gap-7 sm:p-7" data-testid={`card-typology-${item.marker}`}><div className="font-mono text-xs text-primary">{item.marker}</div><div><h3 className="font-serif text-2xl tracking-[-0.03em]">{item.title}</h3><p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{item.description}</p></div><div><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Practical next moves</p><ul className="mt-3 space-y-2.5">{item.steps.map((step) => <li key={step} className="flex gap-2.5 text-sm leading-5"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-accent" />{step}</li>)}</ul></div></article>)}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr]" data-testid="section-evidence-guidance">
        <div className="rounded-xl border border-border bg-[#e9eee8] p-6 dark:bg-accent/10"><div className="flex gap-3"><ShieldAlert size={20} className="mt-0.5 shrink-0 text-accent" /><div><h2 className="font-serif text-2xl tracking-[-0.03em]">Evidence is not identity</h2><p className="mt-3 text-sm leading-6 text-foreground/75">A wallet address is an observed identifier, not proof of who controls it. Labels and scam flags should be cited to their source. CryptoTrace does not infer an exchange, person, or group when the provider has not returned that label.</p></div></div></div>
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-6"><h2 className="font-serif text-2xl tracking-[-0.03em]">Ready to inspect a wallet?</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Start with the address exactly as reported. Keep the original report beside the on-chain record so you can separate claim, source, and inference.</p><Link href="/" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline" data-testid="link-start-investigation">Open investigation desk <ArrowUpRight size={15} /></Link></div>
      </section>

      <p className="mt-10 border-t border-border pt-4 font-mono text-[10px] leading-5 text-muted-foreground">Educational guidance only. It does not replace legal advice, emergency support, or instructions from your local authorities. Typology labels are presented as an investigation aid, not a determination about any individual case.</p>
    </div>
  );
}