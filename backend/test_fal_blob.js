import dotenv from 'dotenv';
import { InferenceClient } from '@huggingface/inference';
import fs from 'fs';

dotenv.config({ path: './.env' });

async function testFalBlob() {
  const token = process.env.HF_TOKEN;
  console.log('Testing HF Token:', token?.substring(0, 10) + '...');

  const client = new InferenceClient(token, { provider: "fal-ai" });

  // Create a sample image Blob (e.g. 100x100 PNG buffer)
  // Let's create a minimal valid PNG buffer or fetch a real image
  console.log('Fetching sample reference image...');
  const sampleRes = await fetch("https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/cat.png");
  const arrayBuf = await sampleRes.arrayBuffer();
  const imageBlob = new Blob([arrayBuf], { type: 'image/png' });

  console.log('Image Blob created size:', imageBlob.size, 'bytes');

  const promptText = "PHOTOGRAPHIC TREATMENT — COMMERCIAL HERO SHOT: Transform the background into a clean, high-end commercial e-commerce studio presentation with soft lighting and natural shadow.";

  console.log('Calling client.imageToImage({ model: "Qwen/Qwen-Image-Edit-2511", inputs: imageBlob, provider: "fal-ai", parameters: { prompt } })...');
  const startTime = Date.now();

  try {
    const outputBlob = await client.imageToImage({
      model: 'Qwen/Qwen-Image-Edit-2511',
      inputs: imageBlob,
      provider: 'fal-ai',
      parameters: {
        prompt: promptText
      }
    });

    const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n========================================`);
    console.log(`✓ SUCCESS in ${elapsedSec}s!`);
    console.log(`outputBlob received:`, outputBlob);
    console.log(`outputBlob type: ${outputBlob?.type}, size: ${outputBlob?.size} bytes`);

    if (outputBlob) {
      const outputBuffer = Buffer.from(await outputBlob.arrayBuffer());
      const base64 = outputBuffer.toString('base64');
      console.log('Result base64 length:', base64.length);
      console.log('Data URL preview:', `data:${outputBlob.type || 'image/png'};base64,${base64.substring(0, 50)}...`);
    }
    console.log(`========================================\n`);
  } catch (err) {
    const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`\n❌ Fal AI Call Failed after ${elapsedSec}s:`, err.message);
    if (err.cause) console.error('Error cause:', err.cause);
  }
}

testFalBlob();
