import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Terminal } from './components/Terminal';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { AICopilot } from './components/AICopilot';
import { VoiceCommandsHelp } from './components/VoiceCommandsHelp';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const { theme } = useThemeStore();

  return (
    <div 
      className="h-screen flex flex-col relative transition-colors duration-300"
      style={{ 
        backgroundColor: theme.background,
        color: theme.foreground,
        '--theme-accent': theme.accent,
        '--theme-border': theme.border
      } as React.CSSProperties}
    >
      <ThemeSwitcher />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <Editor />
      </div>
      <Terminal />
      <AICopilot />
      <VoiceCommandsHelp />
    </div>
  );
}

export default App;