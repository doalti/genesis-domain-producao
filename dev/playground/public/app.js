const $ = (id) => document.getElementById(id);
const chatLog = $("chatLog");
const rawOut = $("rawOut");
const healthStatus = $("healthStatus");

function append(role, text) {
  const div = document.createElement("div");
  div.className = "msg msg-" + role;
  div.textContent = (role === "user" ? "Utilizador: " : "Assistente: ") + text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function loadHealth() {
  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    healthStatus.textContent = data.distBuilt
      ? `OK | LLM: ${data.llmMode}${data.llmConfigured ? "" : " (mock)"}`
      : "dist ausente — npm run build";
    healthStatus.className = "status " + (data.distBuilt ? "ok" : "warn");
  } catch {
    healthStatus.textContent = "servidor offline";
    healthStatus.className = "status warn";
  }
}

async function loadSamples() {
  const res = await fetch("/api/samples");
  const data = await res.json();
  const sel = $("sampleSelect");
  for (const s of data.samples ?? []) {
    const opt = document.createElement("option");
    opt.value = s.message;
    opt.textContent = s.label;
    sel.appendChild(opt);
  }
  sel.addEventListener("change", () => {
    if (sel.value) $("chatInput").value = sel.value;
  });
}

$("chatForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = $("chatInput").value.trim();
  if (!message) return;
  append("user", message);
  $("chatInput").value = "";
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  rawOut.textContent = JSON.stringify(data, null, 2);
  const lines = [];
  if (data.formattedHints) lines.push(data.formattedHints);
  if (data.llmAnalysis) lines.push("", "LLM:", data.llmAnalysis);
  if (data.llmError) lines.push("", "LLM:", data.llmError);
  if (data.stub) lines.push("", "Stub:", JSON.stringify(data.stub, null, 2));
  append("assistant", lines.join("\n") || JSON.stringify(data.heuristicHints ?? data.stub ?? data, null, 2));
});

loadHealth();
loadSamples();
