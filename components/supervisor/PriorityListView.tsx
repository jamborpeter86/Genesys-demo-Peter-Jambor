import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { IncidentLog, Sentiment } from '../../types.ts';
import { User, Phone } from 'lucide-react';

const sentimentOrder = {
  [Sentiment.NEGATIVE]: 1,
  [Sentiment.NEUTRAL]: 2,
  [Sentiment.POSITIVE]: 3,
};

// FIX: Define props type separately to allow React's `key` prop.
type PriorityListItemProps = {
  log: IncidentLog;
  isLive: boolean;
};

const PriorityListItem = ({ log, isLive }: PriorityListItemProps) => {
  const sentimentClasses: Record<Sentiment, { border: string; iconColor: string; text: string }> = {
      [Sentiment.POSITIVE]: { border: 'border-green-500', iconColor: 'text-green-400', text: 'text-green-200' },
      [Sentiment.NEUTRAL]: { border: 'border-yellow-500', iconColor: 'text-yellow-400', text: 'text-yellow-200' },
      [Sentiment.NEGATIVE]: { border: 'border-red-500', iconColor: 'text-red-400', text: 'text-red-200' },
  };
  const classes = sentimentClasses[log.sentiment];

  return (
    <div className={`bg-gray-800/60 p-4 rounded-lg border-l-4 ${classes.border} flex items-center justify-between ${isLive ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
      <div className="flex items-center gap-4">
        <User className={`w-6 h-6 ${classes.iconColor}`} />
        <div>
          <p className="font-bold text-white">{log.agentName}</p>
          <p className="text-sm text-gray-300">{log.intent}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isLive && <Phone className="w-4 h-4 text-blue-400 animate-pulse" />}
        <span className={`text-sm font-semibold capitalize ${classes.text}`}>{log.sentiment}</span>
      </div>
    </div>
  );
};


const PriorityListView: React.FC = () => {
  const { supervisorMetrics, agent, customer, simulationState, currentSentiment } = useAppStore();
  const { incidentLogs } = supervisorMetrics;

  if (!agent) return null;

  const liveInteraction: IncidentLog = {
    agentId: agent.id,
    agentName: agent.name,
    customerId: customer?.id || 'unknown',
    sentiment: currentSentiment,
    duration: 0,
    intent: 'Crypto Activation'
  };

  const displayLogs = (simulationState.includes('chat') ? [liveInteraction, ...incidentLogs] : incidentLogs)
    .slice() // Create a shallow copy to avoid mutating the original array
    .sort((a, b) => sentimentOrder[a.sentiment] - sentimentOrder[b.sentiment]);

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg text-white">Priority List</h3>
      <p className="text-sm text-gray-400 mb-4">Interactions sorted by negative sentiment.</p>
      {displayLogs.map((log) => (
         <PriorityListItem key={log.agentId} log={log} isLive={log.agentId === agent.id && simulationState.includes('chat')} />
      ))}
    </div>
  );
};

export default PriorityListView;