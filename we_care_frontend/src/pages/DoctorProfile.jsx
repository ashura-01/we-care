import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LeafDecor from "../components/LeafDecor";
import GlassCard from "../components/GlassCard";
import PillButton from "../components/PillButton";
import { useAuth } from "../contexts/AuthContext";
import { reviewController } from "../api/reviewController";
import api from "../api/api";

const StarRating = ({ value, onChange, readonly = false }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        disabled={readonly}
        onClick={() => !readonly && onChange && onChange(star)}
        className={`text-[22px] transition-all ${star <= value ? "text-yellow-400" : "text-gray-300"} ${!readonly ? "hover:text-yellow-300 cursor-pointer" : "cursor-default"}`}
      >
        ★
      </button>
    ))}
  </div>
);

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");

  const fetchDoctor = async () => {
    try {
      const res = await api.get(`/doctors/${id}`);
      if (res.data.success) {
        setDoctor(res.data.doctor);
        setReviews(res.data.doctor.reviews || []);
      }
    } catch (err) {
      console.error("Error fetching doctor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewLoading(true);
    setReviewMsg("");

    const result = await reviewController.createReview(id, {
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    if (result.success) {
      setReviewMsg("Review submitted! Thank you.");
      setReviewComment("");
      setReviewRating(5);
      // Re-fetch to get updated reviews
      fetchDoctor();
    } else {
      setReviewMsg(result.message || "Failed to submit review.");
    }
    setReviewLoading(false);
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null;

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="flex gap-2">
          {[0,1,2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-[#00887f] animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
        </div>
        <p className="font-bold text-[#00887f]">Loading Specialist...</p>
      </div>
    );

  if (!doctor)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[18px] font-bold text-[#4f7f89]">Doctor profile not found.</p>
        <PillButton onClick={() => navigate("/doctors")} className="px-8 py-3">Back to Doctors</PillButton>
      </div>
    );

  const imageUrl = doctor.profileImage
    ? `http://localhost:5600/${doctor.profileImage}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user?.name || "Dr")}&background=00887f&color=fff&size=256`;

  return (
    <div className="min-h-screen bg-[#f4f9f7] relative overflow-hidden p-4 md:p-8">
      {/* Background leaves */}
      <div className="absolute left-[-5%] top-[-5%] w-[300px] opacity-10 rotate-45 pointer-events-none"><LeafDecor style={{ "--fill-0": "#00887f" }} /></div>
      <div className="absolute right-[-3%] bottom-[-3%] w-[250px] opacity-15 rotate-[200deg] pointer-events-none"><LeafDecor style={{ "--fill-0": "#003a46" }} /></div>

      <div className="max-w-5xl mx-auto relative z-10 pt-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-[#00887f] font-black flex items-center gap-2 hover:-translate-x-1 transition-transform text-[15px]"
        >
          ← Back to Doctors
        </button>

        {/* Main card */}
        <GlassCard className="p-6 md:p-10 rounded-[40px] md:rounded-[50px] border-white/70 bg-white/60 backdrop-blur-3xl shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12">

            {/* Left: Photo + Fee */}
            <div className="lg:w-1/3 flex flex-col items-center gap-5">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-[30px] md:rounded-[40px] overflow-hidden border-[8px] md:border-[10px] border-white shadow-2xl">
                <img
                  src={imageUrl}
                  alt={doctor.user?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user?.name || "Dr")}&background=00887f&color=fff&size=256`; }}
                />
              </div>

              {/* Fee card */}
              <div className="w-full bg-gradient-to-br from-[#00887f] to-[#046ea3] p-5 rounded-3xl text-white shadow-lg text-center">
                <p className="text-[11px] font-black opacity-80 uppercase tracking-widest mb-1">Consultation Fee</p>
                <p className="text-[38px] font-black">${doctor.fees}</p>
              </div>

              {/* Rating summary */}
              {avgRating && (
                <div className="w-full bg-white/50 border border-white/80 p-4 rounded-3xl text-center shadow">
                  <p className="text-[11px] font-black uppercase text-[#00887f] mb-1">Patient Rating</p>
                  <p className="text-[32px] font-black text-[#003a46]">{avgRating}</p>
                  <StarRating value={Math.round(avgRating)} readonly />
                  <p className="text-[11px] text-[#4f7f89] font-bold mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
                </div>
              )}

              {/* Contact info */}
              <div className="w-full bg-white/50 border border-white/80 p-4 rounded-3xl shadow space-y-2">
                <p className="text-[11px] font-black uppercase text-[#00887f] mb-2">Contact</p>
                {doctor.user?.email && <p className="text-[13px] font-bold text-[#003a46] truncate">✉ {doctor.user.email}</p>}
                {doctor.user?.phone && <p className="text-[13px] font-bold text-[#003a46]">📞 {doctor.user.phone}</p>}
              </div>
            </div>

            {/* Right: Info */}
            <div className="lg:w-2/3 flex flex-col gap-6">
              {/* Name + specialty */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="bg-[#00887f]/10 text-[#00887f] px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wide">
                    {doctor.specialization}
                  </span>
                  {doctor.verified && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[11px] font-black flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.25.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
                <h1 className="text-[36px] md:text-[44px] font-black text-[#003a46] leading-tight mb-1">{doctor.user?.name}</h1>
                <p className="text-[18px] text-[#4f7f89] font-bold">🏥 {doctor.hospital}</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white/50 p-4 rounded-2xl border border-white/80">
                  <p className="text-[10px] text-[#00887f] font-black uppercase mb-1">Experience</p>
                  <p className="text-[24px] font-black text-[#003a46]">{doctor.experience}<span className="text-[14px] font-bold text-[#4f7f89]"> yrs</span></p>
                </div>
                <div className="bg-white/50 p-4 rounded-2xl border border-white/80">
                  <p className="text-[10px] text-[#00887f] font-black uppercase mb-1">Reviews</p>
                  <p className="text-[24px] font-black text-[#003a46]">{reviews.length}</p>
                </div>
                <div className="bg-white/50 p-4 rounded-2xl border border-white/80">
                  <p className="text-[10px] text-[#00887f] font-black uppercase mb-1">Status</p>
                  <p className={`text-[16px] font-black ${doctor.verified ? "text-green-600" : "text-yellow-600"}`}>
                    {doctor.verified ? "Verified" : "Pending"}
                  </p>
                </div>
              </div>

              {/* Reviews section */}
              <div>
                <h3 className="text-[22px] font-black text-[#003a46] mb-4">
                  Patient Feedback ({reviews.length})
                </h3>

                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {reviews.length > 0 ? (
                    reviews.map((rev, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/40 border border-white/70">
                        <div className="flex items-center justify-between mb-1">
                          <StarRating value={rev.rating} readonly />
                          <span className="text-[11px] text-[#4f7f89] font-bold">{rev.rating}/5</span>
                        </div>
                        {rev.comment && <p className="text-[13px] text-[#4f7f89] italic mt-1">"{rev.comment}"</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-[#4f7f89] italic text-[14px]">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </div>

              {/* Leave a review */}
              {user && (
                <div className="bg-white/40 border border-white/70 p-5 rounded-3xl">
                  <h4 className="text-[16px] font-black text-[#003a46] mb-3">Leave a Review</h4>
                  <form onSubmit={handleSubmitReview} className="space-y-3">
                    <div>
                      <p className="text-[11px] font-bold text-[#4f7f89] uppercase mb-2">Your Rating</p>
                      <StarRating value={reviewRating} onChange={setReviewRating} />
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={3}
                      placeholder="Share your experience..."
                      className="w-full resize-none bg-white/80 border-2 border-[#00887f]/20 focus:border-[#00887f] rounded-2xl px-4 py-3 text-[13px] font-semibold text-[#003a46] outline-none transition-all"
                    />
                    {reviewMsg && (
                      <p className={`text-[12px] font-bold ${reviewMsg.includes("Thank") ? "text-green-600" : "text-red-500"}`}>{reviewMsg}</p>
                    )}
                    <PillButton type="submit" disabled={reviewLoading || !reviewComment.trim()} className="px-6 py-3 text-[13px] disabled:opacity-50">
                      {reviewLoading ? "Submitting..." : "Submit Review"}
                    </PillButton>
                  </form>
                </div>
              )}

              <PillButton className="px-10 py-4 text-[16px] shadow-xl shadow-[#00887f]/20 self-start">
                Book Appointment
              </PillButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default DoctorProfile;
