/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ChevronRight, ChevronLeft, UploadCloud, 
  Image as ImageIcon, FileImage, Trash2, Cpu, Sparkles, Layers, 
  FileCheck, Check, Clock, AlertTriangle, User, Dna, ShieldAlert,
  HelpCircle, Eye, RefreshCw
} from 'lucide-react';
import { Case } from '../types';
import { uploadInvestigation } from '../services/api';

type UploadedFile = {
  name: string;
  size: string;
  url: string;
  preset?: boolean;
  file?: File;
};

interface NewInvestigationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCase: (newCase: Case) => void;
}

const SPECIMENS_PRESETS = [
  {
    name: 'synthetic_specimen_flux_beta.png',
    size: '4.2 MB',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    type: 'FLUX.1 Synthesis (Identity Alteration)'
  },
  {
    name: 'satellite_covert_dalle3_harbor.jpg',
    size: '11.8 MB',
    url: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&q=80&w=600',
    type: 'DALL-E 3 Inpainting (Object Insertion)'
  },
  {
    name: 'authorized_organic_specimen.tiff',
    size: '8.4 MB',
    url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=600',
    type: 'Camera Capture (Organic Specimen)'
  }
];

export default function NewInvestigationWizard({ isOpen, onClose, onCreateCase }: NewInvestigationWizardProps) {
  const [step, setStep] = useState(1);
  
  // Step 1: Case Details
  const [caseName, setCaseName] = useState('');
  const [caseDesc, setCaseDesc] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [evidenceType, setEvidenceType] = useState<'single' | 'batch' | 'comparison'>('single');
  const [notes, setNotes] = useState('');
  const [investigator, setInvestigator] = useState('Analyst Varshika');

  // Step 2: Evidence Upload
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStepName, setUploadStepName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadResult, setUploadResult] = useState<{ prediction: 'REAL' | 'FAKE'; confidence: number; explanation_url: string } | null>(null);

  // Step 3: Launch & Cinematic Replay
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayStep, setReplayStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // The 12 exact stages requested by the user
  const replayStages = [
    { label: 'Uploading Evidence...', desc: 'Verifying network handshake and securing image payloads...' },
    { label: 'Validating Image...', desc: 'Parsing headers, examining EXIF tags, checking file consistency...' },
    { label: 'Image Preprocessing...', desc: 'Applying local variance normalization and resizing matrices...' },
    { label: 'Running ResNet...', desc: 'Convolution layer analysis detecting spatial pattern irregularities...' },
    { label: 'Running EfficientNet...', desc: 'Verifying scaling coefficients for high-frequency pixel anomalies...' },
    { label: 'Running MobileNet...', desc: 'Rapid edge validation checking for geometric warp signatures...' },
    { label: 'Extracting Digital DNA...', desc: 'Running Fourier transforms to isolate camera sensor noise...' },
    { label: 'Generating Fingerprint...', desc: 'Compiling unique device and software generation hash codes...' },
    { label: 'Consensus Intelligence...', desc: 'Polling all deep learning neural backends for probability metrics...' },
    { label: 'Building Explainability...', desc: 'Rendering GradCAM activation heatmaps for visual attribution...' },
    { label: 'Generating Digital Passport...', desc: 'Sealing forensic cryptographic certificates with SHA-256 hash...' },
    { label: 'Investigation Complete.', desc: 'Packaging intelligence dossier. Redirecting to core cockpit...' }
  ];

  // Auto progression of cinematic sequence
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isReplaying) {
      interval = setInterval(() => {
        setReplayStep(prev => {
          if (prev < replayStages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              finalizeCaseCreation();
            }, 1000);
            return prev;
          }
        });
      }, 950); // Fluid progression, total ~11 seconds
    }
    return () => clearInterval(interval);
  }, [isReplaying]);

  const handleDrag = (e: React.DragEvent) => {
    if (isUploading) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isUploading) return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading) return;
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const uploadSelectedFile = async (file: File) => {
    if (isUploading) return;
    setUploadError('');
    setUploadResult(null);
    setIsUploading(true);
    setUploadProgress(5);
    setUploadStepName('Uploading forensic specimen...');

    let currentProgress = 5;
    const progressInterval = window.setInterval(() => {
      currentProgress = Math.min(currentProgress + 10, 95);
      setUploadProgress(currentProgress);
    }, 250);

    try {
      const response = await uploadInvestigation(file);
      const rawPrediction = String(response.prediction ?? response.prediction_label ?? response.label ?? 'REAL').toUpperCase();
      const prediction = rawPrediction === 'REAL' ? 'REAL' : 'FAKE';
      const confidence = Number(response.confidence ?? response.confidence_score ?? response.confidencePercentage ?? 0);
      const explanation_url = String(response.explanation_url ?? response.explanationUrl ?? response.gradcam_url ?? response.explanation ?? '');

      if (!explanation_url) {
        throw new Error('Upload succeeded, but server did not return an explanation URL.');
      }

      setUploadResult({ prediction, confidence, explanation_url });
      setUploadStepName('Upload complete. Rendering Grad-CAM visualization...');
      setUploadProgress(100);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(message);
      setUploadProgress(null);
      setUploadStepName('');
    } finally {
      window.clearInterval(progressInterval);
      setIsUploading(false);
    }
  };

  const processFiles = (files: FileList) => {
    const newItems: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileUrl = URL.createObjectURL(file);
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      newItems.push({
        name: file.name,
        size: sizeStr,
        url: fileUrl,
        file
      });
    }

    setUploadedFiles(prev => [...prev, ...newItems]);
    if (newItems.length > 0) {
      const firstFile = newItems[0].file;
      if (firstFile) {
        setSelectedFile(firstFile);
        uploadSelectedFile(firstFile);
      }
    }
  };

  const addPresetSpecimen = (preset: typeof SPECIMENS_PRESETS[0]) => {
    if (isUploading) return;
    if (uploadedFiles.some(f => f.name === preset.name)) return;
    setUploadedFiles(prev => [...prev, { name: preset.name, size: preset.size, url: preset.url, preset: true }]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const target = prev[index];
      const next = prev.filter((_, i) => i !== index);
      if (target?.file && selectedFile && target.file === selectedFile) {
        const nextSelected = next.find(item => item.file)?.file ?? null;
        setSelectedFile(nextSelected);
      }
      return next;
    });
  };

  const handleLaunchInvestigation = () => {
    if (isUploading) return;
    if (selectedFile && !uploadResult) {
      setUploadError('Please wait for the image upload to complete before launching.');
      return;
    }

    if (uploadedFiles.length === 0) {
      // Auto assign a default preset file if none uploaded
      addPresetSpecimen(SPECIMENS_PRESETS[0]);
    }
    setIsReplaying(true);
    setReplayStep(0);
  };

  const finalizeCaseCreation = () => {
    const randomHash = () => Math.random().toString(16).substring(2, 10);
    const primaryFile = uploadedFiles[0] || SPECIMENS_PRESETS[0];
    
    const isPresetFlux = primaryFile.name.includes('flux');
    const isPresetDalle = primaryFile.name.includes('dalle3');
    const isReal = primaryFile.name.includes('organic') || (!isPresetFlux && !isPresetDalle && Math.random() > 0.5);

    let authScore = 14.5;
    let trustIdx = 11.2;
    let risk = 94.8;
    let notesText = notes || 'No custom analyst observations saved during pipeline creation.';
    
    if (isReal) {
      authScore = 96.2;
      trustIdx = 97.4;
      risk = 3.8;
      notesText = notes || 'Forensic analysis confirms pristine sensor noise pattern distribution without generative frequency dropouts.';
    } else if (isPresetDalle) {
      authScore = 24.8;
      trustIdx = 28.5;
      risk = 79.2;
    }

    const created: Case = {
      id: `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: caseName || 'Ad-Hoc Digital Examination',
      description: caseDesc || 'Automated examination of external visual specimens.',
      investigator: investigator,
      priority: priority,
      status: 'COMPLETE',
      evidenceName: primaryFile.name,
      evidenceUrl: primaryFile.url,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      prediction: uploadResult?.prediction,
      confidence: uploadResult?.confidence,
      explanationUrl: uploadResult?.explanation_url,
      authenticityScore: authScore,
      trustIndex: trustIdx,
      evidenceStrength: Math.floor(84 + Math.random() * 12),
      riskFactor: risk,
      integrityIndex: isReal ? 98 : 14,
      consensusAgreement: isReal ? 100 : 88,
      dnaScores: {
        texture: isReal ? 95 : Math.floor(10 + Math.random() * 15),
        noise: isReal ? 97 : Math.floor(6 + Math.random() * 12),
        lighting: isReal ? 92 : Math.floor(15 + Math.random() * 20),
        edges: isReal ? 96 : Math.floor(12 + Math.random() * 15),
        frequency: isReal ? 98 : Math.floor(8 + Math.random() * 12),
        compression: isReal ? 89 : Math.floor(22 + Math.random() * 18),
        diffusion: isReal ? 99 : Math.floor(3 + Math.random() * 8),
        promptArtifacts: isReal ? 99 : Math.floor(9 + Math.random() * 14)
      },
      fingerprints: {
        textureSignature: isReal ? 'ORGANIC_PHOTON_DIST' : (isPresetFlux ? 'FRACTAL_FLOW_FLUX' : 'DALL3_COVERT_LATENT'),
        noiseSignature: isReal ? 'PHYSICAL_CCD_RESONANCE' : 'GENERATIVE_GRID_ATTN',
        reflectionSignature: isReal ? 'NATURAL_COHERENT_RAY' : 'ASYMMETRIC_LIGHT_DISPERSION',
        frequencySignature: isReal ? 'CONGRUENT_FOURIER_SPECTRUM' : 'SPECTRAL_COMB_TRANSFORM',
        compressionSignature: isReal ? 'RAW_CCD_UNCOMPRESSED' : 'JPEG_DOUBLE_QUANTIZATION',
        promptArtifactSignature: isReal ? 'NO_SEMANTIC_ARTIFACTS' : 'CLIP_TEXTUAL_ATTN_SIGN',
        lightingSignature: isReal ? 'COHERENT_ENVIRONMENT_ILLUM' : 'GEOMETRIC_LIGHT_ANOMALY',
        visualConsistency: isReal ? 97.4 : 14.8
      },
      consensusModels: [
        { name: 'ResNet50_DNA', prediction: isReal ? 'REAL' : 'SYNTHETIC', confidence: 99.8, agreement: true, inferenceTime: 12.4, attentionMap: 'CAM_LAYER_4' },
        { name: 'EfficientNet_B7_V4', prediction: isReal ? 'REAL' : 'SYNTHETIC', confidence: 99.2, agreement: true, inferenceTime: 24.8, attentionMap: 'CAM_MBLOCK_12' },
        { name: 'MobileNet_EdgeAI', prediction: isReal ? 'REAL' : (isPresetDalle ? 'REAL' : 'SYNTHETIC'), confidence: 78.1, agreement: isReal || isPresetFlux, inferenceTime: 8.1, attentionMap: 'CAM_CONV_OUT' },
        { name: 'VisionTransformer_L16', prediction: isReal ? 'REAL' : 'SYNTHETIC', confidence: 99.9, agreement: true, inferenceTime: 36.2, attentionMap: 'VIT_ATTN_HEAD_8' }
      ],
      genomeAttribution: {
        stableDiffusion: isReal ? 0.1 : 12.4,
        midjourney: isReal ? 0.2 : 10.5,
        dalle: isReal ? 0.0 : (isPresetDalle ? 82.5 : 4.2),
        flux: isReal ? 0.1 : (isPresetFlux ? 74.8 : 5.9),
        firefly: isReal ? 0.1 : 3.2,
        ideogram: isReal ? 0.1 : 2.1,
        leonardo: isReal ? 0.0 : 0.6
      },
      timeMachineSteps: [
        { phase: 'Textual Prompt Decoding', status: 'COMPLETED', description: isReal ? 'No text alignment keys identified in matrix scan.' : 'Decoded multi-modal prompt context tags.', timestamp: '14:24:11', attributes: isReal ? ['Organic Capture'] : ['Seed: 501289301', 'CFG: 6.0'] },
        { phase: 'Latent Space Diffusion', status: 'COMPLETED', description: isReal ? 'Direct photon-to-diode response capture.' : 'Rendered visual grids over latent flow matching cycles.', timestamp: '14:24:12', attributes: isReal ? ['Unsynthesized'] : ['Steps: 30', 'Sampler: FlowMatch'] }
      ],
      analystNotes: notesText,
      dnaHash: `dna_hash_${randomHash()}${randomHash()}`,
      fingerprintHash: `fp_sig_${randomHash()}${randomHash()}`
    };

    onCreateCase(created);
    setIsReplaying(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#050816] z-[150] flex flex-col overflow-y-auto select-none">
      
      {/* Decorative premium tech grids */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isReplaying ? (
          <motion.div
            key="wizard-fullscreen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex-grow flex flex-col max-w-6xl w-full mx-auto px-6 py-8 relative z-10"
          >
            {/* Header cockpit */}
            <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-8">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <ShieldAlert className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-lg font-display font-black tracking-widest text-white uppercase glow-text-blue">
                    Forensic Setup Wizard
                  </h1>
                  <p className="text-[10px] font-mono text-brand-accent tracking-widest uppercase mt-0.5">
                    Level 9 Security Clearance Autorefiner
                  </p>
                </div>
              </div>

              {/* Step indicator bubbles */}
              <div className="flex items-center gap-3">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <button 
                      type="button"
                      disabled={s > step && (s === 2 && !caseName) || (s === 3 && uploadedFiles.length === 0)}
                      onClick={() => setStep(s)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-mono font-bold border transition-all ${
                        step === s 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-110' 
                          : step > s 
                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20' 
                            : 'bg-white/5 border-white/5 text-brand-muted hover:border-white/10'
                      }`}
                    >
                      {step > s ? <Check className="w-4 h-4 text-white" /> : s}
                    </button>
                    {s < 3 && (
                      <div className={`w-12 h-[2px] mx-1 transition-colors ${step > s ? 'bg-blue-500/40' : 'bg-white/5'}`} />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-brand-muted hover:text-white flex items-center justify-center border border-white/5 transition-all cursor-pointer hover:scale-105"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps Container */}
            <div className="flex-grow flex flex-col justify-between">
              
              {/* STEP 1: CASE DETAILS */}
              {step === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
                  <div className="lg:col-span-7 space-y-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 glass-panel">
                    <h3 className="text-base font-display font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
                      Step 1 — Case Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-mono text-brand-accent uppercase tracking-wider mb-2">Case Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Opus-Alpha Biometric Alteration"
                          value={caseName}
                          onChange={(e) => setCaseName(e.target.value)}
                          className="w-full bg-[#050816] text-white border border-white/10 rounded-xl px-4 py-3.5 text-xs focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-brand-accent uppercase tracking-wider mb-2">Case Description</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Describe target anomaly, media source, and investigation context..."
                          value={caseDesc}
                          onChange={(e) => setCaseDesc(e.target.value)}
                          className="w-full bg-[#050816] text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500/50 transition-colors leading-relaxed"
                        />
                      </div>

                      {/* Priority selector card grid */}
                      <div>
                        <label className="block text-[11px] font-mono text-brand-accent uppercase tracking-wider mb-2">Priority Threat Level</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setPriority(p as any)}
                              className={`py-3.5 px-4 rounded-xl border text-center transition-all cursor-pointer font-mono text-xs font-bold ${
                                priority === p
                                  ? 'bg-blue-600/15 border-blue-500 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                                  : 'bg-white/5 border-white/5 text-brand-muted hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 glass-panel flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block mb-2">Configured Parameters</span>
                      <h4 className="text-sm font-semibold text-white tracking-wide">Evidence Scope Options</h4>
                      <p className="text-xs text-brand-muted leading-relaxed mt-1.5">
                        Define how visual files are catalogued. If analyzing comparison maps, we suggest selecting Image Comparison.
                      </p>
                    </div>

                    {/* Evidence Type button selectors */}
                    <div className="space-y-3">
                      <label className="block text-[11px] font-mono text-brand-accent uppercase tracking-wider">Evidence Type</label>
                      <div className="grid grid-cols-1 gap-2.5">
                        {[
                          { id: 'single', label: 'Single Image', desc: 'Process a single master visual specimen' },
                          { id: 'batch', label: 'Batch Investigation', desc: 'Run analysis over multiple images concurrently' },
                          { id: 'comparison', label: 'Image Comparison', desc: 'Isolate differences between two files side-by-side' }
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setEvidenceType(item.id as any)}
                            className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                              evidenceType === item.id
                                ? 'bg-blue-600/10 border-blue-500 text-white'
                                : 'bg-[#050816]/60 border-white/5 text-brand-muted hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                              {item.id === 'single' ? <ImageIcon className="w-4 h-4 text-blue-400" /> : item.id === 'batch' ? <Layers className="w-4 h-4 text-purple-400" /> : <Eye className="w-4 h-4 text-pink-400" />}
                            </div>
                            <div className="overflow-hidden">
                              <span className="text-xs font-semibold block leading-tight">{item.label}</span>
                              <span className="text-[9px] text-brand-muted mt-0.5 block truncate">{item.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-brand-accent uppercase tracking-wider mb-2">Investigator Notes</label>
                      <input
                        type="text"
                        placeholder="Add specific threat levels or file identifiers..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-[#050816] text-white border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: IMAGE UPLOAD */}
              {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
                  
                  {/* Upload Drop Zone area */}
                  <div className="lg:col-span-7 space-y-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 glass-panel">
                    <h3 className="text-base font-display font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
                      Step 2 — Image Upload
                    </h3>
                    
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-10 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                        dragActive 
                          ? 'border-blue-500 bg-blue-500/10 scale-[0.99] shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple={evidenceType !== 'single'}
                        accept=".png,.jpg,.jpeg,.webp"
                        onChange={handleFileInput}
                        className="hidden"
                      />

                      <motion.div 
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4"
                      >
                        <UploadCloud className="w-8 h-8 text-blue-400" />
                      </motion.div>

                      <h4 className="text-xs font-semibold text-white">Drag & drop your forensic specimen here</h4>
                      <p className="text-[10px] text-brand-muted mt-1.5 leading-relaxed">
                        or click to <span className="text-blue-400 underline font-semibold">browse files</span> from your local terminal
                      </p>

                      <div className="flex items-center gap-4 mt-6 text-[9px] font-mono text-brand-muted">
                        <span>Supported: PNG, JPG, JPEG, WEBP</span>
                        <span>•</span>
                        <span>Max File Size: 50MB</span>
                      </div>
                    </div>

                    {/* Progress loader */}
                    {uploadProgress !== null && (
                      <div className="bg-[#050816] border border-white/5 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-blue-400 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            {uploadStepName}
                          </span>
                          <span className="text-white font-bold">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-150 animate-pulse" 
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {uploadError && (
                      <p className="mt-3 text-xs text-red-400 font-mono">{uploadError}</p>
                    )}
                  </div>

                  {/* Specimen Presets and Queue list */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* Simulated Lab presets */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 glass-panel">
                      <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-brand-accent block mb-3">
                        Laboratory Specimen Presets
                      </span>
                      <div className="grid grid-cols-1 gap-2.5">
                        {SPECIMENS_PRESETS.map((preset) => {
                          const isSelected = uploadedFiles.some(f => f.name === preset.name);
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => addPresetSpecimen(preset)}
                              disabled={isUploading}
                              className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all text-left ${
                                isSelected 
                                  ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/5 scale-[1.02]' 
                                  : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                              } ${isUploading ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                            >
                              <img 
                                src={preset.url} 
                                alt="Preset" 
                                className="w-10 h-10 object-cover rounded-lg border border-white/10"
                                referrerPolicy="no-referrer"
                              />
                              <div className="overflow-hidden flex-grow">
                                <h5 className="text-[11px] font-semibold text-white truncate">{preset.name}</h5>
                                <p className="text-[9px] text-brand-muted mt-0.5 font-mono">{preset.size} • {preset.type.split(' ')[0]}</p>
                              </div>
                              <Check className={`w-4 h-4 text-blue-400 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Queued files with thumbnail preview */}
                    {uploadedFiles.length > 0 && (
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 glass-panel flex flex-col max-h-[220px]">
                        <div className="flex justify-between items-center text-[10px] font-mono text-brand-muted uppercase border-b border-white/5 pb-2 mb-3">
                          <span>Active Queue ({uploadedFiles.length})</span>
                          <span>Action</span>
                        </div>
                        
                        <div className="overflow-y-auto space-y-2 flex-grow pr-1">
                          {uploadedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-[#050816]/60 border border-white/5 rounded-xl">
                              <div className="flex items-center gap-2.5 overflow-hidden flex-grow">
                                <img 
                                  src={file.url} 
                                  alt="Specimen thumbnail" 
                                  className="w-8 h-8 object-cover rounded border border-white/5 flex-shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="overflow-hidden">
                                  <span className="text-xs font-mono text-white truncate block max-w-[180px]">{file.name}</span>
                                  <span className="text-[9px] text-brand-muted font-mono">{file.size}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => !isUploading && removeFile(idx)}
                                disabled={isUploading}
                                className={`p-2 rounded-xl bg-white/5 hover:bg-red-950/20 text-brand-muted hover:text-red-400 transition-colors border border-transparent hover:border-white/10 ${isUploading ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: AI ANALYSIS MODULES */}
              {step === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
                  <div className="lg:col-span-6 space-y-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 glass-panel">
                    <h3 className="text-base font-display font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
                      Step 3 — AI Analysis Modules
                    </h3>
                    
                    {uploadResult && (
                    <div className="bg-[#050816] border border-blue-500/10 rounded-2xl p-5 mb-4">
                      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-brand-muted mb-3">
                        <span>Real-Time Upload Result</span>
                        <span className="text-blue-400">Grad-CAM Ready</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3 text-left text-xs">
                        <div className="flex justify-between gap-3">
                          <span className="text-brand-muted">Prediction</span>
                          <span className="text-white font-semibold uppercase">{uploadResult.prediction}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-brand-muted">Confidence</span>
                          <span className="text-white font-semibold">{uploadResult.confidence.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-brand-muted">Explanation</span>
                          <img
                            src={uploadResult.explanation_url}
                            alt="Grad-CAM explanation"
                            className="mt-2 w-full h-40 object-cover rounded-xl border border-white/10"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4 font-mono text-xs">
                      <div className="flex justify-between border-b border-white/5 pb-2.5">
                        <span className="text-brand-muted">Case ID:</span>
                        <span className="text-white font-bold">{caseName || 'Ad-Hoc Decrypt'}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2.5">
                        <span className="text-brand-muted">Lead Investigator:</span>
                        <span className="text-white">{investigator}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2.5">
                        <span className="text-brand-muted">Priority:</span>
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          priority === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/20' : 'bg-white/5 text-brand-muted'
                        }`}>
                          {priority}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2.5">
                        <span className="text-brand-muted">Evidence Type:</span>
                        <span className="text-white uppercase font-bold">{evidenceType} Image</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-muted">Specimens Queued:</span>
                        <span className="text-cyan-400 font-bold">{uploadedFiles.length > 0 ? uploadedFiles.length : 1} file(s)</span>
                      </div>
                    </div>

                    <div className="bg-blue-950/15 border border-blue-500/10 rounded-2xl p-5 flex items-start gap-4">
                      <Clock className="w-5.5 h-5.5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="text-sm font-semibold text-white">Estimated Analysis Time: ~11.5 seconds</h5>
                        <p className="text-xs text-brand-muted leading-relaxed mt-1">
                          Consolidated GPU thread scheduling is locked. The analysis engine compiles the consensus vote and seals the Digital Passport PDF instantly.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Modules checklist requested exactly */}
                  <div className="lg:col-span-6 space-y-4">
                    <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block mb-1">Aligned Diagnostics Pipeline</span>
                    
                    <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                      {[
                        { label: '✓ AI Detection', desc: 'ResNet and EfficientNet spatial boundary check' },
                        { label: '✓ Digital DNA Extraction', desc: 'Fourier noise frequency distribution extraction' },
                        { label: '✓ Fingerprint Engine', desc: 'PRNU camera response and software metadata mapping' },
                        { label: '✓ Consensus Intelligence', desc: 'Consolidated prediction poll across 4 neural models' },
                        { label: '✓ Explainability Studio', desc: 'Pixel-level attention gradients and GradCAM visualization' },
                        { label: '✓ Generator Attribution', desc: 'Probability scores match on DALL-E, Flux, Midjourney' },
                        { label: '✓ Digital Passport', desc: 'Cryptographically sealed SHA-256 PDF report compilation' }
                      ].map((mod, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl text-xs hover:border-white/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
                              {idx === 0 ? <ShieldAlert className="w-4 h-4 text-cyan-400" /> : idx === 1 ? <Dna className="w-4 h-4 text-blue-400" /> : idx === 2 ? <Cpu className="w-4 h-4 text-purple-400" /> : idx === 3 ? <Layers className="w-4 h-4 text-pink-400" /> : idx === 4 ? <Sparkles className="w-4 h-4 text-rose-400" /> : idx === 5 ? <ImageIcon className="w-4 h-4 text-orange-400" /> : <FileCheck className="w-4 h-4 text-emerald-400" />}
                            </div>
                            <div>
                              <span className="font-semibold text-white block">{mod.label}</span>
                              <span className="text-[10px] text-brand-muted mt-0.5 block">{mod.desc}</span>
                            </div>
                          </div>
                          <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-blue-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Cockpit */}
              <div className="border-t border-white/5 pt-8 mt-8 flex items-center justify-between">
                <button
                  disabled={step === 1}
                  onClick={() => setStep(prev => prev - 1)}
                  className={`flex items-center gap-1.5 px-5 py-3 rounded-xl text-xs font-semibold border transition-all ${
                    step === 1
                      ? 'opacity-0 pointer-events-none'
                      : 'bg-white/5 border-white/5 text-brand-muted hover:text-white hover:bg-white/10 cursor-pointer'
                  }`}
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                  Previous Step
                </button>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-brand-muted hidden md:inline">
                    Secure Cryptographic Sockets Connected
                  </span>
                  {step < 3 ? (
                    <button
                      disabled={step === 2 && uploadedFiles.length === 0}
                      onClick={() => setStep(prev => prev + 1)}
                      className={`flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/10 transition-colors ${
                        step === 2 && uploadedFiles.length === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      Continue
                      <ChevronRight className="w-4.5 h-4.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleLaunchInvestigation}
                      disabled={isUploading}
                      className={`flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold px-8 py-3.5 rounded-xl shadow-xl shadow-indigo-500/25 transition-all relative overflow-hidden group hover:scale-[1.02] ${isUploading ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Launch Investigation
                      <ChevronRight className="w-4.5 h-4.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          
          /* 12-STAGE HIGH-FIDELITY REPLAY SCREEN */
          <motion.div
            key="cinematic-replay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="flex-grow flex flex-col items-center justify-center text-center max-w-2xl w-full mx-auto px-6 py-12 relative z-10"
          >
            {/* Spinning decorative orbit circles */}
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 rounded-full border border-dashed border-blue-500/20 animate-spin" style={{ animationDuration: '12s' }} />
              <div className="absolute inset-4 rounded-full border border-dashed border-cyan-500/30 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
              <div className="absolute inset-8 rounded-full bg-blue-600/10 border-2 border-blue-500 flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.5)]">
                <Dna className="w-10 h-10 text-white animate-pulse" />
              </div>
              <div className="absolute top-0 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            </div>

            <h2 className="text-lg font-display font-black tracking-widest text-white uppercase glow-text-blue">
              Forensic Specimen Scanning
            </h2>
            <p className="text-xs text-brand-muted mt-2 max-w-md font-mono">
              Analyzing visual neural signatures. Distributed compute shards aligned.
            </p>

            {/* Cinematic list of the 12 steps */}
            <div className="w-full bg-[#0E1323] border border-white/10 rounded-2xl p-6 text-left mt-8 space-y-2.5 shadow-2xl relative overflow-hidden glass-panel max-h-[380px] overflow-y-auto">
              <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-[#0E1323] to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-[#0E1323] to-transparent pointer-events-none z-10" />
              
              <div className="space-y-2.5 py-4">
                {replayStages.map((stage, idx) => {
                  const isActive = idx === replayStep;
                  const isCompleted = idx < replayStep;
                  return (
                    <motion.div 
                      key={idx} 
                      className={`flex items-start gap-3 transition-all duration-300 ${
                        isActive ? 'scale-[1.02] pl-1' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                        ) : isActive ? (
                          <div className="w-5 h-5 rounded-md bg-blue-600/20 border border-blue-500 flex items-center justify-center animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-cyan-400" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-md bg-white/5 border border-white/5 flex items-center justify-center text-[9px] font-mono text-brand-muted">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      
                      <div className="overflow-hidden">
                        <h5 className={`text-xs font-mono font-bold ${
                          isCompleted ? 'text-emerald-400/70 line-through' : isActive ? 'text-white' : 'text-brand-muted/40'
                        }`}>
                          {stage.label}
                        </h5>
                        {isActive && (
                          <p className="text-[10px] text-brand-muted mt-0.5 animate-fade-in font-mono">
                            {stage.desc}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Progress load slider */}
            <div className="w-full mt-8 space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-brand-muted">
                <span>GPU Consolidated Thread Load</span>
                <span className="text-white font-bold">{Math.floor(((replayStep + 1) / replayStages.length) * 100)}%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 p-[1px]">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.6)]" 
                  style={{ width: `${((replayStep + 1) / replayStages.length) * 100}%` }}
                />
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
