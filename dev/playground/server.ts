/**
 * Dev playground — @genesis/domain-producao
 * Uso: npm run dev:playground
 */
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { processChatTurn, type ChatTurnRequest } from "./chat-turn.js";
import { PLAYGROUND_SAMPLES } from "./samples.js";
import { genesisDomainProducaoIsPlaygroundLlmConfigured, genesisDomainProducaoResolvePlaygroundLlmMode } from "./playground-llm-port.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "public");
const DIST_INDEX = join(__dirname, "../../dist/index.js");
const PORT = Number(process.env.PLAYGROUND_PORT ?? 4186);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(body, null, 2));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks).toString("utf8");
}

async function serveStatic(res, pathname) {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = join(PUBLIC_DIR, safePath);
  if (!filePath.startsWith(PUBLIC_DIR) || !existsSync(filePath)) return false;
  const content = await readFile(filePath);
  res.writeHead(200, { "Content-Type": MIME[extname(filePath)] ?? "application/octet-stream" });
  res.end(content);
  return true;
}

async function handleRequest(req, res) {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const { pathname } = url;

  if (req.method === "OPTIONS") {
    res.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" });
    res.end();
    return;
  }

  if (req.method === "GET" && pathname === "/api/health") {
    sendJson(res, 200, {
      ok: true,
      package: "@genesis/domain-producao",
      distBuilt: existsSync(DIST_INDEX),
      llmMode: genesisDomainProducaoResolvePlaygroundLlmMode(),
      llmConfigured: genesisDomainProducaoIsPlaygroundLlmConfigured(),
    });
    return;
  }

  if (req.method === "GET" && pathname === "/api/samples") {
    sendJson(res, 200, { samples: PLAYGROUND_SAMPLES });
    return;
  }

  if (req.method === "POST" && pathname === "/api/chat") {
    if (!existsSync(DIST_INDEX)) {
      sendJson(res, 503, { ok: false, error: "dist/index.js ausente — npm run build" });
      return;
    }
    let payload;
    try {
      payload = JSON.parse(await readBody(req));
    } catch {
      sendJson(res, 400, { ok: false, error: "JSON inválido" });
      return;
    }
    if (!payload.message?.trim()) {
      sendJson(res, 400, { ok: false, error: "Campo message é obrigatório." });
      return;
    }
    try {
      sendJson(res, 200, await processChatTurn(payload));
    } catch (e) {
      sendJson(res, 500, { ok: false, error: e instanceof Error ? e.message : String(e) });
    }
    return;
  }

  if (req.method === "GET" && (await serveStatic(res, pathname))) return;
  sendJson(res, 404, { ok: false, error: "Not found" });
}

createServer((req, res) => {
  handleRequest(req, res).catch((err) => {
    console.error("[playground]", err);
    if (!res.headersSent) sendJson(res, 500, { ok: false, error: "Erro interno" });
  });
}).listen(PORT, () => {
  console.log(`[playground] Producao → http://localhost:${PORT}`);
});
