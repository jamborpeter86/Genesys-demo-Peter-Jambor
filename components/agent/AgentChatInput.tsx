
import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { MessageSender } from '../../types.ts';
import { Send } from 'lucide-react';

const AgentChatInput: React.FC = () => {
    const { agentInputText, actions } = useAppStore();
    const { setAgentInputText, addMessage } = actions;

    const handleSend = () => {
        if (agentInputText.trim() === '') return;

        const newMessage = {
            id: `msg-agent-${Date.now()}`,
            sender: MessageSender.AGENT,
            text: agentInputText,
            timestamp: Date.now(),
        };
        addMessage(newMessage);
        setAgentInputText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="border-t border-gray-700 pt-4 mt-4 flex-shrink-0">
            <div className="relative">
                <textarea
                    value={agentInputText}
                    onChange={(e) => setAgentInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md p-3 pr-12 text-sm text-gray-200 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Type your message or apply a script..."
                />
                <button
                    onClick={handleSend}
                    className="absolute top-1/2 right-3 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors disabled:bg-gray-600"
                    disabled={!agentInputText.trim()}
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default AgentChatInput;
