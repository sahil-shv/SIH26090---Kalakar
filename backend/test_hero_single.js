// SIH26090 — Single Hero Test for Qwen-Image-Edit-2511 via fal-ai provider
// Tests: auth, provider support, image input, prompt, edited image output
import dotenv from 'dotenv';
import { InferenceClient } from '@huggingface/inference';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: './.env' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function singleHeroTest() {
  const token = process.env.HF_TOKEN;
  if (!token) {
    console.error('❌ HF_TOKEN not found in .env');
    process.exit(1);
  }
  console.log('✓ HF_TOKEN present:', token.substring(0, 10) + '...');

  // Load prompt files
  const promptDir = path.resolve(__dirname, '..', 'documents', 'prompt');
  const universalPrompt = fs.readFileSync(path.join(promptDir, 'universalPrompt(2).txt'), 'utf-8').trim();
  const heroPrompt = fs.readFileSync(path.join(promptDir, 'hero(2).txt'), 'utf-8').trim();
  const fullPrompt = `${universalPrompt}\n\n${heroPrompt}`;
  console.log('✓ Prompts loaded. Combined length:', fullPrompt.length, 'chars');

  // Download a real product-style test image
  console.log('Fetching test product image...');
  const testImageUrl = 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/cat.png';
  const imgRes = await fetch(testImageUrl);
  const imgArrayBuf = await imgRes.arrayBuffer();
  const imgBlob = new Blob([imgArrayBuf], { type: 'image/png' });
  console.log('✓ Test image fetched. Size:', imgBlob.size, 'bytes');

  // Initialize InferenceClient with explicit fal-ai provider
  const client = new InferenceClient(token);

  console.log('\n====== SINGLE HERO TEST ======');
  console.log('Model: Qwen/Qwen-Image-Edit-2511');
  console.log('Provider: fal-ai');
  console.log('Task: image-to-image');
  console.log('Prompt preview:', fullPrompt.substring(0, 120) + '...');
  console.log('==============================\n');

  const startTime = Date.now();

  // AbortController with 120 second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.error('⏱ TIMEOUT: 120 seconds exceeded, aborting...');
    controller.abort();
  }, 120_000);

  try {
    const result = await client.imageToImage({
      model: 'Qwen/Qwen-Image-Edit-2511',
      inputs: imgBlob,
      provider: 'fal-ai',
      parameters: {
        prompt: fullPrompt
      }
    }, { signal: controller.signal });

    clearTimeout(timeoutId);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n✅ SUCCESS in ${elapsed}s`);
    console.log('Result type:', typeof result);

    if (result instanceof Blob) {
      console.log('Output Blob size:', result.size, 'bytes');
      console.log('Output Blob type:', result.type);

      // Save to disk
      const outBuffer = Buffer.from(await result.arrayBuffer());
      const outPath = path.resolve(__dirname, 'test_hero_output.png');
      fs.writeFileSync(outPath, outBuffer);
      console.log('✓ Saved output to:', outPath);

      // Convert to data URL for verification
      const base64 = outBuffer.toString('base64');
      console.log('Base64 length:', base64.length);
      console.log('Data URL prefix:', `data:${result.type};base64,${base64.substring(0, 40)}...`);

      console.log('\n====== TEST RESULTS ======');
      console.log('1. Authentication: ✅ PASSED');
      console.log('2. Provider supports model: ✅ PASSED');
      console.log('3. Image input works: ✅ PASSED');
      console.log('4. Prompt input works: ✅ PASSED');
      console.log('5. Edited image returned: ✅ PASSED (size:', result.size, 'bytes)');
      console.log('6. Time elapsed:', elapsed, 'seconds');
      console.log('==========================\n');
    } else {
      console.log('Unexpected result format:', result);
    }

  } catch (err) {
    clearTimeout(timeoutId);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`\n❌ FAILED after ${elapsed}s`);
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    if (err.cause) console.error('Error cause:', JSON.stringify(err.cause, null, 2));
    
    console.log('\n====== TEST RESULTS ======');
    console.log('1. Authentication:', err.message.includes('401') || err.message.includes('auth') ? '❌ FAILED' : '✅ PASSED (or N/A)');
    console.log('2. Provider supports model:', err.message.includes('not supported') ? '❌ FAILED' : '? INCONCLUSIVE');
    console.log('3. Image input works:', '? INCONCLUSIVE');
    console.log('4. Prompt input works:', '? INCONCLUSIVE');
    console.log('5. Edited image returned:', '❌ FAILED');
    console.log('6. Error details:', err.message.substring(0, 200));
    console.log('==========================\n');
  }
}

singleHeroTest();
