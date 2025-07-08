import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const instance = searchParams.get("instance");

  if (!instance) {
    return new Response("Project not specified.", { status: 400 });
  }

  const venomUrl = `http://31.97.167.218:3002/qr?instance=${encodeURIComponent(instance)}`;

  try {
    const venomResponse = await fetch(venomUrl);
    const html = await venomResponse.text();

    const match = html.match(/<img[^>]*src="data:image\/png;base64,([^"]+)"/);

    if (!match) {
      return new Response("QR code not found in response.", { status: 500 });
    }

    const base64Data = match[1];
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    return new Response(binaryData, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Erro ao buscar QR do Venom:", error);
    return new Response("Erro ao buscar QR code", { status: 500 });
  }
});