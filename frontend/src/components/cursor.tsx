// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DrawCursor(x:number,y:number,color:string,username:string,rctx:any, ctx?:CanvasRenderingContext2D){
    // Prefer raw 2D context for crisp cursor. If not provided, try to obtain it from rough canvas.
    const _ctx = ctx ?? (rctx && (rctx.canvas && typeof rctx.canvas.getContext === 'function' ? rctx.canvas.getContext('2d') : null));
    if(!_ctx){
        // fallback to a simple roughjs dot and a background rectangle (text skipped in fallback)
        rctx.circle(x, y, 6, { fill: color, stroke: 'black', strokeWidth: 1, roughness: 0, fillStyle: "solid" });
        if(username){
            rctx.rectangle(x + 10, y - 10, Math.max(48, username.length * 6), 18, { fill: 'rgba(0,0,0,0.6)', fillStyle: 'solid', roughness:0 });
        }
        return;
    }

    const size = 12; // arrow scale
    _ctx.save();

    // draw arrow-like cursor (triangle) with a small outline for visibility
    _ctx.beginPath();
    _ctx.moveTo(x, y); // tip
    _ctx.lineTo(x + size, y + size/2);
    _ctx.lineTo(x + size/2, y + size);
    _ctx.closePath();
    _ctx.fillStyle = color;
    _ctx.fill();
    _ctx.lineWidth = 1;
    _ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    _ctx.stroke();

    // small dot at the tip to make pointer target clear
    _ctx.beginPath();
    _ctx.arc(x, y, 3, 0, Math.PI * 2);
    _ctx.fillStyle = color;
    _ctx.fill();
    _ctx.stroke();

    // draw username label to the right of the cursor
    if (username) {
        const paddingX = 8;
        // const paddingY = 4;
        _ctx.font = '12px sans-serif';
        const metrics = _ctx.measureText(username);
        const textW = metrics.width;
        const rectW = textW + paddingX * 2;
        const rectH = 16;
        const rectX = x + size + 8;
        const rectY = y - rectH / 2;

        // rounded rectangle background
        const r = 6;
        _ctx.beginPath();
        _ctx.moveTo(rectX + r, rectY);
        _ctx.arcTo(rectX + rectW, rectY, rectX + rectW, rectY + rectH, r);
        _ctx.arcTo(rectX + rectW, rectY + rectH, rectX, rectY + rectH, r);
        _ctx.arcTo(rectX, rectY + rectH, rectX, rectY, r);
        _ctx.arcTo(rectX, rectY, rectX + rectW, rectY, r);
        _ctx.closePath();
        _ctx.fillStyle = 'rgba(0,0,0,0.6)';
        _ctx.fill();

        // username text
        _ctx.fillStyle = '#ffffff';
        _ctx.textBaseline = 'middle';
        _ctx.fillText(username, rectX + paddingX, rectY + rectH / 2);
    }

    _ctx.restore();
}