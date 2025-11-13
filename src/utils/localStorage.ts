import type { Entry } from '../types.ts';

const STORAGE_KEY = 'daily-muse-entries';

// Load entries from localStorage
export const loadEntries = (): Entry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading entries from localStorage:', error);
    return [];
  }
};

// Save entries to localStorage
export const saveEntries = (entries: Entry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving entries to localStorage:', error);
  }
};