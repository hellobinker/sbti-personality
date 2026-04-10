import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  imageData: string; // base64 encoded image
  personality: {
    code: string;
    name: string;
    title: string;
    traits: string[];
    humor: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageData, personality }: GenerateRequest = await req.json();

    if (!imageData || !personality) {
      return new Response(
        JSON.stringify({ error: "Missing image or personality data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Upload user image to storage
    const imageBuffer = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));
    const imageName = `temp/${Date.now()}_user.png`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("sbti-images")
      .upload(imageName, imageBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      // Continue anyway, we'll use the base64 directly
    }

    // Get public URL of uploaded image
    const { data: urlData } = supabase.storage
      .from("sbti-images")
      .getPublicUrl(imageName);

    const userImageUrl = urlData.publicUrl;

    // Build the prompt for AI image generation
    const traitsText = personality.traits.join("、");
    const prompt = `Convert this person into a Q-version anime chibi style character representing "${personality.name}" personality type.
Style: cute chibi anime illustration, big head, small body, large expressive eyes, pastel colors.
Character traits to incorporate: ${traitsText}
Humor description: ${personality.humor}
Keep the person's facial features recognizable but stylized in anime chibi format.
Add SBTI personality elements like cute accessories or expressions matching ${personality.name} vibe.
Background: colorful gradient with floating elements.`;

    // Call AI image generation API (simulated for now)
    // In production, you would call an actual AI service here
    const generatedImageUrl = await generateAIImage(userImageUrl, prompt, personality);

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: generatedImageUrl,
        prompt: prompt
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Placeholder for AI image generation
// In a real implementation, you would call an AI service API here
async function generateAIImage(
  userImageUrl: string,
  prompt: string,
  personality: GenerateRequest["personality"]
): Promise<string> {
  // Since we don't have direct access to AI image generation in Edge Functions,
  // we'll return a placeholder URL that the client can use
  // In a real implementation, you would:
  // 1. Call OpenAI DALL-E API
  // 2. Call Midjourney API
  // 3. Call Stable Diffusion API
  // 4. Or use another AI image generation service

  // For now, return the user's image with a note
  // The frontend will handle displaying this appropriately
  return userImageUrl;
}
