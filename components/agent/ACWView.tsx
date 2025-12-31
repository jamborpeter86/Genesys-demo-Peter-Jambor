
import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { mockSocketService } from '../../services/mockSocketService.ts';
import { CheckCircle, ClipboardList, Bot, Percent, ShieldCheck } from 'lucide-react';

const InteractionSummary = ({ summary }: { summary: string }) => (
    <div className="mt-4 animate-fade-in">
        <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><ClipboardList className="text-blue-300" /> Interaction Summary</h4>
        <div className="bg-gray-800/70 p-4 rounded-lg text-sm text-gray-300 border border-gray-700">
            {summary}
        </div>
    </div>
);

const InteractionScorecard = ({ score }: { score: { compliance: number, quality: number } }) => (
    <div className="mt-4 animate-fade-in">
        <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><CheckCircle className="text-green-400" /> Interaction Scorecard</h4>
        <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-green-900/50 p-4 rounded-lg border border-green-700">
                <ShieldCheck className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{score.compliance}%</p>
                <p className="text-sm text-green-300">Compliance Score</p>
            </div>
             <div className="bg-blue-900/50 p-4 rounded-lg border border-blue-700">
                <Percent className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{score.quality}/100</p>
                <p className="text-sm text-blue-300">Quality Score</p>
            </div>
        </div>
    </div>
);


const ACWView: React.FC = () => {
    const { simulationState, interactionSummary, interactionScore } = useAppStore();

    const handleGenerate = () => {
        mockSocketService.generateACW();
    };

    return (
        <div className="border-t border-gray-700 pt-4 mt-4 flex-shrink-0">
           {simulationState === 'ended' && (
                <button
                    onClick={handleGenerate}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <Bot className="w-5 h-5" />
                    Generate Summary (Auto-ACW)
                </button>
           )}
           {simulationState === 'acw' && (
               <div>
                   {interactionSummary && <InteractionSummary summary={interactionSummary} />}
                   {interactionScore && <InteractionScorecard score={interactionScore} />}
               </div>
           )}
        </div>
    );
};

export default ACWView;