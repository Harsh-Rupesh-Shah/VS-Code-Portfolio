import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { useFileStore } from '../store/useFileStore';
import { useThemeStore } from '../store/useThemeStore';
import { X, Menu, FileCode, FileJson, FileText } from 'lucide-react';
import { cn } from '../utils/cn';
import { Resume } from './Resume';
import { GitHubActivity } from './GitHubActivity';

const languageMap: Record<string, any> = {
  javascript: javascript(),
  json: javascript({ jsx: false }),
  markdown: markdown(),
};

const iconMap: Record<string, React.ReactNode> = {
  FileJs: <FileCode className="w-4 h-4" />,
  FileJson: <FileJson className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />
};

export const Editor = () => {
  const { tabs, closeTab, setActiveTab, toggleSidebar } = useFileStore();
  const { theme } = useThemeStore();

  const activeTab = tabs.find(tab => tab.active);
  if (!activeTab) return null;

  const renderContent = () => {
    if (activeTab.file.language === 'pdf') {
      return <Resume pdfUrl="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" />;
    }

    if (activeTab.file.name === 'GitHub.activity') {
      return <GitHubActivity />;
    }

    return (
      <CodeMirror
        value={activeTab.file.content}
        height="calc(100vh - 36px)"
        theme={oneDark}
        extensions={[languageMap[activeTab.file.language]]}
        readOnly
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
        }}
      />
    );
  };

  return (
    <div 
      className="flex-1 overflow-hidden"
      style={{ backgroundColor: theme.editor }}
    >
      <div 
        className="h-9 border-b flex items-center"
        style={{ 
          backgroundColor: theme.secondary,
          borderColor: theme.border
        }}
      >
        <button
          onClick={toggleSidebar}
          className="px-2 py-1 hover:bg-[#37373d] transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="flex-1 flex overflow-x-auto">
          {tabs.map(({ file, active }) => (
            <div
              key={file.name}
              className={cn(
                "h-full flex items-center px-3 border-r cursor-pointer group",
                active ? "bg-[#1e1e1e]" : "hover:bg-[#2d2d2d]"
              )}
              style={{ borderColor: theme.border }}
              onClick={() => setActiveTab(file.name)}
            >
              {iconMap[file.icon]}
              <span className="ml-2 text-sm">{file.name}</span>
              <button
                className="ml-2 p-1 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-[#37373d]"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(file.name);
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
      {renderContent()}
    </div>
  );
};