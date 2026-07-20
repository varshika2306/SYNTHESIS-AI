/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Case } from '../types';

export const mockCases: Case[] = [
  {
    id: 'CASE-2026-9082',
    name: 'Opus-Alpha Biometric Alteration',
    description: 'Investigation into potential FLUX.1 generative identity bypass targeting corporate facial biometric authentication scanners.',
    investigator: 'Lead Analyst Varshika',
    priority: 'CRITICAL',
    status: 'COMPLETE',
    evidenceName: 'biometric_bypass_source.png',
    evidenceUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    timestamp: '2026-07-16 14:24:10 UTC',
    authenticityScore: 12.4, // heavily synthetic
    trustIndex: 8.5,
    evidenceStrength: 91.2,
    riskFactor: 94.8,
    integrityIndex: 11.2,
    consensusAgreement: 100.0,
    dnaScores: {
      texture: 14.8,
      noise: 9.1,
      lighting: 18.3,
      edges: 22.0,
      frequency: 8.4,
      compression: 30.2,
      diffusion: 5.6,
      promptArtifacts: 15.0
    },
    fingerprints: {
      textureSignature: 'FRACTAL_DIFF_F1A2',
      noiseSignature: 'ANISOTROPIC_NOISE_P44',
      reflectionSignature: 'NON_PLANAR_ASYMMETRY',
      frequencySignature: 'HF_SPECTRAL_DROP_78',
      compressionSignature: 'VITE_DOUBLE_QUANT_03',
      promptArtifactSignature: 'CHIRAL_BIAS_DETECTED',
      lightingSignature: 'ELLIPTIC_SHADOW_MISMATCH',
      visualConsistency: 18.5
    },
    consensusModels: [
      { name: 'ResNet50_DNA', prediction: 'SYNTHETIC', confidence: 99.8, agreement: true, inferenceTime: 12.4, attentionMap: 'CAM_LAYER_4' },
      { name: 'EfficientNet_B7_V4', prediction: 'SYNTHETIC', confidence: 99.2, agreement: true, inferenceTime: 24.8, attentionMap: 'CAM_MBLOCK_12' },
      { name: 'MobileNet_EdgeAI', prediction: 'SYNTHETIC', confidence: 98.1, agreement: true, inferenceTime: 8.1, attentionMap: 'CAM_CONV_OUT' },
      { name: 'VisionTransformer_L16', prediction: 'SYNTHETIC', confidence: 99.9, agreement: true, inferenceTime: 36.2, attentionMap: 'VIT_ATTN_HEAD_8' }
    ],
    genomeAttribution: {
      stableDiffusion: 15.2,
      midjourney: 12.1,
      dalle: 5.0,
      flux: 62.4,
      firefly: 2.1,
      ideogram: 2.3,
      leonardo: 0.9
    },
    timeMachineSteps: [
      { phase: 'Textual Prompt Decoding', status: 'COMPLETED', description: 'Reconstructed semantic embeddings from generative noise seeds.', timestamp: '14:24:11', attributes: ['Seed: 91823901', 'CFG: 7.5', 'Prompt: "High detail professional portrait of security personnel"'] },
      { phase: 'Latent Space Diffusion', status: 'COMPLETED', description: 'Synthesized low-frequency visual blobs into distinct shapes over 28 steps.', timestamp: '14:24:12', attributes: ['Steps: 28', 'Sampler: FlowMatchEuler', 'Sigma: 0.04'] },
      { phase: 'Bicubic Image Reconstruction', status: 'COMPLETED', description: 'Upscaled latent representations into full 1024x1024 float32 grid.', timestamp: '14:24:13', attributes: ['Method: GigaUpscale', 'Sharpening: Adaptive'] },
      { phase: 'Subtle Facial Editing', status: 'COMPLETED', description: 'Biometric alteration parameters added post-generation around eye structures.', timestamp: '14:24:14', attributes: ['Mask Match: 98.4%', 'Feathering: 12px'] },
      { phase: 'Lossy Web Compression', status: 'COMPLETED', description: 'Quantized RGB colorspace into standard JPEG compression grid.', timestamp: '14:24:15', attributes: ['Quantization: Q80', 'Subsampling: 4:2:0'] }
    ],
    analystNotes: 'Biometric face shows definitive signs of high-frequency Euler flow-matching texture bias. Reflection patterns around pupils are physically inconsistent with the simulated key light. Advise locking authentication credentials.',
    dnaHash: 'dna_hash_f120aef245903c9d81e370',
    fingerprintHash: 'fp_sig_99011a8b2c4e5f'
  },
  {
    id: 'CASE-2026-4021',
    name: 'Bosphorus Satellite Verification',
    description: 'Geopolitical analysis of cargo ship traffic imagery. Suspected DALL-E 3 insertion of synthetic vessel.',
    investigator: 'Analyst Varshika',
    priority: 'HIGH',
    status: 'COMPLETE',
    evidenceName: 'satellite_bosphorus.png',
    evidenceUrl: 'https://images.unsplash.com/photo-1500313830540-7b6650a74fd0?auto=format&fit=crop&q=80&w=600',
    timestamp: '2026-07-15 09:12:04 UTC',
    authenticityScore: 35.8, // moderately synthetic
    trustIndex: 42.0,
    evidenceStrength: 84.5,
    riskFactor: 72.1,
    integrityIndex: 38.6,
    consensusAgreement: 75.0,
    dnaScores: {
      texture: 42.0,
      noise: 28.5,
      lighting: 49.1,
      edges: 31.2,
      frequency: 25.0,
      compression: 65.4,
      diffusion: 18.0,
      promptArtifacts: 41.0
    },
    fingerprints: {
      textureSignature: 'FRACTAL_DIFF_S3B1',
      noiseSignature: 'STOCHASTIC_COV_90',
      reflectionSignature: 'COHERENT_PLANAR',
      frequencySignature: 'SPECTRAL_COMB_FILTER',
      compressionSignature: 'TIFF_NO_LOSS',
      promptArtifactSignature: 'SHAPE_COHERENCE_BIAS',
      lightingSignature: 'DIFFUSE_AMBIENT_OK',
      visualConsistency: 48.2
    },
    consensusModels: [
      { name: 'ResNet50_DNA', prediction: 'SYNTHETIC', confidence: 94.2, agreement: true, inferenceTime: 11.2, attentionMap: 'CAM_LAYER_3' },
      { name: 'EfficientNet_B7_V4', prediction: 'SYNTHETIC', confidence: 89.5, agreement: true, inferenceTime: 22.1, attentionMap: 'CAM_MBLOCK_10' },
      { name: 'MobileNet_EdgeAI', prediction: 'REAL', confidence: 61.2, agreement: false, inferenceTime: 6.4, attentionMap: 'CAM_CONV_OUT' },
      { name: 'VisionTransformer_L16', prediction: 'SYNTHETIC', confidence: 97.4, agreement: true, inferenceTime: 31.8, attentionMap: 'VIT_ATTN_HEAD_3' }
    ],
    genomeAttribution: {
      stableDiffusion: 8.5,
      midjourney: 4.2,
      dalle: 76.1,
      flux: 5.4,
      firefly: 3.1,
      ideogram: 1.2,
      leonardo: 1.5
    },
    timeMachineSteps: [
      { phase: 'Textual Prompt Decoding', status: 'COMPLETED', description: 'Reconstructed prompt: "Aerial military satellite photo of large shipping container vessel crossing the Bosphorus strait"', timestamp: '09:12:05', attributes: ['Model: DALL-E 3', 'Aspect: 1:1'] },
      { phase: 'Latent Space Diffusion', status: 'COMPLETED', description: 'Formed container ship hull inside sea-surface textures.', timestamp: '09:12:06', attributes: ['Latent dimension: 128x128', 'Denoising steps: 50'] },
      { phase: 'Upscaling & Details', status: 'COMPLETED', description: 'Inpainted deck cranes, wake waves, and shipping cargo containers.', timestamp: '09:12:08', attributes: ['Inpaint mask size: 12%'] },
      { phase: 'Compression', status: 'COMPLETED', description: 'Exported as satellite imagery compression format.', timestamp: '09:12:09', attributes: ['Format: GeoTIFF', 'Lossless'] }
    ],
    analystNotes: 'The background water patterns display natural oceanic wave movement, but the vessel itself contains non-matching noise signatures and localized high-frequency compression artefacts. Highly likely DALL-E 3 vessel insertion.',
    dnaHash: 'dna_hash_ab0821ec09228a7e5519',
    fingerprintHash: 'fp_sig_72a11b933d5e2a'
  },
  {
    id: 'CASE-2026-1049',
    name: 'Metropolitan Bank Document Security',
    description: 'Real-world authentication of digital mortgage contract signatures and stamp patterns. Suspected scanning bypass.',
    investigator: 'Analyst Varshika',
    priority: 'LOW',
    status: 'COMPLETE',
    evidenceName: 'mortgage_scan_signature.jpg',
    evidenceUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600',
    timestamp: '2026-07-14 17:05:32 UTC',
    authenticityScore: 94.5, // highly authentic
    trustIndex: 96.1,
    evidenceStrength: 98.2,
    riskFactor: 4.2,
    integrityIndex: 97.5,
    consensusAgreement: 100.0,
    dnaScores: {
      texture: 92.1,
      noise: 95.4,
      lighting: 91.2,
      edges: 93.8,
      frequency: 96.0,
      compression: 89.2,
      diffusion: 98.4,
      promptArtifacts: 99.1
    },
    fingerprints: {
      textureSignature: 'ORGANIC_PULP_MAT',
      noiseSignature: 'PHYSICAL_CCD_SENSOR_P12',
      reflectionSignature: 'ABSORBENT_PAPER_MATTE',
      frequencySignature: 'NATURAL_SPECTRUM_CONGRUENT',
      compressionSignature: 'JPEG_ORIGINAL_CAMERA',
      promptArtifactSignature: 'ZERO_SYNTHETIC_BIAS',
      lightingSignature: 'COHERENT_NATURAL_SHADOW',
      visualConsistency: 96.8
    },
    consensusModels: [
      { name: 'ResNet50_DNA', prediction: 'REAL', confidence: 99.4, agreement: true, inferenceTime: 10.5, attentionMap: 'NONE' },
      { name: 'EfficientNet_B7_V4', prediction: 'REAL', confidence: 99.7, agreement: true, inferenceTime: 21.0, attentionMap: 'NONE' },
      { name: 'MobileNet_EdgeAI', prediction: 'REAL', confidence: 98.9, agreement: true, inferenceTime: 5.9, attentionMap: 'NONE' },
      { name: 'VisionTransformer_L16', prediction: 'REAL', confidence: 99.8, agreement: true, inferenceTime: 29.4, attentionMap: 'NONE' }
    ],
    genomeAttribution: {
      stableDiffusion: 0.1,
      midjourney: 0.2,
      dalle: 0.0,
      flux: 0.1,
      firefly: 0.2,
      ideogram: 0.1,
      leonardo: 0.1
    },
    timeMachineSteps: [
      { phase: 'Physical Sensor Capture', status: 'COMPLETED', description: 'The image displays authentic CCD scan lines and lens vignetting.', timestamp: '17:05:33', attributes: ['Sensor: Fujitsu 7160', 'Color Depth: 24bit RGB'] }
    ],
    analystNotes: 'All forensic scores indicate authentic organic physical capture. Natural ink bleeding matches document pulp texture perfectly. Zero synthetic generative models detected.',
    dnaHash: 'dna_hash_881a2bc0d8e23f990111aa',
    fingerprintHash: 'fp_sig_0411a0033c4d5e'
  }
];

export const mockAnalytics = {
  dailyInvestigations: [
    { name: 'Mon', total: 18, synthetic: 12, real: 6 },
    { name: 'Tue', total: 24, synthetic: 18, real: 6 },
    { name: 'Wed', total: 32, synthetic: 25, real: 7 },
    { name: 'Thu', total: 21, synthetic: 15, real: 6 },
    { name: 'Fri', total: 35, synthetic: 28, real: 7 },
    { name: 'Sat', total: 12, synthetic: 8, real: 4 },
    { name: 'Sun', total: 15, synthetic: 11, real: 4 }
  ],
  generatorTrends: [
    { name: 'Stable Diffusion', percentage: 22 },
    { name: 'Midjourney', percentage: 31 },
    { name: 'DALL-E 3', percentage: 15 },
    { name: 'FLUX.1', percentage: 25 },
    { name: 'Adobe Firefly', percentage: 5 },
    { name: 'Other', percentage: 2 }
  ],
  threatLevels: [
    { name: '00:00', value: 42 },
    { name: '04:00', value: 38 },
    { name: '08:00', value: 65 },
    { name: '12:00', value: 89 },
    { name: '16:00', value: 78 },
    { name: '20:00', value: 55 }
  ],
  authenticityDistribution: [
    { name: '0-20% (Highly Synth)', count: 48 },
    { name: '21-40% (Synth-Mod)', count: 32 },
    { name: '41-60% (Ambiguous)', count: 12 },
    { name: '61-80% (Real-Mod)', count: 22 },
    { name: '81-100% (Highly Real)', count: 64 }
  ]
};
