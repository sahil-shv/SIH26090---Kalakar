// SIH26090 — Photoshoot Prompt Engine Route
// POST /api/product-sessions/:id/photoshoot
// Combines Product Profile + Artisan Input + Product Content to generate 4 personalized photoshoot prompts.

import { Router } from 'express';
import { generatePhotoshootPrompts } from '../services/gemini.js';

export const photoshootRouter = Router();

/**
 * POST /:id/photoshoot
 *
 * Body: {
 *   profile: { ...product profile object from Phase 3... },
 *   artisanInput: "Ye basket bamboo se bana hai...",
 *   content: { ...confirmed content object from Phase 4... }
 * }
 *
 * Response: {
 *   success: true,
 *   sessionId: "...",
 *   photoshoot: {
 *     hero: { purpose: "...", prompt: "..." },
 *     lifestyle: { purpose: "...", prompt: "..." },
 *     detail: { purpose: "...", prompt: "..." },
 *     context: { purpose: "...", prompt: "..." }
 *   },
 *   metadata: { model, timestamp }
 * }
 */
photoshootRouter.post('/:id/photoshoot', async (req, res) => {
  const { id } = req.params;
  const { profile, artisanInput, content } = req.body;

  try {
    console.log(`[${new Date().toISOString()}] Generating photoshoot prompts for session ${id}`);

    const photoshoot = await generatePhotoshootPrompts({
      profile: profile || {},
      artisanInput: artisanInput || '',
      content: content || {}
    });

    console.log(`[${new Date().toISOString()}] Photoshoot prompts generated successfully for 4 shot types`);

    return res.json({
      success: true,
      sessionId: id,
      photoshoot,
      metadata: {
        model: 'gemini-2.0-flash',
        timestamp: new Date().toISOString(),
        stage: 'photoshoot_prompts'
      }
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Photoshoot prompt generation failed for session ${id}:`, error.message);

    const isConfigError = error.message.includes('GEMINI_API_KEY');

    return res.status(isConfigError ? 503 : 500).json({
      success: false,
      error: isConfigError
        ? 'Gemini API key is not configured on the server.'
        : 'Failed to generate photoshoot prompts. Please try again.',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
