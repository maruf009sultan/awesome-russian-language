import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/index.html");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#07080d", color: "#eef0f5", fontFamily: "system-ui, sans-serif" }}>
      <p>Loading Awesome Russian Language…</p>
    </div>
  );
}
