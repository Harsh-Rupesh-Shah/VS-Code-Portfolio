import { create } from 'zustand';
import { Theme, ThemeMode } from '../types';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  theme: Theme;
}

const themes: Record<ThemeMode, Theme> = {
  dark: {
    id: 'dark',
    name: 'Hacker Style',
    background: '#1e1e1e',
    foreground: '#cccccc',
    accent: '#1a8870',
    secondary: '#252526',
    terminal: '#1e1e1e',
    editor: '#1e1e1e',
    sidebar: '#252526',
    border: '#3c3c3c'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    background: '#ffffff',
    foreground: '#2d2d2d',
    accent: '#0066cc',
    secondary: '#f8f9fa',
    terminal: '#ffffff',
    editor: '#ffffff',
    sidebar: '#f8f9fa',
    border: '#e2e8f0'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    background: '#0d0221',
    foreground: '#00ff9f',
    accent: '#ff003c',
    secondary: '#120424',
    terminal: '#0d0221',
    editor: '#0d0221',
    sidebar: '#120424',
    border: '#ff003c'
  },
  gaming: {
    id: 'gaming',
    name: 'Gaming',
    background: '#1a1c2c',
    foreground: '#f4f4f4',
    accent: '#ff004d',
    secondary: '#29366f',
    terminal: '#1a1c2c',
    editor: '#1a1c2c',
    sidebar: '#29366f',
    border: '#83769c'
  }
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'dark',
  theme: themes.dark,
  setMode: (mode) => set({ mode, theme: themes[mode] })
}));