// supabase/functions/venom-qr-proxy/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

console.log("✅ Edge Function Venom QR Proxy iniciado");

serve(async (req) => {
  try {
    // Busca o conteúdo HTML da rota /qr do servidor local
    const response = await fetch("http://31.97.167.218:3002/qr");
    const html = await response.text();

    // Extração do base64 do src da tag <img>
    const match = html.match(/<img[^>]+src="data:image\/png;base64,([^"]+)"/);
    if (!match || !match[1]) {
      return new Response("QR Code não encontrado no HTML.", { status: 500 });
    }

    const base64 = match[1];
    const imageBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Erro no proxy do QR Code:", err);
    return new Response("Erro interno ao buscar QR Code.", { status: 500 });
  }
});