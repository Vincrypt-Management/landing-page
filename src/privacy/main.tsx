import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PrivacyPage from "./PrivacyPage";
import "./PrivacyPage.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrivacyPage />
  </StrictMode>
);
