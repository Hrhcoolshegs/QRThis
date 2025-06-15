
import React, { useState, useCallback, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MAX_CHARACTERS = 2000;
const DEBOUNCE_DELAY = 300;

export function QRGenerator() {
  const [inputText, setInputText] = useState('');
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateQRCode = useCallback(async (text: string) => {
    if (!text.trim()) {
      setQrCodeDataURL('');
      setError(null);
      return;
    }

    if (text.length > MAX_CHARACTERS) {
      setError(`Text too long (max ${MAX_CHARACTERS} characters)`);
      setQrCodeDataURL('');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const dataURL = await QRCode.toDataURL(text, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      setQrCodeDataURL(dataURL);
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
      setQrCodeDataURL('');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateQRCode(inputText);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [inputText, generateQRCode]);

  const handleDownload = useCallback(() => {
    if (!qrCodeDataURL) return;

    const link = document.createElement('a');
    link.download = `qrthis-${Date.now()}.png`;
    link.href = qrCodeDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "QR Code Downloaded",
      description: "Your QR code has been saved successfully!",
    });
  }, [qrCodeDataURL, toast]);

  const characterCount = inputText.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Input Section */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text, URL, WiFi password, or anything..."
                className="w-full min-h-[120px] p-4 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                autoFocus
                aria-label="Text input for QR code generation"
              />
              <div className={`absolute bottom-3 right-3 text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                {characterCount}/{MAX_CHARACTERS} characters
              </div>
            </div>
            
            <Button
              onClick={() => generateQRCode(inputText)}
              disabled={!inputText.trim() || isOverLimit || isGenerating}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium h-12 transition-all duration-200 hover:scale-[1.02]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate QR Code'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      {error && (
        <Card className="shadow-soft border-destructive/20">
          <CardContent className="p-6">
            <p className="text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      )}

      {!error && inputText.trim() && !qrCodeDataURL && !isGenerating && (
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <p className="text-muted-foreground text-center">Enter some text to generate QR code</p>
          </CardContent>
        </Card>
      )}

      {qrCodeDataURL && (
        <Card className="shadow-soft animate-fade-in">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg inline-block shadow-soft">
                <img
                  src={qrCodeDataURL}
                  alt="Generated QR Code"
                  className="w-64 h-64 max-w-full"
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={handleDownload}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>
                <p className="text-sm text-muted-foreground">
                  Right-click the QR code to save directly
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
