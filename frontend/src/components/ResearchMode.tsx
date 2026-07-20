/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, ScatterChart, Scatter, Cell, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { Database, Cpu, Activity, BarChart2, CheckCircle, Flame } from 'lucide-react';

// Recharts simulated Embedding Clusters
const embeddingData = [
  { x: 12, y: 15, z: 10, group: 'Real Images' },
  { x: 15, y: 18, z: 10, group: 'Real Images' },
  { x: 10, y: 12, z: 10, group: 'Real Images' },
  { x: 14, y: 14, z: 10, group: 'Real Images' },
  
  { x: 55, y: 62, z: 10, group: 'FLUX.1 (Synth)' },
  { x: 58, y: 65, z: 10, group: 'FLUX.1 (Synth)' },
  { x: 52, y: 60, z: 10, group: 'FLUX.1 (Synth)' },
  
  { x: 72, y: 32, z: 10, group: 'Midjourney v6 (Synth)' },
  { x: 75, y: 35, z: 10, group: 'Midjourney v6 (Synth)' },
  { x: 70, y: 28, z: 10, group: 'Midjourney v6 (Synth)' },
  
  { x: 32, y: 78, z: 10, group: 'DALL-E 3 (Synth)' },
  { x: 35, y: 80, z: 10, group: 'DALL-E 3 (Synth)' },
  { x: 30, y: 75, z: 10, group: 'DALL-E 3 (Synth)' },

  // CURRENT INVESTIGATION SPECIEMEN
  { x: 54, y: 61, z: 25, group: 'Current Specimen' }
];

// ROC Curve validation coordinates
const rocCurve = [
  { fpr: 0, tpr: 0 },
  { fpr: 0.05, tpr: 0.85 },
  { fpr: 0.10, tpr: 0.94 },
  { fpr: 0.20, tpr: 0.97 },
  { fpr: 0.40, tpr: 0.99 },
  { fpr: 0.60, tpr: 1.00 },
  { fpr: 1.00, tpr: 1.00 }
];

export default function ResearchMode() {
  const [activeSubTab, setActiveSubTab] = useState<'embedding' | 'benchmark'>('embedding');

  // Simulated activation feature maps (4x4 matrix representing high-dimension layers)
  const featureMaps = Array.from({ length: 16 }).map((_, i) => {
    // Generate organic blobs using random or mathematical shapes
    const seed = i * 45;
    return (
      <div key={i} className="aspect-square bg-[#050816] rounded border border-white/5 relative overflow-hidden flex items-center justify-center">
        {/* Grayscale neural grid activation simulation */}
        <div 
          className="w-10 h-10 rounded-full bg-blue-500/20 blur-[6px] absolute animate-pulse"
          style={{
            animationDuration: `${1.5 + (i % 3) * 0.5}s`,
            transform: `translate(${(seed % 10) - 5}px, ${(seed % 8) - 4}px) scale(${0.8 + (i % 4) * 0.1})`
          }}
        />
        <span className="text-[7px] font-mono text-brand-muted/40 absolute bottom-1 right-1">
          #{(1024 + i * 28).toString(16).toUpperCase()}
        </span>
      </div>
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Telemetry and GPU Health header row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-[#0E1323]/80 border border-white/10 p-4 rounded-xl glass-panel flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider block">GPU CORE LOAD</span>
            <span className="text-xl font-mono font-bold text-white">74.2%</span>
            <div className="w-24 h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-indigo-400 rounded-full" style={{ width: '74.2%' }} />
            </div>
          </div>
        </div>

        <div className="bg-[#0E1323]/80 border border-white/10 p-4 rounded-xl glass-panel flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-pink-600/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider block">CHIP TEMPERATURE</span>
            <span className="text-xl font-mono font-bold text-white">62.0°C</span>
            <p className="text-[9px] text-green-400 font-mono mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> COOLING_OK
            </p>
          </div>
        </div>

        <div className="bg-[#0E1323]/80 border border-white/10 p-4 rounded-xl glass-panel flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider block">VRAM ALLOCATION</span>
            <span className="text-xl font-mono font-bold text-white">14.2 / 16.0 GB</span>
            <div className="w-24 h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: '88%' }} />
            </div>
          </div>
        </div>

        <div className="bg-[#0E1323]/80 border border-white/10 p-4 rounded-xl glass-panel flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider block">INFERENCE LATENCY</span>
            <span className="text-xl font-mono font-bold text-white">12.4ms</span>
            <p className="text-[9px] font-mono text-brand-muted mt-1">
              BATCH_SIZE: 1 // FP16
            </p>
          </div>
        </div>

      </div>

      {/* Main visual blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Feature Maps Grid */}
        <div className="lg:col-span-5 bg-[#0E1323]/80 border border-white/10 p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
              <div>
                <h3 className="text-sm font-mono font-bold tracking-widest text-brand-accent uppercase">
                  Feature Maps Activation
                </h3>
                <p className="text-[11px] text-brand-muted mt-0.5">Grayscale tensor slices extracted from CNN layer 4_f3</p>
              </div>
              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/15 uppercase">
                Raw weights
              </span>
            </div>

            {/* Feature maps grid */}
            <div className="grid grid-cols-4 gap-2.5">
              {featureMaps}
            </div>
          </div>

          <p className="text-[10px] font-mono text-brand-muted leading-relaxed mt-4 pt-4 border-t border-white/5 text-center">
            Neural maps updated in real-time under GPU thread ID CUDA-11.
          </p>
        </div>

        {/* Central interactive charting tabs (Embedding vs Benchmarks) */}
        <div className="lg:col-span-7 bg-[#0E1323]/80 border border-white/10 p-6 rounded-2xl glass-panel flex flex-col justify-between min-h-[460px]">
          <div>
            {/* Nav sub-tabs */}
            <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
              <div className="flex gap-1 bg-[#050816]/60 border border-white/5 p-1 rounded-lg">
                <button
                  onClick={() => setActiveSubTab('embedding')}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                    activeSubTab === 'embedding'
                      ? 'bg-blue-600/20 border border-blue-500/35 text-white'
                      : 'text-brand-muted hover:text-white'
                  }`}
                >
                  Embedding Space
                </button>
                <button
                  onClick={() => setActiveSubTab('benchmark')}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                    activeSubTab === 'benchmark'
                      ? 'bg-blue-600/20 border border-blue-500/35 text-white'
                      : 'text-brand-muted hover:text-white'
                  }`}
                >
                  Validation Benchmarks
                </button>
              </div>
              <Database className="w-4.5 h-4.5 text-brand-muted" />
            </div>

            {/* CHART: EMBEDDING SPACE SCATTER */}
            {activeSubTab === 'embedding' && (
              <div className="space-y-4">
                <p className="text-xs text-brand-muted leading-relaxed">
                  2D Projection of global CLIP-space image embedding vectors. Observe how generative models cluster in distinct regions, with the current specimen (pulsating yellow crosshair) plotted dynamically inside the **FLUX.1** quadrant.
                </p>

                <div className="w-full h-[240px] bg-[#050816]/40 rounded-xl border border-white/5 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                      <XAxis type="number" dataKey="x" name="Dimension A" stroke="rgba(255,255,255,0.2)" fontSize={9} />
                      <YAxis type="number" dataKey="y" name="Dimension B" stroke="rgba(255,255,255,0.2)" fontSize={9} />
                      <ZAxis type="number" dataKey="z" range={[40, 400]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0E1323', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff', fontSize: '10px' }}
                        itemStyle={{ color: '#60A5FA', fontSize: '10px' }}
                      />
                      <Scatter name="Clusters" data={embeddingData} fill="#3b82f6">
                        {embeddingData.map((entry, index) => {
                          const isSpecimen = entry.group === 'Current Specimen';
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={
                                isSpecimen 
                                  ? '#F59E0B' 
                                  : entry.group.includes('FLUX') 
                                  ? '#38BDF8' 
                                  : entry.group.includes('Real') 
                                  ? '#10B981' 
                                  : '#EF4444'
                              } 
                            />
                          );
                        })}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex gap-4 items-center justify-center text-[10px] font-mono text-brand-muted">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Real Specimen</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400" /> FLUX.1 Cluster</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /> Generative Noise</span>
                  <span className="flex items-center gap-1.5 animate-pulse"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Current Case</span>
                </div>
              </div>
            )}

            {/* CHART: BENCHMARK ROC CURVE */}
            {activeSubTab === 'benchmark' && (
              <div className="space-y-4">
                <p className="text-xs text-brand-muted leading-relaxed">
                  Receiver Operating Characteristic (ROC) validating the model’s True Positive vs False Positive rates. Model Area Under Curve (AUC) is certified at <span className="text-white font-bold">AUC = 0.984</span>.
                </p>

                <div className="w-full h-[240px] bg-[#050816]/40 rounded-xl border border-white/5 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rocCurve} margin={{ top: 10, right: 10, bottom: 10, left: -25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                      <XAxis dataKey="fpr" stroke="rgba(255,255,255,0.2)" fontSize={9} label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5, fill: '#94A3B8', fontSize: '9px' }} />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', offset: 10, fill: '#94A3B8', fontSize: '9px' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0E1323', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px' }}
                        itemStyle={{ color: '#a855f7', fontSize: '10px' }}
                      />
                      <Area type="monotone" dataKey="tpr" stroke="#a855f7" fillOpacity={0.1} fill="url(#rocAreaGrad)" />
                      <defs>
                        <linearGradient id="rocAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="p-2 bg-[#050816] rounded-lg border border-white/5">
                    <span className="text-[9px] font-mono text-brand-muted block uppercase">ACCURACY</span>
                    <span className="text-sm font-mono font-bold text-white">98.2%</span>
                  </div>
                  <div className="p-2 bg-[#050816] rounded-lg border border-white/5">
                    <span className="text-[9px] font-mono text-brand-muted block uppercase">F1 SCORE</span>
                    <span className="text-sm font-mono font-bold text-white">0.978</span>
                  </div>
                  <div className="p-2 bg-[#050816] rounded-lg border border-white/5">
                    <span className="text-[9px] font-mono text-brand-muted block uppercase">PRECISION</span>
                    <span className="text-sm font-mono font-bold text-white">99.1%</span>
                  </div>
                  <div className="p-2 bg-[#050816] rounded-lg border border-white/5">
                    <span className="text-[9px] font-mono text-brand-muted block uppercase">RECALL</span>
                    <span className="text-sm font-mono font-bold text-white">96.5%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/5 pt-3 mt-4 text-[10px] font-mono text-brand-muted text-center flex justify-between">
            <span>MODEL_FINGERPRINT_REGISTRY: RES_V4</span>
            <span>SYSTEM_NODE: ONLINE_STABLE</span>
          </div>
        </div>

      </div>

    </div>
  );
}
