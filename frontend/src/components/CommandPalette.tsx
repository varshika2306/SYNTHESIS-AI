/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, CornerDownLeft, Sparkles, Folder, Settings, ShieldAlert, Cpu, Database } from 'lucide-react';
import { DockTab } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionType: 'tab' | 'case' | 'action', payload: string) => void;
}

interface CommandItem {
  id: string;
  category: 'NAVIGATION' | 'INVESTIGATION' | 'METRICS';
  title: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: { type: 'tab' | 'case' | 'action'; payload: string };
}

export default function CommandPalette({ isOpen, onClose, onSelectAction }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const paletteRef = useRef<HTMLDivElement>(null);

  const items: CommandItem[] = [
    { id: 'act-new', category: 'INVESTIGATION', title: 'New Investigation', shortcut: '⌘ N', icon: <ShieldAlert className="w-4 h-4 text-red-400" />, action: { type: 'action', payload: 'create_case' } },
    { id: 'act-upload', category: 'INVESTIGATION', title: 'Upload Image', shortcut: '⌘ U', icon: <Cpu className="w-4 h-4 text-cyan-400" />, action: { type: 'action', payload: 'create_case' } },
    { id: 'nav-case', category: 'NAVIGATION', title: 'Recent Cases', shortcut: '⌥ C', icon: <Folder className="w-4 h-4 text-amber-400" />, action: { type: 'tab', payload: 'cases' } },
    { id: 'nav-dna', category: 'NAVIGATION', title: 'Digital DNA', shortcut: '⌥ D', icon: <Cpu className="w-4 h-4 text-purple-400" />, action: { type: 'tab', payload: 'dna_lab' } },
    { id: 'nav-fp', category: 'NAVIGATION', title: 'Fingerprint Engine', shortcut: '⌥ F', icon: <Sparkles className="w-4 h-4 text-pink-400" />, action: { type: 'tab', payload: 'dna_lab' } },
    { id: 'nav-pass', category: 'NAVIGATION', title: 'Passport', shortcut: '⌥ P', icon: <Settings className="w-4 h-4 text-rose-400" />, action: { type: 'tab', payload: 'passport' } },
    { id: 'nav-res', category: 'NAVIGATION', title: 'Research Mode', shortcut: '⌥ R', icon: <Database className="w-4 h-4 text-indigo-400" />, action: { type: 'tab', payload: 'research' } },
    { id: 'nav-an', category: 'NAVIGATION', title: 'Analytics', shortcut: '⌥ A', icon: <Folder className="w-4 h-4 text-emerald-400" />, action: { type: 'tab', payload: 'analytics' } }
  ];

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          const matched = filteredItems[selectedIndex];
          onSelectAction(matched.action.type, matched.action.payload);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose, onSelectAction]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#050816]/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] z-[9999] px-4">
      <div 
        ref={paletteRef}
        className="w-full max-w-2xl bg-[#0E1323]/95 border border-white/10 rounded-2xl shadow-2xl glass-panel-heavy overflow-hidden"
      >
        {/* Search header bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <Search className="w-5 h-5 text-brand-muted" />
          <input
            id="palette-search"
            type="text"
            placeholder="Type a workspace name, forensic case ID, or system action..."
            className="flex-grow bg-transparent text-sm text-white border-none outline-none placeholder:text-brand-muted"
            autoFocus
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-mono text-brand-muted">
            <span className="text-[10px]">ESC</span>
          </div>
        </div>

        {/* Results list */}
        <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-xs text-brand-muted font-mono">
              No intelligence nodes matched your query.
            </div>
          ) : (
            <div>
              {/* Grouping items by category */}
              {['NAVIGATION', 'INVESTIGATION', 'METRICS'].map((cat) => {
                const catItems = filteredItems.filter(i => i.category === cat);
                if (catItems.length === 0) return null;

                return (
                  <div key={cat} className="space-y-1 pb-2">
                    <div className="px-3 py-1.5 text-[9px] font-mono font-bold text-brand-accent tracking-widest uppercase">
                      {cat}
                    </div>
                    {catItems.map((item) => {
                      const absoluteIndex = filteredItems.indexOf(item);
                      const isSelected = absoluteIndex === selectedIndex;

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            onSelectAction(item.action.type, item.action.payload);
                            onClose();
                          }}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-blue-600/20 text-white border-l-2 border-blue-500' 
                              : 'hover:bg-white/5 text-brand-muted hover:text-white border-l-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="opacity-80">{item.icon}</div>
                            <span className="text-xs font-medium tracking-wide">{item.title}</span>
                          </div>
                          {item.shortcut ? (
                            <div className="text-[10px] font-mono text-brand-muted/70 bg-white/5 border border-white/5 px-1.5 py-0.5 rounded">
                              {item.shortcut}
                            </div>
                          ) : isSelected ? (
                            <div className="flex items-center gap-1 text-[10px] font-mono text-blue-400">
                              <span>Enter</span>
                              <CornerDownLeft className="w-2.5 h-2.5" />
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer info bar */}
        <div className="bg-brand-bg/80 border-t border-white/5 px-5 py-2.5 flex justify-between items-center text-[10px] font-mono text-brand-muted">
          <div className="flex items-center gap-1">
            <span>Use</span>
            <span className="text-white">↑↓</span>
            <span>to navigate,</span>
            <span className="text-white">Enter</span>
            <span>to execute clearance</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Synthesis AI Core v2026.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
