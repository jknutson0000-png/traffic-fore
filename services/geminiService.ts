import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TrafficLevel, TrafficAnalysis } from '../types';

// Initialize Gemini
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    level: {
      type: Type.STRING,
      enum: ['GREEN', 'YELLOW', 'RED'],
      description: "Current traffic severity. RED = CLUSTERFUCK."
    },
    headline: {
      type: Type.STRING,
      description: "Current headline. Profane, dark, hysterical."
    },
    summary: {
      type: Type.STRING,
      description: "Current summary rant."
    },
    avoidTimes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Current kill windows."
    },
    patternNote: {
      type: Type.STRING,
      description: "Historical pattern note."
    },
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
      description: "Populate THIS ONLY if the prompt asks for a 3-DAY FORECAST. Otherwise empty.",
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING, description: "e.g. Oct 24" },
          dayName: { type: Type.STRING, description: "e.g. Thursday" },
          level: { type: Type.STRING, enum: ['GREEN', 'YELLOW', 'RED'] },
          headline: { type: Type.STRING, description: "Short doom prediction for this day." },
          summary: { type: Type.STRING, description: "Why this day will suck." },
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

export const checkTrafficConditions = async (mode: 'LIVE' | 'FORECAST' = 'LIVE'): Promise<{ data: TrafficAnalysis, sources: any[] }> => {
  if (!apiKey) {
    throw new Error("API_KEY not found in environment.");
  }

  const modelId = 'gemini-3-pro-preview'; 
  const now = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'long', hour: 'numeric', minute: 'numeric' });

  let prompt = ``;

  if (mode === 'LIVE') {
    prompt = `
      Current Time (Atlanta): ${now}
      Location: 20 Marietta St NW.
      
      Task: LIVE THREAT DETECTION (TODAY ONLY).
      Search for: Mercedes-Benz Stadium events, State Farm Arena, GWCC, Parades, Protests, VIP Motorcades.
      
      Tone: Burned-out, cynical, profane Atlanta local.
      Output: Fill the standard fields. Leave 'forecast' empty.
    `;
  } else {
    prompt = `
      Current Time (Atlanta): ${now}
      Location: 20 Marietta St NW.
      
      Task: 3-DAY TRAFFIC APOCALYPSE FORECAST (Next 3 Days).
      
      1. Identify the next 3 days (dates and names).
      2. For EACH day, search for MAJOR events (Concerts, NFL/MLS Games, Conventions at GWCC, Festivals).
      3. Predict the misery level for 20 Marietta St NW residents.
      
      Tone: Dark, hysterical, doom-prophecy. 
      Output: You MUST populate the 'forecast' array with 3 entries. 
      Fill the top-level fields (level, summary) with a general overview of the next 3 days.
    `;
  }

  prompt += `
    Rules for Status:
    - RED: CLUSTERFUCK (Major game, convention load-out, parade).
    - YELLOW: SHITTY (Standard ATL traffic or minor event).
    - GREEN: CLEAR (It's a trap).
    
    System Instruction: You are Genesis Traffic AI. Misanthropic, profane, NSFW. You hate cars.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        systemInstruction: "You are the Genesis Traffic AI. You have no filter. You hate cars. You hate traffic. You think driving in Atlanta is a form of self-harm. You use adult language freely."
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data received from Gemini.");

    const data = JSON.parse(jsonText) as Omit<TrafficAnalysis, 'lastUpdated'>;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      data: {
        ...data,
        lastUpdated: new Date().toLocaleTimeString()
      },
      sources
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};