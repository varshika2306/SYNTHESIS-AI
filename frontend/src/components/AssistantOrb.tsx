/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ChevronRight, Dna, ShieldAlert, FileText, Search, Activity, Cpu, Layers } from 'lucide-react';
import { AssistantMessage } from '../types';

interface AssistantOrbProps {
  onTriggerAction: (actionType: 'create_case' | 'compare_images' | 'open_case' | 'generate_passport' | 'research_mode' | 'search_evidence') => void;
}

export default function AssistantOrb({ onTriggerAction }: AssistantOrbProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: 'Greetings, Analyst. I am the Synthesis Investigation Intelligence Engine. I have mapped your active terminal. How shall we secure the system today?',
      timestamp: '10:22:34 UTC'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const assistantActions = [
    { label: '+ New Investigation', desc: 'Bootstrap a new forensic case wizard', icon: <ShieldAlert className="w-4 h-4 text-red-400" />, action: 'create_case' as const },
    { label: 'Upload Evidence', desc: 'Securely upload a new image specimen', icon: <Cpu className="w-4 h-4 text-cyan-400" />, action: 'create_case' as const },
    { label: 'Compare Images', desc: 'Compare multi-specimen textures side-by-side', icon: <Layers className="w-4 h-4 text-purple-400" />, action: 'compare_images' as const },
    { label: 'Research Mode', desc: 'Inspect raw network embedding vectors', icon: <Activity className="w-4 h-4 text-pink-400" />, action: 'research_mode' as const },
    { label: 'Recent Cases', desc: 'Browse the cryptographic archives', icon: <Search className="w-4 h-4 text-amber-400" />, action: 'search_evidence' as const },
    { label: 'Generate Passport', desc: 'Generate authorized cryptographic PDF', icon: <FileText className="w-4 h-4 text-rose-400" />, action: 'generate_passport' as const }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: AssistantMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: inputValue,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate smart forensic diagnostic responses
    setTimeout(() => {
      let responseText = "I have queried the digital DNA database. Anomaly signatures are within standard baseline parameters.";
      
      const lowerText = inputValue.toLowerCase();
      if (lowerText.includes('dna') || lowerText.includes('score')) {
        responseText = "Retrieving Digital DNA profiles. In most synthetic models, high-frequency spectral drops occur in the outer wave range. Check the DNA Lab for active plots.";
      } else if (lowerText.includes('dalle') || lowerText.includes('midjourney') || lowerText.includes('flux')) {
        responseText = "Genome signatures indicate typical adversarial noise patterns for that specific generator. I suggest generating a cryptographic Digital Passport for secure export.";
      } else if (lowerText.includes('case') || lowerText.includes('investigation')) {
        responseText = "Initializing new investigation templates. Select 'Create Investigation' from the panel shortcut list below to open the form window.";
      }

      const botMsg: AssistantMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  const handleActionClick = (action: typeof assistantActions[number]['action']) => {
    onTriggerAction(action);
    setIsOpen(false);
  };

  return (
    <>
      {/* Closed Pulsating ORB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            id="assistant-orb-trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer z-50 shadow-[0_0_30px_rgba(59,130,246,0.6)]"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #3b82f6 0%, #1d4ed8 50%, #1e1b4b 100%)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}
          >
            {/* Spinning orbital ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 pointer-events-none"
            />
            
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-12 h-12 rounded-full bg-cyan-500/20 blur-[5px] pointer-events-none"
            />

            <Sparkles className="w-6 h-6 text-cyan-200" />
            
            {/* Online indicator */}
            <div className="absolute top-0 right-1 w-3 h-3 bg-green-500 rounded-full border border-[#050816] shadow-lg animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Intelligent Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="assistant-orb-panel"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-6 right-6 w-[420px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-8rem)] bg-[#0E1323]/95 border border-white/10 rounded-2xl shadow-2xl glass-panel-heavy z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <Dna className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-white">Investigation Intelligence</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-mono text-brand-muted uppercase">Synthesis-AI Agent</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-brand-muted hover:text-white transition-colors flex items-center justify-center border border-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Log area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3.5">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white/5 text-brand-muted border border-white/5 rounded-bl-none font-mono'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] font-mono text-brand-muted/50 mt-1 px-1">
                    {msg.sender === 'user' ? 'Analyst' : 'Synthesis Engine'} • {msg.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Actions Panel */}
            <div className="px-4 py-3 border-t border-white/5 bg-black/20">
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-brand-accent block mb-2.5">
                Forensic Shortcuts
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {assistantActions.map((act) => (
                  <button
                    key={act.label}
                    onClick={() => handleActionClick(act.action)}
                    className="flex items-center justify-between text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center">
                        {act.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {act.label}
                        </h4>
                        <p className="text-[10px] text-brand-muted mt-0.5">
                          {act.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-brand-muted/50 group-hover:translate-x-0.5 group-hover:text-white transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-white/5 flex gap-2">
              <input
                id="assistant-chat-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask intelligence agent about DNA drops, noise bias..."
                className="flex-grow bg-[#050816] border border-white/10 text-xs rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
