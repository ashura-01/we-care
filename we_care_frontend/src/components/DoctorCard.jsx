import React from "react";
import { Link } from "react-router-dom"; 
import GlassCard from "./GlassCard";
import PillButton from "./PillButton";
import LeafDecor from "./LeafDecor";

const DoctorCard = ({ doc, index }) => {
 
  const forestColors = ["#004b43", "#1b4332", "#007a71", "#2d6a4f"];
  const opacities = ["0.7", "0.4", "0.8", "0.5"];

  return (
    <div className="relative group">
      
      <div
        className={`absolute ${
          index % 2 === 0 ? "-right-4 -top-6" : "-left-6 bottom-[-10px] scale-x-[-1]"
        } z-[0] pointer-events-none w-[100px] group-hover:rotate-12 transition-all duration-700`}
      >
        <LeafDecor
          style={{
            "--fill-0": forestColors[index % forestColors.length],
            opacity: opacities[index % opacities.length],
          }}
        />
      </div>

      <GlassCard className="relative z-[1] p-[30px] rounded-[40px] border-white/70 bg-white/50 backdrop-blur-[30px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_30px_60px_rgba(0,136,127,0.2)] hover:-translate-y-2 transition-all duration-500">
        <div className="flex items-center gap-[30px] max-[640px]:flex-col max-[640px]:text-center">
          
          
          <div className="w-[85px] h-[85px] rounded-full overflow-hidden shrink-0 border-[5px] border-white shadow-lg bg-gray-100">
            <img 
              src={doc.user?.avatar || "https://via.placeholder.com/150"} 
              alt={doc.user?.name} 
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start max-[640px]:flex-col max-[640px]:items-center">
              <div>
                
                <h2 className="text-[26px] font-black text-[#003a46] leading-tight tracking-tight">
                  {doc.user?.name || "Expert Doctor"}
                </h2>
                
                
                <p className="text-[12px] font-extrabold text-[#00887f] uppercase tracking-[0.15em] mt-1 bg-[#00887f]/10 px-3 py-1 rounded-lg inline-block">
                  {doc.specialization} | {doc.experience} Years Exp.
                </p>
              </div>

              
              <div className="hidden min-[641px]:block relative z-[2]">
                <Link to={`/doctor/${doc._id}`}>
                  <PillButton className="px-7 py-3 text-[13px] font-bold shadow-xl shadow-[#00887f]/20">
                    View Profile
                  </PillButton>
                </Link>
              </div>
            </div>

            
            <p className="relative z-[1] text-[15px] font-semibold text-[#4f7f89] mt-3 leading-snug line-clamp-2 max-w-[580px]">
              Affiliated with {doc.hospital}. Specialist in {doc.specialization} with a consultation fee of ${doc.fees}.
            </p>

            
            <div className="min-[641px]:hidden mt-4">
               <Link to={`/doctor/${doc._id}`}>
                <PillButton className="w-full py-3 text-[13px] font-bold">
                  View Profile
                </PillButton>
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default DoctorCard;