import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode';

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

// Generate a standard QR code as a data URL
async function generateQRDataUrl(content: string): Promise<string> {
  return await QRCode.toDataURL(content, {
    errorCorrectionLevel: 'H', // High error correction for better scanability
    margin: 2,
    width: 300,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });
}

// Composite the QR code onto the artistic background
async function compositeImages(
  backgroundUrl: string,
  qrCodeDataUrl: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const bgImage = new Image();
    bgImage.crossOrigin = 'anonymous';
    
    bgImage.onload = () => {
      // Set canvas size to background size
      canvas.width = bgImage.width;
      canvas.height = bgImage.height;
      
      // Draw the background
      ctx.drawImage(bgImage, 0, 0);
      
      // Load and draw the QR code
      const qrImage = new Image();
      qrImage.onload = () => {
        // Calculate QR code position and size (centered, ~60% of background)
        const qrSize = Math.min(canvas.width, canvas.height) * 0.6;
        const qrX = (canvas.width - qrSize) / 2;
        const qrY = (canvas.height - qrSize) / 2;
        
        // Draw a white rounded rectangle behind QR for better contrast
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        const padding = qrSize * 0.08;
        const cornerRadius = qrSize * 0.05;
        
        ctx.beginPath();
        ctx.roundRect(
          qrX - padding,
          qrY - padding,
          qrSize + padding * 2,
          qrSize + padding * 2,
          cornerRadius
        );
        ctx.fill();
        
        // Draw the QR code
        ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
        
        // Return the composited image
        resolve(canvas.toDataURL('image/png', 1.0));
      };
      
      qrImage.onerror = () => reject(new Error('Failed to load QR code'));
      qrImage.src = qrCodeDataUrl;
    };
    
    bgImage.onerror = () => reject(new Error('Failed to load background image'));
    bgImage.src = backgroundUrl;
  });
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
      // Step 1: Generate the real QR code locally
      console.log('Generating scannable QR code...');
      const qrCodeDataUrl = await generateQRDataUrl(inputText.trim());

      // Step 2: Request artistic background from edge function
      console.log('Requesting artistic background...');
      const { data, error: fnError } = await supabase.functions.invoke('generate-art-qr', {
        body: {
          content: inputText.trim(),
          style: selectedStyle,
          qrCodeDataUrl: qrCodeDataUrl,
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

      if (!data?.backgroundUrl) {
        throw new Error('No background was generated');
      }

      // Step 3: Composite the real QR code onto the artistic background
      console.log('Compositing final image...');
      const finalImage = await compositeImages(data.backgroundUrl, qrCodeDataUrl);
      setGeneratedImageUrl(finalImage);
      
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
