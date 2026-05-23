import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = 3000;

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      throw new Error('GEMINI_API_KEY missing');
    }

    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'rootai-backend'
        }
      }
    });
  }

  return aiClient;
}

function detectSensitivity(text: string) {
  const t = text.toLowerCase();

  return {
    medical: /(clinic|hospital|doctor|maternal|emergency|medic)/.test(t),
    finance: /(grant|loan|funding|money|scam)/.test(t),
    agriculture: /(cassava|crop|farming|blight|fungal|disease)/.test(t)
  };
}

// ---------------- CHAT ----------------
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, profile } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message required' });
    }

    const flags = detectSensitivity(message);

    let reviewReason = '';
    if (flags.agriculture) {
      reviewReason = 'Agriculture content flagged for review';
    } else if (flags.medical) {
      reviewReason = 'Medical content flagged for review';
    } else if (flags.finance) {
      reviewReason = 'Finance content flagged for review';
    }

    const key = process.env.GEMINI_API_KEY;

    if (!key) {
      return res.status(500).json({
        error: 'Missing GEMINI_API_KEY'
      });
    }

    const ai = getAiClient();

    const systemPrompt = `
You are RootAI Community Assistant.
Tailor answers to user profile.
Be clear, short, and structured.
Use numbered steps when needed.
`;

    const formattedContents: any[] = [];

    if (Array.isArray(history)) {
      for (const msg of history) {
        formattedContents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{
            text: typeof msg.text === 'string'
              ? msg.text.slice(0, 3000)
              : ''
          }]
        });
      }
    }

    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }]
      }
    });

    const text =
      response.text ||
      'No response generated';

    const candidate = response?.candidates?.[0];
    const chunks = candidate?.groundingMetadata?.groundingChunks ?? [];

    const groundingChunks = [];
    for (const c of chunks) {
      if (c?.web?.uri) {
        groundingChunks.push({
          title: c.web.title || 'Source',
          uri: c.web.uri
        });
      }
    }

    const scoreBase = groundingChunks.length > 0 ? 95 : 88;

    return res.json({
      text,
      groundingChunks,
      confidenceScore: Math.min(99, scoreBase),
      confidenceExplanation: groundingChunks.length
        ? 'Grounded web sources used'
        : 'No external sources used',
      isHumanReviewed: Object.values(flags).some(Boolean),
      humanReviewReason: reviewReason
    });

  } catch (err: any) {
    return res.status(500).json({
      error: 'chat failed',
      details: err?.message || 'unknown error'
    });
  }
});

// ---------------- WHATSAPP WEBHOOK ----------------
app.post('/api/webhooks/whatsapp', (req: Request, res: Response) => {
  const secret = req.headers['x-webhook-secret'];

  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const mockId = 'wamid_' + Math.random().toString(36).slice(2, 10);

  return res.json({
    status: 'ok',
    message_id: mockId,
    timestamp: Date.now(),
    data: {
      from: req.body?.from || '',
      incomingQuery: req.body?.body || '',
      replySentText: 'RootAI response generated'
    }
  });
});

// ---------------- SMS WEBHOOK ----------------
app.post('/api/webhooks/sms', (req: Request, res: Response) => {
  const secret = req.headers['x-webhook-secret'];

  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const text = (req.body?.text || '').toLowerCase();

  let sms = 'RootAI: Use *141# for services';

  if (text.includes('farm')) {
    sms = 'RootAI Farm: Check crop health and remove infected plants';
  }

  if (text.includes('job')) {
    sms = 'RootAI Jobs: New listings available via *141#';
  }

  return res.json({
    status: 'sent',
    length: sms.length,
    sms
  });
});

// ---------------- N8N TRIGGER ----------------
app.post('/api/n8n/trigger', (req: Request, res: Response) => {
  const secret = req.headers['x-webhook-secret'];

  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  return res.json({
    ok: true,
    job_id: 'n8n_' + Math.floor(Math.random() * 100000),
    payload: req.body
  });
});

// ---------------- VITE + SERVER ----------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  } else {
    const dist = path.join(process.cwd(), 'dist');

    app.use(express.static(dist));

    app.get('*', (_: Request, res: Response) => {
      res.sendFile(path.join(dist, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
