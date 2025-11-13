import React, { useState, useEffect, type ReactNode } from 'react';
import type { Entry, MoodContextType } from '../types';
import { analyzeEmotion, fetchQuote } from '../utils/api';
import { loadEntries, saveEntries } from '../utils/localStorage';
import { MoodContext } from './useMood';

interface MoodProviderProps {
  children: ReactNode;
}

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentMood, setCurrentMood] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Check localStorage for saved theme preference
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Load entries on mount
  useEffect(() => {
    loadEntriesFromStorage();
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = (): void => {
    setDarkMode(prev => !prev);
  };

  const analyzeMood = async (text: string): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const mood = await analyzeEmotion(text);
      setCurrentMood(mood);
      await fetchQuoteForMood(mood);
    } catch (err) {
      setError('Failed to analyze mood. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuoteForMood = async (mood: string): Promise<void> => {
    try {
      const fetchedQuote = await fetchQuote(mood);
      setQuote(fetchedQuote);
    } catch (err) {
      setError('Failed to fetch quote. Please try again.');
      console.error(err);
    }
  };

  const addEntry = (entry: Entry): void => {
    const newEntries = [entry, ...entries];
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  const deleteEntry = (id: string): void => {
    const newEntries = entries.filter(entry => entry.id !== id);
    setEntries(newEntries);
    saveEntries(newEntries);
  };

  const loadEntriesFromStorage = (): void => {
    const storedEntries = loadEntries();
    setEntries(storedEntries);
  };

  const value: MoodContextType = {
    entries,
    currentMood,
    loading,
    error,
    quote,
    darkMode,
    analyzeMood,
    fetchQuoteForMood,
    addEntry,
    deleteEntry,
    loadEntriesFromStorage,
    toggleDarkMode,
  };

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
};