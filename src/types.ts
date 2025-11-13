// Data model for mood entries
export interface Entry {
  id: string;
  date: string;
  text: string;
  mood: string;
  quote: { text: string; author: string };
  color: string;
}

// API response types
export interface EmotionResponse {
  emotion: Record<string, number>; // e.g., { happy: 0.8, sad: 0.2, ... }
}

export interface QuoteResponse {
  quote: string;
  author: string;
  category: string;
}
export interface MoodContextType {
  entries: Entry[];
  currentMood: string;
  loading: boolean;
  error: string;
  quote: { text: string; author: string } | null;
  darkMode: boolean;
  analyzeMood: (text: string) => Promise<void>;
  fetchQuoteForMood: (mood: string) => Promise<void>;
  addEntry: (entry: Entry) => void;
  deleteEntry: (id: string) => void;
  loadEntriesFromStorage: () => void;
  toggleDarkMode: () => void;
}