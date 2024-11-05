import React from 'react';
import { Thermometer, Droplets } from 'lucide-react';
import { MiniChart } from './MiniChart';
import { HistoricalData } from '../types';

interface SensorCardProps {
  title: string;
  temperature: number;
  humidity: number;
  isLoading: boolean;
  history: HistoricalData[];
  humidityKey: 'humidityMoritz' | 'humidityBad' | 'humidityWohnzimmer';
}

export function SensorCard({ 
  title, 
  temperature, 
  humidity, 
  isLoading,
  history,
  humidityKey
}: SensorCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-3">
            <Thermometer className="text-red-500" size={24} />
            <span className="text-2xl font-bold">{temperature.toFixed(1)}°C</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Droplets className="text-blue-500" size={24} />
              <span className="text-2xl font-bold">{humidity.toFixed(1)}%</span>
            </div>
            <div className="pt-2">
              <MiniChart data={history} dataKey={humidityKey} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}