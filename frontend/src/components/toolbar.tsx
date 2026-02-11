import {
  FiMousePointer,
  FiSquare,
  FiCircle,
  FiArrowRight,
  FiMinus,
  FiEdit2,
  FiType,
  FiTrash2
} from "react-icons/fi";


type ToolBarProps = {
  currentTool:string,
  setCurrentTool: (tool: string) => void;
};

export default function ToolBar({ setCurrentTool,currentTool }: ToolBarProps) {
   const tools = [
  { name: "select", icon: FiMousePointer},
  { name: "rect", icon: FiSquare},
  { name: "circle", icon: FiCircle},
  { name: "line", icon: FiMinus},
  { name: "arrow-line", icon: FiArrowRight},
  { name: "pencil", icon: FiEdit2},
  { name: "text", icon: FiType },
  { name: "trash", icon: FiTrash2 },
];

function handle(toolname:string) {
    setCurrentTool(toolname);
}

    return <nav className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
      <div
        className="
          flex items-center gap-1
          bg-dark-blue/90 backdrop-blur
          border border-white/10
          rounded-xl px-2 py-1
          shadow-lg
        "
      >
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <button
              key={tool.name}
              onClick={()=>handle(tool.name)}
              className={`
                group
                w-11 h-11
                flex items-center justify-center
                rounded-lg
                text-white/80
                hover:text-white
                ${tool.name!==currentTool?"hover:bg-purple-600/10":""}
                hover:bg-purple-600/10
                active:scale-95
                transition-all
                ${tool.name==currentTool?"bg-purple-600/40":""}
              `}
            >
              <Icon size={20} />

              {/* tooltip */}
              <span
                className="
                  pointer-events-none absolute top-full mt-2
                  scale-95 opacity-0
                  group-hover:opacity-100 group-hover:scale-100
                  transition
                  text-xs
                  bg-black/80 text-white
                  px-2 py-1 rounded-md
                  whitespace-nowrap
                "
              >
                {tool.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
}