
export const handler = async (event, context) => {
  console.log("AI Function: Request received");

  // CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // Handle Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  // Only POST allowed
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    // Check both standard variable names to be safe
    const apiKey = process.env.API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error("AI Function: API Key missing");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Server Configuration Error: API Key missing in Netlify settings." })
      };
    }

    if (!event.body) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing body" }) };
    }

    const requestBody = JSON.parse(event.body);
    const { endpointType, systemInstruction, prompt, history, message, image } = requestBody;

    // Use standard 1.5 Flash model for maximum compatibility and speed
    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    let contents = [];

    if (endpointType === 'chat') {
      if (history && Array.isArray(history)) {
        contents = history.map(msg => ({
          role: msg.role,
          parts: msg.parts
        }));
      }

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

    console.log(`Sending request to Google Gemini (${model})...`);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google API Error:", JSON.stringify(data));
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
    console.error("Backend Error:", error);
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: `Backend Error: ${error.message}` })
    };
  }
};
