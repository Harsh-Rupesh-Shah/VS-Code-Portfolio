import React from 'react';
import { FileCode, FileJson, FileText, ChevronDown, Folder } from 'lucide-react';
import { useFileStore } from '../store/useFileStore';
import { useThemeStore } from '../store/useThemeStore';
import { cn } from '../utils/cn';

const iconMap: Record<string, React.ReactNode> = {
  FileJs: <FileCode className="w-4 h-4" />,
  FileJson: <FileJson className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />
};

export const Sidebar = () => {
  const { files, openFile, tabs, sidebarVisible } = useFileStore();
  const { theme } = useThemeStore();
  
  if (!sidebarVisible) return null;

  return (
    <div 
      className="w-60 border-r transition-colors duration-300"
      style={{ 
        backgroundColor: theme.sidebar,
        borderColor: theme.border
      }}
    >
      <div className="p-2 font-medium flex items-center">
        <span className="text-sm">EXPLORER</span>
        <ChevronDown className="w-4 h-4 ml-1" />
      </div>
      <div className="p-2">
        <div className="flex items-center mb-2">
          <Folder className="w-4 h-4 mr-1" />
          <span className="text-sm">Portfolio</span>
        </div>
        <div className="ml-4">
          {files.map((file) => (
            <div
              key={file.name}
              className={cn(
                "flex items-center p-1 cursor-pointer rounded transition-colors duration-200",
                tabs.some(tab => tab.file.name === file.name && tab.active) 
                  ? "bg-[#37373d]" 
                  : "hover:bg-[#37373d]"
              )}
              onClick={() => openFile(file)}
            >
              {iconMap[file.icon]}
              <span className="text-sm ml-2">{file.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};