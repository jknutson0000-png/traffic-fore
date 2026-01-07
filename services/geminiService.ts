
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TrafficLevel, TrafficAnalysis, WeatherAnalysis, WeatherRisk, MarketAnalysis, TechAnalysis, InspectionItem } from '../types';

// Initialize Gemini
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

// --- TRAFFIC SCHEMA ---
const TRAFFIC_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    level: { type: Type.STRING, enum: ['GREEN', 'YELLOW', 'RED'] },
    headline: { type: Type.STRING },
    summary: { type: Type.STRING },
    avoidTimes: { type: Type.ARRAY, items: { type: Type.STRING } },
    patternNote: { type: Type.STRING },
    events: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          location: { type: Type.STRING },
          time: { type: Type.STRING },
          impactDescription: { type: Type.STRING },
        }
      }
    },
    forecast: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          dayName: { type: Type.STRING },
          level: { type: Type.STRING, enum: ['GREEN', 'YELLOW', 'RED'] },
          headline: { type: Type.STRING },
          summary: { type: Type.STRING },
          events: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                location: { type: Type.STRING },
                time: { type: Type.STRING },
                impactDescription: { type: Type.STRING },
              }
            }
          }
        }
      }
    }
  },
  required: ['level', 'headline', 'summary', 'events', 'avoidTimes']
};

// --- WEATHER SCHEMA ---
const WEATHER_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    currentTemp: { type: Type.STRING },
    currentCondition: { type: Type.STRING },
    headline: { type: Type.STRING },
    summary: { type: Type.STRING, description: "Strategic advice for outdoor crews." },
    forecast: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          condition: { type: Type.STRING },
          tempHigh: { type: Type.STRING },
          tempLow: { type: Type.STRING },
          precipChance: { type: Type.STRING },
          windSpeed: { type: Type.STRING },
          workFeasibility: { type: Type.STRING, description: "Can we paint/roof today?" },
          riskLevel: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] }
        }
      }
    }
  },
  required: ['currentTemp', 'currentCondition', 'headline', 'summary', 'forecast']
};

// --- MARKET INTEL SCHEMA ---
const INTEL_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    briefing: { type: Type.STRING, description: "Executive summary of the local market." },
    talkingPoints: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3-4 Quick facts to sound smart in front of clients." 
    },
    localDevelopments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          source: { type: Type.STRING },
          summary: { type: Type.STRING },
          relevance: { type: Type.STRING }
        }
      }
    },
    luxuryTrends: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          source: { type: Type.STRING },
          summary: { type: Type.STRING },
          relevance: { type: Type.STRING }
        }
      }
    }
  },
  required: ['briefing', 'talkingPoints', 'localDevelopments', 'luxuryTrends']
};

// --- TECH RADAR SCHEMA ---
const TECH_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    spotlight: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        category: { type: Type.STRING },
        description: { type: Type.STRING },
        benefit: { type: Type.STRING },
        maturity: { type: Type.STRING },
        pricePoint: { type: Type.STRING }
      }
    },
    emerging: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          description: { type: Type.STRING },
          benefit: { type: Type.STRING },
          maturity: { type: Type.STRING },
          pricePoint: { type: Type.STRING }
        }
      }
    },
    talkingPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ['spotlight', 'emerging', 'talkingPoints']
};

// --- TRAFFIC FUNCTION ---
export const checkTrafficConditions = async (mode: 'LIVE' | 'FORECAST' = 'LIVE'): Promise<{ data: TrafficAnalysis, sources: any[] }> => {
  if (!apiKey) throw new Error("API_KEY not found in environment.");
  
  const modelId = 'gemini-3-pro-preview'; 
  const now = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'long', hour: 'numeric', minute: 'numeric' });

  let prompt = ``;
  if (mode === 'LIVE') {
    prompt = `Current Time (ATL): ${now}. Loc: 20 Marietta St NW. LIVE TRAFFIC THREATS. Search: Stadium events, GWCC, Parades. Tone: Profane, cynical local.`;
  } else {
    prompt = `Current Time (ATL): ${now}. Loc: 20 Marietta St NW. 3-DAY TRAFFIC FORECAST. Search: Major events next 3 days. Tone: Doom-prophecy.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: TRAFFIC_SCHEMA,
        systemInstruction: "You are Genesis Traffic AI. Misanthropic, profane, NSFW. You hate cars."
      }
    });

    let jsonText = response.text || "";
    jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const data = JSON.parse(jsonText) as Omit<TrafficAnalysis, 'lastUpdated'>;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      data: { ...data, lastUpdated: new Date().toLocaleTimeString() },
      sources
    };
  } catch (error) {
    console.error("Gemini Traffic Error:", error);
    throw error;
  }
};

// --- WEATHER FUNCTION ---
export const checkWeatherConditions = async (): Promise<{ data: WeatherAnalysis, sources: any[] }> => {
  if (!apiKey) throw new Error("API_KEY not found in environment.");

  const modelId = 'gemini-3-pro-preview'; 
  const now = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'long', hour: 'numeric', minute: 'numeric' });

  const prompt = `
    Current Time (Atlanta): ${now}
    Location: Marietta St NW, Atlanta, GA.
    
    Task: WEATHER RECON FOR HOME SERVICES (Roofing, Painting, Exterior).
    
    1. Get current conditions.
    2. Get 3-day forecast details.
    3. Analyze impact on OUTDOOR LABOR (Heat safety, Rain delays, Wind risks for ladders).
    
    Tone: Professional, tactical, military-briefing style. Concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: WEATHER_SCHEMA,
        systemInstruction: "You are Genesis Weather Ops. You provide tactical weather intelligence for construction and field crews. Focus on safety and schedule impact."
      }
    });

    let jsonText = response.text || "";
    jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const data = JSON.parse(jsonText) as Omit<WeatherAnalysis, 'lastUpdated'>;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      data: { ...data, lastUpdated: new Date().toLocaleTimeString() },
      sources
    };

  } catch (error) {
    console.error("Gemini Weather Error:", error);
    throw error;
  }
};

// --- MARKET INTEL FUNCTION ---
export const checkMarketIntel = async (): Promise<{ data: MarketAnalysis, sources: any[] }> => {
  if (!apiKey) throw new Error("API_KEY not found in environment.");

  const modelId = 'gemini-3-pro-preview';
  const now = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  const prompt = `
    Current Time: ${now}
    Target Area: Metro Atlanta (Focus on Cobb, Paulding, Fulton).
    Target Audience: "Genesis Executive Home Services" (High-end home maintenance/renovation).
    
    Task: EXECUTIVE INTELLIGENCE BRIEFING.
    
    Search for:
    1. Real Estate News (Atlanta Business Chronicle, local news): New subdivisions, high-value commercial projects, market trends.
    2. Home Trends: What are rich homeowners buying right now? (Smart tech, sustainable materials, specific renovation styles).
    
    Output:
    - Briefing: A short, CEO-level summary of the market this week.
    - Talking Points: 3-4 facts Jeffrey can drop in conversation to sound plugged-in.
    - Developments: Specific local projects.
    - Luxury Trends: Specific design/tech trends.
    
    Tone: Sophisticated, knowledgeable, confident. "Old Money" vibes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: INTEL_SCHEMA,
        systemInstruction: "You are Genesis Strategic Advisor. You provide high-level market intelligence for a premium home services company. You focus on money, real estate values, and luxury trends."
      }
    });

    let jsonText = response.text || "";
    jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const data = JSON.parse(jsonText) as Omit<MarketAnalysis, 'lastUpdated'>;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      data: { ...data, lastUpdated: new Date().toLocaleTimeString() },
      sources
    };

  } catch (error) {
    console.error("Gemini Intel Error:", error);
    throw error;
  }
};

// --- TECH RADAR FUNCTION ---
export const checkTechTrends = async (): Promise<{ data: TechAnalysis, sources: any[] }> => {
  if (!apiKey) throw new Error("API_KEY not found in environment.");

  const modelId = 'gemini-3-pro-preview';

  const prompt = `
    Task: RESIDENTIAL TECHNOLOGY RADAR for a General Contractor / Handyman.
    
    Search for:
    1. New emerging technologies in: Smart Home (Security, Water, HVAC), Construction Materials, Energy Efficiency (Batteries, Panels).
    2. Focus on "Prosumer" or "Luxury" grade tech (e.g., Span Panels, Flo by Moen, Ketra Lighting).
    
    Output:
    - Spotlight: One MAJOR technology that is game-changing right now.
    - Emerging: 4-5 other cool technologies or tools.
    - Talking Points: What to tell a client who asks "What's new?"
    
    Tone: Tech-savvy, futuristic, concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: TECH_SCHEMA,
        systemInstruction: "You are Genesis Tech Ops. You identify cutting-edge residential technology for high-end implementation."
      }
    });

    let jsonText = response.text || "";
    jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const data = JSON.parse(jsonText) as Omit<TechAnalysis, 'lastUpdated'>;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      data: { ...data, lastUpdated: new Date().toLocaleTimeString() },
      sources
    };

  } catch (error) {
    console.error("Gemini Tech Error:", error);
    throw error;
  }
};

// --- INSPECTION REPORT FUNCTION ---
export const generateInspectionSummary = async (items: InspectionItem[]): Promise<string> => {
    if (!apiKey) throw new Error("API_KEY not found.");

    const modelId = 'gemini-3-flash-preview'; // Flash is fine for summarization

    // Filter to only items that have notes or are flagged/failed
    const relevantItems = items.filter(i => i.status !== 'PASS' || i.notes.length > 0);
    
    const itemsJson = JSON.stringify(relevantItems.map(i => ({
        label: i.label,
        status: i.status,
        rawNotes: i.notes
    })));

    const prompt = `
      You are a high-end Home Inspection Report Writer for Genesis Executive Home Services.
      
      Task: Write a Professional Executive Summary based on these raw inspection findings.
      
      Input Data: ${itemsJson}
      
      Guidelines:
      1. Turn raw notes (e.g., "leak under sink") into professional language (e.g., "Active moisture intrusion observed in...").
      2. Group issues logically (Major Concerns vs Maintenance Items).
      3. Use a tone that is firm but not alarmist. Professional, objective, authoritative.
      4. If there are no issues, write a congratulatory summary about the home's condition.
      
      Output: Just the summary text paragraph(s). No markdown formatting.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
        });
        
        return response.text || "Summary generation failed.";
    } catch (error) {
        console.error("Inspection Gen Error", error);
        return "Error generating summary.";
    }
};
