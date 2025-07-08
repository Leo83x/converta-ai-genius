// supabase/functions/venom-qr-proxy/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const url = new URL(req.url);
  const instance = url.searchParams.get("instance");

  if (!instance) {
    return new Response("Missing instance parameter", { status: 400 });
  }

  const venomURL = `http://31.97.167.218:3002/instance/${instance}/qr`;

  try {
    const venomRes = await fetch(venomURL);
    const html = await venomRes.text();

    // Extrai o conteúdo Base64 da tag <img src="data:image/png;base64,...">
    const base64Match = html.match(/<img[^>]+src="data:image\/png;base64,([^"]+)"/);

    if (!base64Match) {
      return new Response("QR Code not found in HTML", { status: 500 });
    }

    const base64Data = base64Match[1];
    const binary = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    return new Response(binary, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});