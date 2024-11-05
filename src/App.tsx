import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RefreshCw, WifiOff } from 'lucide-react';
import { SensorCard } from './components/SensorCard';
import { TemperatureChart } from './components/TemperatureChart';
import { useTemperatureData } from './hooks/useTemperatureData';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function ErrorMessage({ message, retryCount }: { message: string; retryCount: number }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <WifiOff className="text-red-500" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-700">Verbindungsfehler</h3>
          <p className="text-red-600">{message}</p>
        </div>
      </div>
      {retryCount >= 3 && (
        <div className="mt-3 text-sm text-red-600">
          Maximale Anzahl an Versuchen erreicht. Bitte überprüfen Sie Ihre Internetverbindung 
          oder versuchen Sie es später erneut.
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const { data, isLoading, isError, error, refetch, history, errorState } = useTemperatureData();

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Temperatur-Dashboard</h1>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            <span>Aktualisieren</span>
          </button>
        </div>

        {isError && (
          <ErrorMessage 
            message={(error as Error).message} 
            retryCount={errorState.retryCount} 
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SensorCard
            title="Moritz Zimmer"
            temperature={data?.TempMoritz ?? 0}
            humidity={data?.LuftfeuchteMoritz ?? 0}
            isLoading={isLoading}
            history={history}
            humidityKey="humidityMoritz"
          />
          <SensorCard
            title="Badezimmer"
            temperature={data?.TempBad ?? 0}
            humidity={data?.LuftfeuchteBad ?? 0}
            isLoading={isLoading}
            history={history}
            humidityKey="humidityBad"
          />
          <SensorCard
            title="Wohnzimmer"
            temperature={data?.TempWohnzimmer ?? 0}
            humidity={data?.['LuftFeuchte Wohnzimmer'] ?? 0}
            isLoading={isLoading}
            history={history}
            humidityKey="humidityWohnzimmer"
          />
        </div>

        <TemperatureChart data={history} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}