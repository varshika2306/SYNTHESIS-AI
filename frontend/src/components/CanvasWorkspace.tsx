/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ZoomIn, ZoomOut, Move, Play, RefreshCw, Plus, ShieldAlert, CheckCircle, 
  Dna, Cpu, FileText, BarChart2, Server, Clock, AlertTriangle, X, ChevronRight, 
  CornerDownRight, Sparkles, Layers, FileCheck, HelpCircle, Eye
} from 'lucide-react';
import { Case, FloatingWindow, DockTab } from '../types';
import NewInvestigationWizard from './NewInvestigationWizard';

interface CanvasWorkspaceProps {
  cases: Case[];
  activeCaseId: string;
  onSelectCase: (id: string) => void;
  onCreateCase: (newCase: Case) => void;
  onNavigateTab: (tab: DockTab) => void;
  // External control triggers
  newInvestigationTriggered: boolean;
  onResetNewInvestigationTrigger: () => void;
}

export default function CanvasWorkspace({ 
  cases, 
  activeCaseId, 
  onSelectCase, 
  onCreateCase,
  onNavigateTab,
  newInvestigationTriggered,
  onResetNewInvestigationTrigger
}: CanvasWorkspaceProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Custom states for moving windows
  const [windows, setWindows] = useState<FloatingWindow[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [draggedWindowId, setDraggedWindowId] = useState<string | null>(null);
  const [windowDragOffset, setWindowDragOffset] = useState({ x: 0, y: 0 });

  // Scan replay sequence states
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const scanLogs = [
    'Scanning Image Specimen...',
    'Performing Fourier Frequency Analysis...',
    'Analyzing Microtexture Signature Matrix...',
    'Extracting Digital DNA Strands...',
    'Matching Sensor Fingerprint Signatures...',
    'Invoking Multi-Model Consensus Intelligence...',
    'Generating Explainability CAM Maps...',
    'Building Cryptographic Passport...',
    'Forensic Investigation Complete.'
  ];

  // Forms
  const [showNewCaseWindow, setShowNewCaseWindow] = useState(false);
  const [newCaseName, setNewCaseName] = useState('');
  const [newCaseDesc, setNewCaseDesc] = useState('');
  const [newCasePriority, setNewCasePriority] = useState<Case['priority']>('HIGH');
  const [newCaseInvestigator, setNewCaseInvestigator] = useState('Analyst Varshika');
  const [newCaseImage, setNewCaseImage] = useState('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600');

  const containerRef = useRef<HTMLDivElement>(null);

  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0];

  // Initialize basic widgets
  useEffect(() => {
    setWindows([
      { id: 'recent_cases', type: 'cases', title: 'Recent Investigations', x: 40, y: 30, width: 340, height: 260, isMaximized: false, zIndex: 10 },
      { id: 'threat_monitor', type: 'analytics', title: 'Threat Intelligence Monitor', x: 400, y: 30, width: 320, height: 260, isMaximized: false, zIndex: 10 },
      { id: 'model_health', type: 'settings', title: 'Live Model Core Status', x: 740, y: 30, width: 320, height: 160, isMaximized: false, zIndex: 10 },
      { id: 'activity_timeline', type: 'settings', title: 'Investigation Activity Log', x: 40, y: 310, width: 680, height: 260, isMaximized: false, zIndex: 10 },
      { id: 'evidence_board', type: 'mission_control', title: 'Digital Evidence Board (Figma Workspace)', x: 740, y: 210, width: 440, height: 360, isMaximized: false, zIndex: 15 }
    ]);
  }, []);

  // Handle external new case trigger (e.g. from bottom assistant)
  useEffect(() => {
    if (newInvestigationTriggered) {
      setShowNewCaseWindow(true);
      onResetNewInvestigationTrigger();
    }
  }, [newInvestigationTriggered, onResetNewInvestigationTrigger]);

  // Infinite Canvas Pan Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-handle') || (e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
      return; // let window dragging or interactive actions handle it
    }
    setIsPanning(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    } else if (draggedWindowId) {
      // Handle floating window drag
      const currentX = e.clientX - windowDragOffset.x;
      const currentY = e.clientY - windowDragOffset.y;
      
      setWindows(prev => prev.map(w => 
        w.id === draggedWindowId 
          ? { ...w, x: Math.max(10, Math.min(1800, currentX)), y: Math.max(10, Math.min(1000, currentY)) }
          : w
      ));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedWindowId(null);
  };

  // Window Drag triggers
  const startWindowDrag = (e: React.MouseEvent, winId: string) => {
    e.stopPropagation();
    const win = windows.find(w => w.id === winId);
    if (!win) return;
    
    // Bring window to top z-index
    const maxZ = Math.max(...windows.map(w => w.zIndex), 10);
    setWindows(prev => prev.map(w => 
      w.id === winId ? { ...w, zIndex: maxZ + 1 } : w
    ));

    setDraggedWindowId(winId);
    setWindowDragOffset({
      x: e.clientX - win.x,
      y: e.clientY - win.y
    });
  };

  // Triggering the Scan replay sequences
  const runForensicReplay = () => {
    setIsScanning(true);
    setScanStep(0);
    const interval = setInterval(() => {
      setScanStep(prev => {
        if (prev < scanLogs.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
          }, 800);
          return prev;
        }
      });
    }, 700);
  };

  const handleCreateCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseName.trim()) return;

    // Create a robust case structure
    const randomHash = () => Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const created: Case = {
      id: `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newCaseName,
      description: newCaseDesc,
      investigator: newCaseInvestigator,
      priority: newCasePriority,
      status: 'COMPLETE',
      evidenceName: 'evidence_upload_specimen.jpg',
      evidenceUrl: newCaseImage,
      timestamp: 'Just now',
      authenticityScore: Math.floor(10 + Math.random() * 25), // simulated synthetic profile
      trustIndex: Math.floor(5 + Math.random() * 15),
      evidenceStrength: Math.floor(80 + Math.random() * 15),
      riskFactor: Math.floor(85 + Math.random() * 12),
      integrityIndex: Math.floor(10 + Math.random() * 20),
      consensusAgreement: 100,
      dnaScores: {
        texture: Math.floor(10 + Math.random() * 20),
        noise: Math.floor(5 + Math.random() * 15),
        lighting: Math.floor(15 + Math.random() * 20),
        edges: Math.floor(12 + Math.random() * 25),
        frequency: Math.floor(8 + Math.random() * 18),
        compression: Math.floor(25 + Math.random() * 35),
        diffusion: Math.floor(5 + Math.random() * 10),
        promptArtifacts: Math.floor(12 + Math.random() * 25)
      },
      fingerprints: {
        textureSignature: `DIFF_FRACTAL_NEW_${Math.floor(100 + Math.random() * 899)}`,
        noiseSignature: `CCD_STOCHASTIC_COV_${Math.floor(10 + Math.random() * 89)}`,
        reflectionSignature: 'ASYMMETRIC_ELLIPTIC_MISMATCH',
        frequencySignature: 'SPECTRAL_COMB_FILTER_DECAY',
        compressionSignature: 'JPEG_DOUBLE_MATRIX',
        promptArtifactSignature: 'CLIP_LATENT_SPACE_MATCH',
        lightingSignature: 'ELLIPTIC_SHADOW_MISMATCH',
        visualConsistency: Math.floor(10 + Math.random() * 20)
      },
      consensusModels: [
        { name: 'ResNet50_DNA', prediction: 'SYNTHETIC', confidence: 99.4, agreement: true, inferenceTime: 12, attentionMap: 'CAM_LAYER_4' },
        { name: 'EfficientNet_B7_V4', prediction: 'SYNTHETIC', confidence: 98.9, agreement: true, inferenceTime: 23, attentionMap: 'CAM_MBLOCK_12' },
        { name: 'MobileNet_EdgeAI', prediction: 'SYNTHETIC', confidence: 97.5, agreement: true, inferenceTime: 7, attentionMap: 'CAM_CONV_OUT' },
        { name: 'VisionTransformer_L16', prediction: 'SYNTHETIC', confidence: 99.8, agreement: true, inferenceTime: 33, attentionMap: 'VIT_ATTN_HEAD_8' }
      ],
      genomeAttribution: {
        stableDiffusion: 12,
        midjourney: 15,
        dalle: 8,
        flux: 58,
        firefly: 3,
        ideogram: 2,
        leonardo: 2
      },
      timeMachineSteps: [
        { phase: 'Textual Prompt Decoding', status: 'COMPLETED', description: 'Extracted semantic tags from forensic metadata queues.', timestamp: '10:22:34', attributes: ['CFG: 7.5', 'Steps: 30'] },
        { phase: 'Latent Space Diffusion', status: 'COMPLETED', description: 'Unrolled Euler flow steps to recreate canvas textures.', timestamp: '10:22:35', attributes: ['Sampler: FlowMatch'] }
      ],
      analystNotes: 'Initial scan displays extensive flow-matching artifacts around texture gradients. Sub-surface lighting vectors reveal physical inconsistencies. Synthetic generation confirmed.',
      dnaHash: `dna_hash_${randomHash()}`,
      fingerprintHash: `fp_sig_${randomHash().substring(0, 14)}`
    };

    onCreateCase(created);
    setShowNewCaseWindow(false);
    
    // Clear out form fields
    setNewCaseName('');
    setNewCaseDesc('');
    
    // Launch scanning replay!
    runForensicReplay();
  };

  const getWindowContent = (win: FloatingWindow) => {
    switch (win.id) {
      case 'recent_cases':
        return (
          <div className="p-4 space-y-2.5 overflow-y-auto h-[calc(100%-40px)]">
            {cases.map((c) => (
              <div 
                key={c.id}
                onClick={() => onSelectCase(c.id)}
                className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  c.id === activeCaseId 
                    ? 'bg-blue-600/15 border-blue-500 text-white' 
                    : 'bg-white/5 border-white/5 text-brand-muted hover:bg-white/10'
                }`}
              >
                <div>
                  <h4 className="text-xs font-semibold tracking-wide text-white">{c.name}</h4>
                  <p className="text-[10px] font-mono mt-0.5">{c.id} • {c.priority}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${c.authenticityScore > 75 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs font-mono font-bold">{c.authenticityScore}%</span>
                </div>
              </div>
            ))}
          </div>
        );
      case 'threat_monitor':
        return (
          <div className="p-4 space-y-3.5 h-[calc(100%-40px)] overflow-y-auto">
            <div className="flex items-center justify-between p-2.5 bg-red-950/20 border border-red-500/25 rounded-xl text-red-300">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-xs font-bold font-mono">CRITICAL OUTFLOW ALERT</h5>
                  <p className="text-[10px] mt-0.5">Detected coordinated deepfake biometric bypass signatures targeting bank scans.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-mono text-brand-muted">
                <span>Threat node lookup:</span>
                <span className="text-white">Active</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono text-brand-muted">
                <span>Authentication block lists:</span>
                <span className="text-white">Node 908-FLUX</span>
              </div>
            </div>
          </div>
        );
      case 'model_health':
        return (
          <div className="p-4 space-y-3 h-[calc(100%-40px)] overflow-y-auto font-mono text-xs text-brand-muted">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-blue-400" /> ResNet50_DNA Node:</span>
              <span className="text-green-400 font-bold">ONLINE_STABLE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-cyan-400" /> EfficientNet_V4:</span>
              <span className="text-green-400 font-bold">ONLINE_STABLE</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-purple-400" /> ViT Attention Layer:</span>
              <span className="text-green-400 font-bold">ONLINE_STABLE</span>
            </div>
          </div>
        );
      case 'activity_timeline':
        return (
          <div className="p-4 space-y-3.5 h-[calc(100%-40px)] overflow-y-auto">
            <div className="border-l-2 border-blue-500/30 pl-4 ml-2 space-y-4">
              <div className="relative">
                <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                <span className="text-[9px] font-mono text-brand-muted">14:24 UTC</span>
                <h5 className="text-xs font-semibold text-white mt-0.5">Created case Opus-Alpha Biometric Alteration</h5>
                <p className="text-[10px] text-brand-muted mt-0.5">Specimen bypass detected on facial scanner arrays.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-[9px] font-mono text-brand-muted">09:12 UTC</span>
                <h5 className="text-xs font-semibold text-white mt-0.5">Bosphorus Satellite case compiled</h5>
                <p className="text-[10px] text-brand-muted mt-0.5">DALL-E 3 insertion identified inside cargo traffic lane matrices.</p>
              </div>
            </div>
          </div>
        );
      case 'evidence_board':
        return (
          <div className="p-4 h-[calc(100%-40px)] flex flex-col justify-between">
            <div className="space-y-3">
              <p className="text-xs text-brand-muted leading-relaxed">
                The signature Digital Evidence Board links the active investigation image specimen directly with its DNA helix strings, PRNU fingerprints, and final certificates.
              </p>

              {/* Connected node visual graph */}
              <div className="bg-[#050816]/60 p-3 rounded-xl border border-white/5 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-white font-bold uppercase">Evidence Specimen:</span>
                  <span className="text-cyan-400">{activeCase.evidenceName}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-white font-bold uppercase">Linked Signatures:</span>
                  <span className="text-purple-400">DNA, PRNU, Passport</span>
                </div>
              </div>
            </div>

            <button
              onClick={runForensicReplay}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl cursor-pointer text-xs flex items-center justify-center gap-2 transition-colors mt-4"
            >
              <RefreshCw className="w-4 h-4" />
              Re-scan Specimen Anomaly Pipeline
            </button>
          </div>
        );
      default:
        return <div className="p-4 text-xs text-brand-muted font-mono">Workspace module online.</div>;
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] bg-[#050816]/30 overflow-hidden select-none border border-white/5 rounded-2xl">
      
      {cases.length === 0 ? (
        /* ONBOARDING EMPTY STATE FOR FIRST TIME USERS */
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-[#050816]/95 z-25">
          <div className="absolute inset-0 cyber-grid-dots opacity-40 pointer-events-none" />
          
          <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
            {/* Pulsating glow */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-44 h-44 rounded-full bg-blue-500/10 border border-blue-500/20 blur-xl"
            />
            {/* Simulated orbital radar rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              className="absolute w-36 h-36 rounded-full border border-dashed border-cyan-400/25"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              className="absolute w-28 h-28 rounded-full border border-dashed border-purple-500/20"
            />
            <div className="w-20 h-20 rounded-full bg-[#0E1323] border border-white/10 flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.25)] relative z-10">
              <Dna className="w-9 h-9 text-cyan-400 animate-pulse" />
            </div>
            
            {/* Orbit nodes */}
            <div className="absolute top-6 left-12 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)] animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="absolute bottom-10 right-6 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-bounce" style={{ animationDelay: '0.7s' }} />
          </div>

          <h3 className="text-base font-display font-bold text-white tracking-widest uppercase glow-text-blue">
            No Investigations Yet
          </h3>
          <p className="text-xs text-brand-muted max-w-md mt-2.5 leading-relaxed font-mono">
            Create your first Digital DNA investigation to begin analyzing AI-generated images.
          </p>

          <button
            onClick={() => setShowNewCaseWindow(true)}
            className="mt-8 flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-500/15 cursor-pointer transition-all hover:scale-[1.03]"
          >
            <Plus className="w-4.5 h-4.5" />
            Start First Investigation
          </button>
        </div>
      ) : (
        /* ACTIVE GRID WORKSPACE */
        <>
          {/* Infinite Canvas background grid layer */}
          <div 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="absolute inset-0 cyber-grid-dots cursor-grab active:cursor-grabbing"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              transition: isPanning ? 'none' : 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Dynamic evidence board visual connections if Case is active */}
            <svg className="absolute inset-0 w-[2400px] h-[1400px] pointer-events-none z-0">
              <defs>
                <linearGradient id="glowLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              
              {/* Connecting bezier paths linking windows dynamically */}
              {windows.length >= 2 && (
                <>
                  {/* Line linking recent cases to evidence board */}
                  <motion.path
                    d={`M ${windows[0]?.x + 170} ${windows[0]?.y + 130} C ${windows[0]?.x + 250} ${windows[0]?.y + 130}, ${windows[4]?.x - 50} ${windows[4]?.y + 180}, ${windows[4]?.x} ${windows[4]?.y + 180}`}
                    fill="none"
                    stroke="url(#glowLineGrad)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    animate={{ strokeDashoffset: [-20, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                  {/* Line linking activity timeline to evidence board */}
                  <motion.path
                    d={`M ${windows[3]?.x + 340} ${windows[3]?.y + 130} C ${windows[3]?.x + 450} ${windows[3]?.y + 130}, ${windows[4]?.x - 50} ${windows[4]?.y + 240}, ${windows[4]?.x} ${windows[4]?.y + 240}`}
                    fill="none"
                    stroke="url(#glowLineGrad)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </>
              )}

              {/* Dynamic specimen node connectors */}
              {activeCase && (
                <>
                  {[
                    { x: 1300, y: 150 }, // Digital DNA
                    { x: 1650, y: 150 }, // Fingerprint
                    { x: 1720, y: 310 }, // Consensus
                    { x: 1650, y: 470 }, // Explainability
                    { x: 1300, y: 470 }, // Genome Attribution
                    { x: 1180, y: 310 }, // Authenticity Index
                    { x: 1475, y: 110 }  // Digital Passport
                  ].map((pt, index) => (
                    <motion.line
                      key={index}
                      x1="1475"
                      y1="310"
                      x2={pt.x}
                      y2={pt.y}
                      stroke="url(#orbitGrad)"
                      strokeWidth="1.5"
                      strokeDasharray="5 5"
                      animate={{ strokeDashoffset: [0, -20] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    />
                  ))}
                </>
              )}
            </svg>

            {/* Windows rendering on canvas */}
            {windows.map((win) => (
              <div
                key={win.id}
                style={{
                  position: 'absolute',
                  left: `${win.x}px`,
                  top: `${win.y}px`,
                  width: `${win.width}px`,
                  height: `${win.height}px`,
                  zIndex: win.zIndex,
                }}
                className="bg-[#0E1323]/95 border border-white/10 rounded-2xl glass-panel shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Header / Window drag handle */}
                <div 
                  onMouseDown={(e) => startWindowDrag(e, win.id)}
                  className="window-handle bg-white/5 border-b border-white/5 px-4 py-2.5 flex items-center justify-between cursor-move select-none"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500/40 border border-blue-500/20" />
                    <span className="text-xs font-mono font-semibold text-white tracking-wide">{win.title}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => {
                        if (win.type === 'cases') onNavigateTab('cases');
                        else if (win.type === 'analytics') onNavigateTab('passport');
                        else if (win.type === 'mission_control') onNavigateTab('explain_studio');
                      }}
                      className="w-5 h-5 rounded hover:bg-white/5 text-brand-muted hover:text-white flex items-center justify-center border border-transparent hover:border-white/5 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content area */}
                {getWindowContent(win)}
              </div>
            ))}

            {/* HIGH-FIDELITY ACTIVE EVIDENCE NODE NETWORK */}
            {activeCase && (
              <div 
                style={{
                  position: 'absolute',
                  left: '1100px',
                  top: '50px',
                  width: '750px',
                  height: '520px',
                  zIndex: 8,
                  pointerEvents: 'none'
                }}
                className="relative"
              >
                {/* Central Evidence Node */}
                <motion.div
                  style={{
                    position: 'absolute',
                    left: '325px',
                    top: '160px',
                    width: '150px',
                    height: '150px',
                    pointerEvents: 'auto'
                  }}
                  className="bg-[#0E1323]/95 border-2 border-blue-500 rounded-full flex flex-col items-center justify-center p-2 shadow-2xl relative cursor-pointer group"
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="absolute inset-0 rounded-full border border-blue-400/40 animate-ping" style={{ animationDuration: '3s' }} />
                  
                  <img 
                    src={activeCase.evidenceUrl} 
                    alt="Active Evidence" 
                    className="w-full h-full object-cover rounded-full saturate-75 group-hover:saturate-100 transition-all border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Badge */}
                  <div className="absolute -bottom-2 bg-blue-600 border border-blue-400/30 text-white font-mono font-bold text-[8px] px-2.5 py-0.5 rounded-full uppercase whitespace-nowrap shadow-xl">
                    Score: {activeCase.authenticityScore}%
                  </div>
                </motion.div>

                {/* Connected Orbiting Sub-modules */}
                {[
                  { label: '🧬 Digital DNA', desc: 'Noise Spectrum Matrix', icon: <Cpu className="w-4 h-4 text-cyan-400" />, x: 150, y: 100, tab: 'dna_lab' },
                  { label: '🔍 Fingerprint Engine', desc: 'Sensor Noise Signature', icon: <Dna className="w-4 h-4 text-blue-400" />, x: 500, y: 100, tab: 'dna_lab' },
                  { label: '🧠 Consensus Intelligence', desc: 'Voting Inference Score', icon: <Layers className="w-4 h-4 text-purple-400" />, x: 570, y: 260, tab: 'explain_studio' },
                  { label: '🔥 Explainability Studio', desc: 'GradCAM Act. Weights', icon: <Sparkles className="w-4 h-4 text-pink-400" />, x: 500, y: 420, tab: 'explain_studio' },
                  { label: '🌐 Generator Attribution', desc: 'Generative Models Match', icon: <BarChart2 className="w-4 h-4 text-indigo-400" />, x: 150, y: 420, tab: 'dna_lab' },
                  { label: '📊 Authenticity Index', desc: 'Composite Integrity index', icon: <ShieldAlert className="w-4 h-4 text-emerald-400" />, x: 30, y: 260, tab: 'analytics' },
                  { label: '🛂 Digital Passport', desc: 'Cryptographic PDF Cert', icon: <FileCheck className="w-4 h-4 text-rose-400" />, x: 325, y: 20, tab: 'passport' }
                ].map((node, idx) => (
                  <motion.div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      pointerEvents: 'auto'
                    }}
                    className="bg-[#0E1323]/95 hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-3 flex items-center gap-3 cursor-pointer shadow-xl transition-all text-xs text-white max-w-[190px]"
                    whileHover={{ scale: 1.05, y: -2 }}
                    onClick={() => onNavigateTab(node.tab as DockTab)}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                      {node.icon}
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-mono text-[10px] font-bold block text-white truncate leading-none">{node.label}</span>
                      <span className="text-[7px] text-brand-muted uppercase tracking-wider block mt-1 font-mono truncate">{node.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </div>

          {/* Floating Canvas controls */}
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-[#0E1323]/80 border border-white/10 p-2 rounded-xl glass-panel">
            <button
              onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-brand-muted hover:text-white transition-colors cursor-pointer border border-white/5"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-brand-muted hover:text-white transition-colors cursor-pointer border border-white/5"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-brand-muted hover:text-white transition-colors cursor-pointer border border-white/5 font-mono text-[10px]"
              title="Reset View"
            >
              100%
            </button>
            <button
              onClick={() => setShowNewCaseWindow(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Case
            </button>
          </div>

          {/* DYNAMIC HERO ACTION COCKPIT PANEL (Top Right) */}
          <div className="absolute top-4 right-4 z-30 max-w-sm bg-[#0E1323]/95 border border-white/10 p-4 rounded-2xl glass-panel shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-[9px] font-mono font-bold tracking-widest uppercase">Forensic Action Cockpit</span>
              </div>
              <h4 className="text-xs font-semibold text-white tracking-wide">Start New Investigation</h4>
              <p className="text-[10px] text-brand-muted mt-1 leading-relaxed">
                Create a new forensic case to analyze one or more images using the Digital DNA Intelligence Engine.
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowNewCaseWindow(true)}
                className="flex-grow flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold py-2.5 rounded-xl cursor-pointer transition-colors shadow-lg shadow-blue-500/15"
              >
                <Plus className="w-3.5 h-3.5" />
                New Investigation
              </button>
              <button
                onClick={() => {
                  if (cases.length > 0) {
                    onSelectCase(cases[0].id);
                  }
                }}
                className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-brand-muted hover:text-white transition-colors cursor-pointer text-[11px] font-semibold"
              >
                Open Active Case
              </button>
            </div>
          </div>
        </>
      )}

      {/* NEW MULTI-STEP HIGH-FIDELITY WIZARD MODAL */}
      <NewInvestigationWizard 
        isOpen={showNewCaseWindow} 
        onClose={() => setShowNewCaseWindow(false)} 
        onCreateCase={onCreateCase} 
      />

      {/* SCANNING REPLAY OVERLAY SCREEN */}
      <AnimatePresence>
        {isScanning && (
          <div className="fixed inset-0 bg-[#050816]/95 backdrop-blur-md flex flex-col items-center justify-center z-[200] px-4">
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 rounded-full border border-dashed border-blue-500/10 animate-spin" style={{ animationDuration: '6s' }} />
              <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/20 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
              <div className="absolute inset-4 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                <Dna className="w-6 h-6 text-white animate-pulse" />
              </div>
            </div>

            {/* Console logs */}
            <div className="w-full max-w-md bg-[#0E1323] border border-white/10 rounded-xl p-5 text-left font-mono text-xs text-brand-accent glass-panel shadow-2xl relative overflow-hidden">
              <div className="text-[10px] text-brand-muted mb-3 border-b border-white/5 pb-2 uppercase tracking-widest flex justify-between">
                <span>Forensic Scanner</span>
                <span>Anomalous Check</span>
              </div>

              <div className="space-y-1.5 min-h-[120px] flex flex-col justify-end">
                {scanLogs.slice(0, scanStep + 1).map((log, index) => {
                  const isLast = index === scanStep;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-start gap-2 ${isLast ? 'text-white font-semibold' : 'text-brand-muted'}`}
                    >
                      <span className="text-blue-500">{'>'}</span>
                      <span>{log}</span>
                      {isLast && index < scanLogs.length - 1 && (
                        <span className="inline-block w-1.5 h-3.5 bg-cyan-400 animate-pulse ml-0.5" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
