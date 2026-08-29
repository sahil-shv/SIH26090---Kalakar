import dotenv from 'dotenv';
import { HfInference, InferenceClient } from '@huggingface/inference';
import fs from 'fs';

dotenv.config({ path: './.env' });

async function runTest() {
  const token = process.env.HF_TOKEN;
  console.log('Testing HF Token:', token?.substring(0, 10) + '...');

  // Test 1: InferenceClient with provider: "fal-ai"
  console.log('\n--- Test 1: InferenceClient(token, { provider: "fal-ai" }) ---');
  try {
    const client = new InferenceClient(token, { provider: "fal-ai" });
    console.log('Client initialized with provider: fal-ai');
    
    // Test imageToImage or imageEditing methods
    console.log('Available client methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(client)).filter(m => m.toLowerCase().includes('image')));

    const prompt = "PHOTOGRAPHIC TREATMENT — COMMERCIAL HERO SHOT: Transform the background into a clean studio presentation.";
    const imageUrl = "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/cat.png";

    if (typeof client.imageToImage === 'function') {
      console.log('Calling client.imageToImage with model Qwen/Qwen-Image-Edit-2511...');
      const response = await client.imageToImage({
        model: 'Qwen/Qwen-Image-Edit-2511',
        inputs: imageUrl,
        parameters: { prompt }
      });
      console.log('imageToImage Response:', response);
    } else {
      console.log('imageToImage function not found on client instance');
    }
  } catch (err) {
    console.error('InferenceClient Error:', err.message, err.stack?.substring(0, 300));
  }

  // Test 2: Direct router fetch with fal-ai provider header
  console.log('\n--- Test 2: Direct HTTP Fetch to Router with fal-ai provider header ---');
  try {
    const routerEndpoint = 'https://router.huggingface.co/hf-inference/v1/models/Qwen/Qwen-Image-Edit-2511';
    console.log('Posting to:', routerEndpoint, 'with header x-use-provider: fal-ai');

    const res = await fetch(routerEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-use-provider': 'fal-ai'
      },
      body: JSON.stringify({
        inputs: "Commercial product photograph",
        image: "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/cat.png"
      })
    });

    console.log('HTTP Status:', res.status, res.statusText);
    const bodyText = await res.text();
    console.log('Body:', bodyText.substring(0, 400));
  } catch (err) {
    console.error('Fetch Error:', err.message);
  }
}

runTest();
