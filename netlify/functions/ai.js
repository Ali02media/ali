import { GoogleGenAI } from "@google/genai";

export const handler = async (event, context) => {
  // CORS Headers to allow your site to talk to this function
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("Server Error: API_KEY is missing in Netlify Environment Variables.");
      return { 
        statusCode: 500, 
        headers, 
        body: JSON.stringify({ error: "Server Configuration Error: API Key missing. Check Netlify settings." }) 
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const { endpointType, ...data } = JSON.parse(event.body);

    // --- Scenario 1: Chat (AFA Bot) ---
    if (endpointType === 'chat') {
        const { history, message, image, systemInstruction } = data;

        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
            history: history || []
        });

        // Handle text + optional image
        let content = [{ text: message }];
        if (image) {
            content = [
              { inlineData: { mimeType: image.mimeType, data: image.data } }, 
              { text: message || "Analyze this image." }
            ];
        }

        const result = await chat.sendMessage({ message: content });
        return { statusCode: 200, headers, body: JSON.stringify({ text: result.text }) };
    }

    // --- Scenario 2: Recommendation (System Matcher) ---
    if (endpointType === 'recommendation') {
        const { prompt } = data;
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return { statusCode: 200, headers, body: JSON.stringify({ text: result.text }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid endpointType" }) };

  } catch (error) {
    console.error("Backend AI Error:", error);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: error.message || "Internal Server Error" }) 
    };
  }
};