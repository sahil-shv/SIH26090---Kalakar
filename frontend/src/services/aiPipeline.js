// SIH26090 — Frontend AI Pipeline Service
// Calls the backend API which securely proxies to Gemini.
// No API keys exist in the frontend.

function getBackendUrl() {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const hostname = window.location.hostname;
    return `http://${hostname}:3001`;
  }
  return 'http://localhost:3001';
}

/**
 * Stage 1 — Product Understanding
 *
 * Sends 5 captured product images to the backend,
 * which forwards them to Gemini for visual analysis.
 *
 * Returns a structured Visual Product Profile.
 *
 * @param {Array<{id: string, type: string, label: string, dataUrl: string}>} images
 * @returns {Promise<object>} { success, profile, metadata }
 */
export async function analyzeProductPhotos(images) {
  const sessionId = `session_${Date.now()}`;
  const baseUrl = getBackendUrl();

  const response = await fetch(`${baseUrl}/api/product-sessions/${sessionId}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Product analysis failed.');
  }

  return data;
}

/**
 * Phase 4 — Product Content Generation
 *
 * Sends the Visual Product Profile and Artisan Statement to the backend,
 * which combines them and invokes Gemini to generate title, descriptions, SEO, and tags.
 *
 * @param {object} params
 * @param {object} params.profile - Visual product profile from Phase 3
 * @param {string} params.artisanInput - Text or transcript from artisan
 * @returns {Promise<object>} { success, content, metadata }
 */
export async function generateProductListing({ profile, artisanInput }) {
  const sessionId = `session_${Date.now()}`;
  const baseUrl = getBackendUrl();

  const response = await fetch(`${baseUrl}/api/product-sessions/${sessionId}/generate-content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, artisanInput })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to generate product content.');
  }

  return data;
}

/**
 * Phase 5 — Personalized AI Photoshoot Prompt Engine
 *
 * Sends Product Profile, Artisan Statement, and Product Content to the backend,
 * which invokes Gemini to plan 4 detailed photography prompts (hero, lifestyle, detail, context).
 *
 * Does NOT generate images (Nano Banana call belongs to Phase 6).
 *
 * @param {object} params
 * @param {object} params.profile - Visual product profile
 * @param {string} params.artisanInput - Artisan statement
 * @param {object} params.content - Confirmed product content
 * @returns {Promise<object>} { success, photoshoot, metadata }
 */
export async function generatePhotoshootPrompts({ profile, artisanInput, content }) {
  const sessionId = `session_${Date.now()}`;
  const baseUrl = getBackendUrl();

  const response = await fetch(`${baseUrl}/api/product-sessions/${sessionId}/photoshoot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, artisanInput, content })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Photoshoot prompt planning failed.');
  }

  return data;
}

/**
 * Phase 6 — Qwen/Qwen-Image-Edit-2511 Real Product Photoshoot Editing
 *
 * Sends originalImages (5 captured photos) and imageType ('hero' | 'lifestyle' | 'detail' | 'context')
 * to the backend, which passes them directly to Qwen/Qwen-Image-Edit-2511 for image editing.
 *
 * @param {object} params
 * @param {string} params.imageType - 'hero' | 'lifestyle' | 'detail' | 'context'
 * @param {Array<string>|object} [params.originalImages] - All 5 original captured product photographs
 * @param {string} [params.originalImage] - Single original photograph reference
 * @returns {Promise<object>} { success, image: { id, type, status, dataUrl, promptVersion, generatedAt, source } }
 */
export async function generateProductImage({ imageType, promptText, originalImages, originalImage }) {
  const sessionId = `session_${Date.now()}`;
  const baseUrl = getBackendUrl();

  const response = await fetch(`${baseUrl}/api/product-sessions/${sessionId}/generate-single-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageType, promptText, originalImages, originalImage })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || `Failed to generate ${imageType} image mockup with Qwen/Qwen-Image-Edit-2511.`);
  }

  return data;
}

export function computePricing(costs) {
  const { materialCost = 250, labourCost = 120, packagingCost = 30, otherCost = 0, desiredMarginPct = 35 } = costs;
  const baseCost = Number(materialCost) + Number(labourCost) + Number(packagingCost) + Number(otherCost);
  const marginDecimal = desiredMarginPct / 100;
  const recommendedPrice = Math.round(baseCost / (1 - marginDecimal));

  return {
    materialCost,
    labourCost,
    packagingCost,
    otherCost,
    desiredMarginPct,
    baseCost,
    recommendedPrice
  };
}
