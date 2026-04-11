import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LeafDecor from "../components/LeafDecor";
import GlassCard from "../components/GlassCard";
import PillButton from "../components/PillButton";
import api from "../api/api";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [imageErrors, setImageErrors] = useState({}); // Track failed images
  const doctorsPerPage = 8;

  // Fetch specializations for the filter dropdown
  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        const res = await api.get("/specializations");
        if (res.data.success) setSpecializations(res.data.specializations);
      } catch (e) {
        console.error("Failed to fetch specializations:", e);
      }
    };
    fetchSpecs();
  }, []);

  // Fetch doctors with search/filter/sort/pagination
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        let params = `pageNo=${currentPage}&perpage=${doctorsPerPage}`;
        if (searchTerm) params += `&search=${encodeURIComponent(searchTerm)}`;
        if (specialty !== "All") params += `&specialization=${encodeURIComponent(specialty)}`;
        if (sortBy) params += `&sortBy=${sortBy}`;

        const res = await api.get(`/doctors?${params}`);
        if (res.data.success) {
          setDoctors(res.data.doctors);
          setPagination(res.data.pagination || {});
          // Reset image errors when new doctors load
          setImageErrors({});
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchDoctors, 400);
    return () => clearTimeout(debounce);
  }, [searchTerm, specialty, sortBy, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, specialty, sortBy]);

  const forestColors = ["#004b43", "#1b4332", "#007a71", "#2d6a4f"];

  // Helper function to get image source
  const getImageSrc = (doctor) => {
    const doctorId = doctor._id;
    
    // If this image has failed before, use avatar
    if (imageErrors[doctorId]) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user?.name || "Dr")}&background=00887f&color=fff&size=128&bold=true`;
    }
    
    // If there's a profileImage (Cloudinary URL), use it directly
    if (doctor.profileImage) {
      return doctor.profileImage;
    }
    
    // Fallback to avatar
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user?.name || "Dr")}&background=00887f&color=fff&size=128&bold=true`;
  };

  return (
    <div className="min-h-screen bg-[#f4f9f7] pb-32 relative overflow-hidden">
      {/* Background leaves */}
      <div className="absolute left-[-2%] top-[-2%] z-[0] w-[180px] -rotate-12 pointer-events-none opacity-80"><LeafDecor style={{ "--fill-0": "#005f56" }} /></div>
      <div className="absolute left-[8%] top-[12%] z-[0] w-[110px] rotate-[80deg] pointer-events-none opacity-20"><LeafDecor style={{ "--fill-0": "#00887f" }} /></div>
      <div className="absolute right-[2%] top-[18%] z-[0] w-[150px] rotate-[160deg] pointer-events-none opacity-40"><LeafDecor style={{ "--fill-0": "#00887f" }} /></div>
      <div className="absolute left-[-3%] top-[45%] z-[0] w-[200px] rotate-[15deg] pointer-events-none opacity-30"><LeafDecor style={{ "--fill-0": "#2d6a4f" }} /></div>
      <div className="absolute right-[-2%] bottom-[-5%] z-[0] w-[280px] rotate-[210deg] pointer-events-none opacity-60"><LeafDecor style={{ "--fill-0": "#003a46" }} /></div>
      <div className="absolute left-[5%] bottom-[8%] z-[0] w-[160px] rotate-[50deg] pointer-events-none opacity-25"><LeafDecor style={{ "--fill-0": "#004b43" }} /></div>

      {/* Header */}
      <section className="relative z-[10] pt-[60px] pb-[40px]">
        <h2 className="text-center text-[36px] md:text-[48px] font-black text-[#003a46] mb-[10px] tracking-tight px-4">
          Meet Our <span className="text-[#00887f]">Experts</span>
        </h2>

        <div className="max-w-[900px] mx-auto px-4 mt-10">
          <GlassCard className="flex flex-wrap items-center gap-3 p-5 rounded-[30px] border-white/80 bg-white/60 shadow-xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute right-[-15px] top-[-15px] z-[0] w-[80px] rotate-12 pointer-events-none">
              <LeafDecor style={{ "--fill-0": "#2d6a4f" }} />
            </div>
            {/* Search */}
            <input
              type="text"
              placeholder="Search by name..."
              className="relative z-[1] flex-1 min-w-[160px] bg-white/90 border-2 border-[#00887f]/10 rounded-full px-5 py-3 outline-none focus:border-[#00887f] text-[#003a46] font-semibold text-[14px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Specialty filter */}
            <select
              className="relative z-[1] bg-white/90 border-2 border-[#00887f]/10 rounded-full px-4 py-3 outline-none text-[#003a46] font-bold cursor-pointer text-[14px]"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              <option value="All">All Specialties</option>
              {specializations.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {/* Sort */}
            <select
              className="relative z-[1] bg-white/90 border-2 border-[#00887f]/10 rounded-full px-4 py-3 outline-none text-[#003a46] font-bold cursor-pointer text-[14px]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="fees_asc">Fees: Low to High</option>
              <option value="fees_desc">Fees: High to Low</option>
              <option value="experience_asc">Experience: Low</option>
              <option value="experience_desc">Experience: High</option>
            </select>
          </GlassCard>
        </div>
      </section>

      {/* Stats bar */}
      {pagination.totalDoctors > 0 && (
        <div className="relative z-[10] max-w-[900px] mx-auto px-4 mb-4">
          <p className="text-[13px] font-bold text-[#4f7f89]">
            Showing {doctors.length} of {pagination.totalDoctors} doctors
            {specialty !== "All" && ` in ${specialty}`}
          </p>
        </div>
      )}

      {/* Doctor Grid */}
      <div className="relative z-[20] max-w-[900px] mx-auto px-4 mt-2 grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-16 font-black text-[#00887f] text-[18px]">
            <div className="flex justify-center gap-2 mb-3">
              {[0,1,2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-[#00887f] animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
            </div>
            Syncing experts...
          </div>
        ) : doctors.length > 0 ? (
          doctors.map((doc, index) => (
            <div key={doc._id} className="relative group">
              {/* Leaf accents */}
              <div className={`absolute ${index % 2 === 0 ? "-right-4 -top-6" : "-left-6 bottom-[-10px] scale-x-[-1]"} z-[0] pointer-events-none w-[100px] group-hover:rotate-12 transition-all duration-700`}>
                <LeafDecor style={{ "--fill-0": forestColors[index % 4], opacity: index % 2 === 0 ? "0.7" : "0.5" }} />
              </div>

              <GlassCard className="relative z-[1] p-6 md:p-[30px] rounded-[40px] border-white/70 bg-white/50 backdrop-blur-[30px] shadow-lg hover:-translate-y-1 transition-all duration-500">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-[30px] text-center md:text-left">
                  {/* Avatar */}
                  <div className="w-[80px] h-[80px] md:w-[90px] md:h-[90px] rounded-full overflow-hidden shrink-0 border-[4px] border-white shadow-lg bg-gray-100">
                    <img
                      src={getImageSrc(doc)}
                      alt={doc.user?.name}
                      className="w-full h-full object-cover"
                      onError={() => {
                        // Mark this image as failed and force re-render
                        setImageErrors(prev => ({
                          ...prev,
                          [doc._id]: true
                        }));
                      }}
                    />
                  </div>

                  <div className="flex-1 w-full flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                          <h2 className="text-[20px] md:text-[24px] font-black text-[#003a46] leading-tight">{doc.user?.name}</h2>
                          {doc.verified && (
                            <span title="Verified" className="text-green-500">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.25.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-2 justify-center md:justify-start">
                          <span className="text-[11px] font-extrabold text-[#00887f] uppercase tracking-wider bg-[#00887f]/10 px-3 py-1 rounded-lg">{doc.specialization}</span>
                          <span className="text-[11px] font-bold text-[#4f7f89] bg-white/60 px-3 py-1 rounded-lg">{doc.experience} Yrs Exp</span>
                        </div>
                      </div>
                      <Link to={`/doctor/${doc._id}`}>
                        <PillButton className="px-6 py-3 text-[13px] font-bold shadow-xl shadow-[#00887f]/20 whitespace-nowrap">
                          View Profile
                        </PillButton>
                      </Link>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 justify-center md:justify-start text-[13px]">
                      <span className="text-[#4f7f89] font-semibold">🏥 {doc.hospital}</span>
                      <span className="text-[#046ea3] font-black">${doc.fees} / visit</span>
                      {doc.user?.phone && (
                        <span className="text-[#4f7f89] font-semibold">📞 {doc.user.phone}</span>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-[#4f7f89]">
            <p className="text-[20px] font-black mb-2">No doctors found</p>
            <p className="text-[14px] font-semibold">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="relative z-[30] flex justify-center items-center gap-4 mt-16 flex-wrap px-4">
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-6 py-2 rounded-full font-bold transition-all text-[14px] ${!pagination.hasPrevPage ? "opacity-30 cursor-not-allowed grayscale bg-white" : "bg-white text-[#00887f] shadow-md hover:bg-[#00887f] hover:text-white"}`}
          >
            ← Prev
          </button>

          <div className="flex gap-2">
            {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-full font-black text-[13px] transition-all ${currentPage === page ? "bg-[#00887f] text-white shadow-lg" : "bg-white text-[#003a46] shadow hover:bg-[#00887f]/10"}`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            disabled={!pagination.hasNextPage}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-6 py-2 rounded-full font-bold transition-all text-[14px] ${!pagination.hasNextPage ? "opacity-30 cursor-not-allowed grayscale bg-white" : "bg-white text-[#00887f] shadow-md hover:bg-[#00887f] hover:text-white"}`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;