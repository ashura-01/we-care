import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { blogController } from "../api/blogController";
import LeafDecor from "../components/LeafDecor";

const BlogDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      const res = await blogController.getBlogById(id);
      if (res.success) setData(res.data);
      setLoading(false);
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f4f9f7]">
        <div className="w-12 h-12 border-4 border-[#68B2A0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data?.blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f9f7] gap-4">
        <p className="text-[#4f7f89] text-xl font-semibold">Blog not found.</p>
        <Link to="/blogs" className="text-[#2C6975] font-bold hover:underline">
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  const { blog, comments } = data;

  return (
    <div className="min-h-screen bg-[#f4f9f7] pb-20 relative overflow-hidden">
      <div className="absolute left-[-2%] top-[-2%] z-[0] w-[180px] -rotate-12 pointer-events-none opacity-40">
        <LeafDecor style={{ "--fill-0": "#005f56" }} />
      </div>

      <section className="relative z-10 pt-[60px]">
        <div className="max-w-[860px] mx-auto px-4 md:px-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-[#2C6975] font-bold mb-8 hover:text-[#1f4655] transition-colors no-underline"
          >
            ← Back to Blogs
          </Link>

          {/* Category badge */}
          <span className="inline-block mb-4 px-3 py-1 rounded-full bg-[#e8f4f1] text-[#2C6975] text-[12px] font-bold uppercase tracking-wide">
            {blog.category}
          </span>

          <h1 className="text-[clamp(26px,4vw,42px)] font-bold text-[#1d5f71] mb-4 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#68B2A0] to-[#2C6975] flex items-center justify-center text-white text-sm font-bold">
              {blog.author?.name?.[0]?.toUpperCase() || "D"}
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#2C6975]">
                Dr. {blog.author?.name}
              </p>
              <p className="text-[12px] text-[#7a9aa2]">
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Cover Image */}
          {blog.image && (
            <div className="w-full rounded-[24px] overflow-hidden mb-10 shadow-lg">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full max-h-[420px] object-cover"
              />
            </div>
          )}

          {/* Short description */}
          {blog.shortDescription && (
            <p className="text-[17px] font-semibold text-[#2C6975] mb-6 leading-relaxed border-l-4 border-[#68B2A0] pl-4 bg-[#e8f4f1] py-3 rounded-r-[12px]">
              {blog.shortDescription}
            </p>
          )}

          {/* Main content */}
          <div className="prose prose-lg max-w-none text-[#3a6070] leading-relaxed whitespace-pre-wrap text-[16px] bg-white rounded-[24px] p-6 md:p-10 shadow-md">
            {blog.description}
          </div>

          {/* Comments section */}
          {comments && comments.length > 0 && (
            <div className="mt-12">
              <h2 className="text-[22px] font-bold text-[#1d5f71] mb-6">
                Comments ({comments.length})
              </h2>
              <div className="flex flex-col gap-4">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-white rounded-[18px] p-5 shadow-sm border border-[#e8f4f1]"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#e8f4f1] flex items-center justify-center text-[#2C6975] font-bold text-sm">
                        {comment.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#2C6975]">
                          {comment.name}
                        </p>
                        <p className="text-[11px] text-[#7a9aa2]">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-[15px] text-[#4f7f89]">{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
