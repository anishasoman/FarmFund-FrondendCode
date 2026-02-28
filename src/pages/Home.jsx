import React from "react";
import { Button, Card } from "flowbite-react";

import { HiArrowRight, HiTrendingUp } from "react-icons/hi";
import { HiOutlineSearch, HiOutlineUserAdd } from "react-icons/hi";

import { PiChartLineUpBold, PiCoinsBold } from "react-icons/pi";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sprout } from "lucide-react";
import FeaturedProposals from "../components/FeaturedProposals";
// import ProposalCard from "../components/ProposalCard";
import { HomeProposalsAPI } from "../services/allAPIs";
import { useNavigate } from "react-router-dom";
import { Star, Quote, Gift, Lock, TrendingUp } from "lucide-react";
import { Tractor, ShieldCheck } from "lucide-react";
import { getReviewsAPI } from "../services/allAPIs";
import { serverURL } from "../services/serverURL";
import heroImage from "../assets/heroimage.jpg"
import homeimage from "../assets/home1.jpg"
function Home() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const token = sessionStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchHomeReviews = async () => {
      try {
        const res = await getReviewsAPI();
        if (res?.data) {
          // Get the 3 most recent reviews
          const latestReviews = res.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3);
          setReviews(latestReviews);
        }
      } catch (err) {
        console.error("Error loading reviews:", err);
      }
    };
    fetchHomeReviews();
  }, []);
  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await HomeProposalsAPI();

      if (res.status === 200 && res.data?.proposals) {
        setProposals(res.data.proposals);
      }
    } catch (error) {
      console.error("Fetch proposals error:", error);
    }
  };

  return (
    <div className="dark:bg-gray-900 bg-[#FAF9F6] min-h-screen">
      <div
        className="relative overflow-hidden 
  bg-gradient-to-r from-green-600 via-yellow-500 to-green-600
  dark:from-gray-950 dark:via-gray-900 dark:to-gray-950
  py-3 border-y border-white/10"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-white/5 dark:bg-green-500/5 blur-2xl opacity-30"></div>

        <div
          className="relative flex gap-20 animate-ticker hover:[animation-play-state:paused] 
    text-white dark:text-green-400 font-semibold tracking-wide"
        >
          <span className="flex items-center gap-2">
            <Sprout size={18} className="text-green-200 dark:text-green-400" />
            Empowering Farmers Across India
          </span>

          <span className="flex items-center gap-2">
            <TrendingUp
              size={18}
              className="text-emerald-200 dark:text-emerald-400"
            />
            Earn Up To 18% Sustainable Returns
          </span>

          <span className="flex items-center gap-2">
            <Tractor
              size={18}
              className="text-yellow-200 dark:text-yellow-400"
            />
            250+ Active Agricultural Projects
          </span>

          <span className="flex items-center gap-2">
            <ShieldCheck
              size={18}
              className="text-green-200 dark:text-green-500"
            />
            100% Transparent & Secure Platform
          </span>

          {/* Duplicate for seamless loop */}
          <span className="flex items-center gap-2">
            <Sprout size={18} className="text-green-200 dark:text-green-400" />
            Empowering Farmers Across India
          </span>

          <span className="flex items-center gap-2">
            <TrendingUp
              size={18}
              className="text-emerald-200 dark:text-emerald-400"
            />
            Earn Up To 18% Sustainable Returns
          </span>
        </div>
      </div>

      {/* hero section  */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[4000ms] scale-105 hover:scale-110"
          style={{
            backgroundImage:
              `url(${heroImage})`,
          }}
        />

        {/* Green Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/90 via-emerald-800/80 to-emerald-900/90 dark:from-gray-900/95 dark:via-gray-900/85 dark:to-gray-900/95" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl px-6 text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-700/60 backdrop-blur-md px-4 py-2 rounded-full mb-6 hover:bg-emerald-700/80 transition">
            <Sprout size={18} className="text-yellow-300" />
            <span className="text-sm font-medium">
              Empowering Farmers, Growing Wealth
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-serif font-semibold leading-tight mb-6">
            Invest in Agriculture,{" "}
            <span className="text-yellow-400">Harvest Returns</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-emerald-100 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            Connect directly with farmers, fund sustainable agriculture
            projects, and earn attractive returns while supporting rural
            communities.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate("/working")}
              className="group bg-yellow-400 text-emerald-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-yellow-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full sm:w-auto"
            >
              Start Investing
            </button>

            {!isLoggedIn && (
              <button
                onClick={() => navigate("/register")}
                className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold border border-white/40 text-white hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                I'm a Farmer
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Partner Farming Section */}
      <section className="w-full px-6 py-16">
        <div className="max-w-7xl mx-auto bg-linear-to-br from-green-900 via-green-800 to-green-700 dark:from-green-800 dark:via-green-700 dark:to-green-600 rounded-3xl text-white p-12 md:p-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Text Block */}
            <div>
              {/* Tag */}
              <div className="inline-flex items-center gap-2 bg-green-700/50 px-4 py-1 rounded-full text-sm font-medium">
                <HiTrendingUp className="text-lg" />
                Partner Farming
              </div>

              {/* Title */}
              <h2 className="mt-6 text-5xl font-bold leading-tight">
                Invest in Agriculture, <br />
                <span className="text-yellow-400">Grow Together</span>
              </h2>

              {/* Description */}
              <p className="mt-6 text-lg text-green-100 max-w-md">
                Become a farm partner. Fund crops directly and earn returns
                through profit sharing, discounted produce, and priority access.
              </p>

              {/* Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
                {!isLoggedIn && (
                  <Button
                    onClick={() => navigate("/register")}
                    className="bg-yellow-400 text-black hover:bg-yellow-500 px-6 py-3 rounded-lg text-lg flex items-center gap-2 w-full sm:w-auto"
                  >
                    Start Investing <HiArrowRight />
                  </Button>
                )}

                <button
                  onClick={() => navigate("/working")}
                  className="text-white hover:underline text-lg text-center sm:text-left"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Feature Cards Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-green-600/20 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
                <div className="w-10 h-10 flex items-center justify-center bg-yellow-400 text-black rounded-xl mb-4">
                  %
                </div>
                <h3 className="font-semibold text-xl">Profit Share</h3>
                <p className="text-green-100 text-sm mt-2">
                  Earn 12–20% returns on successful harvests
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-green-600/20 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
                <div className="w-10 h-10 flex items-center justify-center bg-yellow-400 text-black rounded-xl mb-4">
                  <Gift size={20} />
                </div>
                <h3 className="font-semibold text-xl">Discounted Produce</h3>
                <p className="text-green-100 text-sm mt-2">
                  Get fresh produce at 15–30% below market
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-green-600/20 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
                <div className="w-10 h-10 flex items-center justify-center bg-yellow-400 text-black rounded-xl mb-4">
                  <Star size={20} />
                </div>
                <h3 className="font-semibold text-xl">Priority Access</h3>
                <p className="text-green-100 text-sm mt-2">
                  First dibs on premium seasonal produce
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-green-600/20 backdrop-blur-sm border border-white/10 p-6 rounded-2xl">
                <div className="w-10 h-10 flex items-center justify-center bg-yellow-400 text-black rounded-xl mb-4">
                  <Lock size={20} />
                </div>
                <h3 className="font-semibold text-xl">Low Risk Options</h3>
                <p className="text-green-100 text-sm mt-2">
                  Choose verified farms with proven track record
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  FEATURED / LATEST PROPOSALS */}
      <section className="py-20 bg-[#FAF9F2] dark:bg-gray-900 transition-colors">
        <FeaturedProposals proposals={proposals} />
      </section>
      
      <section className="bg-[#faf9f5] dark:bg-gray-950 py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <h2 className="text-4xl font-serif font-semibold text-emerald-900 dark:text-white">
              Why Invest with FarmFund?
            </h2>

            <ul className="space-y-4">
              {[
                "Verified and vetted farming projects",
                "Transparent progress updates from farmers",
                "Attractive returns of 15–30% annually",
                "Support sustainable agriculture",
                "Diversify your investment portfolio",
                "Direct impact on rural communities",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-700 dark:text-gray-300 transition-all duration-300 hover:translate-x-1"
                >
                  <span className="mt-1 text-yellow-500">✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {!isLoggedIn && (
              <button
                onClick={() => navigate("/register")}
                className="mt-6 bg-emerald-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-300 hover:shadow-lg hover:scale-105 w-full sm:w-auto"
              >
                Start Your Journey
              </button>
            )}
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-xl group">
              <img
                src={homeimage}
                alt="Farming"
                className="w-full h-[420px] object-cover transition-transform duration-[4000ms] group-hover:scale-110"
              />

              {/* Soft overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
            </div>

            {/* Floating Stat Card */}
            <div className="absolute -bottom-6 left-6 bg-white dark:bg-gray-900 rounded-xl px-5 py-4 shadow-lg flex items-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="bg-yellow-400 text-emerald-900 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Avg. Returns
                </p>
                <p className="text-lg font-semibold text-emerald-900 dark:text-white">
                  22% / Year
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* how it works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {/* Title & Subtitle */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            Whether you're investing in farms or growing crops, we make the
            process simple and transparent.
          </p>
        </div>

        {/* investors  */}
        <div className="mt-14 bg-white dark:bg-gray-800/40 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-gray-800 shadow-sm">
          {/* Section Heading */}
          <div className="flex items-center justify-center gap-3 mb-16">
            <span className="bg-yellow-800 text-white p-3 rounded-2xl shadow-lg shadow-purple-200 dark:shadow-none">
              <PiChartLineUpBold size={24} />
            </span>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              For Investors
            </h3>
          </div>

          {/* Steps Grid/List */}
          <div className="flex flex-col items-center max-w-xl mx-auto">
            {[
              {
                icon: <HiOutlineUserAdd size={22} />,
                title: "Join Platform",
                desc: "Register as an investor with quick KYC verification to get started.",
                last: false,
              },
              {
                icon: <HiOutlineSearch size={22} />,
                title: "Browse Projects",
                desc: "Explore verified farming projects with detailed risk ratings and projections.",
                last: false,
              },
              {
                icon: <PiChartLineUpBold size={22} />,
                title: "Invest & Track",
                desc: "Fund your chosen farms and track growth progress with real-time updates.",
                last: false,
              },
              {
                icon: <PiCoinsBold size={22} />,
                title: "Earn Returns",
                desc: "Receive your profit share and enjoy exclusive discounts on fresh produce.",
                last: true,
              },
            ].map((step, index) => (
              <div key={index} className="flex gap-6 w-full group">
                {/* Timeline Visual */}
                <div className="flex flex-col items-center">
                  <div className="bg-yellow-200 dark:bg-purple-900/30 text-yellow-600 dark:text-yellow-400 p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300">
                    {step.icon}
                  </div>
                  {!step.last && (
                    <div className="w-0.5 h-14 bg-gray-200 dark:bg-gray-700 my-2" />
                  )}
                </div>

                {/* Text Content */}
                <div className="text-left pt-2 pb-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-yellow-600 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 bg-[#FCF9F3] dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          {/* Farm-Themed Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold mb-4">
              <Sprout size={16} />
              <span>Community Voices</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 dark:text-white">
              Growing together with{" "}
              <span className="text-green-600">FarmFund</span>
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
              Real stories from the people helping our local farmers bloom and
              sustain the earth.
            </p>
          </div>

          {/* Natural Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.length > 0
              ? reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="group relative bg-white dark:bg-gray-900 p-8 rounded-[2rem] border-b-4 border-green-600/20 shadow-sm hover:shadow-xl hover:border-green-600 transition-all duration-300"
                  >
                    {/* Large Decorative Quote */}
                    <Quote
                      className="absolute top-6 right-8 text-green-600/5 group-hover:text-green-600/10"
                      size={60}
                    />

                    {/* Rating */}
                    <div className="flex gap-1 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={`${i < rev.rating ? "text-amber-500 fill-amber-500" : "text-gray-200 dark:text-gray-700"}`}
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8 font-medium italic">
                      "{rev.review}"
                    </p>

                    {/* Farmer/investor Info */}
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                      <img
                        src={
                          rev.userImage
                            ? `${rev.userImage}`
                            : "/api/placeholder/100/100"
                        }
                        alt={rev.username}
                        className="w-14 h-14 rounded-2xl object-cover grayscale-[30%] group-hover:grayscale-0 transition-all"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                          {rev.username}
                        </h4>
                        <span className="text-xs font-bold text-green-600 dark:text-green-500 uppercase tracking-widest">
                          Proud Supporter
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              : [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-80 bg-gray-200/50 dark:bg-gray-800 animate-pulse rounded-[2rem]"
                  ></div>
                ))}
          </div>

          <div className="mt-16 text-center">
            {!isLoggedIn && (
              <button
                onClick={() => navigate("/register")}
                className="bg-green-700 hover:bg-green-800 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-lg shadow-lg transition-all hover:scale-105"
              >
                Join the Harvest
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
