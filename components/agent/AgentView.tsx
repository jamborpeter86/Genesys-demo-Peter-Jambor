
import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import Card from '../shared/Card.tsx';
import ContextCard from './ContextCard.tsx';
import UnifiedTimeline from './UnifiedTimeline.tsx';
import AgentAssist from './AgentAssist.tsx';
import CustomerInfo from './CustomerInfo.tsx';
import AgentChatInput from './AgentChatInput.tsx';
import ACWView from './ACWView.tsx';
import AgentStatus from './AgentStatus.tsx';
import { MessageSquare, ShieldCheck, User, BrainCircuit, UserCheck } from 'lucide-react';

const AgentView: React.FC = () => {
    const { simulationState, customer } = useAppStore();

    if (simulationState === 'idle' || simulationState === 'bot_chat' || !customer) {
        return (
            <div className="flex items-center justify-center h-full text-center">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Agent Dashboard</h2>
                    <Card className="p-4 inline-block">
                        <AgentStatus />
                    </Card>
                    <p className="text-gray-400 mt-4">Waiting for an incoming customer interaction...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            {/* Left Column: Customer Info & Details */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                 <Card className="p-4">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><UserCheck className="text-blue-400" /> Agent Status</h3>
                    <AgentStatus />
                </Card>
                <Card className="p-4">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><User className="text-blue-400" /> Customer Profile</h3>
                    <CustomerInfo />
                </Card>
                <Card className="p-4">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ShieldCheck className="text-green-400" /> Security & Compliance</h3>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">Passive Biometrics</span>
                            <span className="flex items-center gap-2 text-sm font-semibold text-green-400">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Voice Match Verified
                            </span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">Accent Normalization</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" value="" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                     </div>
                </Card>
            </div>

            {/* Middle Column: Conversation Timeline */}
            <div className="lg:col-span-2 flex flex-col gap-6 h-full">
                <ContextCard />
                <Card className="flex-1 flex flex-col p-4">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 flex-shrink-0"><MessageSquare className="text-blue-400" /> Unified Timeline</h3>
                    <UnifiedTimeline />
                     {simulationState === 'agent_chat' && <AgentChatInput />}
                     {(simulationState === 'ended' || simulationState === 'acw') && <ACWView />}
                </Card>
            </div>

            {/* Right Column: AI Assist */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <Card className="p-4 flex-1">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><BrainCircuit className="text-blue-400" /> Predictive Agent Assist</h3>
                    <AgentAssist />
                </Card>
            </div>
        </div>
    );
};

export default AgentView;