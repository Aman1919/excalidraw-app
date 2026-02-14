import { useState,useEffect } from 'react';
import { Play, X, Users } from 'lucide-react';
import { FaStop } from "react-icons/fa";
import useWS from "./ws"
import { elementState,groupIdState,isLiveState } from '../atoms';
import { useRecoilState, useRecoilValue } from 'recoil';


export default function Collaboration() {
  const [isOpen, setIsOpen] = useState(false);
  // const [collaborationData,setCollaborationData]=useState("")
  const [groupId,setGroupId] = useRecoilState(groupIdState)
  const [isLive, setIsLive] = useRecoilState(isLiveState);
  const elements = useRecoilValue(elementState)
  const {send} = useWS();


useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
  const id = params.get("groupId");

  if (window.location.pathname === "/collaboration" && id) {
    console.log("Valid collaboration page");
    setIsLive('joined');
    setGroupId(id);
  }

},[elements, isLive, setGroupId, setIsLive])




  const handleStartSession = () => {
    // 1. Generate your room ID or hit your backend here
    // const roomId = crypto.randomUUID();
    
    setIsLive('created');
    
    console.log("Live collaboration started...");
    // Logic to initialize WebSocket would go here
  };


 const handleStopSession  = ()=>{
    //close ws connection
    send({type:"end-session"})
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



{isLive && (
  <div className="mt-6 p-5 rounded-xl bg-[#2a2b38]/80 border border-white/10 backdrop-blur-sm space-y-3">

    <p className="text-white/70 text-sm">
      Share this link to invite others
    </p>

    <div className="flex items-center gap-2">
      <input
        type="text"
        readOnly
        value={`${window.location.origin}/collaboration?groupId=${groupId}`}
        className="flex-1 bg-[#1e1f2b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/90 outline-none focus:ring-1 focus:ring-[#a5adff]"
      />

      <button
        onClick={() =>
          navigator.clipboard.writeText(
            `${window.location.origin}/collaboration?groupId=${groupId}`
          )
        }
        className="px-4 py-2 rounded-lg bg-[#a5adff] text-[#1e1f2b] font-medium text-sm hover:bg-[#949cff] active:scale-95 transition"
      >
        Copy
      </button>
    </div>

    <p className="text-[11px] text-white/40">
      Anyone with this link can join your session.
    </p>
  </div>
)}


          </div>
        </div>
      )}
    </>
  );
}