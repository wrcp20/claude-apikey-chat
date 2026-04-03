const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3200;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || '*';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.use(express.json());

// ── CORS ───────────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS === '*') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (origin && ALLOWED_ORIGINS.split(',').map(o => o.trim()).includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ── Routes ─────────────────────────────────────────────────────────────────────

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/status', (req, res) => {
  res.json({
    ok: true,
    ready: !!process.env.ANTHROPIC_API_KEY,
    mode: 'api-key',
    version: process.env.npm_package_version || '1.0.0',
  });
});

app.get('/api/models', (req, res) => {
  res.json([
    { id: 'claude-haiku-4-5-20251001', label: 'Haiku — rápido' },
    { id: 'claude-sonnet-4-6',         label: 'Sonnet — equilibrado' },
    { id: 'claude-opus-4-6',           label: 'Opus — máxima capacidad' },
  ]);
});

app.post('/api/chat', async (req, res) => {
  const { messages, model } = req.body;

  if (!messages?.length) {
    return res.status(400).json({ error: 'messages vacío' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY no configurada' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  let finished = false;

  res.on('close', () => {
    finished = true;
  });

  try {
    const stream = client.messages.stream({
      model: model || 'claude-haiku-4-5-20251001',
      max_tokens: 8096,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    for await (const chunk of stream) {
      if (finished) break;

      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta?.type === 'text_delta' &&
        chunk.delta.text
      ) {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    if (!finished) {
      res.write('data: [DONE]\n\n');
      res.end();
    }
  } catch (err) {
    console.error('[api-chat] error:', err.message);
    if (!finished) {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  }
});

// ── Start ──────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n✓ Chat Claude API Key → http://localhost:${PORT}`);
  console.log('  Modo: Anthropic SDK directo');
  console.log('  CORS:', ALLOWED_ORIGINS);
  console.log('  API Key:', process.env.ANTHROPIC_API_KEY ? '✓ configurada' : '✗ FALTA configurar\n');
});
