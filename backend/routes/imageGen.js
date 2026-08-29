// SIH26090 — Qwen Image Edit 2511 Route
// POST /api/product-sessions/:id/generate-single-image
// Generates ONE single image mockup using Qwen/Qwen-Image-Edit-2511.

import { Router } from 'express';
import { generateQwenSingleMockup } from '../services/qwenImageEdit.js';

export const imageGenRouter = Router();

/**
 * POST /:id/generate-single-image
 *
 * Body: {
 *   imageType: "hero" | "lifestyle" | "detail" | "context",
 *   originalImages: ["data:image/jpeg;base64,...", ...] (5 captured photos)
 * }
 */
imageGenRouter.post('/:id/generate-single-image', async (req, res) => {
  const { id } = req.params;
  const { imageType, originalImages, originalImage } = req.body;

  if (!imageType || !['hero', 'lifestyle', 'detail', 'context'].includes(imageType)) {
    return res.status(400).json({
      success: false,
      error: "Invalid imageType. Must be one of: 'hero', 'lifestyle', 'detail', 'context'."
    });
  }

  const sourceImages = originalImages || (originalImage ? [originalImage] : null);

  try {
    console.log(`[${new Date().toISOString()}] Executing Qwen-Image-Edit-2511 for '${imageType}' mockup (Session: ${id})`);

    const imageData = await generateQwenSingleMockup({
      imageType,
      originalImages: sourceImages
    });

    console.log(`[${new Date().toISOString()}] Successfully generated '${imageType}' mockup with Qwen-Image-Edit-2511`);

    return res.json({
      success: true,
      sessionId: id,
      image: imageData,
      metadata: {
        timestamp: new Date().toISOString(),
        engine: 'Qwen/Qwen-Image-Edit-2511'
      }
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Qwen image edit failed for '${imageType}':`, error.message);

    return res.status(500).json({
      success: false,
      error: error.message || `Failed to generate ${imageType} image mockup with Qwen/Qwen-Image-Edit-2511.`,
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
