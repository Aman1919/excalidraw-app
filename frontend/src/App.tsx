// import { useState } from 'react'
import ToolBar from "./components/toolbar"
import Edit from "./components/edit"
import Menu from "./components/menu"
import Canvas from "./components/canvas"
import {useState} from "react"
function App() {
const [currentTool,setCurrentTool]=useState("select")
  return (
    <div className="relative">
      <ToolBar currentTool={currentTool} setCurrentTool={setCurrentTool}/>
      <Canvas currentTool={currentTool} setCurrentTool={setCurrentTool}/>
      <Menu/>
      <Edit/>
    </div>
  )
}

export default App
