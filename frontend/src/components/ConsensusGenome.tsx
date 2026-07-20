/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Cpu, ShieldCheck, Eye, Network, HelpCircle, Activity } from 'lucide-react';
import { Case } from '../types';

interface ConsensusGenomeProps {
  activeCase: Case;
}

export default function ConsensusGenome({ activeCase }: ConsensusGenomeProps) {
  const models = activeCase.consensusModels;
  const genome = activeCase.genomeAttribution;

  // Configuration for Genome Attribution Radial Graph Nodes
  const generators = [
    { id: 'flux', name: 'FLUX.1', score: genome.flux, color: '#38BDF8', angle: 0 },
    { id: 'midjourney', name: 'Midjourney v6', score: genome.midjourney, color: '#60A5FA', angle: 51 },
    { id: 'stableDiffusion', name: 'Stable Diffusion', score: genome.stableDiffusion, color: '#2563EB', angle: 102 },
    { id: 'dalle', name: 'DALL-E 3', score: genome.dalle, color: '#A855F7', angle: 153 },
    { id: 'firefly', name: 'Adobe Firefly', score: genome.firefly, color: '#F43F5E', angle: 204 },
    { id: 'ideogram', name: 'Ideogram v2', score: genome.ideogram, color: '#F59E0B', angle: 255 },
    { id: 'leonardo', name: 'Leonardo.AI', score: genome.leonardo, color: '#10B981', angle: 306 }
  ];

  // Helper to map radial angle to cartesian coordinates
  const getCoordinates = (angle: number, radius: number) => {
    const radian = (angle * Math.PI) / 180;
    const x = 150 + radius * Math.cos(radian);
    const y = 150 + radius * Math.sin(radian);
    return { x, y };
  };

  return (
    <div className="space-y-6">
      
      {/* 2-Column Grid for Consensus vs Genome */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Consensus Intelligence */}
        <div className="lg:col-span-7 bg-[#0E1323]/80 border border-white/10 p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5 border-b border-white/5 pb-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <Network className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-display font-semibold text-white">Consensus Intelligence</h3>
                <p className="text-xs text-brand-muted">Consolidated inference agreement across independent convolutional & attention backbones</p>
              </div>
            </div>

            {/* Neural model rows */}
            <div className="space-y-3">
              {models.map((model) => (
                <div key={model.name} className="p-3 bg-[#050816]/80 border border-white/5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-mono text-xs text-brand-muted">
                      <Cpu className="w-4 h-4 text-brand-accent" />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">{model.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-brand-muted">
                        <span>Latency: {model.inferenceTime}ms</span>
                        <span>•</span>
                        <span>Layer: {model.attentionMap}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        model.prediction === 'SYNTHETIC'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-green-500/10 text-green-400 border-green-500/20'
                      }`}>
                        {model.prediction}
                      </span>
                      <p className="text-[10px] font-mono text-brand-muted mt-1">
                        Confidence: <span className="text-white">{model.confidence}%</span>
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs">
                      {model.agreement ? (
                        <ShieldCheck className="w-4.5 h-4.5 text-green-400" />
                      ) : (
                        <HelpCircle className="w-4.5 h-4.5 text-amber-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Combined consensus box */}
            <div className="mt-5 p-4 bg-blue-500/5 border border-blue-500/15 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">Overall Neural Consensus</h4>
                <p className="text-[11px] text-brand-muted mt-1 leading-snug">
                  Agreement coefficient computed from independent high-dimension latent probability manifolds.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-display font-black text-cyan-400">
                  {activeCase.consensusAgreement}%
                </span>
                <span className="text-[10px] font-mono text-brand-muted uppercase block">SYNTHETIC WEIGHT</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-3.5 mt-6 flex justify-between items-center text-[10px] font-mono text-brand-muted">
            <span>ALIGNMENT_SCORE: {(activeCase.consensusAgreement * 1.025).toFixed(1)}/100</span>
            <span>MODEL_REGISTRY: REG_7A</span>
          </div>
        </div>

        {/* Genome Attribution Radial Graph */}
        <div className="lg:col-span-5 bg-[#0E1323]/80 border border-white/10 p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-sm font-mono font-bold tracking-widest text-brand-accent uppercase">
                  Genome Attribution Map
                </h3>
                <p className="text-[11px] text-brand-muted">Similarity linking to known generative diffusion engines</p>
              </div>
              <span className="text-[9px] font-mono text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/15 uppercase">
                Radial Graph
              </span>
            </div>

            {/* SVG RADIAL CANVAS */}
            <div className="relative w-full h-[300px] bg-[#050816]/60 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 cyber-grid-dots opacity-35" />

              <svg className="w-[300px] h-[300px]" viewBox="0 0 300 300">
                {/* Connection lines from center to outer nodes */}
                {generators.map((gen) => {
                  const { x, y } = getCoordinates(gen.angle, 95);
                  const strokeWidth = Math.max(1, (gen.score / 100) * 4);
                  const opacity = Math.max(0.15, gen.score / 100);

                  return (
                    <g key={`link-${gen.id}`}>
                      {/* Interactive dashed line */}
                      <line
                        x1="150"
                        y1="150"
                        x2={x}
                        y2={y}
                        stroke={gen.color}
                        strokeWidth={strokeWidth}
                        opacity={opacity}
                        strokeDasharray={gen.score > 20 ? "none" : "3 3"}
                      />
                      
                      {/* Animated traveling signal particle */}
                      {gen.score > 15 && (
                        <circle r="3" fill="#ffffff" opacity="0.9" className="blur-[1px]">
                          <animateMotion
                            path={`M 150,150 L ${x},${y}`}
                            dur={`${Math.max(1.2, 5 - (gen.score / 20))}s`}
                            repeatCount="Infinity"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* Concentric distance rings */}
                <circle cx="150" cy="150" r="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <circle cx="150" cy="150" r="70" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <circle cx="150" cy="150" r="95" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

                {/* CENTER NODE: CURRENT IMAGE THUMBNAIL */}
                <foreignObject x="125" y="125" width="50" height="50" className="rounded-full overflow-hidden border-2 border-white/20 shadow-2xl z-20">
                  <img
                    src={activeCase.evidenceUrl}
                    alt="Current Case Center Thumbnail"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </foreignObject>
                <circle cx="150" cy="150" r="26" fill="none" stroke="#2563EB" strokeWidth="2.5" className="animate-pulse" />

                {/* OUTER NODES: GENERATORS */}
                {generators.map((gen) => {
                  const { x, y } = getCoordinates(gen.angle, 95);
                  const isMatch = gen.score > 15;

                  return (
                    <g key={gen.id} className="cursor-pointer">
                      {/* Node ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isMatch ? "13" : "10"}
                        fill="#0E1323"
                        stroke={gen.color}
                        strokeWidth={isMatch ? "2.5" : "1.5"}
                        className="transition-all"
                      />
                      {/* Score circle fill representing magnitude */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isMatch ? "8" : "6"}
                        fill={gen.color}
                        opacity={isMatch ? "0.15" : "0.05"}
                      />
                      {/* Text tags */}
                      <text
                        x={x}
                        y={y - 18}
                        fill="#ffffff"
                        fontSize="7"
                        fontFamily="var(--font-mono)"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {gen.name}
                      </text>
                      <text
                        x={x}
                        y={y + 3}
                        fill={isMatch ? "#ffffff" : "rgba(255,255,255,0.4)"}
                        fontSize="7"
                        fontFamily="var(--font-mono)"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {gen.score.toFixed(0)}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Diagnostic readout below */}
            <div className="mt-4 bg-white/5 p-3 rounded-xl border border-white/5 flex items-start gap-2.5">
              <div className="p-1 rounded bg-blue-500/10 text-blue-400 mt-0.5">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div className="text-[10px] font-mono text-brand-muted leading-relaxed">
                Primary model attribution matched <span className="text-white font-bold">{generators[0].name}</span> with a confidence probability weight of <span className="text-white font-bold">{generators[0].score}%</span>. Adversarial noise grids align perfectly with {generators[0].name}’s latent denoising schedules.
              </div>
            </div>
          </div>

          <div className="text-[9px] font-mono text-brand-muted text-center pt-3 border-t border-white/5 mt-4">
            Similarity distance metrics based on cosine weights of global embeddings.
          </div>
        </div>

      </div>

    </div>
  );
}
