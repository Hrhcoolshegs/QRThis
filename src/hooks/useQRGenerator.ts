
import { useState, useCallback, useEffect } from 'react';
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
  optimizationDelay = 2000
}: UseQRGeneratorProps = {}): UseQRGeneratorReturn {
  const [inputText, setInputText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizationShown, setOptimizationShown] = useState(false);
  const [savedChars, setSavedChars] = useState(0);
  const [contentType, setContentType] = useState('text');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [personalizedTips, setPersonalizedTips] = useState<string[]>([]);

  // Auto-optimization effect
  useEffect(() => {
    if (!inputText.trim()) return;
    
    const timeoutId = setTimeout(() => {
      const result = optimizeText(inputText);
      if (result.saved > 0 && !optimizationShown) {
        setOriginalText(inputText);
        setInputText(result.optimized);
        setSavedChars(result.saved);
        setOptimizationShown(true);
        
        // Hide optimization badge after 5 seconds
        setTimeout(() => setOptimizationShown(false), 5000);
      }
    }, optimizationDelay);

    return () => clearTimeout(timeoutId);
  }, [inputText, optimizationShown, optimizationDelay]);

  // Content type detection effect
  useEffect(() => {
    const detected = detectContentType(inputText);
    setContentType(detected);
    
    // Set optimal error correction
    const optimal = getOptimalErrorCorrection(inputText);
    setErrorCorrectionLevel(optimal);
  }, [inputText]);

  // Load personalized tips on mount
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
      
      // Update personalized tips
      setPersonalizedTips(getPersonalizedTips());
      
    } catch (err) {
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
  }, []);

  // Debounced QR generation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateQRCode(inputText);
    }, debounceDelay);

    return () => clearTimeout(timeoutId);
  }, [inputText, generateQRCode, debounceDelay]);

  const characterCount = inputText.length;
  const isOverLimit = characterCount > maxCharacters;

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
