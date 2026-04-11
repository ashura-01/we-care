import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "./GlassCard";
import LeafDecor from "./LeafDecor";

const HospitalCard = ({ hospital, index }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(!hospital.image);
  
  const forestColors = ["#004b43", "#003a46", "#2d6a4f", "#00887f"];
  const isPartner = !!hospital._id;

  const handleAction = () => {
    const lat = hospital.location?.lat || hospital.geometry?.location?.lat;
    const lng = hospital.location?.lng || hospital.geometry?.location?.lng;

    if (lat && lng) {
      navigate("/hospital-map", { state: { hospital } });
    } else if (hospital._id) {
      navigate(`/hospital/${hospital._id}`);
    } else {
      alert("Coordinates pending.");
    }
  };

  return (
    <div className="relative group w-full cursor-pointer" onClick={handleAction}>
      
      <div className="absolute -right-6 -top-6 md:-right-12 md:-top-12 z-[0] w-[70px] md:w-[130px] opacity-0 group-hover:opacity-80 group-hover:translate-y-4 md:group-hover:translate-y-8 group-hover:-rotate-[30deg] transition-all duration-1000 pointer-events-none transform scale-y-[-1] filter drop-shadow-2xl">
        <LeafDecor style={{ "--fill-0": forestColors[index % forestColors.length] }} />
      </div>

      
      <GlassCard className="p-0 border-white/80 backdrop-blur-3xl shadow-[0_15px_40px_rgba(0,58,70,0.06)] transition-all duration-500 group-hover:shadow-[0_50px_100px_rgba(0,136,127,0.15)] group-hover:-translate-y-2 overflow-hidden aspect-square md:aspect-auto">
        
       
        <div className="h-[40%] md:h-[230px] relative overflow-hidden bg-gradient-to-br from-[#003a46] to-[#00887f]">
          {!imgError ? (
            <img 
              src={hospital.image} 
              alt={hospital.name}
              className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" 
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center opacity-20">
                <svg className="w-8 h-8 md:w-20 md:h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                </svg>
            </div>
          )}
          
          <div className="absolute top-2 right-2 md:top-6 md:right-6 bg-white/20 backdrop-blur-md border border-white/30 px-2 md:px-4 py-1 rounded-full shadow-2xl">
            <span className="text-white font-black text-[7px] md:text-[10px] tracking-wider uppercase">
                {isPartner ? `Partner` : `${Math.round(hospital.distanceMeters || 0)}m`}
            </span>
          </div>
        </div>

        
        <div className="p-3 md:p-8 flex flex-col justify-between h-[60%] md:h-auto">
          <div>
            <p className="text-[#00887f] font-black text-[7px] md:text-[10px] uppercase tracking-widest mb-0.5 md:mb-2 truncate">
              {isPartner ? (hospital.type || "Sanctuary") : "Medical Facility"}
            </p>
            
            <h3 className="text-[12px] md:text-[24px] font-black text-[#003a46] line-clamp-2 leading-[1.1] mb-1 md:mb-4 group-hover:text-[#00887f] transition-colors tracking-tighter">
              {hospital.name}
            </h3>
            
            <div className="hidden md:flex items-start gap-2 text-[#4f7f89] font-bold text-xs mb-8 h-10 overflow-hidden">
              <span className="text-[#00887f] text-lg">📍</span>
              <span className="line-clamp-2 leading-relaxed pt-1">
                  {hospital.address || hospital.location || hospital.vicinity || "Detail pending"}
              </span>
            </div>

            <div className="hidden md:flex flex-wrap gap-1.5 mb-10 h-8 overflow-hidden">
              {(hospital.departments || ["Emergency", "Wellness"]).slice(0, 2).map((dept, i) => (
                <span key={i} className="bg-[#003a46]/5 border border-[#003a46]/10 px-4 py-1.5 rounded-full text-[9px] font-black text-[#4f7f89] uppercase tracking-widest">
                  {dept}
                </span>
              ))}
            </div>
          </div>

          <button className="w-full bg-[#003a46] group-hover:bg-[#00887f] text-white py-2 md:py-4 rounded-[10px] md:rounded-[20px] font-black text-[8px] md:text-[11px] tracking-[0.1em] md:tracking-[0.25em] uppercase transition-all shadow-xl active:scale-95 truncate">
            {isPartner ? "Enter Sanctuary" : "View Map"}
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default HospitalCard;