
import { useState, useCallback, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import { optimizeText, detectContentType, getOptimalErrorCorrection } from '@/utils/smartOptimization';
import { trackUsage, getPersonalizedTips } from '@/utils/analytics';

interface UseQRGeneratorProps {
  maxCharacters?: number;
  debounceDelay?: number;
  optimizationDelay?: number;
}

interface UseQRGeneratorReturn {
  inputText: string;
  setInputText: (text: string) => void;
  originalText: string;
  qrCodeDataURL: string;
  isGenerating: boolean;
  error: string | null;
  optimizationShown: boolean;
  savedChars: number;
  contentType: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  personalizedTips: string[];
  generateQRCode: (text: string) => Promise<void>;
  handleUndoOptimization: () => void;
  characterCount: number;
  isOverLimit: boolean;
}

export function useQRGenerator({
  maxCharacters = 2000,
  debounceDelay = 300,
  optimizationDelay = 5000
}: UseQRGeneratorProps = {}): UseQRGeneratorReturn {
  const [inputText, setInputText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizationShown, setOptimizationShown] = useState(false);
  const [savedChars, setSavedChars] = useState(0);
  const [personalizedTips, setPersonalizedTips] = useState<string[]>([]);
  const [lastTypingTime, setLastTypingTime] = useState<number>(0);

  // Memoized computed values for better performance
  const contentType = useMemo(() => detectContentType(inputText), [inputText]);
  const errorCorrectionLevel = useMemo(() => getOptimalErrorCorrection(inputText), [inputText]);
  const characterCount = useMemo(() => inputText.length, [inputText]);
  const isOverLimit = useMemo(() => characterCount > maxCharacters, [characterCount, maxCharacters]);

  // Auto-optimization effect with better timing control
  useEffect(() => {
    if (!inputText.trim() || optimizationShown) return;
    
    const timeoutId = setTimeout(() => {
      if (Date.now() - lastTypingTime >= optimizationDelay) {
        const result = optimizeText(inputText);
        if (result.saved > 5) {
          setOriginalText(inputText);
          setInputText(result.optimized);
          setSavedChars(result.saved);
          setOptimizationShown(true);
          
          setTimeout(() => setOptimizationShown(false), 8000);
        }
      }
    }, optimizationDelay);

    return () => clearTimeout(timeoutId);
  }, [inputText, optimizationShown, optimizationDelay, lastTypingTime]);

  // Load personalized tips on mount only
  useEffect(() => {
    setPersonalizedTips(getPersonalizedTips());
  }, []);

  const generateQRCode = useCallback(async (text: string) => {
    if (!text.trim()) {
      setQrCodeDataURL('');
      setError(null);
      return;
    }

    if (text.length > maxCharacters) {
      setError(`Text too long (max ${maxCharacters} characters)`);
      setQrCodeDataURL('');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const dataURL = await QRCode.toDataURL(text, {
        errorCorrectionLevel: errorCorrectionLevel,
        type: 'image/png',
        quality: 0.92,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 512
      });
      setQrCodeDataURL(dataURL);
      
      // Track usage for analytics
      trackUsage(text, contentType);
      
      // Update personalized tips only when needed
      setPersonalizedTips(getPersonalizedTips());
      
    } catch (err) {
      console.error('QR Code generation failed:', err);
      setError('Failed to generate QR code. Please try again.');
      setQrCodeDataURL('');
    } finally {
      setIsGenerating(false);
    }
  }, [errorCorrectionLevel, contentType, maxCharacters]);

  const handleUndoOptimization = useCallback(() => {
    if (originalText) {
      setInputText(originalText);
      setOriginalText('');
      setOptimizationShown(false);
      setSavedChars(0);
    }
  }, [originalText]);

  const handleInputChange = useCallback((text: string) => {
    setInputText(text);
    setOptimizationShown(false);
    setError(null);
    setLastTypingTime(Date.now());
    
    // Clear QR code when input changes but don't auto-generate
    if (!text.trim()) {
      setQrCodeDataURL('');
    }
  }, []);

  // REMOVED: Auto QR generation effect - now only manual generation

  return {
    inputText,
    setInputText: handleInputChange,
    originalText,
    qrCodeDataURL,
    isGenerating,
    error,
    optimizationShown,
    savedChars,
    contentType,
    errorCorrectionLevel,
    personalizedTips,
    generateQRCode,
    handleUndoOptimization,
    characterCount,
    isOverLimit
  };
}
