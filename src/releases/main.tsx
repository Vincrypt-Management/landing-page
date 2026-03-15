import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReleasesPage from "./ReleasesPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReleasesPage />
  </StrictMode>
);
