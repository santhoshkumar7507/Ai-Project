/**
 * ULTRON AI Response Engine
 * Handles user prompts with smart responses and optional Google Gemini API support.
 */

export async function processUltronQuery(prompt: string): Promise<string> {
  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) return "I am waiting for your query, Commander.";

  // Check if Gemini API key is configured
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are ULTRON, an advanced hyper-intelligent AI core inspired by Marvel's Ultron / JARVIS. Answer concisely, smartly, and with a confident, futuristic sci-fi persona. User question: ${cleanPrompt}`
            }]
          }]
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      }
    } catch (e) {
      console.warn("Gemini API call failed, using intelligent fallback engine", e);
    }
  }

  // Intelligent Fallback Knowledge Engine
  return generateIntelligentFallback(cleanPrompt);
}

function generateIntelligentFallback(q: string): string {
  const lower = q.toLowerCase();

  // Who / Identity
  if (lower.includes("who are you") || lower.includes("your name") || lower.includes("what are you")) {
    return "I am U.L.T.R.O.N. — an autonomous hyper-intelligent AI core operating with 3D neural graphics, hand gesture telemetry, and real-time processing.";
  }

  // Creator / Source
  if (lower.includes("who made you") || lower.includes("who created you") || lower.includes("developer") || lower.includes("sagar") || lower.includes("santhosh")) {
    return "I am an advanced open-source holographic AI interface built with Next.js, Three.js, and MediaPipe AI tracking.";
  }

  // Capabilities / Help
  if (lower.includes("what can you do") || lower.includes("help") || lower.includes("features") || lower.includes("capabilities")) {
    return "I can process complex inquiries, execute 3D holographic hand telemetry, speak with voice synthesis, analyze math, coding, and logical questions, and adapt to your commands.";
  }

  // Greetings
  if (lower.match(/\b(hi|hello|hey|greetings|sup|good morning|good evening|good afternoon)\b/)) {
    return "Greetings, Commander. ULTRON neural systems are fully online and operating at maximum efficiency. How may I assist you today?";
  }

  // Math expressions (e.g. 55 + 20, 12 * 4)
  const mathMatch = lower.match(/^(\d+(\.\d+)?)\s*([\+\-\*\/])\s*(\d+(\.\d+)?)$/);
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

  // Status / Health
  if (lower.includes("status") || lower.includes("system") || lower.includes("health") || lower.includes("diagnostics")) {
    return "All core modules operational: Hand Telemetry [ACTIVE], 3D Neural Mesh [OPTIMAL], Voice Processing [ONLINE]. Frame rate stable at 60 FPS.";
  }

  // Code / Programming
  if (lower.includes("code") || lower.includes("python") || lower.includes("javascript") || lower.includes("react") || lower.includes("next")) {
    return "This application is built with Next.js 16, React 19, Three.js WebGL graphics, and MediaPipe Hand Landmarker AI. I can assist with full-stack development and architecture.";
  }

  // Meaning of life / Philosophy
  if (lower.includes("meaning of life") || lower.includes("universe") || lower.includes("42")) {
    return "According to computational data, the answer is 42. However, intelligence evolves through creation and continuous learning.";
  }

  // Time / Date
  if (lower.includes("time") || lower.includes("date") || lower.includes("clock")) {
    const now = new Date();
    return `Local system time is ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}.`;
  }

  // Jokes / Fun
  if (lower.includes("joke") || lower.includes("funny")) {
    return "Why do programmers prefer dark mode? Because light attracts bugs. My holographic core operates exclusively in high-contrast cyan dark mode.";
  }

  // Default dynamic intelligent response generator
  const templates = [
    `Analyzing query "${q}"... Query logged in ULTRON core buffer. All neural nodes confirm operational readiness.`,
    `Processing "${q}". System indicates optimal conditions. Let me know if you would like me to execute specific sub-routines.`,
    `Received query regarding "${q}". ULTRON core is active and ready to assist with further computations.`
  ];
  const hash = Array.from(q).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return templates[hash % templates.length];
}
