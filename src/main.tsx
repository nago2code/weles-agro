import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionProvider } from "./components/MotionProvider";
import App from "./App";
import "./styles.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionProvider>
      <App />
    </MotionProvider>
  </StrictMode>,
);
