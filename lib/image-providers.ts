import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export interface ImageGenerationRequest {
  prompt: string;
  model: 'dalle-mini' | 'flux';
  width?: number;
  height?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
}

export interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  model: string;
}

// Model configurations with models that work on HF free tier
const MODEL_CONFIGS = {
  'dalle-mini': {
    modelId: 'stabilityai/stable-diffusion-xl-base-1.0',
    name: 'Stable Diffusion XL',
    maxSteps: 50,
    defaultSteps: 20
  },
  'flux': {
    modelId: 'playgroundai/playground-v2.5-1024px-aesthetic', 
    name: 'Playground v2.5',
    maxSteps: 30,
    defaultSteps: 15
  }
} as const;

export async function generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  const config = MODEL_CONFIGS[request.model];
  
  if (!config) {
    return {
      success: false,
      error: 'Invalid model specified',
      model: request.model
    };
  }

  try {
    console.log(`Generating image with ${config.name}...`);

    // Use model-specific parameters
    const steps = Math.min(request.num_inference_steps || config.defaultSteps, config.maxSteps);
    const guidanceScale = request.guidance_scale || 7.5;

    const parameters: any = {
      width: request.width || 512,
      height: request.height || 512,
      num_inference_steps: steps,
      guidance_scale: guidanceScale,
    };

    console.log(`Model: ${request.model}, Steps: ${steps}, Max: ${config.maxSteps}, Parameters:`, parameters);

    // Generate image using Hugging Face Inference API
    const response = await hf.textToImage({
      model: config.modelId,
      inputs: request.prompt,
      parameters
    });

    // Convert response to base64 data URL
    let imageUrl: string;
    
    try {
      // Try to treat as Blob first
      const blob = response as any;
      if (blob && typeof blob.arrayBuffer === 'function') {
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        imageUrl = `data:image/png;base64,${base64}`;
      } else {
        // Handle case where response is already base64 or URL
        imageUrl = typeof response === 'string' ? response : String(response);
      }
    } catch (error) {
      // Fallback to string conversion
      imageUrl = typeof response === 'string' ? response : String(response);
    }

    return {
      success: true,
      imageUrl,
      model: request.model
    };

  } catch (error: any) {
    console.error(`Error generating image with ${request.model}:`, error);
    
    let errorMessage = 'Failed to generate image';
    
    if (error.message?.includes('rate limit')) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    } else if (error.message?.includes('loading')) {
      errorMessage = 'Model is loading. Please try again in a few moments.';
    } else if (error.message?.includes('overloaded')) {
      errorMessage = 'Service is currently overloaded. Please try again later.';
    } else if (error.message?.includes('No Inference Provider')) {
      errorMessage = `${config.name} is not available on the free tier. Consider upgrading to Hugging Face Pro or try a different model.`;
    } else if (error.message?.includes('InputError')) {
      errorMessage = `Model configuration error for ${config.name}. Please try a different model.`;
    } else if (error.message?.includes('exceeds maximum')) {
      errorMessage = 'Model parameter limit exceeded. Please try again.';
    }

    return {
      success: false,
      error: errorMessage,
      model: request.model
    };
  }
}

// Helper function to get available models
export function getAvailableModels() {
  return Object.entries(MODEL_CONFIGS).map(([key, config]) => ({
    id: key,
    name: config.name,
    modelId: config.modelId
  }));
}