  import ToolBar from "./components/toolbar"
import {useState} from "react"
import Canvas from "./components/canvas.tsx"
import Element from "./components/element"

// import StyleBar from "./components/stylebar"

function App() {
const [currentTool,setCurrentTool] = useState("select")
const [selectedElements,setSelectedElements] = useState<Element[]>([])
const [elements,setElements]= useState<Element[]>([]);

  return (
    <div>
    <ToolBar currentTool={currentTool} setCurrentTool={setCurrentTool}/>
    <Canvas currentTool={currentTool} setCurrentTool={setCurrentTool} selectedElements={selectedElements} setSelectedElements={setSelectedElements} setElements={setElements} elements={elements}/>
    {/* <StyleBar/> */}
          </div>
  )
}

export default App
