import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Play, Pause, RotateCcw, Zap } from 'lucide-react';
import type { CryptoTraceResult, CryptoTraceNode, CryptoTraceEdge } from '@workspace/api-client-react';

type Point = { x: number; y: number; node: CryptoTraceNode };

type LiveFundFlowGraphProps = {
  result: CryptoTraceResult;
  autoPlay?: boolean;
};

function nodeColor(node: CryptoTraceNode, isActive: boolean) {
  if (node.kind === 'subject') return isActive ? '#1e3a5f' : '#0f172a';
  if (node.sourceFlaggedScam) return isActive ? '#b91c1c' : '#7f1d1d';
  if (node.kind === 'exchange' || (node.label && /exchange|binance|okx|kucoin/i.test(node.label)))
    return isActive ? '#b45309' : '#92400e';
  return isActive ? '#334155' : '#64748b';
}

export function LiveFundFlowGraph({ result, autoPlay = true }: LiveFundFlowGraphProps) {
  const nodes = result.nodes.slice(0, 20);
  const edges = result.edges.slice(0, 36);

  const layout = useMemo(() => {
    const map = new Map<string, Point>();
    const cx = 420;
    const cy = 210;
    const subject = nodes.find((n) => n.kind === 'subject') ?? nodes[0];
    if (subject) map.set(subject.address, { x: cx, y: cy, node: subject });

    const others = nodes.filter((n) => n.address !== subject?.address);
    const rings = [
      { r: 110, count: Math.min(6, others.length) },
      { r: 175, count: Math.min(8, Math.max(0, others.length - 6)) },
      { r: 230, count: Math.max(0, others.length - 14) },
    ];
    let idx = 0;
    for (const ring of rings) {
      for (let i = 0; i < ring.count && idx < others.length; i++, idx++) {
        const angle = (i / ring.count) * Math.PI * 2 - Math.PI / 2;
        map.set(others[idx].address, {
          x: cx + Math.cos(angle) * ring.r,
          y: cy + Math.sin(angle) * ring.r * 0.72,
          node: others[idx],
        });
      }
    }
    return map;
  }, [nodes]);

  const orderedEdges = useMemo(() => {
    // Prefer chronological if timestamps exist on matching txs
    const withOrder = edges.map((e, i) => {
      const tx = result.transactions.find((t) => t.hash === e.hash);
      const t = tx?.timestamp ? new Date(tx.timestamp).getTime() : i;
      return { edge: e, order: t };
    });
    return withOrder.sort((a, b) => a.order - b.order).map((x) => x.edge);
  }, [edges, result.transactions]);

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const maxStep = orderedEdges.length + 1;

  useEffect(() => {
    if (!playing || orderedEdges.length === 0) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= maxStep) return 0;
        return s + 1;
      });
    }, 900);
    return () => clearInterval(id);
  }, [playing, orderedEdges.length, maxStep]);

  const visibleEdges = orderedEdges.slice(0, Math.max(0, step));
  const activeEdge = step > 0 && step <= orderedEdges.length ? orderedEdges[step - 1] : null;
  const activeAddresses = new Set<string>();
  if (activeEdge) {
    activeAddresses.add(activeEdge.from);
    activeAddresses.add(activeEdge.to);
  }
  visibleEdges.forEach((e) => {
    activeAddresses.add(e.from);
    activeAddresses.add(e.to);
  });

  if (!nodes.length) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
        No graph nodes returned for this address.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 shadow-inner" data-testid="live-fund-flow-graph">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Network size={16} className="text-amber-400" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Live attribution path</p>
            <h3 className="text-sm font-semibold text-white">Animated fund-flow graph</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-slate-400">
            Hop {Math.min(step, orderedEdges.length)} / {orderedEdges.length}
          </span>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-white/10"
          >
            {playing ? <Pause size={12} /> : <Play size={12} />}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setPlaying(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 hover:bg-white/10"
          >
            <RotateCcw size={12} />
            Replay
          </button>
        </div>
      </div>

      <div className="relative">
        <svg viewBox="0 0 840 420" className="h-[380px] w-full" role="img" aria-label="Live animated transaction network">
          <defs>
            <marker id="live-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#f59e0b" />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* subtle grid */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 70} y1={0} x2={i * 70} y2={420} stroke="rgba(148,163,184,0.06)" />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 60} x2={840} y2={i * 60} stroke="rgba(148,163,184,0.06)" />
          ))}

          {visibleEdges.map((edge, i) => {
            const from = layout.get(edge.from);
            const to = layout.get(edge.to);
            if (!from || !to) return null;
            const isActive = activeEdge?.hash === edge.hash;
            return (
              <motion.line
                key={edge.hash + i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isActive ? '#f59e0b' : 'rgba(245,158,11,0.35)'}
                strokeWidth={isActive ? 2.5 : 1.4}
                markerEnd="url(#live-arrow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                filter={isActive ? 'url(#glow)' : undefined}
              />
            );
          })}

          {[...layout.values()].map(({ x, y, node }) => {
            const lit = activeAddresses.has(node.address) || node.kind === 'subject';
            const subject = node.kind === 'subject';
            const r = subject ? 16 : 11;
            return (
              <g key={node.address}>
                {lit && <circle cx={x} cy={y} r={r + 10} fill="url(#node-glow)" />}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={nodeColor(node, lit)}
                  stroke={lit ? '#fbbf24' : 'rgba(148,163,184,0.4)'}
                  strokeWidth={lit ? 2.5 : 1.5}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                />
                <text
                  x={x}
                  y={y + 3.5}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize={subject ? 10 : 8}
                  fontFamily="ui-monospace, monospace"
                  fontWeight={subject ? 700 : 500}
                >
                  {subject ? 'SRC' : node.kind === 'exchange' ? 'EX' : node.sourceFlaggedScam ? '!' : 'W'}
                </text>
                {(node.label || subject) && (
                  <text
                    x={x}
                    y={y + r + 14}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="8"
                    fontFamily="ui-monospace, monospace"
                  >
                    {(node.label || node.address.slice(0, 6) + '…').slice(0, 14)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <AnimatePresence>
          {activeEdge && (
            <motion.div
              key={activeEdge.hash}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-slate-950/90 px-3 py-2 text-[11px] text-amber-100 backdrop-blur"
            >
              <Zap size={13} className="shrink-0 text-amber-400" />
              <span className="font-mono">
                Hop active · {activeEdge.from.slice(0, 8)}… → {activeEdge.to.slice(0, 8)}…
                {activeEdge.value ? ` · ${activeEdge.value} ETH` : ''}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-white/10 px-4 py-2.5 text-[10px] text-slate-400">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-900 ring-2 ring-amber-400" /> Subject</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-800" /> Exchange / VASP</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-800" /> Flagged</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-500" /> Intermediary</span>
        <span className="ml-auto font-mono text-slate-500">{nodes.length} nodes · {edges.length} edges · provider-sourced</span>
      </div>
    </div>
  );
}
