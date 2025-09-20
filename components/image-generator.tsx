'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Download, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  model: string;
}

const models = [
  { id: 'stable-diffusion', name: 'Stable Diffusion 1.5', description: 'High quality, reliable' },
  { id: 'flux', name: 'FLUX.1 Schnell', description: 'Fast, modern quality' },
  { id: 'dalle-mini', name: 'DALL-E Mini', description: 'Quick generations' }
];

interface ImageGeneratorProps {
  selectedModel?: 'stable-diffusion' | 'flux' | 'dalle-mini';
}

export function ImageGenerator({ selectedModel: initialModel }: ImageGeneratorProps = {}) {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(initialModel || 'stable-diffusion');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model: selectedModel,
          width: 512,
          height: 512,
        }),
      });

      const result: ImageGenerationResponse = await response.json();

      if (result.success && result.imageUrl) {
        setGeneratedImage(result.imageUrl);
        toast.success(`Image generated with ${models.find(m => m.id === selectedModel)?.name}!`);
      } else {
        toast.error(result.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded!');
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy prompt');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI Image Generator</h1>
        <p className="text-muted-foreground">
          Generate images using Stable Diffusion, FLUX, and DALL-E Mini from Hugging Face
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model-select">Model</Label>
            <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as 'stable-diffusion' | 'flux' | 'dalle-mini')}>
              <SelectTrigger id="model-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="prompt">Prompt</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyPrompt}
                disabled={!prompt.trim()}
                className="h-6 px-2"
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <Textarea
              id="prompt"
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Image'
            )}
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Free tier: 300 requests/hour for registered HF users</p>
            <p>• Image size: 512x512 pixels</p>
            <p>• Processing time: 10-30 seconds depending on model</p>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <Label>Generated Image</Label>
          <div className="border-2 border-dashed border-muted rounded-lg p-4 min-h-[400px] flex items-center justify-center">
            {isGenerating ? (
              <div className="text-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Generating with {models.find(m => m.id === selectedModel)?.name}...
                </p>
              </div>
            ) : generatedImage ? (
              <div className="space-y-4">
                <Image
                  src={generatedImage}
                  alt="Generated image"
                  width={512}
                  height={512}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                  unoptimized
                />
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="h-16 w-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <div className="h-8 w-8 bg-muted-foreground/20 rounded"></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your generated image will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}