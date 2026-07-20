/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Download, Printer, CheckCircle, QrCode, FileText, Lock } from 'lucide-react';
import { Case } from '../types';

interface DigitalPassportProps {
  activeCase: Case;
}

export default function DigitalPassport({ activeCase }: DigitalPassportProps) {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Printable certificate frame container */}
      <div className="bg-[#0E1323]/80 border border-white/10 p-6 rounded-2xl glass-panel flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-base font-display font-semibold text-white">Digital Forensic Passport</h3>
          <p className="text-xs text-brand-muted">Generate immutable cryptographic certificates suitable for digital evidence logs and research citation</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#1F2937]/80 hover:bg-[#1F2937] text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/10 cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4 text-brand-accent" />
            Print Certificate
          </button>
          <button
            onClick={() => alert("Securing certificate... Encrypting SHA passport logs. Download prepared successfully.")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-all shadow-lg shadow-blue-500/10"
          >
            <Download className="w-4 h-4" />
            Download Encrypted PDF
          </button>
        </div>
      </div>

      {/* CERTIFICATE SHEET */}
      <div 
        id="printable-passport-certificate"
        className="bg-[#0E1323] border-[3px] border-double border-white/20 p-8 rounded-3xl relative overflow-hidden text-white mx-auto max-w-3xl"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7), inset 0 0 40px rgba(96,165,250,0.05)'
        }}
      >
        {/* Holographic Guilloche background simulation using decorative SVGs */}
        <div className="absolute top-0 right-0 w-80 h-80 opacity-5 pointer-events-none transform translate-x-20 -translate-y-20">
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" className="text-cyan-400">
            {Array.from({ length: 20 }).map((_, i) => (
              <circle key={i} cx="100" cy="100" r={10 + i * 8} strokeWidth="1" />
            ))}
          </svg>
        </div>

        {/* Security watermark badge at bottom center */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none">
          <Shield className="w-48 h-48 text-blue-500" />
        </div>

        {/* Outer security border accent lines */}
        <div className="absolute top-2 left-2 right-2 bottom-2 border border-white/5 pointer-events-none rounded-2xl" />

        {/* Certificate Header */}
        <div className="border-b border-white/10 pb-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600/20 border-2 border-blue-500/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black tracking-widest uppercase">SYNTHESIS AI</h2>
              <p className="text-[9px] font-mono text-brand-accent tracking-[0.2em] uppercase">Digital DNA Verification Authority</p>
            </div>
          </div>
          <div className="text-right font-mono text-[10px] text-brand-muted">
            <div>CERTIFICATE NO: <span className="text-white font-semibold">SYN-PASS-{activeCase.id.split('-')[2]}</span></div>
            <div>TIMESTAMP: <span className="text-white">{activeCase.timestamp}</span></div>
          </div>
        </div>

        {/* Forensic core prediction layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 relative z-10">
          <div className="md:col-span-8 space-y-4">
            <div>
              <span className="text-[9px] font-mono text-brand-accent tracking-widest uppercase font-bold block">Specimen Verification Profile</span>
              <h3 className="text-lg font-display font-bold text-white mt-0.5">{activeCase.name}</h3>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">{activeCase.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-black/30 border border-white/5 rounded-xl">
                <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider block mb-1">Authenticity Index</span>
                <span className={`text-2xl font-mono font-bold ${activeCase.authenticityScore > 75 ? 'text-green-400' : 'text-red-400'}`}>
                  {activeCase.authenticityScore}%
                </span>
                <span className="text-[10px] font-mono text-brand-muted ml-1">/ 100%</span>
              </div>

              <div className="p-3.5 bg-black/30 border border-white/5 rounded-xl">
                <span className="text-[9px] font-mono text-brand-muted uppercase tracking-wider block mb-1">Consensus Rating</span>
                <span className="text-2xl font-mono font-bold text-cyan-400">
                  {activeCase.consensusAgreement}%
                </span>
                <span className="text-[10px] font-mono text-brand-muted ml-1">Agree</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col justify-between items-center bg-black/20 border border-white/5 rounded-2xl p-4 text-center">
            <QrCode className="w-20 h-20 text-white" />
            <div className="mt-2.5">
              <span className="text-[9px] font-mono text-brand-muted block uppercase">Cryptographic QR Node</span>
              <span className="text-[8px] font-mono text-blue-400 font-semibold uppercase block truncate w-32 mt-0.5">
                {activeCase.dnaHash}
              </span>
            </div>
          </div>
        </div>

        {/* Forensic DNA & Hash indices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10 pt-6 mb-8 relative z-10">
          <div>
            <h4 className="text-[10px] font-mono font-bold text-brand-accent uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Digital DNA Hash Index
            </h4>
            <div className="space-y-1.5 font-mono text-xs text-brand-muted">
              <div className="flex justify-between"><span>Texture Signature:</span><span className="text-white font-semibold">{activeCase.dnaScores.texture}%</span></div>
              <div className="flex justify-between"><span>Sensor Noise Vector:</span><span className="text-white font-semibold">{activeCase.dnaScores.noise}%</span></div>
              <div className="flex justify-between"><span>Spectral frequency drop:</span><span className="text-white font-semibold">{activeCase.dnaScores.frequency}%</span></div>
              <div className="flex justify-between"><span>Model attribution coefficient:</span><span className="text-white font-semibold">{activeCase.dnaScores.diffusion}%</span></div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-mono font-bold text-brand-accent uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Cryptographic Signatures
            </h4>
            <div className="space-y-1.5 font-mono text-[10px] text-brand-muted">
              <div className="bg-black/30 p-2 rounded border border-white/5">
                <span className="block text-white font-semibold">DNA_HASH:</span>
                <span className="break-all">{activeCase.dnaHash}</span>
              </div>
              <div className="bg-black/30 p-2 rounded border border-white/5">
                <span className="block text-white font-semibold">FINGERPRINT_HASH:</span>
                <span className="break-all">{activeCase.fingerprintHash}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analyst Notes & Signature lines */}
        <div className="border-t border-white/10 pt-6 relative z-10 flex flex-col md:flex-row justify-between gap-6">
          <div className="max-w-md">
            <h4 className="text-[10px] font-mono font-bold text-brand-accent uppercase tracking-widest mb-1.5">Analyst Verdict Remarks</h4>
            <p className="text-xs text-brand-muted leading-relaxed font-mono">
              {activeCase.analystNotes || 'Specimen forensic metrics verified. No generative model anomalies identified. Authentic organic matrix structures.'}
            </p>
          </div>

          <div className="w-48 text-right flex flex-col justify-between h-20 self-end border-l border-white/10 pl-4">
            <span className="text-[9px] font-mono text-brand-muted block uppercase">Lead Investigator</span>
            <div className="text-sm font-display font-bold italic text-white my-1 underline decoration-cyan-400 decoration-wavy">
              {activeCase.investigator}
            </div>
            <span className="text-[8px] font-mono text-cyan-400">CLEARED // SYN_SEC_A9</span>
          </div>
        </div>

      </div>

    </div>
  );
}
