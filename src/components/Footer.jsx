import { useState } from "react";
import { Sprout, Star, Send, ArrowRight } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import { postReviewAPI } from "../services/allAPIs";
import { useNavigate } from "react-router-dom";
export default function AppFooter() {
  const navigate = useNavigate();
  const { user } = useUser();
  const isLoggedIn = Boolean(user);
  const token = sessionStorage.getItem("token");

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Submit review to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review || rating === 0) return;

    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const reqBody = { review, rating };

      const res = await postReviewAPI(reqHeader, reqBody);

      if (res?.status === 200 || res?.status === 201) {
        console.log("Review submitted successfully", res.data);
        setSubmitted(true);
        setReview("");
        setRating(0);
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        console.error("Unexpected response", res);
      }
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  const footerLinks = [
    {
      title: "For Investors",
      links: ["Browse Proposals", "How It Works", "Dashboard", "FAQ"],
    },
    {
      title: "For Farmers",
      links: [
        "Start a Proposal",
        "Farmer Dashboard",
        "Success Stories",
        "Resources",
      ],
    },
    {
      title: "Company",
      links: ["About Us", "Contact", "Privacy Policy", "Terms of Service"],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-gray-200 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-40 dark:via-green-400" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6 group cursor-default">
              <div className="p-2.5 bg-green-500 rounded-2xl shadow-lg shadow-green-500/20 transition-transform group-hover:rotate-12">
                <Sprout className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white dark:text-green-300">
                FarmFund
              </h2>
            </div>
            <p className="text-gray-300/80 leading-relaxed mb-8 max-w-sm dark:text-gray-400">
              Bridging the gap between conscious investors and sustainable
              agriculture. Your capital, their growth, our shared future.
            </p>
            <div className="flex gap-5">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-full border border-white/10 hover:border-green-400 hover:bg-green-500 hover:text-white transition-all duration-300 cursor-pointer text-gray-400 dark:text-gray-400 dark:hover:border-green-400 dark:hover:bg-green-600"
                  >
                    <Icon size={18} />
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs dark:text-green-200">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li
                      key={link}
                      className="text-sm text-gray-400 hover:text-green-400 transition-colors cursor-pointer w-fit relative group dark:text-gray-300 dark:hover:text-green-300"
                    >
                      {link}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 transition-all group-hover:w-full" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Review Section */}
          <div className="lg:col-span-3">
            {isLoggedIn ? (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl dark:bg-gray-800/30 dark:border-gray-700">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2 dark:text-green-200">
                  Feedback{" "}
                  <span className="w-1 h-1 rounded-full bg-green-400" />
                </h3>

                {submitted ? (
                  <div className="py-4 text-center animate-in fade-in zoom-in duration-300">
                    <div className="bg-green-500/20 text-green-400 p-3 rounded-xl text-sm border border-green-500/30">
                      Review shared successfully!
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                      className="w-full p-3 rounded-xl bg-black/20 dark:bg-gray-700/30 border border-white/10 dark:border-gray-600 text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none text-sm transition-all"
                      placeholder="How's your experience?"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center justify-between ">
                      <div className="flex gap-1 ">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            size={18}
                            onMouseEnter={() => setHoverRating(i)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(i)}
                            className={`cursor-pointer transition-transform transform hover:scale-125 ${
                              i <= (hoverRating || rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-100 dark:text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        type="submit"
                        disabled={!review || rating === 0}
                        className="bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 text-white p-2 rounded-lg transition-all active:scale-95 dark:hover:bg-green-400"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="relative group overflow-hidden rounded-2xl border border-emerald-500/20 dark:border-white/10 transition-all duration-500 hover:border-emerald-500/40">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative bg-white/60 dark:bg-gray-800/40 backdrop-blur-md p-6 text-center flex flex-col items-center justify-center gap-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                    <Sprout size={18} />
                  </div>

                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed max-w-[240px]">
                    Join our community to{" "}
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      leave a review
                    </span>{" "}
                    and impact the future of farming.
                  </p>

                  <button
                    onClick={() => navigate("/register")}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:gap-2.5 transition-all"
                  >
                    GET STARTED <ArrowRight size={14} />
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-emerald-500 group-hover:w-full transition-all duration-700" />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 dark:border-gray-700 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-400 dark:text-gray-300">
          <p>© 2026 FarmFund Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="hover:text-green-400 cursor-pointer">
              Security
            </span>
            <span className="hover:text-green-400 cursor-pointer">Sitemap</span>
            <span className="hover:text-green-400 cursor-pointer">
              Cookie Prefs
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
