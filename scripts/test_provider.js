import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: './backend/.env' });

async function testHFProvider() {
  const token = process.env.HF_TOKEN;
  console.log('HF_TOKEN present:', !!token, 'Token prefix:', token?.substring(0, 8));

  // Test endpoints
  const testEndpoints = [
    { name: 'HF Router (fal-ai header)', url: 'https://router.huggingface.co/fal-ai/models/Qwen/Qwen-Image-Edit-2511' },
    { name: 'HF Router (v1 with x-use-provider header)', url: 'https://router.huggingface.co/hf-inference/v1/models/Qwen/Qwen-Image-Edit-2511', headers: { 'x-use-provider': 'fal-ai' } },
    { name: 'Fal AI Direct / HF Proxy', url: 'https://router.huggingface.co/fal-ai/v1/models/Qwen/Qwen-Image-Edit-2511' },
    { name: 'HF Inference API with X-Provider', url: 'https://api-inference.huggingface.co/models/Qwen/Qwen-Image-Edit-2511', headers: { 'x-use-provider': 'fal-ai' } }
  ];

  for (const ep of testEndpoints) {
    console.log(`\n--- Testing: ${ep.name} ---`);
    console.log(`URL: ${ep.url}`);
    try {
      const res = await fetch(ep.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...(ep.headers || {})
        },
        body: JSON.stringify({
          inputs: 'Commercial hero product photograph',
          image: 'https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/cat.png'
        })
      });

      console.log('HTTP Status:', res.status, res.statusText);
      const text = await res.text();
      console.log('Response:', text.substring(0, 400));
    } catch (err) {
      console.error('Error:', err.message);
    }
  }
}

testHFProvider();
