import type { EmotionResponse, QuoteResponse } from '../types';

// API Keys - In production, these should be environment variables
const PARALLEL_DOTS_API_KEY = 'your-parallel-dots-api-key'; // Replace with actual key
const API_NINJAS_KEY = 'your-api-ninjas-key'; // Replace with actual key

// Analyze emotion from text using ParallelDots API
export const analyzeEmotion = async (text: string): Promise<string> => {
  try {
    const response = await fetch('https://apis.paralleldots.com/v4/emotion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        api_key: PARALLEL_DOTS_API_KEY,
        text: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Emotion API error: ${response.status}`);
    }

    const data: EmotionResponse = await response.json();
    const emotions = data.emotion;

    // Find the emotion with the highest score
    const highestEmotion = Object.keys(emotions).reduce((a, b) =>
      emotions[a] > emotions[b] ? a : b
    );

    return highestEmotion;
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    throw error;
  }
};

// Fetch motivational quote based on mood using API Ninjas
export const fetchQuote = async (mood: string): Promise<{ text: string; author: string }> => {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/quotes?category=${mood}`, {
      headers: {
        'X-Api-Key': API_NINJAS_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Quote API error: ${response.status}`);
    }

    const quotes: QuoteResponse[] = await response.json();
    if (quotes.length === 0) {
      throw new Error('No quotes found for this mood');
    }

    const quote = quotes[0];
    return { text: quote.quote, author: quote.author };
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
};