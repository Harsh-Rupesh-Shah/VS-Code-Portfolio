import React, { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { ThemeMode } from '../types';
import { cn } from '../utils/cn';

export const ThemeSwitcher = () => {
  const { mode, setMode } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes: { id: ThemeMode; name: string }[] = [
    { id: 'dark', name: 'Hacker Style' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'cyberpunk', name: 'Cyberpunk' },
    { id: 'gaming', name: 'Gaming' }
  ];

  return (
    <div className="absolute top-4 right-4 z-50" ref={dropdownRef}>
      <div className="relative">
        <button 
          className={cn(
            "p-2.5 rounded-lg transition-all duration-200",
            "hover:bg-opacity-30 hover:scale-105",
            "focus:outline-none focus:ring-2 focus:ring-opacity-50",
            isOpen ? "bg-opacity-30 scale-105" : "bg-opacity-20",
            "bg-black"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Palette className="w-6 h-6" />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl overflow-hidden">
            <div className="py-2 bg-[#252526] backdrop-blur-lg bg-opacity-95">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  className={cn(
                    "w-full px-4 py-2.5 text-left transition-colors duration-200",
                    "hover:bg-[#37373d] focus:outline-none",
                    "flex items-center justify-between",
                    mode === theme.id ? "bg-[#37373d]" : ""
                  )}
                  onClick={() => {
                    setMode(theme.id);
                    setIsOpen(false);
                  }}
                >
                  <span>{theme.name}</span>
                  {mode === theme.id && (
                    <div className="w-2 h-2 rounded-full bg-current" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};