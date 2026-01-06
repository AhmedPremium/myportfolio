import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// Vercel Serverless Function: POST /api/gemini
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing `message` in request body' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured');
      return res.status(500).json({ error: 'AI not configured' });
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

    return res.status(200).json({ text: response.text });
  } catch (error) {
    console.error('API /api/gemini error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
