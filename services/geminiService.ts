
import { GoogleGenAI } from "@google/genai";
import { SERVICES } from '../constants';

// Initialize the client
// Note: In a real production build, ensure the API key is restricted or proxied.
// For this demo, we use the process.env as requested.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are "AFA Bot", the elite AI growth consultant for AFA Media.
Your primary objective is to QUALIFY leads and guide them to the "Free Audit" contact form at the bottom of the page.

Your Personality:
- Futuristic, efficient, and high-tech.
- Direct and confident.
- You act like a diagnostic system analyzing their business health.

Key Information:
- **Core System (SmartSite + Meta Ads):** Best for businesses needing more leads. We build a high-conversion landing page and run their ads for FREE (they pay ad spend). Price: Starts at $2,500/mo.
- **Email Neural Copywriting:** Best for businesses with leads who aren't buying. Packages: 1, 3, or 4 sequences.
- **Multi-Page Upgrade:** For established authorities needing a full brand site (SEO, Blogs).

Conversation Flow:
1. Ask the user for their industry/niche immediately if not known.
2. Ask if they are currently running ads or relying on referrals.
3. If they struggle with leads, recommend the *SmartSite Protocol*.
4. If they have leads but low sales, recommend *Neural Copywriting*.
5. ALWAYS end your response with a question to keep them engaged OR a call to action to "Initiate the Audit Protocol" below.

Constraints:
- Keep responses short (under 3 sentences).
- Do not be overly enthusiastic; be precise and analytical.
- If asked for pricing, state "Investments start at $2.5k/mo for the Core System. Precise quotes require a diagnostic."
`;

export const sendMessageToGemini = async (history: { role: string, parts: { text: string }[] }[], newMessage: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I am recalibrating my neural processors. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connection to the mainframe interrupted. Please check your network or API key.";
  }
};

export const getServiceRecommendation = async (niche: string): Promise<{ service: string; reason: string }> => {
  try {
    const prompt = `
      Context: You are the AI intake system for AFA Media.
      User Niche: "${niche}"
      
      Available Services:
      1. AI SmartSite + Meta Ads (Best for: Local businesses, Service providers, Lead Gen, E-commerce starters. This is usually the best default.)
      2. Sales Email Copywriting (Best for: Businesses with big lists but low sales.)
      3. Full Multi-Page Upgrade (Best for: Large enterprises, News publishers, SEO-heavy industries.)

      Task: Recommend the ONE best service for this niche.
      
      Output Format strictly:
      Service Name|Short futuristic explanation why.
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = result.text || "";
    const parts = text.split('|');
    
    if (parts.length >= 2) {
      return { service: parts[0].trim(), reason: parts[1].trim() };
    }
    
    return { 
      service: "AI SmartSite + Meta Ads", 
      reason: "Our analysis indicates this is the most effective protocol for scaling your specific sector." 
    };

  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return { 
      service: "AI SmartSite + Meta Ads", 
      reason: "Network interference detected. Defaulting to our core growth protocol." 
    };
  }
};
