import { useEffect, useState } from 'react';
import { useFileStore } from '../store/useFileStore';
import { useThemeStore } from '../store/useThemeStore';

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { openFile, files } = useFileStore();
  const { setMode } = useThemeStore();

  useEffect(() => {
    let recognition: any = null;

    const initializeSpeechRecognition = () => {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onend = () => {
          setIsListening(false);
          // Restart recognition
          if (!error) {
            recognition.start();
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setError(event.error);
          setIsListening(false);
        };

        recognition.onresult = (event: any) => {
          const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
          console.log('Voice command received:', command);

          // Handle commands
          if (command.includes('show me your projects')) {
            const projectsFile = files.find(f => f.name === 'Projects.json');
            if (projectsFile) {
              openFile(projectsFile);
            }
          }
          else if (command.includes('show experience') || command.includes('work history')) {
            const experienceFile = files.find(f => f.name === 'Experience.js');
            if (experienceFile) {
              openFile(experienceFile);
            }
          }
          else if (command.includes('education') || command.includes('qualifications')) {
            const educationFile = files.find(f => f.name === 'Education.js');
            if (educationFile) {
              openFile(educationFile);
            }
          }
          else if (command.includes('contact') || command.includes('get in touch')) {
            const contactFile = files.find(f => f.name === 'Contact.md');
            if (contactFile) {
              openFile(contactFile);
            }
          }
          else if (command.includes('switch to dark mode')) {
            setMode('dark');
          }
          else if (command.includes('switch to minimal')) {
            setMode('minimal');
          }
          else if (command.includes('switch to cyberpunk')) {
            setMode('cyberpunk');
          }
          else if (command.includes('switch to gaming')) {
            setMode('gaming');
          }
        };

        recognition.start();
      } catch (err) {
        setError('Speech recognition is not supported in this browser.');
        console.error('Speech recognition initialization error:', err);
      }
    };

    initializeSpeechRecognition();

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [openFile, files, setMode, error]);

  return { isListening, error };
};