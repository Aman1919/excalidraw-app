import { useState,useEffect } from 'react';
import { Play, X, Users } from 'lucide-react';
import { FaStop } from "react-icons/fa";
import useWS from "./ws"
// import Element from "./element"
type CollaborationProps = {
elements:string,
setCollaborationData:(data:string)=>void,
collaborationData:string,
}
export default function Collaboration({elements,collaborationData,setCollaborationData}:CollaborationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const {send} = useWS({isLive,canvasData:elements,setCollaborationData});

  const handleStartSession = () => {
    // 1. Generate your room ID or hit your backend here
    // const roomId = crypto.randomUUID();
    
    setIsLive(true);
    
    console.log("Live collaboration started...");
    // Logic to initialize WebSocket would go here
  };

useEffect(()=>{
  if(collaborationData){
    // const data = JSON.parse(collaborationData)
  }
},[collaborationData])

 const handleStopSession  = ()=>{
    //close ws connection
    send({type:"end-session"})
    setIsLive(false);
    setIsOpen(false);
 }
  return (
    <>
      <button
        className={`absolute right-4 top-4 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors z-40 ${
          isLive ? "bg-green-600/20 text-green-400 border border-green-500/50" : "bg-purple-600 text-white shadow-lg hover:bg-purple-700"
        }`}
        onClick={() => setIsOpen(true)}
      >
        <Users size={18} />
        {isLive ? "Live" : "Share"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          
          <div className="relative w-full max-w-[480px] p-8 rounded-2xl bg-[#1e1f2b] border border-white/10 shadow-2xl text-center animate-in fade-in zoom-in duration-200">
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-[#a5adff] mb-4">
              Live collaboration
            </h2>

            <div className="space-y-4 mb-8">
              <p className="text-white/80 text-sm">
                Invite people to collaborate on your drawing.
              </p>
              <p className="text-white/40 text-[13px] leading-relaxed italic">
                Don't worry, the session is end-to-end encrypted, and fully private. 
                Not even our server can see what you draw.
              </p>
            </div>

            {!isLive?<button
              onClick={handleStartSession}
              className="group flex items-center justify-center gap-3 w-full sm:w-auto mx-auto px-10 py-4 rounded-xl bg-[#a5adff] hover:bg-[#949cff] transition-all active:scale-95"
            >
              <Play size={18} fill="currentColor" className="text-[#1e1f2b]" />
              <span className="font-bold text-[#1e1f2b]">Start session</span>
            </button>:<button
              onClick={handleStopSession}
              className="group flex items-center justify-center gap-3 w-full sm:w-auto mx-auto px-10 py-4 rounded-xl bg-[#ee7070] hover:bg-[#f88d8d] transition-all active:scale-95"
            >
                <FaStop/>
              <span className="font-bold text-[#1e1f2b]">stop session</span>
            </button>}
          </div>
        </div>
      )}
    </>
  );
}