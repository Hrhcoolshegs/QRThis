import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import QRCode from 'qrcode';
import { optimizeText, detectContentType, getOptimalErrorCorrection } from '@/utils/smartOptimization';
import { trackUsage, getPersonalizedTips } from '@/utils/analytics';
import { validateQRContent } from '@/utils/securityUtils';

interface UseQRGeneratorProps {
  maxCharacters?: number;
  debounceDelay?: number;
  optimizationDelay?: number;
}

interface QRColors {
  foreground: string;
  background: string;
}

interface UseQRGeneratorReturn {
  inputText: string;
  setInputText: (text: string) => void;
  originalText: string;
  qrCodeDataURL: string;
  previewDataURL: string;
  isGenerating: boolean;
  isPreviewGenerating: boolean;
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
  colors: QRColors;
  setForegroundColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  downloadQRCode: (format: 'png' | 'jpg' | 'svg', size: number) => void;
}

export function useQRGenerator({
  maxCharacters = 2000,
  debounceDelay = 400,
  optimizationDelay = 5000
}: UseQRGeneratorProps = {}): UseQRGeneratorReturn {
  const [inputText, setInputText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [previewDataURL, setPreviewDataURL] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewGenerating, setIsPreviewGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizationShown, setOptimizationShown] = useState(false);
  const [savedChars, setSavedChars] = useState(0);
  const [personalizedTips, setPersonalizedTips] = useState<string[]>([]);
  const [lastTypingTime, setLastTypingTime] = useState<number>(0);
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const colors = useMemo(() => ({
    foreground: foregroundColor,
    background: backgroundColor
  }), [foregroundColor, backgroundColor]);

  // Memoized computed values for better performance
  const contentType = useMemo(() => detectContentType(inputText), [inputText]);
  const errorCorrectionLevel = useMemo(() => getOptimalErrorCorrection(inputText), [inputText]);
  const characterCount = useMemo(() => inputText.length, [inputText]);
  const isOverLimit = useMemo(() => characterCount > maxCharacters, [characterCount, maxCharacters]);

  // Debounced preview generation
  useEffect(() => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }

    if (!inputText.trim() || isOverLimit) {
      setPreviewDataURL('');
      setIsPreviewGenerating(false);
      return;
    }

    setIsPreviewGenerating(true);

    previewTimeoutRef.current = setTimeout(async () => {
      try {
        const validation = validateQRContent(inputText, detectContentType(inputText));
        if (!validation.isValid) {
          setPreviewDataURL('');
          setIsPreviewGenerating(false);
          return;
        }

        const dataURL = await QRCode.toDataURL(validation.sanitized || inputText, {
          errorCorrectionLevel: 'L',
          type: 'image/png',
          quality: 0.7,
          margin: 2,
          color: {
            dark: foregroundColor,
            light: backgroundColor
          },
          width: 256
        });
        setPreviewDataURL(dataURL);
      } catch (err) {
        console.error('Preview generation failed:', err);
        setPreviewDataURL('');
      } finally {
        setIsPreviewGenerating(false);
      }
    }, debounceDelay);

    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, [inputText, isOverLimit, debounceDelay]);

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

    // Pre-generation validation
    const validation = validateQRContent(text, detectContentType(text));
    if (!validation.isValid) {
      setError(validation.error || 'Invalid content detected');
      setQrCodeDataURL('');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const dataURL = await QRCode.toDataURL(validation.sanitized || text, {
        errorCorrectionLevel: errorCorrectionLevel,
        type: 'image/png',
        quality: 0.92,
        margin: 2,
        color: {
          dark: foregroundColor,
          light: backgroundColor
        },
        width: 512
      });
      setQrCodeDataURL(dataURL);
      
      trackUsage(text, contentType);
      setPersonalizedTips(getPersonalizedTips());
      
    } catch (err) {
      console.error('QR Code generation failed:', err);
      setError('Failed to generate QR code. Please check your content and try again.');
      setQrCodeDataURL('');
    } finally {
      setIsGenerating(false);
    }
  }, [errorCorrectionLevel, contentType, maxCharacters, foregroundColor, backgroundColor]);

  const downloadQRCode = useCallback(async (format: 'png' | 'jpg' | 'svg', size: number) => {
    if (!inputText.trim()) return;

    try {
      const validation = validateQRContent(inputText, detectContentType(inputText));
      const content = validation.sanitized || inputText;

      if (format === 'svg') {
        const svgString = await QRCode.toString(content, {
          type: 'svg',
          errorCorrectionLevel: errorCorrectionLevel,
          margin: 2,
          color: {
            dark: foregroundColor,
            light: backgroundColor
          },
          width: size
        });
        
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `qrthis-${Date.now()}.svg`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, content, {
          errorCorrectionLevel: errorCorrectionLevel,
          margin: 2,
          color: {
            dark: foregroundColor,
            light: backgroundColor
          },
          width: size
        });

        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const dataURL = canvas.toDataURL(mimeType, 0.92);
        
        const link = document.createElement('a');
        link.download = `qrthis-${Date.now()}.${format}`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
  }, [inputText, errorCorrectionLevel, foregroundColor, backgroundColor]);

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
    
    // Clear final QR code when input changes
    setQrCodeDataURL('');
  }, []);

  return {
    inputText,
    setInputText: handleInputChange,
    originalText,
    qrCodeDataURL,
    previewDataURL,
    isGenerating,
    isPreviewGenerating,
    error,
    optimizationShown,
    savedChars,
    contentType,
    errorCorrectionLevel,
    personalizedTips,
    generateQRCode,
    handleUndoOptimization,
    characterCount,
    isOverLimit,
    colors,
    setForegroundColor,
    setBackgroundColor,
    downloadQRCode
  };
}
