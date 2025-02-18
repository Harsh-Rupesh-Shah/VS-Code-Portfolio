import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useFileStore } from '../store/useFileStore';
import { cn } from '../utils/cn';
import { marked } from 'marked';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

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

  const generateSystemPrompt = () => {
    const portfolioContent = files.map(file => `${file.name}:\n${file.content}`).join('\n\n');
    
    return `You are an AI assistant for a portfolio website. You have access to the following portfolio content:

${portfolioContent}

Please use this information to provide accurate and helpful responses about the portfolio owner's experience, projects, and skills. Format your responses using markdown for better readability.

When answering:
1. Be concise and professional
2. Use markdown formatting for better readability
3. Reference specific projects and experiences from the portfolio
4. Provide code examples when relevant
5. Use bullet points and headers for organization`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !GEMINI_API_KEY) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: generateSystemPrompt() }]
            },
            {
              role: 'model',
              parts: [{ text: 'I understand. I will help answer questions about the portfolio using the provided content.' }]
            },
            {
              role: 'user',
              parts: [{ text: userMessage }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I encountered an error processing your request. Please ensure your Gemini API key is properly configured in the .env file." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!GEMINI_API_KEY) {
    return (
      <div 
        className={cn(
          "fixed bottom-4 right-4 w-96 rounded-lg shadow-xl p-4",
          "border border-opacity-20 bg-red-500 bg-opacity-10"
        )}
      >
        <p className="text-sm">
          Please add your Gemini API key to the .env file:
          <br />
          <code className="mt-2 block bg-black bg-opacity-20 p-2 rounded">
            VITE_GEMINI_API_KEY=your_key_here
          </code>
        </p>
      </div>
    );
  }

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