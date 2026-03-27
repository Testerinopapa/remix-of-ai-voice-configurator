import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_WS_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve((req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!GEMINI_API_KEY) {
    return new Response("Missing Gemini API key", {
      status: 500,
      headers: corsHeaders,
    });
  }

  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("WebSocket upgrade required", {
      status: 426,
      headers: corsHeaders,
    });
  }

  const { socket: clientSocket, response } = Deno.upgradeWebSocket(req);

  let geminiSocket: WebSocket | null = null;

  clientSocket.onopen = () => {
    console.log("[proxy] Client connected");

    const url = `${GEMINI_WS_URL}?key=${GEMINI_API_KEY}`;
    try {
      geminiSocket = new WebSocket(url);
    } catch (error) {
      console.error("[proxy] Failed to create Gemini WS:", error);
      clientSocket.close(1011, "Failed to connect to Gemini");
      return;
    }

    geminiSocket.onopen = () => {
      console.log("[proxy] Connected to Gemini");
      clientSocket.send(JSON.stringify({ type: "proxy_ready" }));
    };

    geminiSocket.onmessage = (event) => {
      // Forward Gemini responses to the client
      if (clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(typeof event.data === "string" ? event.data : event.data);
      }
    };

    geminiSocket.onerror = (event) => {
      console.error("[proxy] Gemini WS error:", event);
      if (clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(JSON.stringify({ type: "proxy_error", message: "Google API connection error", code: 1011 }));
        clientSocket.close(1011, "Google API connection error");
      }
    };

    geminiSocket.onclose = (event) => {
      console.log("[proxy] Gemini WS closed:", event.code, event.reason);
      if (clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(JSON.stringify({ type: "proxy_error", message: "Google API connection closed", code: event.code, reason: event.reason }));
        clientSocket.close(event.code === 1000 ? 1000 : 1011, "Gemini upstream closed");
      }
    };
  };

  clientSocket.onmessage = (event) => {
    // Forward client messages to Gemini
    if (geminiSocket && geminiSocket.readyState === WebSocket.OPEN) {
      geminiSocket.send(typeof event.data === "string" ? event.data : event.data);
    } else {
      console.warn("[proxy] Gemini socket not ready, buffering message skipped");
    }
  };

  clientSocket.onclose = () => {
    console.log("[proxy] Client disconnected");
    if (geminiSocket && geminiSocket.readyState === WebSocket.OPEN) {
      geminiSocket.close();
    }
  };

  clientSocket.onerror = (event) => {
    console.error("[proxy] Client WS error:", event);
  };

  return response;
});
