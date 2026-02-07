  import ToolBar from "./components/toolbar"
import {useState} from "react"
import Canvas from "./components/canvas"
// import StyleBar from "./components/stylebar"

function App() {
const [currentTool,setCurrentTool] = useState("select")
  return (
    <div>
    <ToolBar currentTool={currentTool} setCurrentTool={setCurrentTool}/>
    <Canvas currentTool={currentTool} setCurrentTool={setCurrentTool}/>
    {/* <StyleBar/> */}
          </div>
  )
}

export default App
