
import { create } from 'zustand';
import type { Customer, Agent, Message, KnowledgeBaseArticle, IncidentLog, View } from '../types.ts';
import { Sentiment } from '../types.ts';

type SimulationState = 'idle' | 'bot_chat' | 'handoff' | 'agent_chat' | 'ended' | 'acw';

interface AppState {
  simulationState: SimulationState;
  activeView: View;
  customer: Customer | null;
  agent: Agent | null;
  chatMessages: Message[];
  aiSuggestions: KnowledgeBaseArticle[];
  contextSummary: string | null;
  currentSentiment: Sentiment;
  agentInputText: string;
  interactionSummary: string | null;
  interactionScore: { compliance: number; quality: number } | null;
  supervisorMetrics: {
    incidentLogs: IncidentLog[];
    ragAcceptanceRate: number; // percentage
    unrecognizedIntents: string[];
  };
  actions: {
    startSimulation: () => void;
    resetSimulation: () => void;
    setCustomer: (customer: Customer) => void;
    setAgent: (agent: Agent) => void;
    addMessage: (message: Message) => void;
    addBulkMessages: (messages: Message[]) => void;
    setContextSummary: (summary: string) => void;
    setAiSuggestions: (suggestions: KnowledgeBaseArticle[]) => void;
    setCurrentSentiment: (sentiment: Sentiment) => void;
    setSimulationState: (state: SimulationState) => void;
    setAgentInputText: (text: string) => void;
    setInteractionSummary: (summary: string | null) => void;
    setInteractionScore: (score: { compliance: number; quality: number } | null) => void;
    setIncidentLogs: (logs: IncidentLog[]) => void;
    addUnrecognizedIntent: (intent: string) => void;
    updateRagAcceptance: (rate: number) => void;
    setAgentStatus: (status: Agent['status']) => void;
    setActiveView: (view: View) => void;
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  simulationState: 'idle',
  activeView: 'customer',
  customer: null,
  agent: { id: 'alex', name: 'Alex', avatarUrl: 'https://i.pravatar.cc/150?u=alex', status: 'Available' },
  chatMessages: [],
  aiSuggestions: [],
  contextSummary: null,
  currentSentiment: Sentiment.NEUTRAL,
  agentInputText: '',
  interactionSummary: null,
  interactionScore: null,
  supervisorMetrics: {
    incidentLogs: [],
    ragAcceptanceRate: 92, // starting rate
    unrecognizedIntents: [],
  },
  actions: {
    startSimulation: () => {
      set({ simulationState: 'bot_chat' });
    },
    resetSimulation: () => {
      const agent = get().agent;
      set({
        simulationState: 'idle',
        customer: null,
        chatMessages: [],
        aiSuggestions: [],
        contextSummary: null,
        currentSentiment: Sentiment.NEUTRAL,
        agentInputText: '',
        interactionSummary: null,
        interactionScore: null,
        supervisorMetrics: {
          ...get().supervisorMetrics,
          unrecognizedIntents: [],
        },
        agent: agent ? { ...agent, status: 'Available' } : null,
      });
    },
    setCustomer: (customer) => set({ customer }),
    setAgent: (agent) => set({ agent }),
    addMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),
    addBulkMessages: (messages) => set((state) => ({ chatMessages: [...state.chatMessages, ...messages] })),
    setContextSummary: (summary) => set({ contextSummary: summary }),
    setAiSuggestions: (suggestions) => set({ aiSuggestions: suggestions }),
    setCurrentSentiment: (sentiment) => set({ currentSentiment: sentiment }),
    setSimulationState: (state) => set({ simulationState: state }),
    setAgentInputText: (text) => set({ agentInputText: text }),
    setInteractionSummary: (summary) => set({ interactionSummary: summary }),
    setInteractionScore: (score) => set({ interactionScore: score }),
    setIncidentLogs: (logs) => set((state) => ({ supervisorMetrics: { ...state.supervisorMetrics, incidentLogs: logs } })),
    addUnrecognizedIntent: (intent) => set((state) => ({ supervisorMetrics: { ...state.supervisorMetrics, unrecognizedIntents: [...state.supervisorMetrics.unrecognizedIntents, intent] }})),
    updateRagAcceptance: (rate) => set((state) => ({ supervisorMetrics: { ...state.supervisorMetrics, ragAcceptanceRate: rate }})),
    setAgentStatus: (status) => set((state) => ({
        agent: state.agent ? { ...state.agent, status } : state.agent
    })),
    setActiveView: (view) => set({ activeView: view }),
  },
}));

useAppStore.subscribe(
  (state, previousState) => {
    if (state.actions !== previousState.actions) {
      Object.assign(exportedActions, state.actions);
    }
  }
);

const exportedActions = { ...useAppStore.getState().actions };
export { exportedActions as actions };
