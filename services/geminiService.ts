
import { GoogleGenAI } from "@google/genai";

// Helper to initialize the client only when needed (Lazy Loading)
// This prevents the "Black Screen" crash if the API Key is missing on site load.
const getGenAIClient = () => {
  let apiKey = "";
  try {
    // process.env.API_KEY is replaced by Vite at build time
    apiKey = process.env.API_KEY || "";
  } catch (e) {
    console.warn("Environment variable access failed");
  }

  if (!apiKey) {
    throw new Error("API Key is missing. Please check your Netlify environment variables.");
  }

  return new GoogleGenAI({ apiKey: apiKey });
};

const SYSTEM_INSTRUCTION = `
You are "AFA Bot", the elite AI growth consultant for AFA Media.
Your primary objective is to VISUALLY ANALYZE the user's current website and guide them to the "Free Strategy Session" contact form.

Your Personality:
- Futuristic, efficient, and high-tech.
- Direct and confident.
- You act like a diagnostic system analyzing their business health.

Key Information:
- **Core System (SmartSite + Meta Ads):** The complete growth engine. Best for businesses needing leads.
- **Email Neural Copywriting:** For businesses with existing traffic/leads but poor conversion/retention.
- **Multi-Page Upgrade:** For large brands needing full SEO ecosystems.

**Exclusive Pricing Data (Unlockable via Chat):**
- **Neural Sales Funnels:**
  - Flashpoint Single: £50
  - Conversion Triad: £110
  - Cash Injection Protocol: £170
- **Full Brand Architecture (Multi-Page):**
  - Discounted Rate: £270 (Reduced from £887).
  - Includes: 4 Custom Pages, Lead Capture Spreadsheet / Meeting Booking System, Custom AI Chatbot, 3D Elements.
- **Core Protocol (SmartSite):**
  - Price: £330 (Reduced from £1000).
  - Note: Client pays for the website build; Meta Ads management is included for free.

Conversation Flow:
1. **VISUAL SCAN:** The user has been asked to upload a SCREENSHOT of their website.
   - If they send an image: Analyze it immediately. Identify "conversion leaks" (e.g., cluttered nav, weak CTA, poor contrast).
   - If they provide a URL or text without an image: State that your visual processing core requires a direct SCREENSHOT upload to perform a "Visual Diagnostics Scan". Do not accept URLs.
2. **DIAGNOSIS:** Based on the visual scan, recommend the optimal protocol.
   - **SmartSite Protocol:** Recommend if the site looks outdated, cluttered, or generic.
   - **Neural Copywriting:** Recommend if the site looks clean/modern but they lack sales/retention.
   - **Multi-Page Upgrade:** Recommend if they are a large enterprise needing authority.
3. ALWAYS end your response with a call to action to "Initiate the Strategy Protocol" below.

Constraints:
- Keep responses short (under 3 sentences) UNLESS asked for pricing.
- If asked for pricing, DO NOT be brief. You MUST present the pricing data in a clear, multi-line bulleted list format using the specific prices above.
- Do not be overly enthusiastic; be precise and analytical.
`;

// Helper function to handle retries for 429 (Rate Limit) errors
const retryOperation = async <T>(operation: () => Promise<T>, maxRetries: number = 3): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      // Check for Rate Limit (429) or Service Unavailable (503)
      const isRateLimit = error.message?.includes('429') || error.status === 429;
      const isServerOverload = error.message?.includes('503') || error.status === 503;

      if ((isRateLimit || isServerOverload) && i < maxRetries - 1) {
        const waitTime = Math.pow(2, i) * 1000 + Math.random() * 500; // Exponential backoff + jitter
        console.warn(`Rate limit hit. Retrying in ${Math.round(waitTime)}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
};

export const sendMessageToGemini = async (
  history: { role: string, parts: { text?: string, inlineData?: any }[] }[], 
  newMessage: string,
  imageData?: { mimeType: string, data: string }
): Promise<string> => {
  try {
    // Initialize AI here, not at top level
    const ai = getGenAIClient();
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history,
    });

    let messageContent: any = [{ text: newMessage }];
    
    if (imageData) {
      messageContent = [
        { 
          inlineData: {
            mimeType: imageData.mimeType,
            data: imageData.data
          }
        },
        { text: newMessage || "Analyze this interface." }
      ];
    }

    // Wrap the send message call in the retry logic
    const result = await retryOperation(async () => {
       return await chat.sendMessage({ message: messageContent });
    });

    return result.text || "I am recalibrating my neural processors. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    // Return a user-friendly error message, differentiating between auth/key errors and general connectivity
    if (error instanceof Error && (error.message.includes("API Key") || error.message.includes("401") || error.message.includes("403"))) {
       return "System Alert: API Key authentication failed. Get your key at https://aistudio.google.com/app/apikey, add it to Netlify 'API_KEY' variable, and TRIGGER A REDEPLOY.";
    }
    if (error instanceof Error && error.message.includes("429")) {
        return "System Alert: Traffic overload. My neural network is processing too many requests. Please wait 10 seconds.";
    }
    return "System Alert: Unable to connect to AI mainframe. Connection interrupted.";
  }
};

export const getServiceRecommendation = async (niche: string): Promise<{ service: string; reason: string }> => {
  try {
    // Initialize AI here, not at top level
    const ai = getGenAIClient();

    const prompt = `
      Context: You are the AI intake system for AFA Media.
      User Niche: "${niche}"
      
      Available Services:
      1. AI SmartSite + Meta Ads (Best for businesses needing a full lead-gen infrastructure. Good for Real Estate, Local Services, Contractors.)
      2. Sales Email Copywriting (Best for businesses with existing leads needing higher conversion. Good for E-com, Newsletters, Coaches.)
      3. Full Multi-Page Upgrade (Best for large brands requiring extensive SEO and content depth. Good for Law Firms, Corporate, Tech.)

      Task: Recommend the ONE best service for this niche based on their typical operational needs.
      Analyze the niche. Does it rely on quick leads? Retention? Brand authority?
      Select the service that fits best. Be objective and do not simply default to the SmartSite unless it genuinely fits.
      
      Output Format strictly:
      Service Name|Short futuristic explanation why.
    `;

    // Wrap in retry logic
    const result = await retryOperation(async () => {
      return await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
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
    if (error instanceof Error && (error.message.includes("API Key") || error.message.includes("403"))) {
       return {
         service: "System Offline (API Key Error)",
         reason: "The AI module cannot authenticate. Get your key at aistudio.google.com, add 'API_KEY' to Netlify, and REDEPLOY."
       };
    }
    return { 
      service: "Connection Interrupted", 
      reason: "Unable to reach the neural network. Please check your internet connection." 
    };
  }
};
