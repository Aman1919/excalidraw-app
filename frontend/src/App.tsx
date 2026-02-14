  import ToolBar from "./components/toolbar"

import Canvas from "./components/canvas.tsx"

import StyleBar from "./components/stylebar"
import Collaboration from "./components/colaboration.tsx"
import {RecoilRoot} from "recoil"

function App() {

  return (
    <RecoilRoot>
      <Collaboration />
    <ToolBar />
    <Canvas   />
    <StyleBar/>
      </RecoilRoot>
  )
}

export default App
