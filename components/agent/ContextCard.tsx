
import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { AlertTriangle, TrendingDown, Info } from 'lucide-react';
import { Sentiment } from '../../types.ts';

const ContextCard: React.FC = () => {
    const { contextSummary, currentSentiment } = useAppStore();

    if (!contextSummary) {
        return null;
    }

    const isNegative = currentSentiment === Sentiment.NEGATIVE;

    const sentimentColor = {
        [Sentiment.POSITIVE]: 'text-green-400',
        [Sentiment.NEUTRAL]: 'text-yellow-400',
        [Sentiment.NEGATIVE]: 'text-red-300',
    };
    const sentimentIcon = {
        [Sentiment.POSITIVE]: null,
        [Sentiment.NEUTRAL]: null,
        [Sentiment.NEGATIVE]: <TrendingDown className="w-5 h-5" />,
    };

    const baseClasses = "border-2 rounded-xl p-4 shadow-lg animate-fade-in-down";
    const themeClasses = isNegative
        ? "bg-red-900/50 border-red-500"
        : "bg-blue-900/50 border-blue-500";
        
    const iconWrapperClasses = isNegative
        ? "bg-red-500/30"
        : "bg-blue-500/30";
        
    const iconClasses = isNegative ? "text-red-300" : "text-blue-300";

    return (
        <div className={`${baseClasses} ${themeClasses}`}>
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${iconWrapperClasses}`}>
                    <Info className={`w-6 h-6 ${iconClasses}`} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-white">Context Carryover</h3>
                    <p className="text-gray-300 mt-1">{contextSummary}</p>
                    <div className="mt-3 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                            <span className="font-semibold text-yellow-400">Bot Failure Detected</span>
                        </div>
                        <div className={`flex items-center gap-2 font-semibold ${sentimentColor[currentSentiment]}`}>
                            {sentimentIcon[currentSentiment]}
                            <span>Sentiment: {currentSentiment.charAt(0).toUpperCase() + currentSentiment.slice(1)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContextCard;
