// import type { ElementType,Style } from "./type";

export function createDefaultStyle() {
  const base = {
    stroke: "#ffffff",
    strokeWidth: 1,
    strokeStyle: "solid" as const,
    opacity: 1,
    fill: "#ffffff",
    fontSize: 16,
    fontFamily: "Inter, sans-serif",
    textAlign: "left", 
  };


  return base
}
