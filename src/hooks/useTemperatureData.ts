import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { SensorData, HistoricalData } from '../types';
import { subWeeks, format } from 'date-fns';
import { de } from 'date-fns/locale';

const STORAGE_KEY = 'temperature_history';
const ERROR_KEY = 'temperature_error_state';
const HISTORY_WEEKS = 4;
const MAX_RETRY_COUNT = 3;

async function fetchTemperatureData(): Promise<SensorData> {
  const errorState = JSON.parse(localStorage.getItem(ERROR_KEY) || '{"retryCount": 0}');
  
  try {
    const response = await fetch('https://bzrd6i1w.run.nodescript.dev/schule/shelly', {
      // Add cache busting for manual refreshes
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error('Serverfehler beim Abrufen der Daten');
    }
    
    localStorage.setItem(ERROR_KEY, JSON.stringify({ retryCount: 0 }));
    return response.json();
  } catch (error) {
    const newErrorState = {
      message: error instanceof Error ? error.message : 'Unbekannter Fehler',
      retryCount: errorState.retryCount + 1,
      lastSuccess: errorState.lastSuccess || format(new Date(), 'dd.MM.yyyy HH:mm', { locale: de })
    };
    
    localStorage.setItem(ERROR_KEY, JSON.stringify(newErrorState));
    throw new Error(
      `Fehler beim Laden der Daten. Versuch ${newErrorState.retryCount} von ${MAX_RETRY_COUNT}. ` +
      (newErrorState.lastSuccess ? `Letzte erfolgreiche Aktualisierung: ${newErrorState.lastSuccess}` : '')
    );
  }
}

function saveToHistory(data: SensorData) {
  const history: HistoricalData[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const newEntry: HistoricalData = {
    timestamp: new Date().toISOString(),
    tempMoritz: data.TempMoritz,
    tempBad: data.TempBad,
    tempWohnzimmer: data.TempWohnzimmer,
    humidityMoritz: data.LuftfeuchteMoritz,
    humidityBad: data.LuftfeuchteBad,
    humidityWohnzimmer: data['LuftFeuchte Wohnzimmer'],
  };

  const cutoffDate = subWeeks(new Date(), HISTORY_WEEKS);
  const filteredHistory = history
    .filter(entry => new Date(entry.timestamp) > cutoffDate)
    .concat(newEntry);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
  return filteredHistory;
}

export function useTemperatureData() {
  const [errorState, setErrorState] = useState(() => 
    JSON.parse(localStorage.getItem(ERROR_KEY) || '{"retryCount": 0}')
  );

  const query = useQuery({
    queryKey: ['temperature'],
    queryFn: fetchTemperatureData,
    refetchInterval: errorState.retryCount >= MAX_RETRY_COUNT ? undefined : 5 * 60 * 1000,
    retry: MAX_RETRY_COUNT,
    staleTime: 0, // Always consider data stale
    cacheTime: 0, // Don't cache the data
  });

  useEffect(() => {
    if (query.data) {
      saveToHistory(query.data);
      setErrorState({ retryCount: 0 });
    }
  }, [query.data]);

  const history: HistoricalData[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  return {
    ...query,
    history,
    errorState,
  };
}