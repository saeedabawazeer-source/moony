import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add error handling for deployment
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  const root = createRoot(rootElement);
  root.render(<App />);
} catch (error) {
  console.error("Failed to mount React app:", error);
  // Fallback content for debugging
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1>Moony Swimwear</h1>
      <p>Loading application...</p>
      <p style="color: red;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
    </div>
  `;
}
