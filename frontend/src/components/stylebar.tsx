/* eslint-disable @typescript-eslint/no-explicit-any */


import { useState } from "react";

type StyleState = {
  stroke: string;
  background: string;
  fill: "none" | "pattern" | "solid";
  strokeWidth: 1 | 2 | 4;
  strokeStyle: "solid" | "dashed" | "dotted";
  sloppiness: 0 | 1 | 2;
  edges: "round" | "sharp";
  fontFamily: "hand" | "normal" | "code" | "serif";
  fontSize: "S" | "M" | "L" | "XL";
};

export default function StyleBar() {
  const [style, setStyle] = useState<StyleState>({
    stroke: "#ffffff",
    background: "#000000",
    fill: "none",
    strokeWidth: 1,
    strokeStyle: "solid",
    sloppiness: 0,
    edges: "round",
    fontFamily: "hand",
    fontSize: "M",
  });

  return (
    <div className="absolute left-6 top-20 z-50">
      <div className="w-[230px] rounded-xl bg-[#1e1f2b]/90 backdrop-blur border border-white/10 shadow-xl p-3 space-y-4">

        <Section title="Stroke">
          <ColorRow
            colors={["#fff", "#ff6b6b", "#7bed9f", "#74b9ff", "#e17055"]}
            active={style.stroke}
            onSelect={(v) => setStyle(s => ({ ...s, stroke: v }))}
          />
        </Section>

        <Section title="Background">
          <ColorRow
            colors={["#3d1f1f", "#14532d", "#1e3a8a", "#422006"]}
            active={style.background}
            onSelect={(v) => setStyle(s => ({ ...s, background: v }))}
          />
        </Section>

        <Section title="Fill">
          <ButtonRow
            values={["", "", ""]}
            active={style.fill}
            onSelect={(v) => setStyle(s => ({ ...s, fill: v }))}
          />
        </Section>

        <Section title="Stroke width">
          <ButtonRow
            values={["—", "━", "▬"]}
            active={style.strokeWidth}
            onSelect={(v) => setStyle(s => ({ ...s, strokeWidth: v }))}
          />
        </Section>

        <Section title="Stroke style">
          <ButtonRow
            values={["—", "---", "⋯"]}
            active={style.strokeStyle}
            onSelect={(v) => setStyle(s => ({ ...s, strokeStyle: v }))}
          />
        </Section>

        <Section title="Sloppiness">
          <ButtonRow
            values={["~", "≈", "≋"]}
            active={style.sloppiness}
            onSelect={(v) => setStyle(s => ({ ...s, sloppiness: v }))}
          />
        </Section>

        <Section title="Edges">
          <ButtonRow
            values={["⬚", "▢"]}
            active={style.edges}
            onSelect={(v) => setStyle(s => ({ ...s, edges: v }))}
          />
        </Section>

        
        <Section title="Font family">
          <ButtonRow
            values={["✎", "A", "</>", "𝐀"]}
            active={style.fontFamily}
            onSelect={(v) => setStyle(s => ({ ...s, fontFamily: v }))}
          />
        </Section>

        <Section title="Font size">
          <ButtonRow
            values={["S", "M", "L", "XL"]}
            active={style.fontSize}
            onSelect={(v) => setStyle(s => ({ ...s, fontSize: v }))}
          />
        </Section>

      </div>
    </div>
  );
}

function ColorRow({
  colors,
  active,
  onSelect,
}: {
  colors: string[];
  active: string;
  onSelect: (c: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {colors.map((c) => (
        <div
          key={c}
          onClick={() => onSelect(c)}
          style={{ background: c }}
          className={`
            h-6 w-6 rounded-md cursor-pointer
            border
            ${active === c ? "ring-2 ring-indigo-400" : "border-white/10"}
          `}
        />
      ))}
    </div>
  );
}

function ButtonRow({
  values,
  active,
  onSelect,
}: {
  values: any[];
  active: any;
  onSelect: (v: any) => void;
}) {
  return (
    <div className="flex gap-2">
      {values.map((v) => (
        <button
          key={v}
          onClick={() => onSelect(v)}
          className={`
            h-8 w-8 rounded-lg border text-white
            ${active === v ? "bg-indigo-500" : "bg-white/5 hover:bg-white/10"}
            border-white/10
          `}
        >
          {v}
        </button>
      ))}
    </div>
  );
}


function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-white/60">{title}</p>
      {children}
    </div>
  );
}