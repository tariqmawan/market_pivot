import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { bootAI } from "./ai";
import { registerServiceWorker } from "./pwa";

// Boot subsystems that don't need React.
bootAI();
if (typeof window !== "undefined") {
  // Defer SW registration until after the first paint.
  const ric = window.requestIdleCallback;
  if (typeof ric === "function") {
    ric(() => registerServiceWorker());
  } else {
    setTimeout(registerServiceWorker, 1500);
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
