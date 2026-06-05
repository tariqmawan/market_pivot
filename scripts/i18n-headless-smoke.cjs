const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9225;
const profile = path.resolve(__dirname, "..", ".tmp-chrome-i18n-cdp");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
  return res.json();
}

async function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(wsUrl);
    socket.addEventListener("open", () => resolve(socket), { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
}

async function main() {
  fs.mkdirSync(profile, { recursive: true });
  const child = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ], { stdio: "ignore" });

  try {
    let version;
    for (let i = 0; i < 40; i += 1) {
      try {
        version = await requestJson(`http://127.0.0.1:${port}/json/version`);
        break;
      } catch {
        await sleep(250);
      }
    }
    if (!version) throw new Error("Chrome DevTools did not start");

    const target = await requestJson(`http://127.0.0.1:${port}/json/new?http://localhost:5173/`, { method: "PUT" });
    const ws = await connect(target.webSocketDebuggerUrl);
    let id = 0;
    const pending = new Map();
    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg);
        pending.delete(msg.id);
      }
    });
    const send = (method, params = {}) => new Promise((resolve) => {
      const msgId = ++id;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    await send("Runtime.enable");
    await send("Page.enable");
    await sleep(2500);
    await send("Runtime.evaluate", {
      expression: "localStorage.setItem('mp_language','hi'); location.reload();",
      awaitPromise: false,
    });
    await sleep(3500);
    const result = await send("Runtime.evaluate", {
      expression: `JSON.stringify({
        lang: document.documentElement.lang,
        dir: document.documentElement.dir,
        text: document.body.innerText.slice(0, 5000),
        hasNewsObjectBug: document.body.innerText.includes("returned an object instead of string"),
        hasHindiHeader: document.body.innerText.includes("समाचार") && document.body.innerText.includes("लॉगिन")
      })`,
      returnByValue: true,
    });
    const payload = JSON.parse(result.result.result.value);
    console.log(JSON.stringify(payload, null, 2));
    ws.close();
  } finally {
    child.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
