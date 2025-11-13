import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMood } from '../context/useMood';
import type { Entry } from '../types';

// Map moods to numerical values for charting
const moodValues: Record<string, number> = {
  happy: 5,
  calm: 4,
  sad: 2,
  angry: 1,
  fear: 3,
};

interface ChartDataPoint {
  date: string;
  mood: number;
  moodLabel: string;
  fullDate: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint;
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-oswald text-primary">{`Date: ${label}`}</p>
        <p className="font-oswald text-secondary">{`Mood: ${data.moodLabel}`}</p>
      </div>
    );
  }
  return null;
};

const MoodGraph: React.FC = () => {
  const { entries } = useMood();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  const chartData = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();

    if (timeRange === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else {
      cutoffDate.setMonth(now.getMonth() - 1);
    }

    const filteredEntries = entries
      .filter(entry => new Date(entry.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return filteredEntries.map((entry: Entry) => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: moodValues[entry.mood.toLowerCase()] || 3,
      moodLabel: entry.mood,
      fullDate: entry.date,
    }));
  }, [entries, timeRange]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-oswald text-primary mb-4">Mood Trends</h3>
        <p className="text-secondary text-center py-8">Not enough data to show trends. Keep journaling!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-oswald text-primary">Mood Trends</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded font-oswald text-sm ${
              timeRange === 'week'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-secondary hover:bg-gray-300'
            }`}
          >
            Last Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded font-oswald text-sm ${
              timeRange === 'month'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-secondary hover:bg-gray-300'
            }`}
          >
            Last Month
          </button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F4" />
            <XAxis
              dataKey="date"
              stroke="#8D99AE"
              fontSize={12}
              fontFamily="Oswald, sans-serif"
            />
            <YAxis
              domain={[0, 6]}
              stroke="#8D99AE"
              fontSize={12}
              fontFamily="Oswald, sans-serif"
              tickFormatter={(value) => {
                const moodLabels = { 1: 'Angry', 2: 'Sad', 3: 'Fear', 4: 'Calm', 5: 'Happy' };
                return moodLabels[value as keyof typeof moodLabels] || '';
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#2B2D42"
              strokeWidth={2}
              dot={{ fill: '#2B2D42', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#2B2D42', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-xs text-secondary text-center">
        Mood scale: Angry (1) → Sad (2) → Fear (3) → Calm (4) → Happy (5)
      </div>
    </div>
  );
};

export default MoodGraph;