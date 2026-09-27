import { useState } from 'react';
import { Mic, Languages, FileText, LoaderCircle, CheckCircle2, Wand2 } from 'lucide-react';
import { SAMPLE_COMPLAINTS } from '@/lib/mock-data';

const DEMO_TRANSCRIPTS: Record<string, string> = {
  Hindi:
    'मेरे से निवेश स्कैम में करीब दो लाख रुपये की धोखाधोरी हुई है। उन्होंने एक वॉलेट एड्रेस दिया था जिसमें मैंने 15 सितंबर को ट्रांसफर किया। एड्रेस है 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1।',
  English:
    'I was scammed through a task-based app. After tasks they asked for a deposit. I sent 0.4 ETH on 19 September to 0x8ba1f109551bD432803012645Ac136ddd64DBA72.',
  Tamil:
    'முதலீட்டு மோசடியில் என்னிடம் இருந்து பணம் ஏமாற்றப்பட்டது. அவர்கள் கொடுத்த வாலட் முகவரிக்கு நான் பணம் அனுப்பினேன்.',
  Bengali:
    'আমাকে একটি ফেক ইনভেস্টমেন্ট অ্যাপে ফাঁসিয়ে প্রায় এক লক্ষ টাকা আত্মসাৎ করা হয়েছে। ওয়ালেট অ্যাড্রেস দিয়েছিলেন।',
};

export function VoiceIntake() {
  const [language, setLanguage] = useState('Hindi');
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [structured, setStructured] = useState<(typeof SAMPLE_COMPLAINTS)[0]['structured'] | null>(null);
  const [processing, setProcessing] = useState(false);

  const simulateListen = () => {
    setListening(true);
    setTranscript('');
    setStructured(null);
    setTimeout(() => {
      setTranscript(DEMO_TRANSCRIPTS[language] ?? DEMO_TRANSCRIPTS.English);
      setListening(false);
    }, 1800);
  };

  const structureComplaint = () => {
    if (!transcript.trim()) return;
    setProcessing(true);
    setTimeout(() => {
      const base =
        language === 'English'
          ? SAMPLE_COMPLAINTS[1].structured
          : SAMPLE_COMPLAINTS[0].structured;
      setStructured({
        ...base,
        typology: language === 'English' ? 'Task-based fraud' : 'Investment scam',
      });
      setProcessing(false);
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8" data-testid="page-voice-intake">
      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Accessibility first</p>
        <h1 className="mt-1 font-serif text-3xl tracking-[-0.03em] md:text-4xl">Multilingual voice complaint intake</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Victims can speak in Hindi or a regional language instead of filling a technical English-only form. Speech is
          transcribed and converted into a structured complaint that feeds the wallet-tracing pipeline.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Languages size={18} className="text-primary" />
            <h2 className="font-semibold">Language & capture</h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.keys(DEMO_TRANSCRIPTS).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  language === lang ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={simulateListen}
            disabled={listening}
            className="mt-6 flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 py-10 transition-colors hover:border-primary hover:bg-primary/5 disabled:opacity-70"
            data-testid="button-start-voice"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full ${
                listening ? 'animate-pulse bg-red-600 text-white' : 'bg-primary text-primary-foreground'
              }`}
            >
              <Mic size={28} />
            </span>
            <span className="text-sm font-semibold">{listening ? 'Listening… (demo)' : 'Tap to speak (demo)'}</span>
            <span className="text-[11px] text-muted-foreground">Demo uses sample transcripts — no mic required</span>
          </button>

          <div className="mt-5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Transcript</label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={5}
              className="mt-1.5 w-full rounded-lg border border-border bg-background p-3 text-sm outline-none ring-primary focus:ring-2"
              placeholder="Spoken complaint will appear here…"
              data-testid="textarea-transcript"
            />
          </div>

          <button
            type="button"
            onClick={structureComplaint}
            disabled={!transcript.trim() || processing}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground disabled:opacity-50"
            data-testid="button-structure-complaint"
          >
            {processing ? <LoaderCircle size={14} className="animate-spin" /> : <Wand2 size={14} />}
            Structure with AI
          </button>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            <h2 className="font-semibold">Structured complaint record</h2>
          </div>

          {!structured && !processing && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Capture or paste a transcript, then structure it to generate a machine-readable complaint.
            </p>
          )}

          {processing && (
            <div className="mt-10 flex flex-col items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle size={22} className="animate-spin text-primary" />
              Extracting entities & typology…
            </div>
          )}

          {structured && (
            <div className="mt-5 space-y-3" data-testid="structured-complaint">
              {(
                [
                  ['Victim', structured.victimName],
                  ['Amount lost', structured.amountLost],
                  ['Wallet address', structured.walletAddress],
                  ['Typology', structured.typology],
                  ['Incident date', structured.incidentDate],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="rounded-lg bg-muted/50 px-3 py-2.5">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="mt-0.5 font-mono text-sm font-medium break-all">{value}</p>
                </div>
              ))}
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                <CheckCircle2 size={16} />
                Ready to feed wallet-tracing pipeline
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="mt-8">
        <h2 className="font-serif text-xl">Recent intake (demo)</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          {SAMPLE_COMPLAINTS.map((c) => (
            <div key={c.id} className="border-b border-border px-4 py-3 last:border-0 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-xs font-medium">
                  {c.id} · {c.language}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {c.structured.typology} · {c.structured.amountLost}
                </p>
              </div>
              <span className="mt-2 inline-block rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold uppercase sm:mt-0">
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
