import { useEffect, useState } from "react";
import { getReviewsAPI } from "../../services/allAPIs";
import { Star, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { serverURL } from "../../services/serverURL";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 5;

  const totalPages = Math.max(1, Math.ceil(reviews.length / limit));

  /*FETCH */

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getReviewsAPI();
      if (Array.isArray(res?.data)) {
        setReviews(res.data);
        setPage(1); // reset page safely
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const paginatedReviews = reviews.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 min-h-[700px] flex flex-col">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          User Reviews
        </h2>
      </div>

      {/* CONTENT */}
      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-blue-500" />
          </div>
        ) : paginatedReviews.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-20">
            No reviews available
          </p>
        ) : (
          <ul className="space-y-4">
            {paginatedReviews.map((rev) => (
              <li
                key={rev._id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {rev.userImage ? (
                      <img
                        src={`${serverURL}/uploads/${rev.userImage}`}
                        alt={rev.username}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold border">
                        {rev.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {rev.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* STARS */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i <= rev.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 italic">
                  “{rev.review}”
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-500 hover:text-white disabled:opacity-40 transition"
            >
              <ChevronLeft size={18} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg font-semibold transition ${
                  page === i + 1
                    ? "bg-blue-500 text-white shadow"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-500 hover:text-white disabled:opacity-40 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
