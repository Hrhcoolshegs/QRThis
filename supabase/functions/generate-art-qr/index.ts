import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Art style prompts - generate artistic BACKGROUNDS only, we'll overlay the real QR
const stylePrompts: Record<string, string> = {
  watercolor: "Create a beautiful square artistic background with soft watercolor painting style. Use flowing brush strokes with pastel colors (soft pinks, blues, purples, greens). Include subtle paint splatter effects and color gradients. The center area should be slightly lighter to allow content placement. No text or QR codes - just a pure artistic watercolor background.",
  minimalist: "Create a clean minimalist square background design with subtle geometric patterns. Use a crisp white or light gray background with very subtle geometric shapes (circles, triangles, thin lines) as decorative elements around the edges. The center should remain clean and uncluttered. Modern and elegant aesthetic. No text or QR codes.",
  cyberpunk: "Create a cyberpunk-styled square background with neon glow effects. Use a dark background (deep purple or dark blue) with glowing neon accents in cyan and pink. Add circuit board patterns and digital grid lines. Include subtle neon light reflections around the edges. The center should be darker for content placement. No text or QR codes.",
  vintage: "Create a vintage-styled square background with a sepia-toned aesthetic. Use an aged paper or parchment texture. Add ornate decorative borders and vintage flourishes around the edges. Include subtle coffee stain effects and weathered textures. The center should be cleaner for content placement. No text or QR codes.",
  corporate: "Create a professional corporate-styled square background. Use a clean gradient (subtle blue to purple or teal to blue). Add modern geometric accents and subtle professional patterns around the edges. Keep the center area clean and minimal. Sleek and professional look. No text or QR codes.",
  nature: "Create a nature-themed square background with organic botanical elements. Use soft green and earth tones. Add subtle leaf patterns, vine decorations, and natural textures around the edges. Include organic shapes and botanical illustrations. The center should be lighter for content placement. No text or QR codes.",
  pixel: "Create a pixel art style square background with an 8-bit retro gaming aesthetic. Use blocky pixelated patterns with bright primary colors (reds, blues, greens, yellows). Add retro video game inspired elements like pixel clouds, stars, or geometric shapes around the edges. The center should be cleaner with a subtle pixel grid texture. No text or QR codes.",
  anime: "Create a Japanese anime style square background with soft pastel colors and dreamy gradients. Use soft pinks, blues, and purples. Add subtle cherry blossom petals, sparkles, and soft light rays around the edges. Include anime-style gradient shading. The center should be lighter for content placement. Kawaii aesthetic. No text or QR codes.",
  graffiti: "Create an urban graffiti street art style square background. Use bold, vibrant colors with spray paint textures and drips. Add abstract graffiti shapes, splatter effects, and urban patterns around the edges. Include brick wall texture hints. The center should be slightly cleaner for content placement. Street art aesthetic. No text or QR codes."
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, style, qrCodeDataUrl } = await req.json();
    
    console.log('Generating AI Art QR:', { content: content?.substring(0, 50), style, hasQrCode: !!qrCodeDataUrl });

    if (!content || typeof content !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!style || !stylePrompts[style]) {
      return new Response(
        JSON.stringify({ error: 'Invalid style selected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate artistic background
    const backgroundPrompt = `${stylePrompts[style]} The image should be exactly 512x512 pixels, high quality, artistic.`;

    console.log('Generating artistic background...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: backgroundPrompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to generate background' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const backgroundImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!backgroundImage) {
      console.error('No image in response:', JSON.stringify(data).substring(0, 500));
      return new Response(
        JSON.stringify({ error: 'No background was generated. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Background generated successfully');

    // Return background URL - frontend will composite with QR code
    return new Response(
      JSON.stringify({ 
        backgroundUrl: backgroundImage,
        qrCodeDataUrl: qrCodeDataUrl,
        style: style,
        message: 'Background generated successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-art-qr:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
