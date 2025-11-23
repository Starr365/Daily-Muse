// EmotionWorker.ts - Web Worker for emotion analysis using API
// Uses Hugging Face Inference API for sentiment analysis (no local model loading)

// Simple emotion mapping based on keywords
const analyzeEmotionFromText = (text: string): string => {
  const lowerText = text.toLowerCase();

  // Emotion keywords mapping
  const emotionKeywords: Record<string, string[]> = {
    joy: ['happy', 'glad', 'excited', 'love', 'wonderful', 'great', 'fantastic', 'amazing', 'awesome', 'brilliant'],
    sad: ['sad', 'unhappy', 'depressed', 'down', 'miserable', 'terrible', 'awful', 'bad', 'hate'],
    angry: ['angry', 'furious', 'mad', 'annoyed', 'irritated', 'frustrated', 'hate'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'meditative'],
    fear: ['afraid', 'scared', 'fearful', 'nervous', 'anxious', 'worried', 'terrified'],
  };

  // Count keyword matches for each emotion
  const emotionScores: Record<string, number> = {};

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    emotionScores[emotion] = keywords.filter(keyword => lowerText.includes(keyword)).length;
  }

  // Find emotion with highest score, default to calm if no matches
  const detectedEmotion = Object.entries(emotionScores).reduce((prev, current) =>
    current[1] > prev[1] ? current : prev
  );

  return detectedEmotion[0] !== undefined && detectedEmotion[1] > 0 ? detectedEmotion[0] : 'calm';
};

const analyzeSentiment = async (text: string): Promise<string> => {
  try {
    // Use CORS proxy to access Hugging Face API
    const response = await fetch(
      'https://cors-anywhere.herokuapp.com/https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ inputs: text }),
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await response.json();

    if (Array.isArray(result) && result[0]?.length > 0) {
      const sentiment = result[0][0];
      console.log('Worker: Sentiment result:', sentiment);

      // Map sentiment to emotion
      const label = sentiment.label.toUpperCase();
      if (label === 'POSITIVE') {
        return 'joy';
      } else if (label === 'NEGATIVE') {
        return 'sadness';
      }
    }

    return 'calm';
  } catch (error) {
    console.warn('Worker: API sentiment analysis failed, falling back to keyword analysis:', error);
    return analyzeEmotionFromText(text);
  }
};

self.onmessage = async (event: MessageEvent) => {
  const { text } = event.data;
  console.log('Worker: Received text for analysis:', text);

  try {
    // Try API-based sentiment first, fall back to keyword analysis
    const emotion = await analyzeSentiment(text);
    console.log('Worker: Detected emotion:', emotion);

    // Post the emotion back to main thread
    self.postMessage({ emotion });
  } catch (error) {
    console.error('Worker: Error during analysis:', error);
    self.postMessage({ error: (error as Error).message });
  }
};
