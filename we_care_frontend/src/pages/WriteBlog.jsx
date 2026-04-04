import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { blogController } from "../api/blogController";
import LeafDecor from "../components/LeafDecor";
import GlassCard from "../components/GlassCard";

const CATEGORIES = [
  "General Health",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Gynecology",
  "Oncology",
  "Nutrition",
  "Fitness",
  "Mental Health",
  "Diabetes",
  "Other",
];

const WriteBlog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
 const isDoctor = user?.isDoctor === true || localStorage.getItem("userRole") === "doctor";

  const [form, setForm] = useState({
    title: "",
    category: "",
    image: "",
    shortDescription: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // If not a doctor, show access denied
  if (!isDoctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f9f7] gap-4 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-2">
          <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <h2 className="text-[24px] font-bold text-[#1d5f71]">Access Denied</h2>
        <p className="text-[#4f7f89] max-w-sm">
          Only verified doctors can write blogs on WeCare.
        </p>
        <button
          onClick={() => navigate("/blogs")}
          className="mt-4 px-6 py-3 rounded-[14px] bg-[#2C6975] text-white font-bold hover:bg-[#1f4655] transition-colors"
        >
          Browse Blogs
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.category || !form.shortDescription || !form.description) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await blogController.createBlog({
        title: form.title,
        category: form.category,
        image: form.image,
        shortDescription: form.shortDescription,
        description: form.description,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate("/blogs"), 2000);
      } else {
        setError(res.message || "Failed to publish blog.");
      }
    } catch  {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-[16px] border border-[#b8d9d3] bg-white px-4 py-3 text-[#1d5f71] outline-none focus:border-[#00887f] transition-all placeholder:text-[#a0bec6]";

  return (
    <div className="min-h-screen bg-[#f4f9f7] pb-20 relative overflow-hidden">
      <div className="absolute left-[-2%] top-[-2%] z-[0] w-[180px] -rotate-12 pointer-events-none opacity-60">
        <LeafDecor style={{ "--fill-0": "#005f56" }} />
      </div>
      <div className="absolute right-[-2%] bottom-[-5%] z-[0] w-[220px] rotate-[210deg] pointer-events-none opacity-40">
        <LeafDecor style={{ "--fill-0": "#003a46" }} />
      </div>

      <section className="relative z-10 pt-[60px]">
        <div className="max-w-[860px] mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-[clamp(28px,4vw,42px)] font-bold text-[#1d5f71]">
              Write a Blog
            </h1>
            <p className="mt-2 text-[15px] font-medium text-[#4f7f89]">
              Share your medical knowledge and insights with patients.
            </p>
          </div>

          {success ? (
            <GlassCard className="rounded-[32px] bg-white/80 px-8 py-12 text-center shadow-xl">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </div>
              <h2 className="text-[24px] font-bold text-[#1d5f71] mb-2">
                Blog Published!
              </h2>
              <p className="text-[#4f7f89]">Redirecting you to blogs...</p>
            </GlassCard>
          ) : (
            <GlassCard className="rounded-[32px] border-white/80 bg-white/70 px-5 py-8 shadow-xl backdrop-blur-xl md:px-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-[14px] px-4 py-3 text-red-600 text-[14px] font-medium">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block mb-2 text-[14px] font-bold text-[#2C6975]">
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter an engaging title..."
                    className={inputCls}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-[14px] font-bold text-[#2C6975]">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className={inputCls}
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-[14px] font-bold text-[#2C6975]">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://..."
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-[14px] font-bold text-[#2C6975]">
                    Short Description *
                    <span className="ml-2 text-[12px] font-normal text-[#7a9aa2]">
                      (shown in blog cards)
                    </span>
                  </label>
                  <textarea
                    name="shortDescription"
                    value={form.shortDescription}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Write a brief summary of your blog..."
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-[14px] font-bold text-[#2C6975]">
                    Full Content *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={12}
                    placeholder="Write your full blog content here..."
                    className={`${inputCls} leading-relaxed`}
                  />
                </div>

                {/* Preview of image */}
                {form.image && (
                  <div className="rounded-[16px] overflow-hidden border border-[#b8d9d3] max-h-[220px]">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                )}

                <div className="flex gap-4 mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`rounded-[14px] bg-gradient-to-r from-[#2C6975] to-[#68B2A0] px-8 py-3 text-white font-bold shadow-md transition-all hover:opacity-90 ${
                      loading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Publishing..." : "Publish Blog"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/blogs")}
                    className="rounded-[14px] border border-[#7a9aa2] px-6 py-3 text-[#4f7f89] font-bold hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </GlassCard>
          )}
        </div>
      </section>
    </div>
  );
};

export default WriteBlog;
