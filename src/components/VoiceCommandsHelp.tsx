import React, { useState } from 'react';
import { Mic, X } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { cn } from '../utils/cn';

export const VoiceCommandsHelp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useThemeStore();

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg",
          "bg-white bg-opacity-10 hover:bg-opacity-20",
          "transition-all duration-200 shadow-lg",
          "border border-opacity-20",
          "text-sm font-medium"
        )}
        style={{ borderColor: theme.border }}
      >
        <Mic className="w-4 h-4" />
        Voice Commands
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div 
            className="w-full max-w-md rounded-lg shadow-xl"
            style={{ backgroundColor: theme.background }}
          >
            <div 
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: theme.border }}
            >
              <h2 className="text-lg font-semibold">Voice Commands Guide</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white hover:bg-opacity-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-medium mb-3">Available Commands:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div 
                      className="px-2 py-1 rounded text-sm"
                      style={{ backgroundColor: theme.secondary }}
                    >
                      "Show me your projects"
                    </div>
                    <span className="text-sm opacity-75">
                      Opens the projects.json file
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div 
                      className="px-2 py-1 rounded text-sm"
                      style={{ backgroundColor: theme.secondary }}
                    >
                      "Switch to dark mode"
                    </div>
                    <span className="text-sm opacity-75">
                      Activates the hacker-style theme
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div 
                      className="px-2 py-1 rounded text-sm"
                      style={{ backgroundColor: theme.secondary }}
                    >
                      "Download resume"
                    </div>
                    <span className="text-sm opacity-75">
                      Downloads the CV automatically
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-3">How to Use:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm opacity-75">
                  <li>Click the "Voice Commands" button in the bottom left</li>
                  <li>Allow microphone access when prompted</li>
                  <li>Speak any of the commands listed above clearly</li>
                  <li>Wait for the command to be processed</li>
                </ol>
              </div>

              <div 
                className="p-4 rounded-lg text-sm"
                style={{ backgroundColor: theme.secondary }}
              >
                <p className="font-medium mb-2">Note:</p>
                <p className="opacity-75">
                  Voice commands are automatically enabled when you visit the portfolio. 
                  You can speak commands at any time without clicking any buttons. 
                  This guide is just for reference.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};