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
  fetchQuoteForEmotion: (emotion: string) => Promise<void>;
  addEntry: (entry: Entry) => void;
  deleteEntry: (id: string) => void;
  loadEntriesFromStorage: () => void;
  toggleDarkMode: () => void;
}