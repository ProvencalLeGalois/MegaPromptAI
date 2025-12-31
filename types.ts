export enum TaskType {
  GENERAL = 'GENERAL',
  CODING = 'CODING',
  CREATIVE = 'CREATIVE',
  ACADEMIC = 'ACADEMIC',
  BUSINESS = 'BUSINESS'
}

export enum Language {
  FR = 'FR',
  EN = 'EN',
  ES = 'ES',
  DE = 'DE'
}

export enum PromptLength {
  SHORT = 'SHORT',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  MEGA = 'MEGA'
}

export interface OptimizedResult {
  originalPrompt: string;
  optimizedPrompt: string;
  explanation: string;
  score: number;
  components: {
    role: string;
    task: string;
    context: string;
    format: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
}

export type AspectRatio = "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9";
