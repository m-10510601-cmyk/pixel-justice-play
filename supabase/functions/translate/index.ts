// Translation edge function — uses Lovable AI Gateway, no API key needed.
// Accepts: { texts: string[], target: "zh" | "ms" | "en" }
// Returns: { translations: string[] }
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LANG_NAME: Record<string, string> = {
  zh: "Simplified Chinese (华文)",
  ms: "Bahasa Melayu",
  en: "English",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { texts, target } = await req.json();
    if (!Array.isArray(texts) || !texts.length || !LANG_NAME[target]) {
      return new Response(JSON.stringify({ error: "bad request" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "missing LOVABLE_API_KEY" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const sys = `You are a professional game-localization translator. Translate each input string into ${LANG_NAME[target]}.
Rules:
- Preserve emojis, punctuation, quotes, ellipses, leading/trailing whitespace.
- Keep proper nouns (Aira, Malaysia, etc.) untranslated.
- Keep section symbols like §302, §304 and law/code references unchanged.
- Keep markers like "CHAPTER 1", numbers, and labels like "A.", "B." unchanged.
- Return ONLY a JSON array of strings, same length & order as input. No commentary.`;

    const user = JSON.stringify(texts);

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
      }),
    });

    if (resp.status === 429) {
      return new Response(JSON.stringify({ error: "rate_limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (resp.status === 402) {
      return new Response(JSON.stringify({ error: "payment_required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(JSON.stringify({ error: "ai_error", detail: errText }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await resp.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? "[]";
    // strip code fences if present
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    let translations: string[] = [];
    try { translations = JSON.parse(cleaned); } catch { translations = texts; }
    if (!Array.isArray(translations) || translations.length !== texts.length) translations = texts;
    return new Response(JSON.stringify({ translations }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
