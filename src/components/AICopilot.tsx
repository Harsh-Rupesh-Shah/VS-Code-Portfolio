import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useFileStore } from '../store/useFileStore';
import { cn } from '../utils/cn';
import { marked } from 'marked';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export const AICopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Hi! I'm your AI assistant. I can help you:\n\n" +
        "- Navigate through the portfolio\n" +
        "- Find relevant projects\n" +
        "- Answer technical questions\n" +
        "- Provide code examples\n\n" +
        "What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeStore();
  const { openFile, files } = useFileStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      let response = '';
      const lowerInput = userMessage.toLowerCase();

      if (lowerInput.includes('project') || lowerInput.includes('work')) {
        const projectsFile = files.find(f => f.name === 'Projects.json');
        if (projectsFile) {
          openFile(projectsFile);
          response = "I've opened the Projects file for you. You can see all the projects I've worked on. Would you like me to highlight any specific type of project?";
        }
      } else if (lowerInput.includes('experience') || lowerInput.includes('work history')) {
        const experienceFile = files.find(f => f.name === 'Experience.js');
        if (experienceFile) {
          openFile(experienceFile);
          response = "I've opened my work experience file. You can see my professional journey here. Let me know if you have any specific questions!";
        }
      } else if (lowerInput.includes('education') || lowerInput.includes('study')) {
        const educationFile = files.find(f => f.name === 'Education.js');
        if (educationFile) {
          openFile(educationFile);
          response = "Here's my educational background. I've highlighted my degrees and certifications. Would you like to know more about any specific area?";
        }
      } else if (lowerInput.includes('contact') || lowerInput.includes('reach')) {
        const contactFile = files.find(f => f.name === 'Contact.md');
        if (contactFile) {
          openFile(contactFile);
          response = "I've opened my contact information. Feel free to reach out through any of these channels!";
        }
      } else if (lowerInput.includes('interview') || lowerInput.includes('question')) {
        response = "Here's a common interview question and solution:\n\n" +
          "**Question: Explain the difference between `let`, `const`, and `var` in JavaScript.**\n\n" +
          "```javascript\n" +
          "// var - function-scoped, can be redeclared\n" +
          "var x = 1;\n" +
          "var x = 2; // OK\n\n" +
          "// let - block-scoped, can be reassigned\n" +
          "let y = 1;\n" +
          "y = 2; // OK\n" +
          "let y = 3; // Error!\n\n" +
          "// const - block-scoped, cannot be reassigned\n" +
          "const z = 1;\n" +
          "z = 2; // Error!\n" +
          "```\n\n" +
          "Would you like to practice more interview questions?";
      } else {
        response = "I'd be happy to help you explore my portfolio. You can ask about:\n\n" +
          "- Projects and technologies I've worked with\n" +
          "- Work experience and achievements\n" +
          "- Educational background\n" +
          "- Technical skills\n" +
          "- Contact information\n\n" +
          "What would you like to know more about?";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 w-96 rounded-lg shadow-xl transition-all duration-300",
        "border border-opacity-20",
        isOpen ? "h-[600px]" : "h-12"
      )}
      style={{ 
        backgroundColor: theme.secondary,
        borderColor: theme.border
      }}
    >
      <div 
        className="h-12 px-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-medium">AI Copilot</span>
        </div>
        <button>
          {isOpen ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronUp className="w-5 h-5" />
          )}
        </button>
      </div>

      {isOpen && (
        <>
          <div 
            className="h-[calc(100%-96px)] overflow-y-auto p-4 space-y-4"
            style={{ backgroundColor: theme.editor }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3 p-3 rounded-lg",
                  message.role === 'assistant' ? "bg-opacity-10 bg-white" : "bg-opacity-5 bg-white"
                )}
              >
                {message.role === 'assistant' ? (
                  <Bot className="w-6 h-6 flex-shrink-0 mt-1" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex-shrink-0 mt-1" />
                )}
                <div 
                  className="prose prose-invert max-w-none flex-1"
                  dangerouslySetInnerHTML={{ 
                    __html: marked(message.content, { breaks: true }) 
                  }}
                />
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-opacity-10 bg-white">
                <Bot className="w-6 h-6" />
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form 
            onSubmit={handleSubmit}
            className="h-20 p-4 border-t flex gap-2"
            style={{ borderColor: theme.border }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 rounded-lg bg-opacity-10 bg-white focus:outline-none focus:ring-2 ring-opacity-50"
              style={{ 
                backgroundColor: theme.editor,
                '--tw-ring-color': theme.accent
              } as React.CSSProperties}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "px-4 rounded-lg transition-colors",
                "bg-opacity-10 hover:bg-opacity-20",
                "bg-white",
                (!input.trim() || isLoading) && "opacity-50 cursor-not-allowed"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};