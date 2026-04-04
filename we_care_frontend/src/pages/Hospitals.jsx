import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hospitalController } from "../api/hospitalController";
import LeafDecor from "../components/LeafDecor";
import { useAuth } from "../contexts/AuthContext";

const TYPE_COLORS = {
  General: "bg-blue-100 text-blue-700",
  Specialized: "bg-purple-100 text-purple-700",
  Clinic: "bg-green-100 text-green-700",
  Diagnostic: "bg-yellow-100 text-yellow-700",
  Emergency: "bg-red-100 text-red-700",
};

const Hospitals = () => {
  const navigate = useNavigate();

  // State
  const [hospitals, setHospitals] = useState([]);
  const [mapHospitals, setMapHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchHospitals = async () => {
    setLoading(true);
    const res = await hospitalController.getAllHospitals({ search, type: typeFilter });
    if (res.success) setHospitals(res.data || []);
    setLoading(false);
  };

  const fetchMapData = async (query) => {
    const addressToSearch = query || "Dhaka, Bangladesh"; 
    const res = await hospitalController.getNearbyHospitals(addressToSearch);
    if (res.success) setMapHospitals(res.hospitals || []);
  };

  useEffect(() => {
    fetchHospitals();
    fetchMapData(search);
  }, [search, typeFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleCardClick = (hospital) => {
    // Only navigate if the hospital actually has GPS coordinates!
    if (hospital.location && hospital.location.lat) {
      navigate("/hospital-map", { state: { hospital } });
    } else {
      alert("Map coordinates are not available for this location yet.");
    }
  };

  // Combine DB partners and Geoapify results into one list for the cards
  const combinedHospitals = [...hospitals, ...mapHospitals];

  return (
    <div className="min-h-screen bg-[#f4f9f7] pb-20 relative overflow-hidden">
      <div className="absolute left-[-2%] top-[-2%] z-[0] w-[180px] -rotate-12 pointer-events-none opacity-60">
        <LeafDecor style={{ "--fill-0": "#005f56" }} />
      </div>

      <section className="relative z-10 pt-[60px]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-[clamp(30px,5vw,52px)] font-bold text-[#1d5f71] leading-tight">
              Hospitals & Clinics
            </h1>
            <p className="mt-3 text-[16px] font-medium text-[#4f7f89] max-w-xl mx-auto">
              Find hospitals and medical centers near you
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-3 flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by address or city..."
                className="flex-1 rounded-[14px] border border-[#b8d9d3] bg-white px-4 py-3 text-[#1d5f71] outline-none focus:border-[#00887f] transition-all"
              />
              <button
                type="submit"
                className="rounded-[14px] bg-[#2C6975] px-5 py-3 text-white font-bold hover:bg-[#1f4655] transition-colors"
              >
                Search Location
              </button>
            </form>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-[14px] border border-[#b8d9d3] bg-white px-4 py-3 text-[#1d5f71] outline-none focus:border-[#00887f] transition-all"
            >
              <option value="">All Types</option>
              {["General", "Specialized", "Clinic", "Diagnostic", "Emergency"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-10 h-10 border-4 border-[#68B2A0] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : combinedHospitals.length === 0 ? (
            <div className="text-center py-20 text-[#4f7f89] font-medium">
              No hospitals found for your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {combinedHospitals.map((hospital, index) => {
                // Determine if it's an internal partner (has an _id) or a Geoapify result
                const isPartner = !!hospital._id;

                return (
                  <div
                    key={hospital._id || index}
                    onClick={() => handleCardClick(hospital)}
                    className="bg-white rounded-[24px] shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#e8f4f1] flex flex-col cursor-pointer hover:-translate-y-1"
                  >
                    {/* Card Image / Placeholder */}
                    {hospital.image ? (
                      <div className="h-[160px] overflow-hidden">
                        <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-[120px] bg-gradient-to-br from-[#e8f4f1] to-[#b8d9d3] flex items-center justify-center relative">
                        {/* Little badge to show it's a real-world map result */}
                        {!isPartner && (
                           <span className="absolute top-3 right-3 bg-white/80 text-[#2C6975] text-[10px] font-bold px-2 py-1 rounded">
                             Geoapify Radar
                           </span>
                        )}
                        <svg className="w-14 h-14 text-[#68B2A0]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
                        </svg>
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-[17px] font-bold text-[#1d5f71] leading-snug">
                          {hospital.name}
                        </h3>
                        {/* Partner badge or distance badge */}
                        {isPartner ? (
                          <span className={`text-[11px] font-bold px-2 py-1 rounded-full shrink-0 ${TYPE_COLORS[hospital.type] || "bg-gray-100 text-gray-600"}`}>
                            {hospital.type || "Partner"}
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2 py-1 rounded-full shrink-0">
                            {Math.round(hospital.distanceMeters)}m away
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[13px] text-[#4f7f89] mb-1">
                        📍 {hospital.address} {hospital.city ? `, ${hospital.city}` : ""}
                      </div>

                      <div className="mt-auto pt-4 text-[#2C6975] text-sm font-semibold flex items-center justify-end">
                        View on Map &rarr;
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Hospitals;