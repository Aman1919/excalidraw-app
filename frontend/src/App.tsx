  import ToolBar from "./components/toolbar"
import {useState} from "react"
import Canvas from "./components/canvas.tsx"
import Element from "./components/element"

import StyleBar from "./components/stylebar"
import Collaboration from "./components/colaboration.tsx"

function App() {
const [currentTool,setCurrentTool] = useState("select")
const [selectedElements,setSelectedElements] = useState<Element[]>([])
const [elements,setElements]= useState<Element[]>([]);
const [styleUpdate,setStyleUpdate]=useState(false)
const [collaborationData,setCollaborationData]=useState("")
function stringifyElements(){
  const arr = elements.map((el)=>{
   return {
    id:el.id,
    type:el.type,
    x1:el.x1,
    y1:el.y1,
    x2:el.x2,
    y2:el.y2,
    width:el.width,
    height:el.height,
  style:el.style,
    text:el.text
   }
  })
  return JSON.stringify(arr)
}
  return (
    <div>
      <Collaboration elements={stringifyElements()} collaborationData={collaborationData} setCollaborationData={setCollaborationData}/>
    <ToolBar currentTool={currentTool} setCurrentTool={setCurrentTool}/>
    <Canvas currentTool={currentTool} setCurrentTool={setCurrentTool} selectedElements={selectedElements} styleUpdate={styleUpdate} setStyleUpdate={setStyleUpdate} setSelectedElements={setSelectedElements} setElements={setElements} elements={elements}/>
    {selectedElements.length>0&&<StyleBar styleUpdate={styleUpdate} selectedElements={selectedElements} setStyleUpdate={setStyleUpdate} setSelectedElements={setSelectedElements}/>}
          </div>
  )
}

export default App
