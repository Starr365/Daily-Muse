import React from 'react';
import { useMood } from '../context/useMood';
import type { Entry } from '../types';

const EntryList: React.FC = () => {
  const { entries, deleteEntry } = useMood();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = (id: string, mood: string) => {
    if (window.confirm(`Are you sure you want to delete this ${mood} entry?`)) {
      deleteEntry(id);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-oswald text-primary mb-4">Your Mood Journal</h3>
        <p className="text-secondary text-center py-8">No entries yet. Start journaling to see your mood history here!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-oswald text-primary mb-4">Your Mood Journal</h3>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {entries.map((entry: Entry) => (
          <div
            key={entry.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: entry.color }}
                  aria-label={`Mood: ${entry.mood}`}
                ></div>
                <span className="font-oswald text-primary capitalize">{entry.mood}</span>
                <span className="text-xs text-secondary">{formatDate(entry.date)}</span>
              </div>
              <button
                onClick={() => handleDelete(entry.id, entry.mood)}
                className="text-red-500 hover:text-red-700 transition-colors p-1"
                aria-label={`Delete ${entry.mood} entry`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <p className="text-secondary mb-3 leading-relaxed">{entry.text}</p>

            <div className="bg-accent rounded p-3">
              <blockquote className="text-sm italic text-secondary mb-1">
                "{entry.quote.text}"
              </blockquote>
              <cite className="text-xs text-primary font-oswald">— {entry.quote.author}</cite>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntryList;