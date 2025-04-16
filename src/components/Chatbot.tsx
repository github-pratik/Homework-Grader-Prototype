import React, { useEffect, useState, useRef } from 'react';
import { MessageCircleIcon, XIcon, SendIcon, BotIcon } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';
import ChatMessage from './ChatMessage';
const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([{
    id: '1',
    content: "Hello! I'm your Homework Grader Assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date().toISOString()
  }]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    // Add user message
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    // Process the message and get bot response
    const response = await getBotResponse(input.trim().toLowerCase());
    // Add bot response
    const botMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      content: response,
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, botMessage]);
  };
  const getBotResponse = async (message: string): Promise<string> => {
    // Simple Q&A logic - can be expanded with more sophisticated matching
    const responses: {
      [key: string]: string;
    } = {
      hello: 'Hi there! How can I assist you with grading today?',
      help: 'I can help you with: \n- Understanding grading criteria\n- Calculating scores\n- Managing assignments\n- Analyzing student performance',
      'how to grade': 'To grade assignments:\n1. Select an assignment\n2. Choose a student submission\n3. Assign points for each criterion\n4. Provide feedback\n5. Submit the grade',
      criteria: 'Each assignment has specific grading criteria. You can view and edit them when creating or grading assignments.',
      export: "You can export grades as CSV files from the Analysis page. Look for the 'Export CSV' button.",
      feedback: 'When grading, provide specific feedback for each criterion and overall feedback at the bottom of the grading form.'
    };
    // Default response for unknown queries
    let response = "I'm not sure about that. Try asking about grading, assignments, criteria, or analysis.";
    // Check for matching keywords
    for (const [key, value] of Object.entries(responses)) {
      if (message.includes(key)) {
        response = value;
        break;
      }
    }
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return response;
  };
  return <>
      {/* Chat Button */}
      <button onClick={() => setIsOpen(true)} className={`fixed bottom-4 right-4 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all z-50 ${isOpen ? 'hidden' : 'flex'}`}>
        <MessageCircleIcon size={24} />
      </button>
      {/* Chat Window */}
      <div className={`fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col transition-all z-50 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <BotIcon size={20} className="text-blue-600" />
            </div>
            <h3 className="font-semibold">Grading Assistant</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map(message => <ChatMessage key={message.id} message={message} />)}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t">
          <div className="flex gap-2">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <SendIcon size={20} />
            </button>
          </div>
        </form>
      </div>
    </>;
};
export default Chatbot;