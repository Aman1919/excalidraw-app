  import ToolBar from "./components/toolbar"
import {useState} from "react"
import Canvas from "./components/canvas.tsx"
import Element from "./components/element"

import StyleBar from "./components/stylebar"

function App() {
const [currentTool,setCurrentTool] = useState("select")
const [selectedElements,setSelectedElements] = useState<Element[]>([])
const [elements,setElements]= useState<Element[]>([]);
const [styleUpdate,setStyleUpdate]=useState(false)
  return (
    <div>
    <ToolBar currentTool={currentTool} setCurrentTool={setCurrentTool}/>
    <Canvas currentTool={currentTool} setCurrentTool={setCurrentTool} selectedElements={selectedElements} styleUpdate={styleUpdate} setStyleUpdate={setStyleUpdate} setSelectedElements={setSelectedElements} setElements={setElements} elements={elements}/>
    {selectedElements.length>0&&<StyleBar styleUpdate={styleUpdate} selectedElements={selectedElements} setStyleUpdate={setStyleUpdate} setSelectedElements={setSelectedElements}/>}
          </div>
  )
}

export default App
