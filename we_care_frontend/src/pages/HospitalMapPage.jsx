import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HospitalMap from "../components/HospitalMap";

const HospitalMapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Grab the hospital data we passed through the router
  const hospital = location.state?.hospital;

  // Fallback just in case someone refreshes the page directly
  if (!hospital || !hospital.location) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f9f7]">
        <h2 className="text-2xl font-bold text-[#1d5f71]">No Location Data Found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-[#2C6975] text-white rounded-xl">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f9f7] pt-[80px] px-4 md:px-8 pb-10">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header & Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1d5f71]">{hospital.name}</h1>
            <p className="text-[#4f7f89] mt-1">{hospital.address}</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-white border-2 border-[#c7e6de] text-[#2C6975] font-bold rounded-xl hover:bg-[#e8f4f1] transition-all"
          >
            &larr; Back to List
          </button>
        </div>

        {/* The Full Size Map */}
        <div className="w-full h-[600px] shadow-2xl rounded-2xl overflow-hidden border-4 border-white">
          <HospitalMap 
            centerLocation={hospital.location} 
            hospitals={[hospital]} // We only pass this specific hospital to the map so it's the only pin!
          />
        </div>

      </div>
    </div>
  );
};

export default HospitalMapPage;