
import React from 'react';
import GalaxyView from './GalaxyView.tsx';
import RagFidelityChart from './RagFidelityChart.tsx';
import IntentDriftAlert from './IntentDriftAlert.tsx';
import Card from '../shared/Card.tsx';
import WhisperControl from './WhisperControl.tsx';
import { Aperture, BarChart2, AlertCircle } from 'lucide-react';
import PriorityListView from './PriorityListView.tsx';

const SupervisorView: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <div className="md:col-span-2 flex flex-col gap-6">
                 {/* Desktop View: Galaxy */}
                 <div className="hidden md:block h-full">
                     <Card className="p-6 h-full flex flex-col">
                         <h3 className="font-bold text-lg mb-4 flex items-center gap-2 flex-shrink-0"><Aperture className="text-blue-400"/> Agent Galaxy "Oculus" View</h3>
                         <p className="text-sm text-gray-400 mb-4 flex-shrink-0">Real-time heatmap of agent and customer sentiment across the floor.</p>
                         <div className="flex-grow">
                            <GalaxyView />
                         </div>
                     </Card>
                 </div>
                 {/* Mobile View: Priority List */}
                 <div className="block md:hidden">
                     <Card className="p-6">
                         <PriorityListView />
                     </Card>
                 </div>
            </div>
            <div className="md:col-span-1 flex flex-col gap-6">
                 <WhisperControl />
                <Card className="p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><BarChart2 className="text-blue-400" /> RAG Fidelity Dashboard</h3>
                    <p className="text-sm text-gray-400 mb-4">Live chart of AI suggestion acceptance rate by agents.</p>
                    <RagFidelityChart />
                </Card>
                <Card className="p-6 bg-yellow-900/40 border-yellow-600/60">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-yellow-300"><AlertCircle/> Intent Drift Alerts</h3>
                     <IntentDriftAlert />
                </Card>
            </div>
        </div>
    );
};

export default SupervisorView;
