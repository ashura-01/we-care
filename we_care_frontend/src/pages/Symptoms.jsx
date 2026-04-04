import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { aiController } from "../api/aiController";
import aiIcon from "../assets/ai.svg";

const urgencyStyle = {
  low: "bg-emerald-100 text-emerald-700 border-emerald-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  high: "bg-rose-100 text-rose-700 border-rose-200",
};

const AIDoctorCard = ({ doc, onClick }) => (
  <button
    onClick={() => onClick(doc._id)}
    className="w-full text-left p-4 md:p-5 rounded-[24px] bg-white/60 border border-white/80 hover:bg-white hover:shadow-xl transition-all flex items-center gap-4 group mb-3"
  >
    <div className="relative shrink-0">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-gray-100">
        <img
          src={doc.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.user?.name || "Dr")}&background=00887f&color=fff`}
          alt={doc.user?.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start gap-2">
        <p className="text-[15px] md:text-[17px] font-black text-[#003a46] truncate group-hover:text-[#00887f]">
          {doc.user?.name}
        </p>
        <p className="text-[14px] md:text-[15px] font-black text-[#046ea3] shrink-0">${doc.fees}</p>
      </div>
      <p className="text-[11px] md:text-[12px] font-bold text-[#00887f] flex flex-wrap items-center gap-1 mt-0.5">
        <span className="bg-[#00887f]/10 px-2 py-0.5 rounded-md">{doc.specialization}</span>
        <span className="text-[#4f7f89]">• {doc.experience}y exp</span>
      </p>
    </div>
  </button>
);

const AIResponseCard = ({ data }) => (
  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500 w-full">
    <div className="bg-white/90 backdrop-blur-sm p-4 md:p-5 rounded-3xl rounded-tl-none border border-white shadow-sm">
      <p className="text-[14px] md:text-[15px] text-[#003a46] font-medium leading-relaxed italic">"{data.reply}"</p>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="bg-[#00887f]/5 p-3 rounded-2xl border border-[#00887f]/10">
        <p className="text-[10px] font-black uppercase text-[#00887f]/60 mb-1">Potential Cause</p>
        <p className="text-[13px] font-bold text-[#003a46]">{data.possible_cause}</p>
      </div>
      <div className={`p-3 rounded-2xl border ${urgencyStyle[data.urgency] || urgencyStyle.medium}`}>
        <p className="text-[10px] font-black uppercase opacity-60 mb-1">Urgency</p>
        <p className="text-[13px] font-bold capitalize">{data.urgency}</p>
      </div>
    </div>

    {data.home_care?.length > 0 && (
      <div className="bg-white/40 p-4 rounded-2xl border border-white/60">
        <p className="text-[11px] font-black uppercase text-[#003a46] mb-2 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#00887f] rounded-full" /> Home Care
        </p>
        <ul className="space-y-2">
          {data.home_care.map((tip, i) => (
            <li key={i} className="text-[13px] text-[#4f7f89] font-medium flex items-start gap-2">
              <span className="text-[#00887f]">•</span>{tip}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const Symptoms = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInputText("");
    setIsLoading(true);
    
    const data = await aiController.chatWithAI(trimmed);
    if (data.success) {
      setMessages((prev) => [...prev, { role: "ai", type: "response", data }]);
      if (data.doctors) {
        setDoctorList(data.doctors);
        setSelectedSpecialist(data.specialist);
      }
    } else {
      setMessages((prev) => [...prev, { role: "ai", type: "error", text: data.message || "Error occurred" }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="h-screen bg-[#f4f9f7] flex flex-col font-sans overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-5%] left-[-5%] w-[50%] h-[40%] bg-[#00887f]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-5%] right-[-5%] w-[40%] h-[30%] bg-[#046ea3]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Responsive Wrapper */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10 w-full overflow-hidden">
        
        {/* --- CHAT INTERFACE (Top on Mobile, Right on Desktop) --- */}
        <aside className="lg:order-2 w-full lg:w-[420px] xl:w-[480px] bg-white/60 lg:bg-white/40 backdrop-blur-2xl border-b lg:border-b-0 lg:border-l border-white/60 shadow-xl flex flex-col h-[60vh] lg:h-full">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-white/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-[#00887f] to-[#046ea3] flex items-center justify-center shadow-md">
                <img src={aiIcon} alt="AI" className="w-6 h-6 brightness-0 invert" />
              </div>
              <div>
                <p className="text-sm md:text-base font-black text-[#003a46]">Health AI</p>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => {setMessages([]); setDoctorList([]);}} className="p-2 hover:bg-white/60 rounded-xl transition-colors text-[#4f7f89]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-[#4f7f89] font-medium mb-6">Describe your symptoms to get started.</p>
                <div className="flex flex-col gap-2">
                  {["Headache for 3 days", "Severe back pain"].map((s) => (
                    <button key={s} onClick={() => {setInputText(s); setMessages([{role:'user', text:s}]); /* Simplified for demo */}} className="text-left p-3 rounded-2xl bg-white/80 border border-white text-xs font-bold text-[#00887f]">
                      {s} →
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={msg.role === "user" ? "max-w-[90%]" : "w-full"}>
                    {msg.role === "user" ? (
                      <div className="bg-[#003a46] text-white px-4 py-2.5 rounded-2xl rounded-tr-none text-sm font-medium shadow-md">
                        {msg.text}
                      </div>
                    ) : (
                      msg.type === "response" ? <AIResponseCard data={msg.data} /> : 
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 text-sm">{msg.text}</div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && <div className="p-3 bg-white/50 w-16 rounded-full flex justify-center animate-pulse">...</div>}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 md:p-6 bg-white/40 border-t border-white/60 shrink-0">
            <div className="flex items-center gap-2 bg-white rounded-full p-1.5 shadow-lg border border-white">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type symptoms..."
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none font-medium"
              />
              <button onClick={handleSend} className="w-10 h-10 rounded-full bg-[#00887f] text-white flex items-center justify-center shadow-md active:scale-90 transition-transform">
                <svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </aside>

        {/* --- DOCTOR FEED (Bottom on Mobile, Left on Desktop) --- */}
        <section className="lg:order-1 flex-1 p-4 md:p-10 overflow-y-auto custom-scrollbar h-[40vh] lg:h-full">
          <div className="max-w-[800px] mx-auto">
            <header className="mb-6 md:mb-10">
              <h1 className="text-3xl md:text-5xl font-black text-[#003a46] leading-tight mb-3">
                {selectedSpecialist ? <><span className="text-[#00887f]">{selectedSpecialist}</span> matches</> : "Doctor matches"}
              </h1>
              <p className="text-sm md:text-base text-[#4f7f89] font-medium">
                {selectedSpecialist ? `Specialists found for your condition.` : "Your personalized results appear after chat."}
              </p>
            </header>

            {doctorList.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center text-gray-400 bg-white/10">
                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <p className="font-bold">No diagnosis yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {doctorList.map((doc) => (
                  <AIDoctorCard key={doc._id} doc={doc} onClick={(id) => navigate(`/doctor/${id}`)} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,136,127,0.2); border-radius: 10px; }
        @media (max-width: 1024px) {
          .custom-scrollbar::-webkit-scrollbar { width: 0px; }
        }
      `}</style>
    </div>
  );
};

export default Symptoms;