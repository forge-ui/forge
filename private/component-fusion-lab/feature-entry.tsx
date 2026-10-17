import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { LabFeature, LabMotion } from "./features";
import "./features.css";

function FeaturePreview() {
  const params = new URLSearchParams(window.location.search);
  const id = window.location.pathname.split("/").pop()?.replace(".html", "") ?? "";
  const [motion, setMotion] = useState(params.get("motion") !== "none");
  useEffect(() => {
    const update = (event: MessageEvent) => {
      if (event.source !== parent || event.data?.type !== "forge-settings") return;
      setMotion(event.data.motion !== "none");
    };
    window.addEventListener("message", update);
    return () => window.removeEventListener("message", update);
  }, []);
  return <LabMotion.Provider value={motion}><LabFeature id={id} /></LabMotion.Provider>;
}

createRoot(document.getElementById("root")!).render(<FeaturePreview />);
