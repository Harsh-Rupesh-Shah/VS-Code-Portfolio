import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { cn } from '../utils/cn';

const RESUME_URL = 'https://example.com/resume.pdf'; // Replace with actual resume URL

interface CommandOutput {
  content: string;
  type: 'success' | 'error' | 'info';
}

export const Terminal = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<CommandOutput[]>([
    { content: 'Welcome to the Portfolio Terminal!', type: 'info' },
    { content: 'Type "help" to see available commands.', type: 'info' },
  ]);
  const [height, setHeight] = useState(192); // Default height (48px * 4)
  const [isResizing, setIsResizing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const { theme, mode } = useThemeStore();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && terminalRef.current) {
        e.preventDefault();
        const terminalBottom = window.innerHeight;
        const newHeight = terminalBottom - e.clientY;
        setHeight(Math.max(192, Math.min(newHeight, window.innerHeight * 0.8)));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newOutput: CommandOutput[] = [
        ...output,
        { content: `> ${command}`, type: 'info' }
      ];
      
      const [cmd, ...args] = command.toLowerCase().split(' ');
      
      switch (cmd) {
        case 'help':
          newOutput.push(
            { content: 'Available commands:', type: 'info' },
            { content: '  help              - Show this help message', type: 'info' },
            { content: '  clear             - Clear the terminal', type: 'info' },
            { content: '  git clone resume  - Download resume', type: 'info' },
            { content: '  npm run projects  - List all projects', type: 'info' },
            { content: '  npm run skills    - Show skills', type: 'info' },
            { content: '  npm run contact   - Show contact information', type: 'info' },
            { content: '  theme             - Show current theme', type: 'info' }
          );
          break;

        case 'clear':
          setOutput([]);
          setCommand('');
          return;

        case 'git':
          if (args[0] === 'clone' && args[1] === 'resume') {
            window.open(RESUME_URL, '_blank');
            newOutput.push(
              { content: 'Downloading resume...', type: 'success' },
              { content: 'Resume downloaded successfully!', type: 'success' }
            );
          } else {
            newOutput.push({ content: 'Invalid git command. Try "git clone resume"', type: 'error' });
          }
          break;

        case 'npm':
          if (args[0] === 'run') {
            switch (args[1]) {
              case 'projects':
                newOutput.push(
                  { content: '🚀 Projects:', type: 'success' },
                  { content: '  1. AI-Powered Analytics Platform', type: 'info' },
                  { content: '     - Enterprise-level analytics with ML', type: 'info' },
                  { content: '     - 1M+ daily data points', type: 'info' },
                  { content: '  2. E-commerce Microservices', type: 'info' },
                  { content: '     - Scalable platform with 10k+ users', type: 'info' },
                  { content: '     - 99.99% uptime', type: 'info' },
                  { content: '  3. Real-time Collaboration Tool', type: 'info' },
                  { content: '     - WebSocket-based platform', type: 'info' },
                  { content: '     - 10k+ daily active users', type: 'info' }
                );
                break;
              case 'skills':
                newOutput.push(
                  { content: '💻 Technical Skills:', type: 'success' },
                  { content: '  • Languages: JavaScript, TypeScript, Python, Java', type: 'info' },
                  { content: '  • Frontend: React, Next.js, Vue.js, Tailwind CSS', type: 'info' },
                  { content: '  • Backend: Node.js, Express, Django, Spring Boot', type: 'info' },
                  { content: '  • Databases: PostgreSQL, MongoDB, Redis', type: 'info' },
                  { content: '  • Cloud: AWS, Google Cloud, Azure', type: 'info' }
                );
                break;
              case 'contact':
                newOutput.push(
                  { content: '📫 Contact Information:', type: 'success' },
                  { content: '  • Email: john.doe@example.com', type: 'info' },
                  { content: '  • LinkedIn: linkedin.com/in/johndoe', type: 'info' },
                  { content: '  • GitHub: github.com/johndoe', type: 'info' },
                  { content: '  • Twitter: @johndoe', type: 'info' }
                );
                break;
              default:
                newOutput.push({ content: `Unknown command: npm run ${args[1]}`, type: 'error' });
            }
          } else {
            newOutput.push({ content: 'Invalid npm command. Try "npm run projects"', type: 'error' });
          }
          break;

        case 'theme':
          newOutput.push(
            { content: `Current theme: ${theme.name}`, type: 'success' },
            { content: `  Mode: ${mode}`, type: 'info' },
            { content: `  Accent color: ${theme.accent}`, type: 'info' }
          );
          break;

        default:
          newOutput.push({ content: `Command not found: ${command}`, type: 'error' });
      }
      
      setOutput(newOutput);
      setCommand('');
    }
  };

  return (
    <div 
      ref={terminalRef}
      className="border-t transition-all duration-300"
      style={{ 
        backgroundColor: theme.terminal,
        borderColor: theme.border,
        height: `${height}px`
      }}
    >
      <div 
        ref={resizeRef}
        className="h-9 flex items-center px-4 border-b transition-colors duration-300 cursor-ns-resize"
        style={{ 
          backgroundColor: theme.secondary,
          borderColor: theme.border
        }}
        onMouseDown={() => setIsResizing(true)}
      >
        <TerminalIcon className="w-4 h-4 mr-2" />
        <span className="text-sm">Terminal</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            className="p-1 hover:bg-white hover:bg-opacity-10 rounded"
            onClick={() => setHeight(prev => Math.max(192, prev - 48))}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            className="p-1 hover:bg-white hover:bg-opacity-10 rounded"
            onClick={() => setHeight(prev => Math.min(window.innerHeight * 0.8, prev + 48))}
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-2 font-mono text-sm overflow-y-auto" style={{ height: `calc(100% - 36px)` }}>
        {output.map((line, i) => (
          <div 
            key={i}
            className={cn(
              'terminal-output',
              line.type === 'error' ? 'text-red-500' :
              line.type === 'success' ? 'text-green-500' :
              ''
            )}
          >
            {line.content}
          </div>
        ))}
        <div className="flex items-center">
          <span className="mr-2">{'>'}</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent outline-none"
            style={{ color: theme.foreground }}
            spellCheck={false}
            placeholder="Type a command..."
          />
        </div>
      </div>
    </div>
  );
};