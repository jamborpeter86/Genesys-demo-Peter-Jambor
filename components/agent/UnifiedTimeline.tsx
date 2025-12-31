import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { Message, MessageSender } from '../../types.ts';
import { Bot, User, UserCheck, Mic } from 'lucide-react';

// FIX: Define props type separately to allow React's `key` prop.
type MessageBubbleProps = {
    msg: Message;
    customerName?: string;
};

const MessageBubble = ({ msg, customerName }: MessageBubbleProps) => {
    const isUser = msg.sender === MessageSender.USER;
    const isBot = msg.sender === MessageSender.BOT;
    const isAgent = msg.sender === MessageSender.AGENT;
    const isWhisper = msg.type === 'whisper';
    
    if (isWhisper) {
        return (
             <div className="flex gap-3 my-4 items-center bg-yellow-900/40 border border-yellow-700/60 rounded-lg p-3">
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-yellow-600">
                    <Mic className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="font-bold text-sm text-yellow-200">Supervisor Whisper</p>
                    <p className="text-yellow-100 text-sm">{msg.text}</p>
                </div>
            </div>
        )
    }

    const Icon = isBot ? Bot : (isAgent ? UserCheck : User);
    const senderName = isBot ? "ApexBot" : (isAgent ? "Alex (Agent)" : customerName);

    return (
        <div className={`flex gap-3 my-4 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                isUser ? 'bg-gray-600' : isBot ? 'bg-blue-600' : 'bg-green-600'
            }`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className={`w-full max-w-lg p-3 rounded-lg ${isUser ? 'bg-blue-700' : 'bg-gray-700'}`}>
                <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-sm">{senderName}</p>
                    <p className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
                <p className={`text-gray-200 text-sm ${msg.isStuckPoint ? 'text-red-300 font-semibold' : ''}`}>{msg.text}</p>
            </div>
        </div>
    );
}

const UnifiedTimeline: React.FC = () => {
    const chatMessages = useAppStore(state => state.chatMessages);
    const customer = useAppStore(state => state.customer);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    return (
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            {chatMessages.map(msg => <MessageBubble key={msg.id} msg={msg} customerName={customer?.name} />)}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default UnifiedTimeline;