export enum TrafficLevel {
  GREEN = 'GREEN',    // Clear
  YELLOW = 'YELLOW',  // Caution
  RED = 'RED'         // Fucked
}

export interface EventInfo {
  name: string;
  location: string;
  time: string;
  impactDescription: string;
}

export interface DailyForecast {
  date: string;       // e.g. "Oct 12"
  dayName: string;    // e.g. "Friday"
  level: TrafficLevel;
  headline: string;   // "Friday: Absolute Carnage"
  summary: string;
  events: EventInfo[];
}

export interface TrafficAnalysis {
  level: TrafficLevel;
  headline: string;
  summary: string;
  events: EventInfo[];
  avoidTimes: string[]; // Specific windows to avoid driving
  patternNote?: string; // Historical pattern or anomaly detection
  forecast?: DailyForecast[]; // Optional 3-day outlook
  lastUpdated: string;
}

export interface SearchSource {
  uri: string;
  title: string;
}