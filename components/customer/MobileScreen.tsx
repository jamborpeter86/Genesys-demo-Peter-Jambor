import React, { useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { Message, MessageSender } from '../../types.ts';
import { Bot, User } from 'lucide-react';

// FIX: Define props type separately to allow React's `key` prop.
type ChatBubbleProps = {
  message: Message, 
  customerAvatarUrl?: string
};

const ChatBubble = ({ message, customerAvatarUrl }: ChatBubbleProps) => {
  const isUser = message.sender === MessageSender.USER;
  const isBot = message.sender === MessageSender.BOT;
  const isAgent = message.sender === MessageSender.AGENT;
  
  return (
      <div className={`flex items-end gap-2 my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {!isUser && (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  {isBot ? <Bot className="w-5 h-5 text-blue-300" /> : <User className="w-5 h-5 text-green-300" />}
              </div>
          )}
          <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-600 text-gray-200 rounded-bl-none'}`}>
             <p>{message.text}</p>
          </div>
           {isUser && (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <img src={customerAvatarUrl} alt="User" className="w-full h-full rounded-full object-cover" />
              </div>
          )}
      </div>
  );
}

const MobileScreen: React.FC = () => {
  const { chatMessages, customer } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  return (
    <div className="w-[375px] h-[750px] bg-gray-900 rounded-[40px] border-[10px] border-gray-950 shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white"/>
            </div>
            <div>
                <p className="font-bold text-white">ApexBank Support</p>
                <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                </p>
            </div>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto">
        {chatMessages.map(msg => <ChatBubble key={msg.id} message={msg} customerAvatarUrl={customer?.avatarUrl} />)}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-800 flex-shrink-0">
        <div className="w-full bg-gray-700 rounded-full h-10 flex items-center px-4">
            <p className="text-sm text-gray-400">Enter your message...</p>
        </div>
      </div>
    </div>
  );
};

export default MobileScreen;