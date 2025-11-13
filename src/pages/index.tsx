import React from 'react';
import MoodInput from '../components/MoodInput';
import QuoteCard from '../components/QuoteCard';
import EntryList from '../components/EntryList';
import MoodGraph from '../components/MoodGraph';
import DarkModeToggle from '../components/DarkModeToggle';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <DarkModeToggle />
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-oswald text-primary dark:text-white mb-2">Daily Muse</h1>
          <p className="text-lg text-secondary dark:text-gray-300 font-oswald">
            Your personal mood journaling companion
          </p>
        </header>

        <main className="space-y-8">
          <MoodInput />
          <QuoteCard />
          <MoodGraph />
          <EntryList />
        </main>

        <footer className="text-center mt-12 text-sm text-secondary">
          <p>Track your emotions, discover insights, and find inspiration in your daily reflections.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;