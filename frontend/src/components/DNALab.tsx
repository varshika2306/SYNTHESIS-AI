/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Dna, ShieldAlert, CheckCircle, Info, Sparkles, Sliders } from 'lucide-react';
import { Case } from '../types';

interface DNALabProps {
  activeCase: Case;
}

interface DNADefinition {
  key: keyof Case['dnaScores'];
  name: string;
  scientificTerm: string;
  desc: string;
  threshold: number;
}

export default function DNALab({ activeCase }: DNALabProps) {
  const [selectedDnaKey, setSelectedDnaKey] = useState<keyof Case['dnaScores']>('texture');

  const dnaDefs: DNADefinition[] = [
    {
      key: 'texture',
      name: 'Texture Signature',
      scientificTerm: 'High-order Co-occurrence Matrix Anisotropy',
      desc: 'Measures structural patterns and micro-grain alignment. GAN models often reveal grid-like repetitions, whereas diffusion engines fail to replicate physical paper or organic skin pore pores, yielding isotropic smoothness bias.',
      threshold: 80
    },
    {
      key: 'noise',
      name: 'Sensor Noise Fingerprint',
      scientificTerm: 'Photo-Response Non-Uniformity (PRNU) Divergence',
      desc: 'Authentic camera sensors print a unique stochastical pixel noise footprint (PRNU). AI-generated pictures contain synthetic white noise and mathematical dither patterns that lack sensor array covariance.',
      threshold: 85
    },
    {
      key: 'lighting',
      name: 'Lighting Coherence',
      scientificTerm: 'Planar Normal Light Vector Convergence',
      desc: 'Decodes surface normal estimations to check key/fill shadows. Generative AI frequently inserts objects with non-matching light vectors or incorrect subsurface light scattering.',
      threshold: 75
    },
    {
      key: 'edges',
      name: 'Boundary Edge Fills',
      scientificTerm: 'High-frequency Spatial Edge Decay',
      desc: 'Inpaints and generative boundaries exhibit blurred gradients or localized pixel artifacts. Real objects feature sharp, organic transitions with diffraction margins.',
      threshold: 80
    },
    {
      key: 'frequency',
      name: 'Spectral Distribution',
      scientificTerm: 'Discrete Cosine Transform (DCT) Spectral Drop',
      desc: 'Measures frequency distributions. Generative media displays distinct high-frequency spectrum spikes and drops caused by convolutional upsamplers and Fourier artifact echoes.',
      threshold: 90
    },
    {
      key: 'compression',
      name: 'Compression Signatures',
      scientificTerm: 'Double Quantization Matrix Asymmetry',
      desc: 'Verifies the history of image transformations. Synthetic imagery is frequently saved twice, leaving signature double-quantization matrix tables and mismatched pixel grids.',
      threshold: 70
    },
    {
      key: 'diffusion',
      name: 'Diffusion Footprint',
      scientificTerm: 'Euler Flow Match Divergence Coefficient',
      desc: 'Extracts the underlying denoising schedule trace. Diffusion algorithms leave structural residual footprints representing the step-by-step reduction of latent space noise.',
      threshold: 85
    },
    {
      key: 'promptArtifacts',
      name: 'Prompt Semantic Traces',
      scientificTerm: 'CLIP-Space Latent Bias Correlation',
      desc: 'Measures semantic over-fitting. Detects whether certain textures (like standard hair or background brushwork) are heavily correlated with specific prompt vocabularies.',
      threshold: 80
    }
  ];

  const activeDnaScore = activeCase.dnaScores[selectedDnaKey];
  const activeDef = dnaDefs.find(d => d.key === selectedDnaKey)!;

  return (
    <div className="space-y-6">
      
      {/* Overview stats header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-8 bg-[#0E1323]/80 border border-white/10 p-6 rounded-2xl glass-panel">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center">
              <Dna className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base font-display font-semibold text-white">Digital DNA Analyzer</h3>
              <p className="text-xs text-brand-muted">Molecular forensic validation of high-frequency generative patterns</p>
            </div>
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            Every generative algorithm leaves underlying trace patterns inside pixel spaces. SYNTHESIS AI Digital DNA Lab reconstructs these anomalies into distinct molecular chains. Select a nucleotide on the interactive double helix below to inspect its forensic authenticity metrics.
          </p>
        </div>

        <div className="md:col-span-4 bg-[#0E1323]/80 border border-white/10 p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-brand-muted uppercase tracking-wider">DNA Security Hash</span>
            <span className="text-[9px] font-mono text-cyan-400 font-semibold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/15">
              SECURE_STRAND
            </span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] font-mono text-brand-muted truncate mb-1">
              HASH: <span className="text-white font-semibold">{activeCase.dnaHash}</span>
            </div>
            <div className="text-[11px] font-mono text-brand-muted">
              INVESTIGATOR: <span className="text-white font-semibold">{activeCase.investigator}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Helix visualization + detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Interactive Double Helix Strand */}
        <div className="lg:col-span-5 bg-[#0E1323]/85 border border-white/10 rounded-2xl glass-panel p-6 flex flex-col justify-between min-h-[480px]">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-mono font-bold tracking-widest text-brand-accent uppercase">
                Interactive Genome Helix
              </span>
              <span className="text-[10px] font-mono text-brand-muted">Click nodes to inspect</span>
            </div>

            {/* Vertical DNA Strand Animation Container */}
            <div className="relative w-full h-[360px] flex items-center justify-center bg-[#050816]/40 rounded-xl border border-white/5 overflow-hidden">
              <div className="absolute inset-0 cyber-grid-dots opacity-40" />

              <svg className="w-64 h-[320px]" viewBox="0 0 100 200">
                {/* Connecting ladders */}
                {dnaDefs.map((def, i) => {
                  const y = 20 + i * 22;
                  const phase = i * 0.6;
                  // Sine wave positions for complimentary strands
                  const x1 = 50 + 28 * Math.sin(phase);
                  const x2 = 50 - 28 * Math.sin(phase);
                  const isSelected = selectedDnaKey === def.key;

                  return (
                    <g key={def.key} className="cursor-pointer" onClick={() => setSelectedDnaKey(def.key)}>
                      {/* Ladder Rung */}
                      <line
                        x1={x1}
                        y1={y}
                        x2={x2}
                        y2={y}
                        stroke={isSelected ? '#38BDF8' : 'rgba(255,255,255,0.1)'}
                        strokeWidth={isSelected ? '2' : '1'}
                        strokeDasharray={isSelected ? 'none' : '2 2'}
                      />

                      {/* Node A */}
                      <circle
                        cx={x1}
                        cy={y}
                        r={isSelected ? '5' : '3.5'}
                        fill={isSelected ? '#38BDF8' : activeCase.dnaScores[def.key] > 70 ? '#10B981' : '#EF4444'}
                        className={`transition-all ${isSelected ? 'shadow-[0_0_8px_#38BDF8]' : ''}`}
                      />

                      {/* Node B */}
                      <circle
                        cx={x2}
                        cy={y}
                        r={isSelected ? '5' : '3.5'}
                        fill={isSelected ? '#38BDF8' : 'rgba(96, 165, 250, 0.4)'}
                      />

                      {/* Text Tag next to key nodes */}
                      {Math.abs(x1 - 50) > 10 && (
                        <text
                          x={x1 > 50 ? x1 + 8 : x1 - 40}
                          y={y + 3}
                          fill={isSelected ? '#ffffff' : 'rgba(148, 163, 184, 0.6)'}
                          className="text-[6px] font-mono"
                          textAnchor={x1 > 50 ? 'start' : 'end'}
                        >
                          {def.name.split(' ')[0]}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="text-[10px] font-mono text-brand-muted text-center pt-2">
            Helix normalized using 128-bit SHA biometric hashes.
          </div>
        </div>

        {/* Selected Component Description */}
        <div className="lg:col-span-7 bg-[#0E1323]/85 border border-white/10 rounded-2xl glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
              <div>
                <span className="text-[9px] font-mono text-brand-accent tracking-widest uppercase font-bold">DNA Component Selected</span>
                <h3 className="text-xl font-display font-bold text-white mt-0.5">{activeDef.name}</h3>
                <p className="text-xs font-mono text-blue-400 mt-1">{activeDef.scientificTerm}</p>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <span className="text-[10px] font-mono text-brand-muted block uppercase">STRAND STATE</span>
                <span className={`inline-block mt-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono ${
                  activeDnaScore >= activeDef.threshold
                    ? 'bg-green-500/10 text-green-400 border border-green-500/25'
                    : 'bg-red-500/10 text-red-400 border border-red-500/25'
                }`}>
                  {activeDnaScore >= activeDef.threshold ? 'AUTHENTIC' : 'SYNTHETIC_ANOMALY'}
                </span>
              </div>
            </div>

            {/* Score detail card with high-fidelity gauges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
              <div className="bg-[#050816] p-4 rounded-xl border border-white/5 relative overflow-hidden">
                <span className="text-[10px] font-mono text-brand-muted uppercase tracking-wider block mb-1">Authenticity Rating</span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-display font-bold ${activeDnaScore > 70 ? 'text-green-400' : 'text-red-400'}`}>
                    {activeDnaScore}%
                  </span>
                  <span className="text-xs font-mono text-brand-muted">/ 100%</span>
                </div>
                {/* Horizontal status line */}
                <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${activeDnaScore > 70 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${activeDnaScore}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#050816] p-4 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-brand-muted uppercase tracking-wider block mb-1">Standard Margin deviation</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-mono font-bold text-white">
                    {((100 - activeDnaScore) * 0.12).toFixed(2)}
                  </span>
                  <span className="text-xs font-mono text-brand-muted">σ</span>
                </div>
                <p className="text-[10px] text-brand-muted leading-relaxed mt-2.5">
                  Confidence intervals mapped to baseline human sensor matrixes.
                </p>
              </div>
            </div>

            {/* Scientific Explanation paragraph */}
            <div className="mt-5 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  Forensic Diagnostics
                </h4>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {activeDef.desc}
                </p>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/15 p-4 rounded-xl">
                <h4 className="text-xs font-semibold text-blue-400 font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Sub-spectrogram analysis
                </h4>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Spectral spikes localized around the {(activeDnaScore * 8).toFixed(0)}Hz frequency band reveal recurrent upsampling interpolation grid coefficients typical of {activeCase.id.includes('9082') ? 'Euler Flow-Match flowlines' : 'GAN pixel replication tables'}.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center text-[10px] font-mono text-brand-muted">
            <span>COV_MATRIX_DIVERGENCE: {((100 - activeDnaScore) * 1.45).toFixed(4)}</span>
            <span>CELL_CLEARANCE: ALPHA_9</span>
          </div>
        </div>

      </div>

    </div>
  );
}
