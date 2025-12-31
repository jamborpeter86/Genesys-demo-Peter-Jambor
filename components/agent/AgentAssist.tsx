
import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { Lightbulb, Link as LinkIcon, ThumbsDown, ThumbsUp, Sparkles } from 'lucide-react';

const AgentAssist: React.FC = () => {
  const { aiSuggestions, actions } = useAppStore();
  const { setAgentInputText } = actions;

  if (aiSuggestions.length === 0) {
    return <div className="text-center text-gray-400 text-sm p-4">No suggestions at this time.</div>;
  }
  
  const handleApplyScript = (content: string) => {
    setAgentInputText(content);
  }

  return (
    <div className="space-y-4 overflow-y-auto h-full pr-2 -mr-2">
      {aiSuggestions.map(suggestion => (
        <div key={suggestion.id} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/80 transition-shadow hover:shadow-lg hover:border-blue-500/50">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-blue-300 flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5" />
              {suggestion.title}
            </h4>
             <button
                onClick={() => handleApplyScript(suggestion.content)}
                title="Apply Script"
                className="flex-shrink-0 ml-2 p-2 rounded-full bg-blue-600/50 text-blue-300 hover:bg-blue-600 hover:text-white transition-colors"
              >
                  <Sparkles className="w-4 h-4" />
              </button>
          </div>

          <p className="text-sm text-gray-300 mb-3">{suggestion.content}</p>
          <div className="flex justify-between items-center mt-3 border-t border-gray-600 pt-3">
             <a href={suggestion.source} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                <LinkIcon className="w-3 h-3"/>
                Explainability (XAI)
            </a>
            <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-full bg-gray-600 hover:bg-green-500 text-gray-300 hover:text-white transition-colors"><ThumbsUp className="w-4 h-4" /></button>
                <button className="p-1.5 rounded-full bg-gray-600 hover:bg-red-500 text-gray-300 hover:text-white transition-colors"><ThumbsDown className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentAssist;
