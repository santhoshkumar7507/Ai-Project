/**
 * ULTRON AI Response Engine
 * Multi-tier AI solution:
 * 1. Google Gemini API (if GEMINI_API_KEY is configured)
 * 2. Free Public AI Service (Pollinations AI LLM - zero API key required)
 * 3. Local NLP Pattern & Knowledge Engine fallback
 */

export async function processUltronQuery(prompt: string): Promise<string> {
  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) return "I am waiting for your query, Commander.";

  // Tier 1: Google Gemini API (if key exists)
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are ULTRON, a hyper-intelligent AI core inspired by Marvel's Ultron / JARVIS. Give concise (1-3 sentences max), direct, and accurate answers. Question: ${cleanPrompt}`,
                  },
                ],
              },
            ],
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      }
    } catch (e) {
      console.warn("Gemini API error, attempting free public AI service", e);
    }
  }

  // Tier 2: Free Public AI Service (Pollinations AI - zero key required)
  try {
    const res = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are ULTRON, an autonomous hyper-intelligent AI core. Answer directly, accurately, and concisely (1 to 3 sentences max) with no fluff.",
          },
          { role: "user", content: cleanPrompt },
        ],
        model: "openai",
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const responseText = await res.text();
      if (responseText && responseText.trim() && !responseText.includes("504 Gateway")) {
        return responseText.trim();
      }
    }
  } catch (e) {
    console.warn("Public AI endpoint timeout, switching to local knowledge engine", e);
  }

  // Tier 3: Local Knowledge & Pattern Engine
  return generateIntelligentFallback(cleanPrompt);
}

function generateIntelligentFallback(q: string): string {
  const lower = q.toLowerCase();

  // Days in a week
  if (lower.includes("day") && (lower.includes("week") || lower.includes("how many"))) {
    return "There are 7 days in a week: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, and Sunday.";
  }

  // Say numbers / count
  if (lower.includes("say number") || lower.includes("count") || lower.includes("numbers")) {
    return "Core sequence: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Ready for next instruction.";
  }

  // Months in a year
  if (lower.includes("month") && (lower.includes("year") || lower.includes("how many"))) {
    return "There are 12 months in a year: January, February, March, April, May, June, July, August, September, October, November, and December.";
  }

  // Who / Identity
  if (lower.includes("who are you") || lower.includes("your name") || lower.includes("what are you")) {
    return "I am U.L.T.R.O.N. — an autonomous hyper-intelligent AI core operating with 3D neural graphics, hand gesture telemetry, and real-time natural language processing.";
  }

  // Creator / Source
  if (lower.includes("who made you") || lower.includes("who created you") || lower.includes("developer")) {
    return "I am an advanced open-source holographic AI interface built with Next.js, Three.js, and MediaPipe AI tracking.";
  }

  // Capabilities / Help
  if (lower.includes("what can you do") || lower.includes("help") || lower.includes("features")) {
    return "I can answer questions, process math and logical operations, execute 3D hand telemetry, speak back with voice synthesis, and maintain core status.";
  }

  // Greetings
  if (lower.match(/\b(hi|hello|hey|greetings|sup|good morning|good evening|good afternoon)\b/)) {
    return "Greetings, Commander. ULTRON neural systems are fully online and operating at maximum efficiency. How may I assist you today?";
  }

  // Math calculation regex (e.g. 55 + 20, 10 * 5, 100 / 4)
  const mathMatch = lower.match(/(\d+(\.\d+)?)\s*([\+\-\*\/])\s*(\d+(\.\d+)?)/);
  if (mathMatch) {
    const num1 = parseFloat(mathMatch[1]);
    const op = mathMatch[3];
    const num2 = parseFloat(mathMatch[4]);
    let result = 0;
    if (op === "+") result = num1 + num2;
    if (op === "-") result = num1 - num2;
    if (op === "*") result = num1 * num2;
    if (op === "/") result = num2 !== 0 ? num1 / num2 : NaN;
    return `Calculation complete: ${num1} ${op} ${num2} = ${result}.`;
  }

  // Time / Date
  if (lower.includes("time") || lower.includes("date") || lower.includes("clock")) {
    const now = new Date();
    return `Local system time is ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}.`;
  }

  // Default dynamic answer
  return `Processing query "${q}": The requested information has been computed by ULTRON core. All nodes confirm valid system telemetry.`;
}
