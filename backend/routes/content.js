// SIH26090 — Product Content Route
// POST /api/product-sessions/:id/generate-content
// Combines Product Profile + Artisan Input to generate listing content with Gemini.

import { Router } from 'express';
import { generateProductContent } from '../services/gemini.js';

export const contentRouter = Router();

/**
 * POST /:id/generate-content
 *
 * Body: {
 *   profile: { ...product profile object from Phase 3... },
 *   artisanInput: "Ye basket bamboo se bana hai..."
 * }
 */
contentRouter.post('/:id/generate-content', async (req, res) => {
  const { id } = req.params;
  const { profile, artisanInput } = req.body;

  console.log(`\n[DIAGNOSTIC] === POST /api/product-sessions/${id}/generate-content ===`);
  console.log(`[DIAGNOSTIC] Step 1: Received request.`);
  console.log(`[DIAGNOSTIC]   - Profile present: ${!!profile} (product_type: ${profile?.product_type || profile?.productType || 'N/A'})`);
  console.log(`[DIAGNOSTIC]   - Artisan input length: ${artisanInput ? artisanInput.length : 0} chars`);

  // --- Validation ---
  if (!artisanInput || typeof artisanInput !== 'string' || !artisanInput.trim()) {
    console.warn(`[DIAGNOSTIC] Validation failed: artisanInput is missing or empty.`);
    return res.status(400).json({
      success: false,
      error: 'Artisan input statement is required to generate product content.'
    });
  }

  // --- Gemini Content Generation ---
  try {
    console.log(`[DIAGNOSTIC] Step 2: Invoking Gemini 2.0 Flash for factual content generation...`);

    const content = await generateProductContent({
      profile: profile || {},
      artisanInput: artisanInput.trim()
    });

    console.log(`[DIAGNOSTIC] Step 3: Content generation completed successfully.`);
    console.log(`[DIAGNOSTIC]   - Title: "${content.title}"`);
    console.log(`[DIAGNOSTIC]   - Short desc length: ${content.short_description ? content.short_description.length : 0}`);
    console.log(`[DIAGNOSTIC]   - English desc length: ${content.description_en ? content.description_en.length : 0}`);
    console.log(`[DIAGNOSTIC]   - Hindi desc length: ${content.description_hi ? content.description_hi.length : 0}`);
    console.log(`[DIAGNOSTIC]   - SEO desc length: ${content.seo_description ? content.seo_description.length : 0}`);
    console.log(`[DIAGNOSTIC]   - Tags count: ${Array.isArray(content.tags) ? content.tags.length : 0}`);
    console.log(`[DIAGNOSTIC] Step 4: Returning content response to frontend.`);

    return res.json({
      success: true,
      sessionId: id,
      content,
      metadata: {
        model: 'gemini-2.0-flash',
        timestamp: new Date().toISOString(),
        stage: 'product_content'
      }
    });

  } catch (error) {
    console.error(`[DIAGNOSTIC] ERROR in /generate-content for session ${id}:`, error.message);

    const isConfigError = error.message.includes('GEMINI_API_KEY');

    return res.status(isConfigError ? 503 : 500).json({
      success: false,
      error: isConfigError
        ? 'Gemini API key is not configured on the server.'
        : 'Failed to generate product content. Please try again.',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
