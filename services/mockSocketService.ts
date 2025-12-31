
import { actions, useAppStore } from '../store/useAppStore.ts';
import type { Customer, Message, KnowledgeBaseArticle, IncidentLog } from '../types.ts';
import { MessageSender, Sentiment } from '../types.ts';

const {
    setCustomer, addMessage, addBulkMessages, setContextSummary, setAiSuggestions,
    setCurrentSentiment, setSimulationState, setIncidentLogs, addUnrecognizedIntent, updateRagAcceptance,
    setInteractionSummary, setInteractionScore, setAgentStatus
} = actions;

class MockSocketService {
    private timeouts: ReturnType<typeof setTimeout>[] = [];
    private eventLog: string[] = [];
    private isLoaded = false;
    private customerData: Customer | null = null;
    private initialChatHistory: Message[] = [];
    private knowledgeBase: KnowledgeBaseArticle[] = [];
    private incidentLogs: IncidentLog[] = [];
    private unsubscribe: (() => void) | null = null;

    async init() {
        if(this.isLoaded) return;
        console.log("MockSocketService Initializing and loading data...");

        try {
            const [customerRes, chatRes, kbRes, logsRes] = await Promise.all([
                fetch('./data/customer.json'),
                fetch('./data/chatHistory.json'),
                fetch('./data/knowledgeBase.json'),
                fetch('./data/incidentLogs.json'),
            ]);
            this.customerData = await customerRes.json();
            this.initialChatHistory = await chatRes.json();
            this.knowledgeBase = await kbRes.json();
            this.incidentLogs = await logsRes.json();
            this.isLoaded = true;
            console.log("Mock data loaded successfully.");
        } catch (error) {
            console.error("Failed to load mock data:", error);
        }
    }

    startScenario() {
        if (!this.isLoaded || !this.customerData) {
            console.error("Data not loaded. Cannot start scenario.");
            return;
        }

        const customerData = this.customerData;
        const initialChatHistory = this.initialChatHistory;
        const knowledgeBase = this.knowledgeBase;
        const incidentLogs = this.incidentLogs;

        this.logEvent('Scenario Started');
        this.clearTimeouts();
        
        this.unsubscribe = useAppStore.subscribe(
            (state, prevState) => {
                if (state.chatMessages.length === prevState.chatMessages.length) return;

                const lastMessage = state.chatMessages[state.chatMessages.length - 1];
                if (
                    lastMessage &&
                    lastMessage.sender === MessageSender.AGENT &&
                    lastMessage.text.includes("crypto assets are volatile")
                ) {
                    this.logEvent('Compliance script sent by agent. Ending interaction shortly.');
                    this.schedule(() => {
                        setSimulationState('ended');
                        setAgentStatus('ACW');
                    }, 2500);
                    this.unsubscribe?.(); // Unsubscribe after triggering
                }
            }
        );
        
        // 1. Set initial data
        this.schedule(() => {
            setCustomer(customerData as Customer);
            setIncidentLogs(incidentLogs as IncidentLog[]);
            this.logEvent('Customer and Incident data loaded');
        }, 100);

        // 2. Simulate bot chat
        this.schedule(() => {
            addBulkMessages(initialChatHistory.slice(0, 2) as Message[]);
            this.logEvent('Initial bot chat messages displayed');
        }, 1000);

        this.schedule(() => {
            addMessage(initialChatHistory[2] as Message);
            this.logEvent('User asks about fees');
        }, 3000);

        this.schedule(() => {
            addMessage(initialChatHistory[3] as Message);
            this.logEvent('Bot responds about fees');
        }, 5000);

        // 3. The Failure Point
        this.schedule(() => {
            addMessage(initialChatHistory[4] as Message);
            this.logEvent('User asks about "Error 505" - The failure point');
        }, 8000);

        this.schedule(() => {
            addMessage(initialChatHistory[5] as Message);
            this.logEvent('Bot fails, asks to rephrase');
        }, 10000);

        this.schedule(() => {
            addMessage(initialChatHistory[6] as Message);
            this.logEvent('User repeats, frustrated');
        }, 12000);

        this.schedule(() => {
            addMessage(initialChatHistory[7] as Message);
            this.logEvent('Bot fails again, triggers sentiment drop');
        }, 14000);
        
        // 4. Sentiment Drop and Handoff
        this.schedule(() => {
            setCurrentSentiment(Sentiment.NEGATIVE);
            setSimulationState('handoff');
            this.logEvent('SENTIMENT_DROP event, state -> handoff');
        }, 14500);

        this.schedule(() => {
            addUnrecognizedIntent('Crypto Activation Error 505');
            this.logEvent('INTENT_DRIFT_ALERT event');
        }, 15000);

        this.schedule(() => {
            const handoffMessage: Message = {
                id: 'msg-handoff',
                sender: MessageSender.BOT,
                text: "I'm sorry I couldn't help. Connecting you to a specialist who can assist with activation errors.",
                timestamp: Date.now(),
            };
            addMessage(handoffMessage);
            this.logEvent('Bot initiates handoff');
        }, 15500);
        
        // 5. Agent receives interaction
        this.schedule(() => {
            setContextSummary("Customer 'Alex Smith' is getting 'Error 505' activating their new Crypto-Native Debit Card. Bot failed to assist after two attempts. Sentiment is negative.");
            setAiSuggestions(knowledgeBase as KnowledgeBaseArticle[]);
            setSimulationState('agent_chat');
            setAgentStatus('OnInteraction');
            this.logEvent('INCOMING_INTERACTION event for Agent. Context and AI suggestions pushed.');
        }, 17000);
    }

    sendSupervisorWhisper(text: string) {
         if (!text.trim()) return;
         const whisper: Message = {
            id: `msg-whisper-${Date.now()}`,
            sender: MessageSender.SYSTEM,
            text: text,
            timestamp: Date.now(),
            type: 'whisper'
        };
        addMessage(whisper);
        this.logEvent('Supervisor whisper sent to agent manually');
    }

    generateACW() {
        this.logEvent('Agent requested ACW Summary.');
        setSimulationState('acw');

        this.schedule(() => {
             setInteractionSummary("Customer attempted to activate Crypto Staking, encountered Error 505. Agent provided compliance disclaimer for High-Risk Assets and guided user through troubleshooting. Customer sentiment improved from Negative to Neutral. Validated via Voice Liveness.");
             this.logEvent('Interaction summary generated.');
        }, 1000);
       
        this.schedule(() => {
             setInteractionScore({ compliance: 100, quality: 94 });
             this.logEvent('Interaction scorecard generated.');
        }, 1500);
    }

    stopScenario() {
        this.logEvent('Scenario Stopped');
        this.clearTimeouts();
        this.unsubscribe?.();
    }

    cleanup() {
        this.clearTimeouts();
        this.unsubscribe?.();
    }

    private schedule(callback: () => void, delay: number) {
        const timeout = setTimeout(callback, delay);
        this.timeouts.push(timeout);
    }

    private clearTimeouts() {
        this.timeouts.forEach(clearTimeout);
        this.timeouts = [];
    }
    
    private logEvent(event: string) {
        const timestamp = new Date().toISOString();
        console.log(`[MockSocket] ${timestamp}: ${event}`);
        this.eventLog.push(`${timestamp}: ${event}`);
    }
}

export const mockSocketService = new MockSocketService();