// SIH26090 — Phase 6: Qwen/Qwen-Image-Edit-2511 Image Editing Service
// Provider: fal-ai (via Hugging Face InferenceClient)
// Task: image-to-image
//
// IMPORTANT PROVIDER LIMITATIONS (verified 2026-08-26):
// - fal-ai provider accepts a SINGLE image Blob input per request
// - Multi-image input is NOT supported by the fal-ai hosted provider
// - The SDK sends: image_url: base64DataUrl, image_urls: [base64DataUrl]
// - Each shot type receives ONE representative original photo (the best match)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { InferenceClient } from '@huggingface/inference';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');

/**
 * Helper to read exact prompt text files from documents/prompt/
 */
function getPromptFileContent(filename) {
  const filePath = path.join(projectRoot, 'documents', 'prompt', filename);
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8').trim();
    }
  } catch (err) {
    console.warn(`[QWEN] Could not read prompt file '${filename}':`, err.message);
  }
  return '';
}

/**
 * Select the best representative original photo for a given shot type.
 *
 * Since fal-ai only accepts a single image input, we pick the most
 * relevant captured photo for each shot type:
 *   hero    → front (primary product view)
 *   lifestyle → left (side perspective for room staging)
 *   detail  → detail (macro craft texture)
 *   context → right (alternate angle for use context)
 *
 * Falls back through: requested angle → front → first available.
 */
function selectBestOriginalPhoto(imageType, originalImages) {
  // Normalize to a keyed object
  let imageMap = {};

  if (Array.isArray(originalImages)) {
    // Array of data URLs — map by index to canonical positions
    const keys = ['front', 'back', 'left', 'right', 'detail'];
    originalImages.forEach((img, i) => {
      const val = typeof img === 'object' ? img?.dataUrl || img : img;
      if (val && typeof val === 'string') {
        imageMap[keys[i] || `img_${i}`] = val;
      }
    });
  } else if (originalImages && typeof originalImages === 'object') {
    for (const [key, val] of Object.entries(originalImages)) {
      const resolved = typeof val === 'object' ? val?.dataUrl || val : val;
      if (resolved && typeof resolved === 'string') {
        imageMap[key] = resolved;
      }
    }
  }

  // Priority mapping for each shot type
  const priorityMap = {
    hero: ['front', 'back', 'left', 'right', 'detail'],
    lifestyle: ['left', 'front', 'right', 'back', 'detail'],
    detail: ['detail', 'front', 'back', 'left', 'right'],
    context: ['right', 'front', 'left', 'back', 'detail']
  };

  const priorities = priorityMap[imageType] || priorityMap.hero;

  for (const key of priorities) {
    if (imageMap[key]) return imageMap[key];
  }

  // Absolute fallback: first available
  const firstVal = Object.values(imageMap)[0];
  return firstVal || null;
}

/**
 * Convert a base64 data URL string to a Blob for the InferenceClient.
 */
function dataUrlToBlob(dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) {
    throw new Error('Invalid data URL format for image input');
  }
  const mimeType = match[1];
  const base64Data = match[2];
  const buffer = Buffer.from(base64Data, 'base64');
  return new Blob([buffer], { type: mimeType });
}

/**
 * Phase 6 — Qwen/Qwen-Image-Edit-2511 Image Editing via fal-ai Provider
 *
 * IMAGE EDITING ARCHITECTURE:
 * Original Product Photo + Universal Product Lock Prompt + Shot Specific Prompt
 * → InferenceClient.imageToImage({ provider: 'fal-ai' })
 * → Qwen/Qwen-Image-Edit-2511
 * → Edited Product Image Mockup
 *
 * LIMITATION: fal-ai provider accepts ONE image per request.
 * Each shot type receives the most relevant original photo for that angle.
 *
 * @param {object} params
 * @param {string} params.imageType - 'hero' | 'lifestyle' | 'detail' | 'context'
 * @param {Array<string>|object} params.originalImages - The captured product photographs
 * @returns {Promise<object>} { id, type, status: 'completed', dataUrl, source }
 */
export async function generateQwenSingleMockup({ imageType, originalImages }) {
  const hfToken = process.env.HF_TOKEN;

  // 1. Verify HF_TOKEN
  if (!hfToken || hfToken.includes('your_')) {
    throw new Error(
      'Hugging Face token (HF_TOKEN) is not configured in backend/.env. ' +
      'Qwen/Qwen-Image-Edit-2511 requires a valid HF_TOKEN for fal-ai inference.'
    );
  }

  // 2. Read Prompt Files from documents/prompt/
  const universalPrompt = getPromptFileContent('universalPrompt(2).txt') ||
    'CRITICAL PRODUCT IDENTITY LOCK: Preserve the exact physical product shown in the supplied original photographs.';

  const shotPromptMap = {
    hero: getPromptFileContent('hero(2).txt') || 'PHOTOGRAPHIC TREATMENT — COMMERCIAL HERO SHOT',
    lifestyle: getPromptFileContent('lifestyle(2).txt') || 'PHOTOGRAPHIC TREATMENT — LIFESTYLE IN-SITU SHOT',
    detail: getPromptFileContent('detail(2).txt') || 'PHOTOGRAPHIC TREATMENT — CRAFT DETAIL SHOT',
    context: getPromptFileContent('context(1).txt') || 'PHOTOGRAPHIC TREATMENT — PRACTICAL CONTEXT SHOT'
  };

  const shotPrompt = shotPromptMap[imageType] || shotPromptMap.hero;
  const fullPrompt = `${universalPrompt}\n\n${shotPrompt}`;

  // 3. Select the best original photo for this shot type (single image only)
  const selectedPhoto = selectBestOriginalPhoto(imageType, originalImages);

  if (!selectedPhoto) {
    throw new Error(
      `No original product photo available for '${imageType}' shot. ` +
      'Capture product photos before generating mockups.'
    );
  }

  const imageBlob = dataUrlToBlob(selectedPhoto);
  console.log(`[QWEN] Initiating fal-ai → Qwen-Image-Edit-2511 for '${imageType}' (input: ${(imageBlob.size / 1024).toFixed(0)}KB)`);

  // 4. Call InferenceClient with provider: 'fal-ai'
  const client = new InferenceClient(hfToken);

  try {
    const startTime = Date.now();

    const resultBlob = await client.imageToImage({
      model: 'Qwen/Qwen-Image-Edit-2511',
      inputs: imageBlob,
      provider: 'fal-ai',
      parameters: {
        prompt: fullPrompt
      }
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    if (!(resultBlob instanceof Blob) || resultBlob.size === 0) {
      throw new Error('Qwen/Qwen-Image-Edit-2511 returned empty or invalid response');
    }

    // Convert result Blob to data URL
    const outputBuffer = Buffer.from(await resultBlob.arrayBuffer());
    const base64 = outputBuffer.toString('base64');
    const mimeType = resultBlob.type || 'image/png';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    console.log(`[QWEN SUCCESS] '${imageType}' mockup generated in ${elapsed}s (output: ${(resultBlob.size / 1024).toFixed(0)}KB)`);

    return {
      id: imageType,
      type: imageType,
      status: 'completed',
      dataUrl,
      promptVersion: 1,
      generatedAt: new Date().toISOString(),
      source: 'Qwen/Qwen-Image-Edit-2511 (fal-ai)'
    };

  } catch (err) {
    console.error(`[QWEN FAILURE] '${imageType}' generation failed:`, err.message);

    // Surface error directly — NO fallback to Replicate/Nano Banana/other models
    throw new Error(
      `Qwen/Qwen-Image-Edit-2511 failed for '${imageType}': ${err.message}`
    );
  }
}
