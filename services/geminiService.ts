// Client-side helper: call the serverless endpoint instead of using process or bundling the SDK
export const chatWithAssistant = async (message: string) => {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => null);
      console.error('Gemini endpoint error:', res.status, text);
      return 'I am currently unavailable. Please try again later.';
    }

    const data = await res.json();
    return data.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'I am currently unavailable. Please try again later.';
  }
};