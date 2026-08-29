import dotenv from 'dotenv';
import { InferenceClient } from '@huggingface/inference';

dotenv.config({ path: './.env' });

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

async function runVerboseTest() {
  const token = process.env.HF_TOKEN;
  console.log('Testing HF Token:', token?.substring(0, 10) + '...');

  const client = new InferenceClient(token);

  console.log('Fetching sample image...');
  const sampleRes = await fetch("https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/diffusers/cat.png");
  const arrayBuf = await sampleRes.arrayBuffer();
  const imageBlob = new Blob([arrayBuf], { type: 'image/png' });

  const promptText = "PHOTOGRAPHIC TREATMENT — COMMERCIAL HERO SHOT: Transform background into a clean studio presentation.";

  console.log('Calling client.imageToImage with provider: fal-ai ...');
  try {
    const res = await client.imageToImage({
      model: 'Qwen/Qwen-Image-Edit-2511',
      inputs: imageBlob,
      provider: 'fal-ai',
      parameters: {
        prompt: promptText
      }
    });

    console.log('Response returned! Result:', res);
    if (res instanceof Blob) {
      console.log('Blob size:', res.size, 'type:', res.type);
    }
  } catch (err) {
    console.error('API Error:', err.message);
    if (err.cause) console.error('Error Cause:', err.cause);
  }
  console.log('Test completed.');
}

runVerboseTest();
