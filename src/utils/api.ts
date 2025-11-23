// Hardcoded inspirational quotes mapped by emotion (no API calls needed)
const quotesByEmotion: Record<string, Array<{ text: string; author: string }>> = {
  joy: [
    { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
    { text: 'Happiness is not something ready made. It comes from your own actions.', author: 'Dalai Lama' },
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  ],
  sadness: [
    { text: 'The wound is the place where the Light enters you.', author: 'Rumi' },
    { text: 'Tears are words the heart cannot speak.', author: 'Stephen Covey' },
    { text: 'You are braver than you believe, stronger than you seem, and smarter than you think.', author: 'A.A. Milne' },
  ],
  angry: [
    { text: 'Anger is just sad\'s bodyguard.', author: 'Sabaa Tahir' },
    { text: 'For every minute you are angry you lose sixty seconds of happiness.', author: 'Ralph Waldo Emerson' },
    { text: 'An angry man is always full of poison.', author: 'Confucius' },
  ],
  fear: [
    { text: 'Courage is not the absence of fear, but triumph over it.', author: 'Nelson Mandela' },
    { text: 'Do the thing and you shall have the power.', author: 'Ralph Waldo Emerson' },
    { text: 'Fear is the mind-killer. Fear is the little-death that brings total obliteration.', author: 'Frank Herbert' },
  ],
  calm: [
    { text: 'Peace comes from within. Do not seek it without.', author: 'Buddha' },
    { text: 'In the midst of winter, I found there was, within me, an invincible summer.', author: 'Albert Camus' },
    { text: 'Let peace settle deep in your soul.', author: 'Unknown' },
  ],
};

// Fetch a random motivational quote based on emotion (uses local quotes, no API)
export const fetchMotivationalQuote = async (emotion: string): Promise<{ text: string; author: string }> => {
  try {
    const quotes = quotesByEmotion[emotion.toLowerCase()] || quotesByEmotion['calm'];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    console.log('Fetched quote for emotion:', emotion, randomQuote);
    return randomQuote;
  } catch (error) {
    console.error('Error fetching quote:', error);
    // Fallback to a default quote
    return { text: 'This too shall pass.', author: 'Persian Proverb' };
  }
};
