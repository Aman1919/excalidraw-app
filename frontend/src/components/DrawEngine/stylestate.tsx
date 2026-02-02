export default class StyleState{
    strokeColor:string;backgroundColor:string;fillStyle:string;strokeWidth:number;strokeStyle:string;roughness:number;opacity:number;
    constructor(strokeColor='white',backgroundColor='',fillStyle='solid',strokeWidth=1,strokeStyle = 'solid',roughness=1,opacity=1){
this.strokeColor =strokeColor;
this.backgroundColor =backgroundColor;
this.fillStyle = fillStyle;
this.strokeWidth = strokeWidth;
this.roughness = roughness;
this.strokeStyle = strokeStyle;
this.opacity = opacity
    }
}