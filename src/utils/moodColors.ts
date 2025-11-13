// Maps mood strings to their corresponding colors
export const moodColors: Record<string, string> = {
  happy: '#FFD93D',
  sad: '#3ABEFF',
  angry: '#F45B69',
  calm: '#A7E9AF',
  fear: '#B07CFD',
};

// Function to get color for a mood, with fallback
export const getMoodColor = (mood: string): string => {
  return moodColors[mood.toLowerCase()] || '#8D99AE'; // Default to secondary color
};