import { Link } from "react-router-dom";
import React, { useState } from "react";
import { ChevronDown, HelpCircle, Leaf } from "lucide-react";
import { Button } from "flowbite-react";
import {
  Search,
  CreditCard,
  Bell,
  TrendingUp,
  UserPlus,
  FileText,
  Users,
  Wallet,
  ArrowRight,
} from "lucide-react";

export default function Working() {
  const [openIndex, setOpenIndex] = useState(null);
  const token = sessionStorage.getItem("token");
  const isLoggedIn = !!token;
  const faqs = [
    {
      q: "What is the minimum investment?",
      a: "You can start planting the seeds of change with as little as ₹1,000. We believe everyone should have the chance to support local agriculture.",
    },
    {
      q: "How are returns calculated?",
      a: "Returns are tied to the harvest success. Based on historical data from our farm partners, supporters typically see a 15–30% annual yield once the produce is sold.",
    },
    {
      q: "How are farmers verified?",
      a: "Every farm undergoes a rigorous 'Roots Check'—verifying land titles, sustainable practice certifications, and a 3-year history of successful harvests.",
    },
    {
      q: "What if a project fails?",
      a: "Nature can be unpredictable. We mitigate risks through crop insurance and climate-smart farming techniques, though we always suggest diversifying your support across multiple farm projects.",
    },
  ];
  const investorSteps = [
    {
      icon: Search,
      title: "Browse Proposals",
      description:
        "Explore verified farming projects with detailed information about farmers, timelines, and expected returns.",
    },
    {
      icon: CreditCard,
      title: "Make an Investment",
      description:
        "Invest securely starting from ₹1,000. Your funds are tracked and protected.",
    },
    {
      icon: Bell,
      title: "Track Progress",
      description:
        "Receive updates with photos, videos, and reports from farmers.",
    },
    {
      icon: TrendingUp,
      title: "Earn Returns",
      description:
        "Get your principal plus returns directly to your bank account.",
    },
  ];

  const farmerSteps = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description:
        "Sign up as a farmer and complete verification with farm details.",
    },
    {
      icon: FileText,
      title: "Submit Proposal",
      description:
        "Create a detailed proposal with funding goal, timeline, and returns.",
    },
    {
      icon: Users,
      title: "Connect with Investors",
      description:
        "Your proposal goes live and investors can fund your project.",
    },
    {
      icon: Wallet,
      title: "Receive Funding",
      description: "Access capital and provide regular updates to investors.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/*hero*/}
      <section className="relative py-20 bg-gradient-to-r from-emerald-700 to-emerald-600 dark:from-gray-900 dark:to-gray-800 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How FarmFund Works
          </h1>
          <p className="text-white/80 text-lg">
            A simple, transparent platform connecting farmers and investors
          </p>
        </div>
      </section>

      {/* investors*/}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm mb-4">
              For Investors
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Start Investing in 4 Easy Steps
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Begin your agricultural investment journey with confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investorSteps.map((step, i) => (
              <div
                key={step.title}
                className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-emerald-900 font-bold text-sm">
                  {i + 1}
                </div>

                <div className="p-3 rounded-lg bg-emerald-100 dark:bg-gray-700 inline-block mb-4">
                  <step.icon className="h-6 w-6 text-emerald-700 dark:text-yellow-400" />
                </div>

                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button color="warning" size="lg" as={Link} to="/proposals">
              Start Investing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/*farmers*/}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-emerald-600 text-white text-sm mb-4">
              For Farmers
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Fund Your Farm in 4 Steps
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get the capital you need to grow your farming business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {farmerSteps.map((step, i) => (
              <div
                key={step.title}
                className="relative bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {i + 1}
                </div>

                <div className="p-3 rounded-lg bg-emerald-100 dark:bg-gray-700 inline-block mb-4">
                  <step.icon className="h-6 w-6 text-emerald-700 dark:text-yellow-400" />
                </div>

                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            {!isLoggedIn && (
              <Button color="success" size="lg" as={Link} to="/register">
                Start a Proposal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/*faq*/}
      <section className="py-24 bg-[#FCF9F3] dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <span className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl text-green-700 dark:text-green-400">
                <HelpCircle size={28} />
              </span>
            </div>
            <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Curious about{" "}
              <span className="text-green-600">how it works?</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Everything you need to know about supporting our farmers.
            </p>
          </div>

          {/* Accordion Container */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`group border border-gray-200 dark:border-gray-800 rounded-[2rem] transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-white dark:bg-gray-900 shadow-xl shadow-green-900/5 ring-1 ring-green-500/20"
                      : "bg-transparent hover:bg-white/50"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <Leaf
                        size={20}
                        className={`transition-colors duration-300 ${isOpen ? "text-green-600" : "text-gray-300 dark:text-gray-700"}`}
                      />
                      <span
                        className={`text-lg font-bold transition-colors ${isOpen ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-400"}`}
                      >
                        {faq.q}
                      </span>
                    </div>
                    <div
                      className={`p-2 rounded-full transition-all duration-300 ${isOpen ? "bg-green-600 text-white rotate-180" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}
                    >
                      <ChevronDown size={20} />
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-16 pb-8 text-gray-600 dark:text-gray-400 leading-relaxed text-md">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/*Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 dark:text-gray-500">
              Still have questions?
              <a
                href="#contact"
                className="ml-2 text-green-600 font-bold hover:underline decoration-2 underline-offset-4"
              >
                Talk to our farm experts
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
