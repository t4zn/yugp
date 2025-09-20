import { NextRequest, NextResponse } from 'next/server';
import { generateImage, ImageGenerationRequest } from '@/lib/image-providers';

export async function POST(request: NextRequest) {
  try {
    // Check if Hugging Face API key is configured
    if (!process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json(
        { error: 'Hugging Face API key not configured' },
        { status: 500 }
      );
    }

    const body: ImageGenerationRequest = await request.json();

    // Validate required fields
    if (!body.prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!body.model || !['stable-diffusion', 'flux', 'dalle-mini'].includes(body.model)) {
      return NextResponse.json(
        { error: 'Valid model is required (stable-diffusion, flux, or dalle-mini)' },
        { status: 400 }
      );
    }

    // Generate the image
    const result = await generateImage(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Image generation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}