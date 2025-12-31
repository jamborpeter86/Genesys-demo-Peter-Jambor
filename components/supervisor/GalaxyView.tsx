
import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { IncidentLog, Sentiment } from '../../types.ts';
import { User, Phone } from 'lucide-react';

const GalaxyView: React.FC = () => {
  const { supervisorMetrics, agent, customer, simulationState, currentSentiment } = useAppStore();
  const { setActiveView } = useAppStore(state => state.actions);
  const { incidentLogs } = supervisorMetrics;

  if (!agent) return null; // Should not happen in this simulation

  const liveInteraction: IncidentLog = {
    agentId: agent.id,
    agentName: agent.name,
    customerId: customer?.id || 'unknown',
    sentiment: currentSentiment,
    duration: 0,
    intent: 'Crypto Activation'
  };

  const displayLogs = simulationState.includes('chat') ? [liveInteraction, ...incidentLogs] : incidentLogs;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {displayLogs.map((log) => {
        const isLive = log.agentId === agent?.id && simulationState.includes('chat');
        const sentimentClasses: Record<Sentiment, { bg: string; pulse: string; text: string }> = {
            [Sentiment.POSITIVE]: { bg: 'bg-green-500', pulse: 'ring-green-400', text: 'text-green-200' },
            [Sentiment.NEUTRAL]: { bg: 'bg-yellow-500', pulse: 'ring-yellow-400', text: 'text-yellow-200' },
            [Sentiment.NEGATIVE]: { bg: 'bg-red-500', pulse: 'ring-red-400', text: 'text-red-200' },
        };
        const classes = sentimentClasses[log.sentiment];

        const handleClick = () => {
            if (isLive) {
                setActiveView('agent');
            }
        };
        
        return (
          <div 
            key={log.agentId} 
            className={`flex flex-col items-center text-center p-2 transition-colors duration-200 ${isLive ? 'cursor-pointer rounded-lg hover:bg-gray-700/50' : ''}`}
            onClick={handleClick}
            title={isLive ? "Click to view this interaction" : ""}
          >
            <div className={`relative w-20 h-20 rounded-full flex items-center justify-center border-2 border-gray-600 ${classes.bg} ${isLive ? `animate-pulse ring-4 ${classes.pulse}` : ''}`}>
              <User className="w-8 h-8 text-white" />
              {isLive && (
                <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1.5">
                    <Phone className="w-3 h-3 text-white animate-pulse"/>
                </div>
              )}
            </div>
            <p className="mt-2 font-semibold text-white text-sm">{log.agentName}</p>
            <p className={`text-xs ${classes.text} capitalize font-medium`}>{log.intent}</p>
          </div>
        );
      })}
    </div>
  );
};

export default GalaxyView;
