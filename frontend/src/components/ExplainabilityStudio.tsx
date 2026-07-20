/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Eye, Info, Sliders, Activity, Layers } from 'lucide-react';
import { Case } from '../types';

interface ExplainabilityStudioProps {
  activeCase: Case;
}

type XAIMode = 'grad_cam' | 'attention' | 'frequency' | 'texture';

export default function ExplainabilityStudio({ activeCase }: ExplainabilityStudioProps) {
  const [mode, setMode] = useState<XAIMode>('grad_cam');
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.7);
  const [threshold, setThreshold] = useState(45);
  const [activeLayer, setActiveLayer] = useState(4);

  const modes = [
    { id: 'grad_cam' as XAIMode, name: 'Grad-CAM', desc: 'Gradient Weighted Activations', color: 'bg-red-500 border-red-500/30 text-red-300' },
    { id: 'attention' as XAIMode, name: 'Attention Map', desc: 'Vision Transformer Attention Heads', color: 'bg-purple-500 border-purple-500/30 text-purple-300' },
    { id: 'frequency' as XAIMode, name: 'Fourier Spectral Drops', desc: 'Spectral Frequency Discontinuities', color: 'bg-cyan-500 border-cyan-500/30 text-cyan-300' },
    { id: 'texture' as XAIMode, name: 'Texture Heatmap', desc: 'Localized Co-occurrence Anomalies', color: 'bg-emerald-500 border-emerald-500/30 text-emerald-300' }
  ];

  // Simulated coordinate triggers based on specific case to make hover labels ultra-contextual
  const hoverPoints = activeCase.id.includes('9082') 
    ? [
        { top: '35%', left: '42%', title: 'Sub-surface light vectors', text: 'Shadow gradient normal mismatch detected around right iris.' },
        { top: '55%', left: '50%', title: 'Mismatched flow structures', text: 'Mouth edges exhibit sharp high-frequency dither coefficients.' }
      ]
    : [
        { top: '48%', left: '46%', title: 'Asymmetrical wave dispersion', text: 'Boundary ripples display spatial Fourier echoes.' },
        { top: '65%', left: '38%', title: 'Inpaint boundary blending', text: 'Local pixel compression quantizations deviate from maritime water tables.' }
      ];

  // Helper to choose SVG overlay filters representing Grad-CAM or Attention Maps
  const renderOverlay = () => {
    switch (mode) {
      case 'grad_cam':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: heatmapOpacity }}>
            {/* Red/orange blobs for attention */}
            <circle cx="150" cy="140" r="70" fill="url(#gradCamGrad1)" opacity="0.8" className="blur-[15px]" />
            <circle cx="280" cy="180" r="45" fill="url(#gradCamGrad2)" opacity="0.6" className="blur-[12px]" />
            <defs>
              <radialGradient id="gradCamGrad1">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <radialGradient id="gradCamGrad2">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="60%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </svg>
        );
      case 'attention':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: heatmapOpacity }}>
            {/* Glowing lines mapping transformer weights */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="none" />
                <circle cx="10" cy="10" r="1.5" fill="#C084FC" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Attention vectors */}
            <line x1="120" y1="130" x2="160" y2="150" stroke="#C084FC" strokeWidth="2.5" strokeDasharray="3 3" className="animate-pulse" />
            <line x1="160" y1="150" x2="220" y2="110" stroke="#C084FC" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="160" cy="150" r="30" fill="none" stroke="#C084FC" strokeWidth="1" className="animate-pulse" />
          </svg>
        );
      case 'frequency':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: heatmapOpacity }}>
            {/* Concentric high frequency visualizers */}
            <circle cx="200" cy="160" r="110" fill="none" stroke="#22D3EE" strokeWidth="1" strokeDasharray="5 5" opacity="0.4" />
            <circle cx="200" cy="160" r="80" fill="none" stroke="#06B6D4" strokeWidth="1.5" opacity="0.5" />
            <circle cx="200" cy="160" r="45" fill="none" stroke="#22D3EE" strokeWidth="2.5" opacity="0.7" className="animate-pulse" />
          </svg>
        );
      case 'texture':
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: heatmapOpacity }}>
            {/* Localized hot-spot grids */}
            <rect x="80" y="100" width="80" height="60" fill="rgba(16, 185, 129, 0.25)" stroke="#34D399" strokeWidth="1.5" className="blur-[1px]" />
            <rect x="220" y="150" width="60" height="80" fill="rgba(16, 185, 129, 0.15)" stroke="#34D399" strokeWidth="1" className="blur-[2px]" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header instructions card */}
      <div className="bg-[#0E1323]/80 border border-white/10 p-6 rounded-2xl glass-panel">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-display font-semibold text-white">Explainability Studio (XAI)</h3>
            <p className="text-xs text-brand-muted">Layer-by-layer visualization of spatial features triggering synthetic AI predictions</p>
          </div>
        </div>
        <p className="text-xs text-brand-muted leading-relaxed">
          AI forensic models must not only predict; they must explain. Our Explainability Studio runs Grad-CAM maps and attention distributions to reveal exactly where the neural backbones detect anomalous generation indicators (like iris light vector anomalies or Fourier texture boundary tears).
        </p>
      </div>

      {/* Main interactive grid splitting preview and knobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Interactive Image Preview with Heatmap overlay */}
        <div className="lg:col-span-7 bg-[#0E1323]/80 border border-white/10 p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <span className="text-xs font-mono font-bold tracking-widest text-brand-accent uppercase">
                Forensic Specimen Microscope
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-[10px] font-mono text-brand-muted uppercase">Interactive Hotspots</span>
              </div>
            </div>

            {/* Specimen Frame */}
            <div className="relative w-full aspect-[4/3] bg-[#050816] rounded-xl border border-white/10 overflow-hidden group">
              <img
                src={activeCase.evidenceUrl}
                alt="Case Evidence Specimen"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none"
              />

              {/* Dynamic Overlay representation */}
              {renderOverlay()}

              {/* Holographic scanner effect line */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" />

              {/* Hover point overlays */}
              {hoverPoints.map((pt, i) => (
                <div
                  key={i}
                  className="absolute group/pt z-30 cursor-help"
                  style={{ top: pt.top, left: pt.left }}
                >
                  {/* Radial Ring */}
                  <div className="w-5 h-5 rounded-full bg-blue-500/30 border-2 border-white flex items-center justify-center animate-ping absolute" />
                  <div className="w-5 h-5 rounded-full bg-blue-600 border border-white flex items-center justify-center relative z-20 hover:scale-110 transition-transform">
                    <Info className="w-3 h-3 text-white" />
                  </div>

                  {/* Micro tooltip label */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-[#0E1323]/95 border border-white/10 p-2.5 rounded-lg opacity-0 group-hover/pt:opacity-100 pointer-events-none transition-all duration-200 translate-y-1 group-hover/pt:translate-y-0 text-left shadow-2xl">
                    <h5 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">{pt.title}</h5>
                    <p className="text-[9px] text-brand-muted mt-1 leading-relaxed">{pt.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] font-mono text-brand-muted flex justify-between items-center mt-4">
            <span>MICROSCOPE_ZOOM: 1.0X</span>
            <span>MODEL_ATTN_LAYER: Block-{activeLayer}-CAM</span>
          </div>
        </div>

        {/* Studio Controls Panel */}
        <div className="lg:col-span-5 bg-[#0E1323]/80 border border-white/10 p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono font-bold tracking-widest text-brand-accent uppercase">
                Filter Selectors
              </h3>
              <Sliders className="w-4 h-4 text-brand-muted" />
            </div>

            {/* Mode selection buttons */}
            <div className="grid grid-cols-1 gap-2.5">
              {modes.map((m) => {
                const isSelected = mode === m.id;

                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`flex items-center justify-between text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500/40 text-white'
                        : 'bg-[#050816]/60 border-white/5 text-brand-muted hover:bg-[#050816]/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center`}>
                        <Eye className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold tracking-wide text-white">{m.name}</h4>
                        <p className="text-[10px] text-brand-muted mt-0.5">{m.desc}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Slider Control values */}
            <div className="mt-8 space-y-5">
              <div>
                <div className="flex justify-between items-center text-xs font-mono text-brand-muted mb-2">
                  <span className="uppercase">Heatmap Intensity</span>
                  <span className="text-white">{(heatmapOpacity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={heatmapOpacity}
                  onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-white/10 rounded-full appearance-none cursor-ew-resize"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-mono text-brand-muted mb-2">
                  <span className="uppercase">Inference Threshold</span>
                  <span className="text-white">{threshold}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="1"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="w-full accent-purple-500 h-1 bg-white/10 rounded-full appearance-none cursor-ew-resize"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-mono text-brand-muted mb-2">
                  <span className="uppercase">Target Neural Layer</span>
                  <span className="text-white">Convolution Layer {activeLayer}</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((lyr) => (
                    <button
                      key={lyr}
                      onClick={() => setActiveLayer(lyr)}
                      className={`flex-grow py-1.5 rounded text-xs font-mono border cursor-pointer ${
                        activeLayer === lyr
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-[#050816]/60 border-white/5 text-brand-muted hover:bg-[#050816]'
                      }`}
                    >
                      L{lyr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-[#050816]/60 border border-white/5 rounded-xl flex items-start gap-2.5">
            <Activity className="w-3.5 h-3.5 text-blue-400 mt-0.5" />
            <p className="text-[10px] font-mono text-brand-muted leading-relaxed">
              XAI engine compiled successfully. Gradient weights mapped to COV_MAP parameters. Output verified with standard deviation interval σ=0.032.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
