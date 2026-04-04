import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { blogController } from "../api/blogController";
import LeafDecor from "../components/LeafDecor";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchBlogs = async (pageNo = 1) => {
    setLoading(true);
    const res = await blogController.getAllBlogs({ page: pageNo, perpage: 9 });
    if (res.success && res.data?.[0]) {
      const { blogs: list, totalCount } = res.data[0];
      setBlogs(list || []);
      const count = totalCount?.[0]?.count || 0;
      setTotalPages(Math.ceil(count / 9) || 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const filteredBlogs = search
    ? blogs.filter(
        (b) =>
          b.title?.toLowerCase().includes(search.toLowerCase()) ||
          b.category?.toLowerCase().includes(search.toLowerCase()) ||
          b.author?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : blogs;

  return (
    <div className="min-h-screen bg-[#f4f9f7] pb-20 relative overflow-hidden">
      {/* Background decor */}
      <div className="absolute left-[-2%] top-[-2%] z-[0] w-[180px] -rotate-12 pointer-events-none opacity-60">
        <LeafDecor style={{ "--fill-0": "#005f56" }} />
      </div>
      <div className="absolute right-[-2%] bottom-[-5%] z-[0] w-[220px] rotate-[210deg] pointer-events-none opacity-40">
        <LeafDecor style={{ "--fill-0": "#003a46" }} />
      </div>

      <section className="relative z-10 pt-[60px]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-[clamp(30px,5vw,52px)] font-bold text-[#1d5f71] leading-tight">
              Health Blogs
            </h1>
            <p className="mt-3 text-[16px] font-medium text-[#4f7f89] max-w-xl mx-auto">
              Expert health articles written by our verified doctors
            </p>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex gap-3 max-w-xl mx-auto mb-12"
          >
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, category or doctor..."
              className="flex-1 rounded-[14px] border border-[#b8d9d3] bg-white px-4 py-3 text-[#1d5f71] outline-none focus:border-[#00887f] transition-all"
            />
            <button
              type="submit"
              className="rounded-[14px] bg-[#2C6975] px-6 py-3 text-white font-bold hover:bg-[#1f4655] transition-colors"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); setSearchInput(""); }}
                className="rounded-[14px] border border-[#7a9aa2] px-4 py-3 text-[#4f7f89] font-bold hover:bg-gray-100 transition-colors"
              >
                Clear
              </button>
            )}
          </form>

          {/* Blogs Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-10 h-10 border-4 border-[#68B2A0] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20 text-[#4f7f89] text-[18px] font-medium">
              No blogs found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredBlogs.map((blog) => (
                <Link
                  key={blog._id}
                  to={`/blogs/${blog._id}`}
                  className="no-underline group bg-white rounded-[24px] shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#e8f4f1] flex flex-col"
                >
                  <div className="h-[200px] overflow-hidden bg-[#e8f4f1]">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#68B2A0] to-[#2C6975]">
                        <svg className="w-16 h-16 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="inline-block mb-3 px-3 py-1 rounded-full bg-[#e8f4f1] text-[#2C6975] text-[12px] font-bold uppercase tracking-wide w-fit">
                      {blog.category}
                    </span>
                    <h3 className="text-[18px] font-bold text-[#1d5f71] mb-2 leading-snug group-hover:text-[#00887f] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-[14px] text-[#4f7f89] mb-4 line-clamp-3 flex-1">
                      {blog.shortDescription}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#e8f4f1]">
                      <span className="text-[13px] font-semibold text-[#2C6975]">
                        Dr. {blog.author?.name}
                      </span>
                      <span className="text-[12px] text-[#7a9aa2]">
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!search && totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2 rounded-[12px] border border-[#b8d9d3] text-[#2C6975] font-bold disabled:opacity-40 hover:bg-[#e8f4f1] transition-colors"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-[12px] font-bold transition-colors ${
                    p === page
                      ? "bg-[#2C6975] text-white"
                      : "border border-[#b8d9d3] text-[#2C6975] hover:bg-[#e8f4f1]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2 rounded-[12px] border border-[#b8d9d3] text-[#2C6975] font-bold disabled:opacity-40 hover:bg-[#e8f4f1] transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blogs;
