export interface SensorData {
  TempMoritz: number;
  LuftfeuchteMoritz: number;
  TempBad: number;
  LuftfeuchteBad: number;
  TempWohnzimmer: number;
  'LuftFeuchte Wohnzimmer': number;
}

export interface HistoricalData {
  timestamp: string;
  tempMoritz: number;
  tempBad: number;
  tempWohnzimmer: number;
  humidityMoritz: number;
  humidityBad: number;
  humidityWohnzimmer: number;
}