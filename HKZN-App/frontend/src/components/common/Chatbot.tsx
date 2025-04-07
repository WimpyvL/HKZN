import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, SendHorizonal, X } from 'lucide-react';
import { serviceCategories, ServiceCategory, ServiceOption, formatCurrency } from '@/data/wizardServices'; // Import the data

interface Message {
  sender: 'user' | 'bot';
  text: string | React.ReactNode; // Allow React nodes for richer formatting
}

// Basic NLP/Keyword matching logic (will be expanded)
const processUserQuery = (query: string): string | React.ReactNode => {
  const lowerQuery = query.toLowerCase();

  // --- Simple Keyword Matching ---

  // Greeting
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
    return "Hello! How can I help you with our services today? You can ask about specific packages like 'website', 'hosting', 'seo', or ask for details like 'cost of Essential Website Package'.";
  }

  // List categories
  if (lowerQuery.includes('list services') || lowerQuery.includes('what services') || lowerQuery.includes('categories')) {
    return (
      <div>
        <p>We offer the following service categories:</p>
        <ul>
          {serviceCategories.map(cat => <li key={cat.id}>- {cat.title} (Ask about '{cat.id.split('-')[0]}')</li>)}
        </ul>
      </div>
    );
  }

  // Find specific option details
  let foundOption: ServiceOption | null = null;
  let foundCategory: ServiceCategory | null = null;
  for (const category of serviceCategories) {
    for (const option of category.options) {
      if (lowerQuery.includes(option.name.toLowerCase())) {
        foundOption = option;
        foundCategory = category;
        break;
      }
    }
    if (foundOption) break;
  }

  if (foundOption && foundCategory) {
    return (
      <div>
        <p><strong>{foundOption.name}</strong> (Part of {foundCategory.title}):</p>
        <p>{foundOption.description}</p>
        <p>Cost: {formatCurrency(foundOption.oneOffCost)} once-off + {formatCurrency(foundOption.monthlyCost)} / month</p>
        <p>Features:</p>
        <ul>
          {foundOption.features.map((feature, index) => <li key={index}>- {feature}</li>)}
        </ul>
      </div>
    );
  }

  // Find category options
  let matchedCategory: ServiceCategory | null = null;
  for (const category of serviceCategories) {
      // Match based on title words or category id prefix
      const titleWords = category.title.toLowerCase().split(' ');
      const idPrefix = category.id.split('-')[0].toLowerCase();
      if (titleWords.some(word => lowerQuery.includes(word)) || lowerQuery.includes(idPrefix)) {
          matchedCategory = category;
          break;
      }
  }

  if (matchedCategory) {
      return (
          <div>
              <p>Okay, here are the options for <strong>{matchedCategory.title}</strong>:</p>
              <ul>
                  {matchedCategory.options.map(opt => (
                      <li key={opt.name}>- {opt.name} (Ask "{opt.name}" for details)</li>
                  ))}
              </ul>
          </div>
      );
  }


  // Default fallback
  return "Sorry, I couldn't find specific information for that. You can ask me to 'list services' or ask about a specific package like 'Enhanced Website Package'.";
};


export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    const botResponseText = processUserQuery(inputValue);
    const botMessage: Message = { sender: 'bot', text: botResponseText };

    setMessages([...messages, userMessage, botMessage]);
    setInputValue('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Add initial greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: 'bot', text: "Hello! Ask me about our services (e.g., 'website packages', 'hosting options', 'cost of Starter SEO')." }]);
    }
  }, [isOpen, messages.length]);


  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          className="fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg z-50"
          onClick={() => setIsOpen(true)}
          aria-label="Open Chatbot"
        >
          <Bot size={28} />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-card border rounded-lg shadow-xl flex flex-col z-50">
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b bg-primary text-primary-foreground rounded-t-lg">
            <h3 className="font-semibold">Service Assistant</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close Chatbot">
              <X size={20} />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-grow p-3" ref={scrollAreaRef}>
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-2 rounded-lg text-sm ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-3 border-t flex items-center">
            <Input
              type="text"
              placeholder="Ask about services..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="flex-grow mr-2"
              aria-label="Chat input"
            />
            <Button onClick={handleSendMessage} size="icon" aria-label="Send message">
              <SendHorizonal size={20} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
