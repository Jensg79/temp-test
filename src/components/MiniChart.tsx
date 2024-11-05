import React from 'react';
import { Line, LineChart, ResponsiveContainer, YAxis, XAxis } from 'recharts';
import { HistoricalData } from '../types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface MiniChartProps {
  data: HistoricalData[];
  dataKey: 'humidityMoritz' | 'humidityBad' | 'humidityWohnzimmer';
}

export function MiniChart({ data, dataKey }: MiniChartProps) {
  const lastTwelveHours = data.slice(-12).map(entry => ({
    ...entry,
    time: format(new Date(entry.timestamp), 'HH:mm', { locale: de })
  }));

  const minValue = Math.floor(Math.min(...lastTwelveHours.map(d => d[dataKey])));
  const maxValue = Math.ceil(Math.max(...lastTwelveHours.map(d => d[dataKey])));

  return (
    <div className="h-24 w-full bg-gray-900 rounded-lg p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lastTwelveHours} margin={{ top: 5, right: 5, bottom: 5, left: 25 }}>
          <XAxis
            dataKey="time"
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
            interval="preserveEnd"
            tickFormatter={(value) => value}
          />
          <YAxis
            domain={[minValue - 1, maxValue + 1]}
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
            tickFormatter={(value) => `${value}%`}
            width={30}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#60A5FA"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}