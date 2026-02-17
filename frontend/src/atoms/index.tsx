import {atom, selectorFamily }from "recoil";
import type { Actions,CurrentTool,ScaleType,Element, Collaborate} from "../type"
const elementState = atom<Element[]>({
    key:"elementState",
    default:[],
})
const selectedElementState = atom<string[]>({
    key:"selectedElementState",
    default:[],
})
const currentToolState = atom<CurrentTool>({
    key:"currentToolState",
    default:"select"
})
const styleUpdateState = atom({
    key:"styleUpdateState",
    default:false
})
const actionState = atom<Actions>({
    key:"actionState",
    default:"IDLE"
})

const scaleTypeState = atom<ScaleType|'rotate'>({
    key:"scaleTypeState",
    default:null
})

const groupIdState = atom<string>({
    key:"groupIdState",
    default:""
})
const isLiveState = atom<"joined"|"created"|null>({
    key:"isLiveState",
    default:null
})
const collaboratorsState = atom<Collaborate[]>({
    key:"collaboratorsState",
    default:[]
})

export {elementState,selectedElementState,currentToolState,styleUpdateState,actionState,scaleTypeState,groupIdState,isLiveState ,collaboratorsState}