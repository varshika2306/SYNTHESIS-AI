/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ShieldAlert, Zap, Layers, RefreshCw, Compass, Binary } from 'lucide-react';
import { Case } from '../types';

interface FingerprintEngineProps {
  activeCase: Case;
}

export default function FingerprintEngine({ activeCase }: FingerprintEngineProps) {
  const fp = activeCase.fingerprints;

  const signatures = [
    { name: 'Texture Signature', val: fp.textureSignature, desc: 'Co-occurrence structural fingerprint', icon: <Layers className="w-4 h-4 text-blue-400" /> },
    { name: 'Noise Signature', val: fp.noiseSignature, desc: 'Stochastic pixel sensor covariance', icon: <Binary className="w-4 h-4 text-cyan-400" /> },
    { name: 'Reflection Signature', val: fp.reflectionSignature, desc: 'Planar surface highlight coherence', icon: <Zap className="w-4 h-4 text-yellow-400" /> },
    { name: 'Frequency Signature', val: fp.frequencySignature, desc: 'Spectral distribution coefficients', icon: <Compass className="w-4 h-4 text-purple-400" /> },
    { name: 'Compression Signature', val: fp.compressionSignature, desc: 'Double JPEG matrix quantization', icon: <Binary className="w-4 h-4 text-emerald-400" /> },
    { name: 'Prompt Artifact Signature', val: fp.promptArtifactSignature, desc: 'Generative semantic model bias', icon: <Layers className="w-4 h-4 text-pink-400" /> },
    { name: 'Lighting Signature', val: fp.lightingSignature, desc: 'Surface normal shadow mismatch', icon: <Zap className="w-4 h-4 text-rose-400" /> }
  ];

  // Gauges for Authenticity Index
  const gauges = [
    { label: 'Authenticity Rating', value: activeCase.authenticityScore, color: 'stroke-red-500', text: 'text-red-400', desc: 'Probability of organic origin' },
    { label: 'Trust Index', value: activeCase.trustIndex, color: 'stroke-blue-500', text: 'text-blue-400', desc: 'Consolidated network credibility' },
    { label: 'Evidence Strength', value: activeCase.evidenceStrength, color: 'stroke-cyan-500', text: 'text-cyan-400', desc: 'Forensic signal-to-noise ratio' },
    { label: 'Risk Factor', value: activeCase.riskFactor, color: 'stroke-rose-500', text: 'text-rose-400', desc: 'Target authentication threat' },
    { label: 'Integrity Index', value: activeCase.integrityIndex, color: 'stroke-emerald-500', text: 'text-emerald-400', desc: 'Traceability of pixel transformations' },
    { label: 'Consensus Agreement', value: activeCase.consensusAgreement, color: 'stroke-purple-500', text: 'text-purple-400', desc: 'Neural model validation alignment' }
  ];

  return (
    <div className="space-y-6">
      
      {/* AUTHENTICITY INDEX - Beautiful radial circular gauges */}
      <div className="bg-[#0E1323]/80 border border-white/10 p-6 rounded-2xl glass-panel">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-base font-display font-semibold text-white">Forensic Authenticity Index</h3>
            <p className="text-xs text-brand-muted">Aggregated confidence analytics from multi-layered deep learning detectors</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {gauges.map((gauge) => {
            const radius = 32;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (gauge.value / 100) * circumference;

            return (
              <div key={gauge.label} className="bg-[#050816]/60 p-4 rounded-xl border border-white/5 flex flex-col items-center text-center relative overflow-hidden group hover:border-white/10 transition-colors">
                
                {/* SVG Dial Gauge */}
                <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      className="stroke-white/5"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    {/* Active Circle with stroke dash animation */}
                    <motion.circle
                      cx="40"
                      cy="40"
                      r={radius}
                      className={gauge.color}
                      strokeWidth="5"
                      fill="transparent"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-sm font-mono font-bold text-white`}>
                      {gauge.value.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <h4 className="text-[11px] font-mono font-bold text-white uppercase tracking-wide">
                  {gauge.label.split(' ')[0]} <span className="opacity-60">{gauge.label.split(' ')[1] || ''}</span>
                </h4>
                <p className="text-[9px] text-brand-muted mt-1 leading-snug">
                  {gauge.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* SIGNATURE FINGERPRINT MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Core details list */}
        <div className="lg:col-span-7 bg-[#0E1323]/80 border border-white/10 p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
              <div>
                <h3 className="text-base font-display font-semibold text-white">Digital Fingerprint Engine</h3>
                <p className="text-xs text-brand-muted">Unique biometric code tags decoded from camera and model matrices</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-brand-muted block uppercase">FINGERPRINT HASH</span>
                <span className="text-xs font-mono text-cyan-400 font-semibold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/15">
                  {activeCase.fingerprintHash.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {signatures.map((sig) => (
                <div key={sig.name} className="p-3 bg-[#050816]/85 border border-white/5 rounded-xl flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5 flex items-center justify-center">
                    {sig.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">{sig.name}</h4>
                    <p className="text-[11px] font-mono text-cyan-400 font-semibold mt-1">{sig.val}</p>
                    <p className="text-[9px] text-brand-muted mt-0.5">{sig.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center text-[10px] font-mono text-brand-muted">
            <span>VERIFICATION_METHOD: PRNU_COVARIANCE_MATRIX_v3</span>
            <span>NODE_LATENCY: ~11ms</span>
          </div>
        </div>

        {/* Visual Signature Microscope */}
        <div className="lg:col-span-5 bg-[#0E1323]/80 border border-white/10 p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-mono font-bold tracking-widest text-brand-accent uppercase">
                Visual Consistency Map
              </h3>
              <span className="text-[10px] font-mono text-green-400 bg-green-950/40 px-1.5 py-0.5 rounded border border-green-500/15 uppercase">
                Live Scanner
              </span>
            </div>

            <div className="relative w-full h-[220px] bg-[#050816]/80 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
              {/* Scanline effect */}
              <motion.div
                animate={{ y: [-110, 110, -110] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-0.5 bg-cyan-400/50 shadow-[0_0_10px_#22d3ee] z-10 pointer-events-none"
              />

              {/* Grid backdrop */}
              <div className="absolute inset-0 cyber-grid opacity-30" />

              {/* Abstract structural matrix visualizer */}
              <div className="relative w-36 h-36 border border-white/15 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-28 h-28 border border-dashed border-cyan-500/30 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-20 h-20 border border-dashed border-blue-500/40 rounded-full"
                />
                
                {/* Visual score */}
                <div className="text-center z-10">
                  <span className="text-2xl font-mono font-bold text-white tracking-wider">
                    {fp.visualConsistency}%
                  </span>
                  <p className="text-[9px] font-mono text-brand-muted uppercase tracking-widest mt-0.5">Alignment</p>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-white/5 p-3 rounded-xl border border-white/5">
              <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
                Spatial noise mapping
              </h4>
              <p className="text-[10px] text-brand-muted leading-relaxed">
                Mismatched stochastics detected in the high-frequency quadrants. Real camera arrays exhibit linear CCD noise distribution, whereas this specimen displays latent blockiness index 0.441.
              </p>
            </div>
          </div>

          <div className="text-[9px] font-mono text-brand-muted text-center pt-3 mt-4 border-t border-white/5">
            Decrypted signature code certified under ISO/IEC 27001 forensics.
          </div>
        </div>

      </div>

    </div>
  );
}
