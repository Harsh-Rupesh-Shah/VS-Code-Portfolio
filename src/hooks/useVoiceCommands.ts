import { useEffect, useState } from 'react';
import { useFileStore } from '../store/useFileStore';
import { useThemeStore } from '../store/useThemeStore';

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const { openFile, files } = useFileStore();
  const { setMode } = useThemeStore();

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    if ('webkitSpeechRecognition' in window) {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();

        // Handle commands
        if (command.includes('show me your projects')) {
          const projectsFile = files.find(f => f.name === 'Projects.json');
          if (projectsFile) {
            openFile(projectsFile);
          }
        }
        else if (command.includes('switch to dark mode')) {
          setMode('dark');
        }
        else if (command.includes('download resume')) {
          const link = document.createElement('a');
          link.href = '/resume.pdf'; // Update with actual resume URL
          link.download = 'resume.pdf';
          link.click();
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    // Start listening
    if (recognition) {
      recognition.start();
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [openFile, files, setMode]);

  return { isListening };
};