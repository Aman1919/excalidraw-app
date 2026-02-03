/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Area } from "./../../type";
import Element from "./element";
import { DrawDiagrams } from "./drawgraphics";
import CollisionCheck from "./collision";
export default class Selection {
  selectedElements: Element[] = [];
  selectionAreaCoords: Area = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    width: 0,
    height: 0,
  };
  moveCoords = { x: 0, y: 0 };
  isDragging = false;

  startMove(x: number, y: number) {
    if (this.selectedElements.length > 0 && this.movingGroup(x, y)) {
      // const {min_x,min_y}= this.min_max_x_y();
      this.isDragging = true;
      this.moveCoords = { x, y };
    }
  }
  updateMoveCoords(x: number, y: number) {
    console.log("moveelement", this.selectedElements);
    if (!this.selectedElements.length || !this.isDragging) return;
    //  const {x1,y1,width,height}=this.selectedElements[0];
    this.selectedElements.forEach((el) => {
      const dx = x - this.moveCoords.x;
      const dy = y - this.moveCoords.y;
      el.x1 += dx;
      el.y1 += dy;
      el.x2 += dx;
      el.y2 += dy;
    });
    this.moveCoords = { x, y };
  }

  movingGroup(x: number, y: number) {
    const { min_x, min_y, max_x, max_y } = this.min_max_x_y();
    console.log(min_x, min_y, max_x, max_y);
    return x >= min_x && x <= max_x && y >= min_y && y <= max_y;
  }

  stopMove() {
    console.log("stopmove", this.selectedElements);
    this.isDragging = false;
    this.moveCoords = { x: 0, y: 0 };
  }

  draw(rctx: any) {
    const { x1, y1, width, height } = this.selectionAreaCoords;
    DrawDiagrams(x1, y1, width, height, "select", rctx);
  }

  start(x: number, y: number) {
    this.selectionAreaCoords = {
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      width: x,
      height: y,
    };
  }

  updateCoordinates(x: number, y: number) {
    this.selectionAreaCoords.width = x - this.selectionAreaCoords.x1;
    this.selectionAreaCoords.height = y - this.selectionAreaCoords.y1;
    this.selectionAreaCoords.x2 = x;
    this.selectionAreaCoords.y2 = y;
  }

  groupSelection(rctx: any) {
    if (!this.selectedElements.length) return;
    if (this.selectedElements.length == 1) {
      this.selectedElements[0].selected();
      return;
    }
    const { min_x, min_y, max_x, max_y } = this.min_max_x_y();
    console.log(min_x, min_y, max_x, max_y);
    DrawDiagrams(
      min_x,
      min_y,
      max_x,
      max_y,
      "selectionBorder",
      rctx,
      max_x,
      max_y,
    );
  }

  min_max_x_y() {
    const min_x = Math.min(
      ...this.selectedElements.map((el) => Math.min(el.x1, el.x2)),
    );
    const max_x = Math.max(
      ...this.selectedElements.map((el) => Math.max(el.x1, el.x2)),
    );
    const min_y = Math.min(
      ...this.selectedElements.map((el) => Math.min(el.y1, el.y2)),
    );
    const max_y = Math.max(
      ...this.selectedElements.map((el) => Math.max(el.y1, el.y2)),
    );
    return { min_x, min_y, max_x, max_y };
  }

  ScanElements(shapes: Element[]) {
    // Check how elements comes under the selection area
    if (this.isDragging) return;
    for (const shape of shapes) {
      if (
        CollisionCheck(
          0,
          0,
          "selection_collision",
          shape,
          this.selectionAreaCoords,
        ) &&
        !this.selectedElements.some((obj) => obj.id === shape.id)
      ) {
        this.selectedElements.push(shape);
        shape.selected();
      }
    }
  }
//my click on Element function
  // clickOnElement(x: number, y: number, shapes: Element[]) {
  //   //if we click on a element then select it
  //   if (this.isDragging) return;
  //   shapes.forEach((shape) => {
  //     if (CollisionCheck(x, y, "point_element_collision", shape)) {
  //       if (!this.selectedElements.some((obj) => obj.id === shape.id)) {
  //         this.selectedElements.push(shape);
  //         shape.selected();
  //       }
  //       console.log(shape, "collision");
  //     } else {
  //       this.selectedElements = this.selectedElements.filter(
  //         (obj) => obj.id !== shape.id,
  //       );
  //       shape.deselected();
  //     }
  //   });
  // }

  //if mouse hovers over element or group of elements
  
  //ai function
  clickOnElement(x: number, y: number, shapes: Element[]) {
    if (this.isDragging) return;

    // 1. Find the specific shape that was clicked (top-most first)
    // We reverse() so we pick the item drawn on top if they overlap
    const hitShape = [...shapes].reverse().find(shape => 
        CollisionCheck(x, y, "point_element_collision", shape)
    );

    if (hitShape) {
        // 2. Logic for when we HIT a shape
        if (!this.selectedElements.some((obj) => obj.id === hitShape.id)) {
            this.selectedElements.push(hitShape);
            hitShape.selected();
        }
        console.log(hitShape, "collision");
    } else {
        // 3. Logic for when we hit EMPTY SPACE
        // Only deselect if the user clicked the background
        this.selectedElements.forEach(shape => shape.deselected());
        this.selectedElements = [];
    }
}
 
//my mouseon element function
  // MouseOnElement(
  //   x: number,
  //   y: number,
  //   shapes: Element[],
  //   canvas: HTMLCanvasElement,
  // ) {
  //   if (this.movingGroup(x, y)) {
  //     canvas.style.cursor = "all-scroll"; 
  //     return true;
  //   } else {
  //     canvas.style.cursor = "default";

  //     return shapes.some((shape) => {
  //       if (CollisionCheck(x, y, "point_element_collision", shape)) {
  //         canvas.style.cursor = "all-scroll";
  //         return true;
  //       } else {
  //         canvas.style.cursor = "default";
  //         this.selectedElements = this.selectedElements.filter(
  //           (obj) => obj.id !== shape.id,
  //         );
  //         shape.deselected();
  //         return false;
  //       }
  //     });
  //   }
  // }

  //ai function. find the difference
  MouseOnElement(x: number, y: number, shapes: Element[], canvas: HTMLCanvasElement) {
    // 1. Check if we are over the already selected group first
    if (this.movingGroup(x, y)) {
        canvas.style.cursor = "all-scroll";
        return true;
    }

    // 2. Check if the mouse is hovering over ANY shape in the scene
    const isHovering = shapes.some(shape => 
        CollisionCheck(x, y, "point_element_collision", shape)
    );

    // 3. Set cursor once based on the result
    canvas.style.cursor = isHovering ? "all-scroll" : "default";
    
    return isHovering;
}

  stop(shapes: Element[]) {
    this.ScanElements(shapes);
    this.selectionAreaCoords = {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      width: 0,
      height: 0,
    };
  }

  hasSelected() {
    return this.selectedElements.length;
  }
}
