export interface FileType {
  name: string;
  content: string;
  language: string;
  icon: string;
}

export interface Theme {
  id: string;
  name: string;
  background: string;
  foreground: string;
  accent: string;
  secondary: string;
  terminal: string;
  editor: string;
  sidebar: string;
  border: string;
}

export type ThemeMode = 'dark' | 'minimal' | 'cyberpunk' | 'gaming';

export interface Tab {
  file: FileType;
  active: boolean;
}