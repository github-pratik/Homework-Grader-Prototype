import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { BotIcon, UserIcon } from 'lucide-react';
interface ChatMessageProps {
  message: ChatMessageType;
}
const ChatMessage: React.FC<ChatMessageProps> = ({
  message
}) => {
  const isBot = message.sender === 'bot';
  return <div className={`flex items-start gap-2 mb-4 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isBot ? 'bg-blue-100' : 'bg-gray-100'}`}>
        {isBot ? <BotIcon size={16} className="text-blue-600" /> : <UserIcon size={16} className="text-gray-600" />}
      </div>
      <div className={`max-w-[75%] rounded-lg px-4 py-2 ${isBot ? 'bg-blue-50' : 'bg-gray-50'}`}>
        <p className="text-sm text-gray-800">{message.content}</p>
        <span className="text-xs text-gray-500 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}
        </span>
      </div>
    </div>;
};
export default ChatMessage;