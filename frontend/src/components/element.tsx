import type { ElementType, ScaleType, Element } from "../type";

export function createElement(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: ElementType
):Element {
  return {
    id: crypto.randomUUID(),
    type,
    x1,
    y1,
    x2,
    y2,
    width: x2 - x1,
    height: y2 - y1,
    text: "",
    style: {
      stroke: "white",
      strokeWidth: 2,
      strokeStyle: "solid",
      fill: null,
      opacity: 1,
      fontSize: 30,
      fontFamily: "Inter, sans-serif",
      textAlign: "left",
    },
  };
}

export function setText(el: Element, text: string): Element {
  if (el.type !== "text") return el;

  return {
    ...el,
    text,
  };
}


export function moveElement(
  el: Element,
  x: number,
  y: number,
  last: { x: number; y: number }
): Element {
  const dx = x - last.x;
  const dy = y - last.y;

  return {
    ...el,
    x1: el.x1 + dx,
    y1: el.y1 + dy,
    x2: el.x2 + dx,
    y2: el.y2 + dy,
  };
}

export function updateDraftCoords(
  el: Element,
  x: number,
  y: number
): Element {
  return {
    ...el,
    x2: x,
    y2: y,
    width: x - el.x1,
    height: y - el.y1,
  };
}

// export function rotateElement(
//   el: Element,
//   x: number,
//   y: number,
//   last: { x: number; y: number },
//   handle: ScaleType
// ): Element {
// console.log(x,y,last,handle,el)
// return el
// }


export function scaleElement(
  el: Element,
  x: number,
  y: number,
  last: { x: number; y: number },
  handle: ScaleType
): Element {
  const dx = x - last.x;
  const dy = y - last.y;

  let next = { ...el };

  // text scaling
  if (el.type === "text") {
    next = {
      ...next,
      style: {
        ...next.style,
        fontSize: Math.max(
          6,
          (next.style.fontSize ?? 16) + dy * 0.1
        ),
      },
    };
  }

  switch (handle) {
    case "left":
      next.x1 += dx;
      break;
    case "right":
      next.x2 += dx;
      break;
    case "top":
      next.y1 += dy;
      break;
    case "bottom":
      next.y2 += dy;
      break;
    case "tr":
      next.x2 += dx;
      next.y1 += dy;
      break;
    case "tl":
      next.x1 += dx;
      next.y1 += dy;
      break;
    case "br":
      next.x2 += dx;
      next.y2 += dy;
      break;
    case "bl":
      next.x1 += dx;
      next.y2 += dy;
      break;
  }

  return {
    ...next,
    width: next.x2 - next.x1,
    height: next.y2 - next.y1,
  };
}