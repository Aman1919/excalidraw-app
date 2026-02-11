/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef } from "react";
import Element from "./element";
import type { Style } from "../type";

type StyleBarProps = {
  selectedElements: Element[];
  setSelectedElements: React.Dispatch<React.SetStateAction<Element[]>>;
  setStyleUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  styleUpdate:boolean;
};

export default function StyleBar({ selectedElements, setStyleUpdate ,styleUpdate}: StyleBarProps) {
  const selectionInfo = useMemo(() => {
    if (!selectedElements.length) return null;

    const first = selectedElements[0];
    const mixed = selectedElements.some((el) => el.type !== first.type);

    return {
      type: mixed ? "mixed" : first.type,
      style: first.style,
    };
  }, [selectedElements,styleUpdate]);

  const style = selectionInfo?.style;
  const selectionType = selectionInfo?.type;

  function updateStyle(patch: Partial<Style>) {
    selectedElements.forEach((el) => {
      el.style = { ...el.style, ...patch };
    });
    setStyleUpdate((prev) => !prev);
  }

  if (!style) return null;

  return (
    <div className="absolute left-6 top-24 z-50">
      <div className="w-[240px] rounded-2xl bg-[#1e1f2b]/95 backdrop-blur-md border border-white/10 shadow-2xl p-4 space-y-5 text-sm">
        
        {/* Stroke Section */}
        <Section title="Stroke">
          <ColorRow
            colors={["#ffffff", "#ff6b6b", "#7bed9f", "#74b9ff", "#eccc68"]}
            active={style.stroke || ""}
            onSelect={(v) => updateStyle({ stroke: v })}
          />
        </Section>

        {/* Fill Section (Only for Shapes) */}
        {(selectionType === "rect" || selectionType === "circle" || selectionType === "mixed") && (
          <><Section title="Fill">
            <ColorRow
              colors={["transparent", "#333333", "#ffffff", "#1e3a8a", "#14532d"]}
              active={style.fill ?? "transparent"}
              onSelect={(v) => updateStyle({ fill: v })}
            />
          </Section>
          <Section title="Fill Style">
              <ButtonRow
                values={["solid", "zigzag", "hachure"]}
                active={style.fillStyle}
                onSelect={(v) => updateStyle({ fillStyle: v })}
              />
            </Section>
          </>
        )}

        {/* Line Style Section */}
        {selectionType !== "text" && (
          <>
            <Section title="Stroke Width">
              <ButtonRow
                values={[1, 2, 4, 8]}
                active={style.strokeWidth}
                onSelect={(v) => updateStyle({ strokeWidth: v })}
                labels={["1px", "2px", "4px", "8px"]}
              />
            </Section>
            <Section title="Stroke Style">
              <ButtonRow
                values={["solid", "dashed", "dotted"]}
                active={style.strokeStyle}
                onSelect={(v) => updateStyle({ strokeStyle: v })}
              />
            </Section>
          </>
        )}

        {/* Text Specific Controls */}
        {selectionType === "text" && (
          <>
            <Section title="Font Size">
              <ButtonRow
                values={[12, 16, 24, 32]}
                active={style.fontSize}
                onSelect={(v) => updateStyle({ fontSize: v })}
              />
            </Section>
            <Section title="Align">
              <ButtonRow
                values={["left", "center", "right"]}
                active={style.textAlign}
                onSelect={(v) => updateStyle({ textAlign: v })}
              />
            </Section>
          </>
        )}

        {/* Global Opacity */}
        <Section title={`Opacity (${Math.round((style.opacity||1) * 100)}%)`}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={style.opacity}
            onChange={(e) => updateStyle({ opacity: parseFloat(e.target.value) })}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </Section>
      </div>
    </div>
  );
}

/* --- Sub-Components --- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">{title}</p>
      {children}
    </div>
  );
}

function ColorRow({ colors, active, onSelect }: { colors: string[]; active: string; onSelect: (c: string) => void }) {
  const customColorRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          style={{ backgroundColor: c === "transparent" ? "transparent" : c }}
          className={`h-6 w-6 rounded-md border transition-all ${
            active === c ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#1e1f2b]" : "border-white/20 hover:scale-110"
          } ${c === "transparent" ? "bg-checkered" : ""}`} // Add CSS for checkered bg if needed
        />
      ))}
      
      {/* Custom Color Picker Button */}
      <div className="relative h-6 w-6">
        <button 
          onClick={() => customColorRef.current?.click()}
          className="h-6 w-6 rounded-md border border-white/20 bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 hover:scale-110 transition-transform"
        />
        <input
          ref={customColorRef}
          type="color"
          value={active.startsWith("#") ? active : "#ffffff"}
          onChange={(e) => onSelect(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

function ButtonRow({ 
  values, 
  active, 
  onSelect, 
  labels 
}: { 
  values: any[]; 
  active: any; 
  onSelect: (v: any) => void;
  labels?: string[];
}) {
  return (
    <div className="flex bg-white/5 p-1 rounded-lg gap-1">
      {values.map((v, i) => (
        <button
          key={v}
          onClick={() => onSelect(v)}
          className={`flex-1 py-1 px-2 rounded-md text-[11px] transition-all capitalize ${
            active === v 
              ? "bg-indigo-500 text-white shadow-lg" 
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          {labels ? labels[i] : v}
        </button>
      ))}
    </div>
  );
}