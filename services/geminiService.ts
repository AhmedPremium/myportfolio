// Lazy-load @google/genai at runtime so it is NOT bundled into the main client bundle.
// This prevents Node-only code from breaking the browser bundle and keeps the initial bundle smaller.

export const chatWithAssistant = async (message: string) => {
  try {
    // Vite replaces `process.env.API_KEY` at build time with the configured value (or undefined).
    const apiKey = (process as any)?.env?.API_KEY as string | undefined;

    if (!apiKey) {
      console.warn('Gemini API key is not configured for this deployment.');
      return "AI is not configured for this deployment. Please use the contact page to reach out.";
    }

    // Dynamically import the ESM build from the CDN at runtime.
    // Using the full URL ensures it won't get bundled or cause server-only code to be included.
    const module = await import('https://esm.sh/@google/genai');
    const GoogleGenAI = (module as any).GoogleGenAI ?? (module as any).default?.GoogleGenAI;

    if (!GoogleGenAI) {
      console.error('Could not load GoogleGenAI from the ESM module');
      return "AI is currently unavailable. Please try again later.";
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: `You are the AI assistant for 'QwertyDeveloper', a world-class product designer and engineer's portfolio.\n        Your tone is professional, helpful, minimalist, and "Apple-like"—sophisticated but concise.\n        You know about QwertyDeveloper's projects (Horizon OS, Aura Health, Nebula Engine) and experience.\n        Keep answers short and elegant. If someone asks for a meeting, tell them to use the contact link.`,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error('Gemini API Error:', error);
    return "I am currently unavailable. Please try again later.";
  }
};