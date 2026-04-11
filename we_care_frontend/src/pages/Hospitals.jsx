import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hospitalController } from "../api/hospitalController";
import { useAuth } from "../contexts/AuthContext";
import LeafDecor from "../components/LeafDecor";
import GlassCard from "../components/GlassCard";
import HospitalCard from "../components/HospitalCard";

const Hospitals = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State
  const [hospitals, setHospitals] = useState([]);
  const [mapHospitals, setMapHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(""); 
  const [apiQuery, setApiQuery] = useState("");       // For triggering the API fetch
  const [typeFilter, setTypeFilter] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Internal Database Partners
      const res = await hospitalController.getAllHospitals({
        search: apiQuery,
        type: typeFilter,
      });
      if (res.success) setHospitals(res.data || []);

      // 2. Logic for Map Address Fallbacks
      let addressToSearch = "Dhaka, Bangladesh"; // Final fallback
      if (apiQuery) {
        addressToSearch = apiQuery;
      } else if (user?.address) {
        addressToSearch = user.address;
      } else if (user?.city) {
        addressToSearch = user.city;
      }

      // 3. Fetch External Nearby Hospitals (Geoapify/Map API)
      const mapRes = await hospitalController.getNearbyHospitals(addressToSearch);
      if (mapRes.success) setMapHospitals(mapRes.hospitals || []);
      
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchData();
  }, [apiQuery, typeFilter, user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setApiQuery(searchInput);
  };

  const handleCardClick = (hospital) => {
    // Navigation with GPS check
    if (hospital.location && hospital.location.lat) {
      navigate("/hospital-map", { state: { hospital } });
    } else {
      alert("Map coordinates are not available for this location yet.");
    }
  };

  
  const combinedHospitals = [
    ...hospitals,
    ...mapHospitals.filter(
      (mh) => !hospitals.some((h) => h.name?.toLowerCase() === mh.name?.toLowerCase())
    ),
  ];

  return (
    <div className="min-h-screen bg-[#f0f7f4] pb-60 relative overflow-hidden">
      
      
      <div className="absolute left-[-8%] top-[-8%] z-[0] w-[600px] -rotate-12 pointer-events-none opacity-20 blur-[2px]">
        <LeafDecor style={{ "--fill-0": "#005f56" }} />
      </div>

      <div className="absolute right-[-10%] bottom-[5%] z-[0] w-[700px] rotate-[160deg] pointer-events-none opacity-20 blur-[3px]">
        <LeafDecor style={{ "--fill-0": "#00887f" }} />
      </div>

      <section className="relative z-[50] pt-16 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-[clamp(40px,8vw,72px)] font-black text-[#003a46] leading-[0.85] tracking-tighter italic">
            Medical <span className="text-[#00887f]">Sanctuaries</span>
          </h2>

          
          <form onSubmit={handleSearchSubmit} className="mt-16 max-w-[900px] mx-auto flex flex-col md:flex-row gap-5">
            <GlassCard className="flex-[2.5] p-2 rounded-full border-white/70 shadow-[0_25px_60px_rgba(0,58,70,0.12)]">
              <div className="flex items-center gap-4 px-5 py-1 md:py-3">
                <svg className="w-5 h-5 text-[#00887f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Sanctuary name or city..."
                  className="flex-1 bg-transparent outline-none text-[#003a46] font-bold text-lg md:text-xl placeholder-[#003a46]/20"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" className="hidden md:block bg-[#003a46] text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#00887f] transition-all">
                  Locate
                </button>
              </div>
            </GlassCard>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="flex-1 bg-white/50 backdrop-blur-xl border border-white/70 rounded-full px-8 py-4 md:py-5 text-[#003a46] font-black text-xs uppercase tracking-widest outline-none cursor-pointer shadow-xl appearance-none"
            >
              <option value="">All Types</option>
              {["General", "Specialized", "Clinic", "Diagnostic", "Emergency"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </form>
        </div>
      </section>

      
      <div className="relative z-[40] max-w-[1400px] mx-auto px-4 md:px-8 mt-24">
        {loading ? (
          <div className="text-center py-32 font-black text-[#00887f] text-3xl animate-pulse italic">
            locating sanctuaries...
          </div>
        ) : combinedHospitals.length === 0 ? (
          <div className="text-center py-20 text-[#4f7f89] font-medium text-xl">
            No sanctuaries found in this realm.
          </div>
        ) : (
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 md:gap-x-12 gap-y-6 md:gap-y-12">
            {combinedHospitals.map((hospital, index) => (
              <div 
                key={hospital._id || `map-${index}`}
                className="w-full cursor-pointer"
                onClick={() => handleCardClick(hospital)}
              >
                <HospitalCard hospital={hospital} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hospitals;