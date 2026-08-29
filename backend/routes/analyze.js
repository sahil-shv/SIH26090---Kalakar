// SIH26090 — Product Analysis Route
// POST /api/product-sessions/:id/analyze
// Receives 5 captured product images from the frontend and sends them to Gemini.

import { Router } from 'express';
import { analyzeProductImages } from '../services/gemini.js';

export const analyzeProductRouter = Router();

/**
 * POST /:id/analyze
 *
 * Body: {
 *   images: [
 *     { id: "front", type: "front", label: "Front", dataUrl: "data:image/jpeg;base64,..." },
 *     ...
 *   ]
 * }
 */
analyzeProductRouter.post('/:id/analyze', async (req, res) => {
  const { id } = req.params;
  const { images } = req.body;

  console.log(`\n[DIAGNOSTIC] === POST /api/product-sessions/${id}/analyze ===`);
  console.log(`[DIAGNOSTIC] Step 1: Received request. Images payload present: ${!!images}`);

  // --- Validation ---
  if (!images || !Array.isArray(images) || images.length === 0) {
    console.warn(`[DIAGNOSTIC] Validation failed: No images array in request body.`);
    return res.status(400).json({
      success: false,
      error: 'No images provided. Send an array of captured product images.'
    });
  }

  // Verify all images have dataUrl
  const validImages = images.filter(img => img.dataUrl && typeof img.dataUrl === 'string' && img.dataUrl.startsWith('data:image/'));
  console.log(`[DIAGNOSTIC] Step 2: Validated ${validImages.length} / ${images.length} images containing valid base64 data URLs.`);

  if (validImages.length === 0) {
    console.warn(`[DIAGNOSTIC] Validation failed: No valid base64 image data URLs.`);
    return res.status(400).json({
      success: false,
      error: 'No valid image data found. Each image must have a base64 dataUrl.'
    });
  }

  // --- Gemini Analysis ---
  try {
    console.log(`[DIAGNOSTIC] Step 3: Invoking Gemini Vision model (gemini-2.0-flash)...`);

    const profile = await analyzeProductImages(validImages);

    console.log(`[DIAGNOSTIC] Step 4: Gemini analysis completed successfully.`);
    console.log(`[DIAGNOSTIC]   - product_type: "${profile.product_type || profile.productType || 'N/A'}"`);
    console.log(`[DIAGNOSTIC]   - category: "${profile.category || 'N/A'}"`);
    console.log(`[DIAGNOSTIC]   - materials: ${JSON.stringify(profile.materials_observed || profile.materialsObserved || [])}`);
    console.log(`[DIAGNOSTIC] Step 5: Returning product profile response to frontend.`);

    return res.json({
      success: true,
      sessionId: id,
      profile,
      metadata: {
        model: 'gemini-2.0-flash',
        timestamp: new Date().toISOString(),
        imageCount: validImages.length,
        stage: 'product_understanding'
      }
    });

  } catch (error) {
    console.error(`[DIAGNOSTIC] ERROR in /analyze for session ${id}:`, error.message);

    const isConfigError = error.message.includes('GEMINI_API_KEY');

    return res.status(isConfigError ? 503 : 500).json({
      success: false,
      error: isConfigError
        ? 'Gemini API key is not configured on the server.'
        : 'Product analysis failed. Please try again.',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
