import React, { useState, useEffect, useRef } from 'react';
import { useMood } from '../context/useMood';
import { getMoodColor } from '../utils/moodColors';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

const MoodInput: React.FC = () => {
  const [text, setText] = useState('');
  const { fetchQuoteForEmotion, currentMood, loading, error, quote, addEntry } = useMood();
  const workerRef = useRef<Worker | null>(null);
  const currentTextRef = useRef<string>('');

  useEffect(() => {
    // Create Web Worker
    workerRef.current = new Worker(new URL('../utils/EmotionWorker.ts', import.meta.url), { type: 'module' });

    // Handle messages from worker
    workerRef.current.onmessage = async (event) => {
      const { emotion, error: workerError } = event.data;
      if (workerError) {
        // Handle worker error, perhaps set error in context or local
        console.error('Worker error:', workerError);
        return;
      }
      if (emotion) {
        try {
          await fetchQuoteForEmotion(emotion);
          // After fetching quote, create entry if mood and quote are available
          if (currentMood && quote) {
            const entry = {
              id: Date.now().toString(),
              date: new Date().toISOString(),
              text: currentTextRef.current,
              mood: currentMood,
              quote,
              color: getMoodColor(currentMood),
            };
            addEntry(entry);
            setText(''); // Clear input after successful submission
          }
        } catch {
          // Error handled in context
        }
      }
    };

    // Cleanup worker on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [fetchQuoteForEmotion, currentMood, quote, addEntry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !workerRef.current) return;

    currentTextRef.current = text.trim();
    // Send text to worker for emotion analysis
    workerRef.current.postMessage({ text: currentTextRef.current });
  };

  const isDisabled = loading || !text.trim();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-oswald text-primary mb-4">How are you feeling today?</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="journal-entry" className="block text-sm font-oswald text-secondary mb-2">
            Write your thoughts and reflections
          </label>
          <textarea
            id="journal-entry"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share what's on your mind..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-oswald"
            disabled={loading}
            aria-describedby="entry-help"
          />
          <p id="entry-help" className="text-xs text-gray-500 mt-1">
            Your entry will be analyzed to detect your current mood.
          </p>
        </div>

        {error && <ErrorMessage message={error} onRetry={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)} />}

        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full py-3 px-4 rounded-lg font-oswald text-white transition-colors ${
            isDisabled
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-primary hover:bg-opacity-90 focus:ring-2 focus:ring-primary focus:ring-offset-2'
          }`}
          aria-describedby={loading ? 'loading-status' : undefined}
        >
          {loading ? <Loader message="Analyzing your mood..." /> : 'Analyze & Get Quote'}
        </button>
      </form>

      {currentMood && quote && (
        <div className="mt-4 p-4 bg-accent rounded-lg">
          <p className="text-sm font-oswald text-primary mb-2">
            Detected mood: <span style={{ color: getMoodColor(currentMood) }}>{currentMood}</span>
          </p>
          <blockquote className="text-sm italic text-secondary">
            "{quote.text}"
          </blockquote>
          <cite className="text-xs text-secondary mt-1">— {quote.author}</cite>
        </div>
      )}
    </div>
  );
};

export default MoodInput;