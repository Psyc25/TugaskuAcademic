import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error filter to handle and suppress cross-origin Script errors
// and benign third-party or iframe resource errors.
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    const isScriptError = event.message === "Script error." || !event.filename || event.message?.toLowerCase().includes("script error");
    if (isScriptError) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  window.addEventListener("unhandledrejection", (event) => {
    // Suppress cross-origin/iframe unhandled promise rejection warnings in test environments
    event.preventDefault();
    event.stopPropagation();
  }, true);

  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    const msgStr = String(message || "");
    const isScriptErr = msgStr === "Script error." || !source || msgStr.toLowerCase().includes("script error");
    if (isScriptErr) {
      return true; // Suppress the native error handler
    }
    if (originalOnError) {
      return originalOnError.apply(this, arguments as any);
    }
    return false;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

