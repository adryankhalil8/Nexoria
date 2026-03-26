import type { ExternalSignal } from '../model/blueprint';

const EXTERNAL_SIGNAL_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.12&current_weather=true';

export async function fetchExternalSignal(): Promise<ExternalSignal> {
  const response = await fetch(EXTERNAL_SIGNAL_URL);
  if (!response.ok) {
    throw new Error(`External signal request failed with status ${response.status}`);
  }

  const data = await response.json();
  return {
    windspeed: data.current_weather?.windspeed ?? 10,
    weathercode: data.current_weather?.weathercode ?? 0,
    temperature: data.current_weather?.temperature ?? 15,
  };
}
