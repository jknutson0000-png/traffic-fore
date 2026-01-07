

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

// --- WEATHER TYPES ---

export enum WeatherRisk {
  LOW = 'LOW',       // Good for work
  MEDIUM = 'MEDIUM', // Watch out
  HIGH = 'HIGH'      // Shut it down
}

export interface WeatherDay {
  date: string;
  condition: string;
  tempHigh: string;
  tempLow: string;
  precipChance: string;
  windSpeed: string;
  workFeasibility: string; // "Good for roofing", "No exterior painting", etc.
  riskLevel: WeatherRisk;
}

export interface WeatherAnalysis {
  currentTemp: string;
  currentCondition: string;
  headline: string;
  summary: string; // Strategic advice for crews
  forecast: WeatherDay[];
  lastUpdated: string;
}

// --- MARKET INTEL TYPES ---

export interface IntelItem {
  headline: string;
  source: string;
  summary: string;
  relevance: string; // "Why this matters to Genesis"
}

export interface MarketAnalysis {
  briefing: string; // "Good morning, market is tightening..."
  talkingPoints: string[]; // Quick facts to drop in conversation
  localDevelopments: IntelItem[]; // New subdivisions, commercial projects nearby
  luxuryTrends: IntelItem[]; // "Smart homes", "Minimalist landscaping", etc.
  lastUpdated: string;
}

// --- TECH RADAR TYPES ---

export interface TechItem {
  name: string;
  category: string; // "Smart Home", "Energy", "Materials"
  description: string;
  benefit: string; // "Saves energy", "Prevents leaks"
  maturity: string; // "Bleeding Edge", "Early Adopter", "Mainstream"
  pricePoint: string; // "$$$", "$$"
}

export interface TechAnalysis {
  spotlight: TechItem; // The single most interesting new tech
  emerging: TechItem[];
  talkingPoints: string[]; // "Did you know about..."
  lastUpdated: string;
}

// --- INSPECTION TYPES ---

export type InspectionStatus = 'PASS' | 'FLAG' | 'FAIL' | 'N/A';

export interface InspectionItem {
  id: string;
  category: string; // e.g., "Exterior", "Electrical"
  label: string; // e.g., "Main Service Panel"
  status: InspectionStatus;
  notes: string;
  photo?: string; // Base64 string for the image
}

export interface InspectionReport {
  clientName: string;
  propertyAddress: string;
  items: InspectionItem[];
  executiveSummary: string; // AI Generated Summary
  generatedAt: string;
}
