import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UseAIArtQRReturn {
  selectedStyle: string | null;
  setSelectedStyle: (style: string | null) => void;
  isGenerating: boolean;
  generatedImageUrl: string | null;
  error: string | null;
  generateArtQR: (inputText: string) => Promise<void>;
  downloadArtQR: () => void;
  reset: () => void;
}

export function useAIArtQR(): UseAIArtQRReturn {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateArtQR = useCallback(async (inputText: string) => {
    if (!selectedStyle || !inputText.trim()) {
      setError('Please select a style and enter content');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-art-qr', {
        body: {
          content: inputText.trim(),
          style: selectedStyle,
        },
      });

      if (fnError) {
        console.error('Edge function error:', fnError);
        if (fnError.message?.includes('429')) {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        }
        if (fnError.message?.includes('402')) {
          throw new Error('AI credits exhausted. Please add credits to continue.');
        }
        throw new Error(fnError.message || 'Failed to generate art QR code');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
      } else {
        throw new Error('No image was generated');
      }
    } catch (err) {
      console.error('AI Art QR generation error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedStyle]);

  const downloadArtQR = useCallback(() => {
    if (!generatedImageUrl) return;

    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `ai-art-qr-${selectedStyle}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImageUrl, selectedStyle]);

  const reset = useCallback(() => {
    setGeneratedImageUrl(null);
    setError(null);
    setSelectedStyle(null);
  }, []);

  return {
    selectedStyle,
    setSelectedStyle,
    isGenerating,
    generatedImageUrl,
    error,
    generateArtQR,
    downloadArtQR,
    reset,
  };
}
