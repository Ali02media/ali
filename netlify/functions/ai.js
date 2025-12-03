
export const handler = async (event, context) => {
  // Log start of execution to debug connection
  console.log("AI Function: Received request", event.httpMethod);

  // 1. Handle CORS Preflight
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  // 2. Only allow POST
  if (event.httpMethod !== "POST") {
    console.warn("AI Function: Method Not Allowed", event.httpMethod);
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  try {
    // 3. Get API Key
    const apiKey = process.env.API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error("CRITICAL: API Key is missing in Netlify Environment Variables.");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Server Configuration Error: API Key missing." })
      };
    }

    // 4. Parse Body
    if (!event.body) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing request body" }) };
    }
    
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (e) {
      console.error("AI Function: Invalid JSON body");
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
    }

    const { endpointType, systemInstruction, prompt, history, message, image } = requestBody;

    // 5. Construct Gemini Request
    // UPDATED: Using gemini-2.5-flash as 1.5-flash is returning "Not Found"
    const model = 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    let contents = [];

    if (endpointType === 'chat') {
      // Reconstruct chat history
      if (history && Array.isArray(history)) {
        contents = history.map(msg => ({
          role: msg.role,
          parts: msg.parts
        }));
      }

      // Add new user message
      const newParts = [];
      if (image) {
        newParts.push({
          inlineData: {
            mimeType: image.mimeType,
            data: image.data
          }
        });
        newParts.push({ text: message || "Analyze this image." });
      } else {
        newParts.push({ text: message || "" });
      }

      contents.push({ role: "user", parts: newParts });
    } else {
      // Simple prompt (Recommendation engine)
      contents.push({
        role: "user",
        parts: [{ text: prompt || "Hello" }]
      });
    }

    const payload = {
      contents: contents,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    // 6. Call Google API
    // Using native fetch (supported in Node 18/20 defined in netlify.toml)
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", JSON.stringify(data));
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: data.error?.message || "Gemini API Error" })
      };
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: text })
    };

  } catch (error) {
    console.error("Function Crash:", error);
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: `Backend Crash: ${error.message}` })
    };
  }
};
