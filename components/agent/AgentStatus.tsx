
import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';

const AgentStatus: React.FC = () => {
    const agent = useAppStore(state => state.agent);
    if (!agent) return null;

    const statusClasses = {
        Available: 'bg-green-500/20 text-green-300 ring-green-500/30',
        OnInteraction: 'bg-blue-500/20 text-blue-300 ring-blue-500/30',
        ACW: 'bg-yellow-500/20 text-yellow-300 ring-yellow-500/30',
    };

    return (
        <div className="flex items-center gap-4">
            <img src={agent.avatarUrl} alt={agent.name} className="w-16 h-16 rounded-full border-2 border-gray-600" />
            <div>
                <h4 className="text-xl font-bold text-white">{agent.name}</h4>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full w-fit ring-1 ${statusClasses[agent.status]}`}>
                    {agent.status.replace('OnInteraction', 'On Interaction')}
                </span>
            </div>
        </div>
    );
};

export default AgentStatus;
