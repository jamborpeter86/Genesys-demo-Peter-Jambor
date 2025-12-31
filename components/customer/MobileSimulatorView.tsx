
import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import MobileScreen from './MobileScreen.tsx';

const MobileSimulatorView: React.FC = () => {
    const simulationState = useAppStore(state => state.simulationState);

    const getStatusText = () => {
        switch (simulationState) {
            case 'idle':
                return 'Waiting to start scenario...';
            case 'bot_chat':
                return 'Customer is chatting with ApexBot.';
            case 'handoff':
                return 'Bot is handing off to a human agent.';
            case 'agent_chat':
                return 'Customer is now connected with a human agent.';
            case 'ended':
                return 'Interaction has ended.';
            default:
                return '';
        }
    }
    
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-8">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Customer Experience Simulator</h2>
            <p className="text-gray-400">This panel simulates the customer's mobile app view in real-time.</p>
            <p className="mt-2 text-lg font-medium text-blue-300 animate-pulse">{getStatusText()}</p>
        </div>
        <MobileScreen />
    </div>
  );
};

export default MobileSimulatorView;
