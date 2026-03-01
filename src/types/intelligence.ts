export interface Briefing {
    id: string;
    timestamp: string;
    source: string; // e.g., "Reuters", "X-Intelligence", "Internal"
    category: 'GEOPOLITICAL' | 'MARKETS' | 'TECH' | 'SECURITY';
    title: string;
    summary: string;
    verificationScore: number; // 0-100
    isVoiceReady: boolean;
  }