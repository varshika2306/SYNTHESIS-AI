/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Eye, EyeOff, Mail, Key, User, Building, ArrowRight, CheckCircle, Dna, Cpu, Search, Sparkles } from 'lucide-react';
import { register, login } from '../services/api';

interface SplashAuthProps {
  onAuthSuccess: (analystName: string, orgName: string) => void;
}

type AuthScreen = 
  | 'splash'
  | 'welcome'
  | 'signin'
  | 'signup'
  | 'forgot'
  | 'reset'
  | 'verify'
  | 'loading';

export default function SplashAuth({ onAuthSuccess }: SplashAuthProps) {
  const [screen, setScreen] = useState<AuthScreen>('splash');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [fullName, setFullName] = useState('Analyst Varshika');
  const [organization, setOrganization] = useState('Global Digital Forensics Org');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Loading logs animation states
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingLogs = [
    'Initializing SYNTHESIS AI...',
    'Loading Mission Control...',
    'Preparing Digital DNA Engine...',
    'Connecting Explainability Studio...',
    'Loading Investigation Workspace...',
    'Synchronizing Intelligence Modules...',
    'Welcome Back, Analyst.'
  ];

  // Auto transition from splash to welcome after DNA assemblies
  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => {
        setScreen('welcome');
      }, 4200);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Loading screen sequence
  useEffect(() => {
    if (screen === 'loading') {
      const timer = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingLogs.length - 1) {
            return prev + 1;
          } else {
            clearInterval(timer);
            // Trigger login success with a slight delay after the final log
            setTimeout(() => {
              onAuthSuccess(fullName, organization);
            }, 1000);
            return prev;
          }
        });
      }, 800);
      return () => clearInterval(timer);
    }
  }, [screen, fullName, organization, onAuthSuccess]);

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      setLoadingStep(0);
      setScreen('loading');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      await register(fullName, signupEmail, signupPassword);
      await login(signupEmail, signupPassword);
      setLoadingStep(0);
      setScreen('loading');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#050816] cyber-grid overflow-hidden">
      
      {/* Dynamic light nodes in the background */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[160px] pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {/* SCREEN: SPLASH */}
        {screen === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center z-10 px-4"
          >
            {/* DNA Assembly Animation Container */}
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
              {/* Spinning core */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-blue-500/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-36 h-36 border border-dashed border-cyan-400/30 rounded-full"
              />

              {/* DNA Strands Assembling into 'S' shape logo */}
              <svg className="w-40 h-40" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="dnaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="50%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#60A5FA" />
                  </linearGradient>
                </defs>
                
                {/* Connecting ladder rungs */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.line
                    key={i}
                    x1="25"
                    y1={20 + i * 8}
                    x2="75"
                    y2={20 + i * 8}
                    stroke="rgba(96, 165, 250, 0.25)"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: i * 0.2, duration: 0.8 }}
                  />
                ))}

                {/* Strand A - helix curve */}
                <motion.path
                  d="M 25,20 C 35,28 65,12 75,20 C 85,28 15,44 25,52 C 35,60 65,44 75,52 C 85,60 15,76 25,84"
                  fill="none"
                  stroke="url(#dnaGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "200", strokeDashoffset: "200" }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 3.5, ease: "easeInOut" }}
                />

                {/* Strand B - helix complementary */}
                <motion.path
                  d="M 75,20 C 65,28 35,12 25,20 C 15,28 85,44 75,52 C 65,60 35,44 25,52 C 15,60 85,76 75,84"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.7"
                  initial={{ strokeDasharray: "200", strokeDashoffset: "200" }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 3.5, ease: "easeInOut", delay: 0.4 }}
                />

                {/* Pulse particles around 'S' shape center */}
                <motion.circle
                  cx="50"
                  cy="52"
                  r="6"
                  fill="#38BDF8"
                  className="blur-[2px]"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ delay: 2.5, duration: 1.5, repeat: Infinity }}
                />
              </svg>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, duration: 0.8 }}
              className="text-4xl font-display font-bold tracking-widest text-white glow-text-blue"
            >
              SYNTHESIS AI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 2.8, duration: 0.8 }}
              className="mt-2 text-xs font-mono tracking-[0.4em] uppercase text-brand-muted"
            >
              Digital DNA Intelligence Platform
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2, duration: 1.2 }}
              className="mt-6 flex items-center gap-2 text-blue-400 font-mono text-sm tracking-wider"
            >
              <span>Decode.</span>
              <span className="opacity-40">•</span>
              <span>Explain.</span>
              <span className="opacity-40">•</span>
              <span>Trust.</span>
            </motion.div>
          </motion.div>
        )}

        {/* SCREEN: WELCOME */}
        {screen === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-5xl px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10"
          >
            {/* Visual branding & capabilities column */}
            <div className="md:col-span-6 flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <Dna className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-semibold tracking-wide">SYNTHESIS AI</h2>
                  <p className="text-[10px] font-mono text-brand-accent tracking-widest uppercase">Digital DNA Operating System</p>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight leading-tight text-white">
                Deep Media Forensics & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Explainable AI</span>
              </h1>

              <p className="text-brand-muted text-sm leading-relaxed">
                Enter the world’s most advanced digital forensic laboratory. Decode synthetic anomalies, inspect GAN and diffusion models’ fingerprints, and generate immutable digital passports for litigation and research.
              </p>

              {/* Mini capability items */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-md bg-cyan-950 flex items-center justify-center border border-cyan-500/20">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">Multi-Model Consensus</h4>
                    <p className="text-xs text-brand-muted">Consolidated prediction engine from ResNet50, EfficientNet, and Vision Transformers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-md bg-blue-950 flex items-center justify-center border border-blue-500/20">
                    <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">XAI Explainability Studio</h4>
                    <p className="text-xs text-brand-muted">Analyze high-resolution Grad-CAM spatial heatmaps, spectrum drops, and noise signatures.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-md bg-purple-950 flex items-center justify-center border border-purple-500/20">
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">Immutability Passports</h4>
                    <p className="text-xs text-brand-muted">Build cryptographic PDF certificates recording case details, integrity index, and QR code.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome buttons box (Figma/palantir visual frame) */}
            <div className="md:col-span-6 bg-[#0E1323]/80 border border-white/10 p-8 rounded-2xl glass-panel relative flex flex-col justify-center space-y-6">
              
              <div className="absolute top-4 right-4 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Enterprise SECURE
              </div>

              <div className="text-center pb-2">
                <h3 className="text-lg font-display font-bold text-white tracking-wide">Investigation Hub</h3>
                <p className="text-xs text-brand-muted mt-1">Select authentication mode or run preloaded simulation</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  id="auth-demo-btn"
                  onClick={() => setScreen('loading')}
                  className="group relative flex items-center justify-between w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium px-5 py-3.5 rounded-xl shadow-lg shadow-blue-500/15 border border-blue-400/20 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-cyan-300" />
                    <span className="text-sm font-semibold tracking-wide">Start Demo Investigation</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="auth-signin-btn"
                    onClick={() => setScreen('signin')}
                    className="flex items-center justify-center bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold py-3.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>

                  <button
                    id="auth-signup-btn"
                    onClick={() => setScreen('signup')}
                    className="flex items-center justify-center bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold py-3.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Create Account
                  </button>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-brand-muted text-[10px] font-mono uppercase tracking-widest">or continue with credentials</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setScreen('loading')}
                    className="flex items-center justify-center gap-2 bg-[#1F2937]/50 hover:bg-[#1F2937]/80 text-brand-muted hover:text-white border border-white/5 text-xs py-2.5 rounded-lg transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.743-.079-1.309-.176-1.765H12.24Z"/>
                    </svg>
                    Google
                  </button>
                  <button 
                    onClick={() => setScreen('loading')}
                    className="flex items-center justify-center gap-2 bg-[#1F2937]/50 hover:bg-[#1F2937]/80 text-brand-muted hover:text-white border border-white/5 text-xs py-2.5 rounded-lg transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                    GitHub
                  </button>
                </div>
              </div>

              <div className="text-center pt-2 text-[10px] text-brand-muted">
                Connecting to SYNTHESIS sovereign network node. Latency: ~14ms.
              </div>
            </div>
          </motion.div>
        )}

        {/* SCREEN: SIGN IN */}
        {screen === 'signin' && (
          <motion.div
            key="signin"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-md px-4 z-10"
          >
            <div className="bg-[#0E1323]/90 border border-white/10 p-8 rounded-2xl glass-panel relative">
              <div className="text-center mb-6">
                <Dna className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h2 className="text-2xl font-display font-bold text-white tracking-wide">Analyst Access</h2>
                <p className="text-xs text-brand-muted mt-1">Authenticate to open digital DNA laboratory</p>
              </div>

              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-brand-muted uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-muted" />
                    <input
                      id="signin-email"
                      type="email"
                      required
                      placeholder="analyst@forensics.synthesis.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#050816] text-white border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-mono text-brand-muted uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={() => setScreen('forgot')}
                      className="text-[11px] font-mono text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-muted" />
                    <input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#050816] text-white border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-brand-muted hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-white/10 bg-[#050816] text-blue-600 focus:ring-0 focus:ring-offset-0 w-4 h-4"
                    />
                    <span className="text-xs text-brand-muted">Remember session</span>
                  </label>
                  <span className="text-[10px] font-mono text-green-400/80 bg-green-950/40 px-2 py-0.5 rounded border border-green-500/15 uppercase tracking-wider">
                    Secure Crypt
                  </span>
                </div>

                <button
                  id="signin-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enter Mission Control
                </button>
                {authError && (
                  <p className="mt-3 text-xs text-red-400 font-mono text-left">{authError}</p>
                )}
              </form>

              <div className="mt-6 flex flex-col items-center justify-center space-y-4">
                <p className="text-xs text-brand-muted">
                  New investigator?{' '}
                  <button
                    onClick={() => setScreen('signup')}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Create account
                  </button>
                </p>

                <button
                  onClick={() => setScreen('welcome')}
                  className="text-xs text-brand-muted/70 hover:text-brand-muted transition-colors font-mono"
                >
                  ← Back to Portal Selection
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* SCREEN: SIGN UP */}
        {screen === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-md px-4 z-10"
          >
            <div className="bg-[#0E1323]/90 border border-white/10 p-8 rounded-2xl glass-panel">
              <div className="text-center mb-5">
                <User className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h2 className="text-2xl font-display font-bold text-white tracking-wide">Register Account</h2>
                <p className="text-xs text-brand-muted mt-1">Acquire state clearance for Synthesis DNA Lab</p>
              </div>

              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-mono text-brand-muted uppercase tracking-wider mb-1">Full Investigator Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-muted" />
                    <input
                      id="signup-name"
                      type="text"
                      required
                      placeholder="Analyst Varshika"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#050816] text-white border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-brand-muted uppercase tracking-wider mb-1">Organization / University</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-muted" />
                    <input
                      id="signup-org"
                      type="text"
                      required
                      placeholder="Cyber Security Intelligence agency"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full bg-[#050816] text-white border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-brand-muted uppercase tracking-wider mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-muted" />
                    <input
                      id="signup-email"
                      type="email"
                      required
                      placeholder="analyst@forensics.synthesis.ai"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full bg-[#050816] text-white border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-brand-muted uppercase tracking-wider mb-1">Secure Password</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-brand-muted" />
                    <input
                      id="signup-password"
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full bg-[#050816] text-white border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>

                <button
                  id="signup-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-cyan-500/10 mt-2 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Investigation Account
                </button>
                {authError && (
                  <p className="mt-3 text-xs text-red-400 font-mono text-left">{authError}</p>
                )}
              </form>

              <div className="mt-5 text-center space-y-3">
                <p className="text-xs text-brand-muted">
                  Already have access?{' '}
                  <button
                    onClick={() => setScreen('signin')}
                    className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                </p>
                <button
                  onClick={() => setScreen('welcome')}
                  className="text-xs text-brand-muted/70 hover:text-brand-muted transition-colors font-mono"
                >
                  ← Cancel and return
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* SCREEN: FORGOT PASSWORD */}
        {screen === 'forgot' && (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md px-4 z-10"
          >
            <div className="bg-[#0E1323]/90 border border-white/10 p-8 rounded-2xl glass-panel">
              <div className="text-center mb-6">
                <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h2 className="text-2xl font-display font-bold text-white">Reset Credentials</h2>
                <p className="text-xs text-brand-muted mt-1">Send secure recovery token to authorized inbox</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setScreen('reset'); }} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-brand-muted uppercase tracking-wider mb-1.5">Your Registered Email</label>
                  <input
                    type="email"
                    required
                    placeholder="analyst@forensics.synthesis.ai"
                    className="w-full bg-[#050816] text-white border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Transmit Recovery Token
                </button>
              </form>

              <button
                onClick={() => setScreen('signin')}
                className="mt-6 block w-full text-center text-xs text-brand-muted hover:text-white transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          </motion.div>
        )}

        {/* SCREEN: RESET PASSWORD */}
        {screen === 'reset' && (
          <motion.div
            key="reset"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md px-4 z-10"
          >
            <div className="bg-[#0E1323]/90 border border-white/10 p-8 rounded-2xl glass-panel">
              <div className="text-center mb-6">
                <Key className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <h2 className="text-2xl font-display font-bold text-white">Set New Password</h2>
                <p className="text-xs text-brand-muted mt-1">Authorization token validated. Specify new secret key.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setScreen('signin'); }} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-brand-muted uppercase tracking-wider mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-[#050816] text-white border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-brand-muted uppercase tracking-wider mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-[#050816] text-white border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Update & Authenticate
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* SCREEN: EMAIL VERIFICATION */}
        {screen === 'verify' && (
          <motion.div
            key="verify"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md px-4 z-10"
          >
            <div className="bg-[#0E1323]/90 border border-white/10 p-8 rounded-2xl glass-panel text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white">Inbox Clearance Required</h2>
              <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                We sent an asymmetric cryptographic verification link to your email inbox. Please click the clearance link to verify your identity.
              </p>

              <div className="bg-[#050816] p-3 rounded-xl border border-white/5 my-5 text-left text-xs font-mono text-brand-muted flex flex-col gap-1">
                <span className="text-blue-400"># Forensic Clearance Node:</span>
                <span>Node ID: SYN-CL-901</span>
                <span>Clearing: {fullName}</span>
              </div>

              <button
                onClick={() => setScreen('loading')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors cursor-pointer text-sm"
              >
                I have verified my email (Bypass)
              </button>

              <button
                onClick={() => setScreen('signin')}
                className="mt-4 text-xs text-brand-muted hover:text-white transition-colors"
              >
                ← Return to Login
              </button>
            </div>
          </motion.div>
        )}

        {/* SCREEN: LOADING (CINEMATIC) */}
        {screen === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center z-10 px-4 max-w-lg w-full"
          >
            <div className="relative w-24 h-24 mb-10">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-500/10 animate-spin" style={{ animationDuration: '8s' }}></div>
              <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/30 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}></div>
              <div className="absolute inset-4 rounded-full border-2 border-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <Dna className="w-7 h-7 text-white animate-pulse" />
              </div>
            </div>

            {/* Console output style logs */}
            <div className="w-full bg-[#0E1323]/90 border border-white/10 rounded-xl p-6 text-left font-mono text-xs text-brand-accent glass-panel shadow-2xl relative overflow-hidden">
              <div className="absolute top-2 right-4 flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              </div>
              
              <div className="text-[10px] text-brand-muted mb-3 border-b border-white/5 pb-2 uppercase tracking-widest flex items-center justify-between">
                <span>Node System Boot</span>
                <span>SECURE CRYPTO // 2026</span>
              </div>

              <div className="space-y-1.5 min-h-[140px] flex flex-col justify-end">
                {loadingLogs.slice(0, loadingStep + 1).map((log, index) => {
                  const isLast = index === loadingStep;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-start gap-2 ${isLast ? 'text-white font-semibold' : 'text-brand-muted'}`}
                    >
                      <span className="text-blue-500">{'>'}</span>
                      <span>{log}</span>
                      {isLast && index < loadingLogs.length - 1 && (
                        <span className="inline-block w-1.5 h-3.5 bg-blue-400 animate-pulse ml-0.5" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            <p className="mt-4 text-xs text-brand-muted/50 font-mono">
              Sovereign Node clearance sequence active
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
