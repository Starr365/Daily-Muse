import React, { useState } from 'react';
import { useMood } from '../context/useMood';
import { getMoodColor } from '../utils/moodColors';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';

const QuoteCard: React.FC = () => {
  const { currentMood, quote, fetchQuoteForEmotion, loading, error } = useMood();
  const [refreshLoading, setRefreshLoading] = useState(false);

  const handleRefresh = async () => {
    if (!currentMood) return;
    setRefreshLoading(true);
    try {
      await fetchQuoteForEmotion(currentMood);
    } catch {
      // Error handled in context
    } finally {
      setRefreshLoading(false);
    }
  };

  if (!currentMood) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-oswald text-primary">
          Inspirational Quote for <span style={{ color: getMoodColor(currentMood) }}>{currentMood}</span>
        </h3>
        <button
          onClick={handleRefresh}
          disabled={refreshLoading || loading}
          className="p-2 text-secondary hover:text-primary transition-colors disabled:opacity-50"
          aria-label="Get a new quote"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={handleRefresh} />}

      {loading || refreshLoading ? (
        <Loader message="Fetching inspiration..." />
      ) : quote ? (
        <div className="text-center">
          <blockquote className="text-xl italic text-secondary mb-4 leading-relaxed">
            "{quote.text}"
          </blockquote>
          <cite className="text-sm font-oswald text-primary">— {quote.author}</cite>
        </div>
      ) : (
        <p className="text-secondary text-center">No quote available at the moment.</p>
      )}
    </div>
  );
};

export default QuoteCard;