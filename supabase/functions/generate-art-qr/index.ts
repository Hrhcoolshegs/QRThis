import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Art style prompts designed to preserve QR scannability
const stylePrompts: Record<string, string> = {
  watercolor: "Create an artistic QR code with a beautiful watercolor painting style background. Use soft, flowing brush strokes with pastel colors (soft pinks, blues, purples). The QR code pattern should remain clearly visible and scannable with high contrast black modules on a light watercolor wash background. Add subtle paint splatter effects around the edges.",
  minimalist: "Create a minimalist QR code design with clean geometric patterns. Use a crisp white background with the QR modules in pure black. Add subtle geometric shapes (circles, triangles, lines) as decorative elements around the QR code. The design should be modern, elegant, and the QR code must remain perfectly scannable.",
  cyberpunk: "Create a cyberpunk-styled QR code with neon glow effects. Use a dark background (deep purple or dark blue) with the QR modules glowing in bright cyan/neon pink. Add circuit board patterns and digital grid lines as background elements. Include subtle neon light reflections. The QR code must remain clearly scannable despite the glow effects.",
  vintage: "Create a vintage-styled QR code with a sepia-toned aesthetic. Use an aged paper or parchment texture as background. The QR modules should be in dark brown/sepia. Add ornate decorative borders and vintage flourishes around the QR code. Include subtle coffee stain effects. The QR code must remain clearly scannable.",
  corporate: "Create a professional corporate-styled QR code. Use a clean gradient background (subtle blue to purple). The QR modules should be crisp and dark. Add modern geometric accents and subtle brand-appropriate patterns. The design should look sleek while keeping the QR code perfectly scannable.",
  nature: "Create a nature-themed QR code with organic botanical elements. Use soft green and earth tones as background. Add subtle leaf patterns, vine decorations, and natural textures around the edges. The QR modules should be in dark forest green or brown on a light natural background. The QR code must remain clearly scannable."
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, style } = await req.json();
    
    console.log('Generating AI Art QR:', { content: content?.substring(0, 50), style });

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

    // Create the prompt for image generation
    const prompt = `${stylePrompts[style]} The QR code should encode the following text: "${content.substring(0, 100)}". Make sure the QR code is functional and scannable. The image should be square (1:1 aspect ratio) and high quality.`;

    console.log('Sending request to AI gateway for image generation...');

    // Call Lovable AI Gateway with image generation model
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
            content: prompt
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
        JSON.stringify({ error: 'Failed to generate image' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI Gateway response received');

    // Extract the image from the response
    const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageData) {
      console.error('No image in response:', JSON.stringify(data).substring(0, 500));
      return new Response(
        JSON.stringify({ error: 'No image was generated. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully generated AI Art QR code');

    return new Response(
      JSON.stringify({ 
        imageUrl: imageData,
        style: style,
        message: 'AI Art QR code generated successfully'
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
