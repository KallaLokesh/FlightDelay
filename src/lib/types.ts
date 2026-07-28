export interface Airline {
  code: string;
  name: string;
  onTimeRate: number;
  color: string;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  congestion: number;
  region: 'Northeast' | 'Southeast' | 'Midwest' | 'Southwest' | 'West';
}

export interface FlightInput {
  airline: string;
  origin: string;
  destination: string;
  flightDate: string;
  scheduledDeparture: string;
}

export interface FactorContribution {
  label: string;
  detail: string;
  contribution: number;
  direction: 'increases' | 'decreases';
}

export interface PredictionResult {
  delayMinutes: number;
  delayProbability: number;
  delayCategory: 'on-time' | 'slight' | 'moderate' | 'severe';
  baseProbability: number;
  baseLogit: number;
  finalLogit: number;
  factors: FactorContribution[];
  features: {
    hourFactor: number;
    seasonFactor: number;
    airlineFactor: number;
    originFactor: number;
    destFactor: number;
    dowFactor: number;
  };
}

export interface SavedPrediction {
  id: string;
  airline: string;
  origin: string;
  destination: string;
  flight_date: string;
  scheduled_departure: string;
  day_of_week: number;
  delay_minutes: number;
  delay_probability: number;
  delay_category: string;
  top_factors: FactorContribution[];
  created_at: string;
}
