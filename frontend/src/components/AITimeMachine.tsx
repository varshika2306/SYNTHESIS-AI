/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ChevronRight, CornerDownRight, HelpCircle, Activity } from 'lucide-react';
import { Case } from '../types';

interface AITimeMachineProps {
  activeCase: Case;
}

export default function AITimeMachine({ activeCase }: AITimeMachineProps) {
  const steps = activeCase.timeMachineSteps;
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeStep = steps[activeStepIndex];

  return (
    <div className="bg-[#0E1323]/80 border border-white/10 p-6 rounded-2xl glass-panel">
      
      {/* Header bar */}
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-base font-display font-semibold text-white">AI Generation Time Machine</h3>
          <p className="text-xs text-brand-muted">Timeline reconstruction of estimated generative transformations inside pixel spaces</p>
        </div>
        
        {/* Play controls */}
        <div className="flex gap-1 bg-[#050816]/60 border border-white/5 p-1 rounded-lg">
          <button
            onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
            className="p-1.5 rounded text-xs font-mono text-brand-muted hover:text-white cursor-pointer"
          >
            Prev
          </button>
          <button
            onClick={() => {
              if (activeStepIndex === steps.length - 1) {
                setActiveStepIndex(0);
              } else {
                setActiveStepIndex(activeStepIndex + 1);
              }
            }}
            className="p-1.5 rounded text-xs font-mono text-brand-muted hover:text-white cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Horizontal flowchart steps */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {steps.map((st, i) => {
              const isActive = i === activeStepIndex;
              const isPast = i < activeStepIndex;

              return (
                <div
                  key={st.phase}
                  onClick={() => setActiveStepIndex(i)}
                  className={`flex-grow p-3 rounded-xl border cursor-pointer transition-all ${
                    isActive
                      ? 'bg-blue-600/15 border-blue-500 shadow-lg'
                      : isPast
                      ? 'bg-white/5 border-blue-500/30 text-brand-muted'
                      : 'bg-white/5 border-white/5 text-brand-muted hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono tracking-widest uppercase">
                      Stage {i + 1}
                    </span>
                    <span className="text-[9px] font-mono opacity-60">{st.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white tracking-wide truncate">
                    {st.phase}
                  </h4>
                  {/* Timeline status indicator */}
                  <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${isActive ? 'bg-blue-500' : isPast ? 'bg-blue-400' : 'bg-transparent'}`}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Step Details Card */}
          <div className="bg-[#050816]/60 p-5 rounded-xl border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-mono text-brand-accent tracking-widest uppercase font-bold">
                  Forensic Reconstruction Active
                </span>
                <h4 className="text-base font-display font-bold text-white mt-1">
                  {activeStep.phase}
                </h4>
              </div>
              <span className="text-xs font-mono text-brand-muted">
                Status: <span className="text-green-400 font-semibold">{activeStep.status}</span>
              </span>
            </div>

            <p className="text-xs text-brand-muted leading-relaxed mb-4">
              {activeStep.description}
            </p>

            {/* Step parameters list */}
            <div className="border-t border-white/5 pt-4 space-y-2">
              <span className="text-[9px] font-mono font-bold text-white uppercase tracking-widest block mb-2">
                Decoded Parameters
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeStep.attributes.map((attr) => (
                  <div key={attr} className="p-2.5 bg-[#0E1323] rounded-lg border border-white/5 flex items-start gap-2">
                    <CornerDownRight className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] font-mono text-brand-muted break-all">
                      {attr}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Informational sidebar */}
        <div className="lg:col-span-4 bg-[#050816]/60 p-5 rounded-xl border border-white/5 flex flex-col justify-between h-full min-h-[300px]">
          <div>
            <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Diffusion Timeline Note
            </h4>
            <p className="text-[11px] text-brand-muted leading-relaxed">
              Generative models compile images asynchronously through step denoising. By reverse-engineering high-frequency gradients, SYNTHESIS AI models reconstruct the sequence of edits and upscalers used.
            </p>
          </div>

          <div className="mt-5 bg-white/5 p-3 rounded-lg border border-white/5 text-[10px] font-mono text-brand-muted">
            <span className="text-white font-bold block mb-1">Time Machine Audit Code</span>
            <span>TIMELINE_NODE_HASH_2026_X19</span>
          </div>
        </div>

      </div>

    </div>
  );
}
