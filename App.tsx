
import React, { useState, useEffect } from 'react';
import { useAppStore } from './store/useAppStore.ts';
import { mockSocketService } from './services/mockSocketService.ts';
import AgentView from './components/agent/AgentView.tsx';
import SupervisorView from './components/supervisor/SupervisorView.tsx';
import MobileSimulatorView from './components/customer/MobileSimulatorView.tsx';
import { LayoutDashboard, User, Smartphone, Bot } from 'lucide-react';
import type { View } from './types.ts';

const App: React.FC = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const simulationState = useAppStore(state => state.simulationState);
  const activeView = useAppStore(state => state.activeView);
  const { startSimulation, resetSimulation, setActiveView } = useAppStore(state => state.actions);

  useEffect(() => {
    const initialize = async () => {
      await mockSocketService.init();
      setIsDataLoaded(true);
    };
    initialize();
    
    return () => {
      mockSocketService.cleanup();
    };
  }, []);

  const handleStartSimulation = () => {
    mockSocketService.startScenario();
    startSimulation();
  };

  const handleResetSimulation = () => {
    mockSocketService.stopScenario();
    resetSimulation();
  };

  const renderView = () => {
    switch (activeView) {
      case 'agent':
        return <AgentView />;
      case 'supervisor':
        return <SupervisorView />;
      case 'customer':
        return <MobileSimulatorView />;
      default:
        return <MobileSimulatorView />;
    }
  };

  const NavButton = ({ view, label, icon: Icon }: { view: View; label: string; icon: React.ElementType }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex flex-col items-center justify-center space-y-1 px-4 py-2 text-xs font-medium transition-all duration-200 rounded-lg ${
        activeView === view
          ? 'bg-blue-600/80 text-white'
          : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col antialiased">
       <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 p-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <Bot className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Genesys <span className="text-blue-400">Experience Orchestration Hub</span>
          </h1>
          <span className="text-xs font-semibold bg-gray-700 text-blue-300 px-2 py-1 rounded-md">
            Apex Global Bank
          </span>
        </div>
        <div className="flex items-center space-x-4">
           {simulationState === 'idle' && (
             <button
               onClick={handleStartSimulation}
               className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
               disabled={!isDataLoaded}
             >
               {isDataLoaded ? 'Start Scenario' : 'Loading...'}
             </button>
           )}
           {simulationState !== 'idle' && (
             <button onClick={handleResetSimulation} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
               Reset Scenario
             </button>
           )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-24 bg-gray-900/30 border-r border-gray-700/50 p-3 flex flex-col items-center space-y-4">
          <NavButton view="customer" label="Customer" icon={Smartphone} />
          <NavButton view="agent" label="Agent" icon={User} />
          <NavButton view="supervisor" label="Supervisor" icon={LayoutDashboard} />
        </nav>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-800/20">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
