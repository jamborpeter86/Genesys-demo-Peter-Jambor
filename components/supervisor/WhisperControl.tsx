
import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import Card from '../shared/Card.tsx';
import { useAppStore } from '../../store/useAppStore.ts';
import { mockSocketService } from '../../services/mockSocketService.ts';

const WhisperControl: React.FC = () => {
    const [whisperText, setWhisperText] = useState("Great job handling that risk disclaimer!");
    const simulationState = useAppStore(state => state.simulationState);
    const isChatActive = simulationState === 'agent_chat';

    const handleSendWhisper = () => {
        if (whisperText.trim() === '') return;
        mockSocketService.sendSupervisorWhisper(whisperText);
        setWhisperText('');
    };

    return (
        <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Mic className="text-blue-400" /> Whisper Control</h3>
            <p className="text-sm text-gray-400 mb-2">Send a private message to the agent.</p>
            <textarea
                value={whisperText}
                onChange={(e) => setWhisperText(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-gray-200 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-800"
                rows={2}
                placeholder="Type a message to the agent..."
                disabled={!isChatActive}
            />
            <button
                onClick={handleSendWhisper}
                className="mt-2 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
                disabled={!isChatActive || !whisperText.trim()}
            >
                Send Whisper
            </button>
        </Card>
    );
};

export default WhisperControl;