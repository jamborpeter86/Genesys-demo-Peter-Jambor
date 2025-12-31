
import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { Zap } from 'lucide-react';

const IntentDriftAlert: React.FC = () => {
    const unrecognizedIntents = useAppStore(state => state.supervisorMetrics.unrecognizedIntents);

    if (unrecognizedIntents.length === 0) {
        return (
            <div className="text-center text-sm text-gray-400">
                <p>No new unrecognized intents detected.</p>
                <p>System is operating within known parameters.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-3">
            {unrecognizedIntents.map((intent, index) => (
                <div key={index} className="bg-yellow-800/50 p-3 rounded-lg flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                        <span className="text-sm font-semibold text-yellow-200">{intent}</span>
                    </div>
                    <button className="text-xs bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-2 rounded-md transition-colors">
                        Create Intent
                    </button>
                </div>
            ))}
        </div>
    );
};

export default IntentDriftAlert;
