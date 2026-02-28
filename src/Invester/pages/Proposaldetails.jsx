import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Progress, Badge, TextInput, Label } from "flowbite-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  ArrowLeft,
  Share2,
  Heart,
  ShieldCheck,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "../../contexts/UserContext";

import { proposalByIdAPI, CheckoutAPI } from "../../services/allAPIs";
import UpdateCard from "../../Farmer/components/UpdateCard";
import { serverURL } from "../../services/serverURL";

loadStripe(
  "pk_test_51Sq4QsD6Mvuka85EknGtdulaWsCl6wltOZVhmAM6tBwi9cjSgFLhCrbCoyn6xTAgMXsfbHvecMdG0ZduuHqnpazc00zFdOfMMx",
);

export default function ProposalDetails() {
  const { id } = useParams();
  const { user } = useUser();
  const role = sessionStorage.getItem("role");

  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investAmount, setInvestAmount] = useState("");
  const [investing, setInvesting] = useState(false);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const res = await proposalByIdAPI(id, {
          Authorization: `Bearer ${token}`,
        });

        if (res.status === 200 && res.data?.proposal) {
          setProposal(res.data.proposal);
        }
      } catch {
        toast.error("Failed to load proposal");
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  const handleInvest = async () => {
    const amount = Number(investAmount);
    if (!amount || amount <= 0) return toast.error("Enter a valid amount");

    const remaining = proposal.targetAmount - proposal.raisedAmount;
    if (amount > remaining) return toast.error(`Only ₹${remaining} remaining`);

    try {
      setInvesting(true);
      const token = sessionStorage.getItem("token");
      const res = await CheckoutAPI(
        proposal._id,
        { amount },
        { Authorization: `Bearer ${token}` },
      );

      if (res.status === 200 && res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setInvesting(false);
    }
  };


  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading Project…</p>
        </div>
      </div>
    );

// no data 
  if (!proposal)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-10 text-center shadow-xl">
          <ShieldCheck size={56} className="mx-auto text-green-500 mb-6" />
          <h2 className="text-2xl font-bold mb-3 dark:text-white">
            Join FarmFund
          </h2>
          <p className="text-gray-500 mb-8">
            Access verified farming projects and earn sustainable returns.
          </p>
          <div className="space-y-3">
            <Link
              to="/register"
              className="block py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold"
            >
              Get Started
            </Link>
            <Link
              to="/proposals"
              className="block py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold"
            >
              Browse Projects
            </Link>
          </div>
        </div>
      </div>
    );

  const progress = Math.round(
    (proposal.raisedAmount / proposal.targetAmount) * 100,
  );
  const remaining = proposal.targetAmount - proposal.raisedAmount;
  const updates = proposal.updates || [];
  const coverImage = proposal.bgimage || proposal.image;


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 md:px-12 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Back */}
        <Link
          to="/proposals"
          className="inline-flex items-center gap-2 mb-8 text-gray-500 hover:text-green-600"
        >
          <ArrowLeft size={18} /> Back to Discover
        </Link>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-10">
            {/* COVER */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl group">
              <img
                src={`${coverImage}`}
                alt={proposal.title}
                className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-6 left-6">
                <Badge color="success">{proposal.category}</Badge>
              </div>
              <div className="absolute top-6 right-6 flex gap-3">
                <button className="p-3 bg-white/20 rounded-full backdrop-blur">
                  <Share2 size={18} className="text-white" />
                </button>
                <button className="p-3 bg-white/20 rounded-full backdrop-blur">
                  <Heart size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* DETAILS */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow">
              <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={`${proposal.farmerAvatar}`}
                    className="w-14 h-14 rounded-xl object-cover"
                    alt=""
                  />
                  <div>
                    <p className="text-xs text-green-600 uppercase font-bold">
                      Managed By
                    </p>
                    <h2 className="font-bold text-lg dark:text-white">
                      {proposal.farmerName}
                    </h2>
                  </div>
                </div>
                <div className="flex gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {proposal.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {proposal.duration} months
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-black mb-4 dark:text-white">
                {proposal.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {proposal.description}
              </p>
            </div>

            {/* UPDATES */}
            <div>
              <h2 className="text-2xl font-bold mb-4 dark:text-white">
                Project Journal
              </h2>

              {updates.length ? (
                <div>
                  {updates.map((u) => (
                    <UpdateCard
                      key={u._id}
                      update={u}
                      proposalId={proposal._id}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-gray-100 dark:bg-gray-900 rounded-2xl">
                  <p className="text-gray-400 italic">No updates posted yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <div className="sticky top-10 bg-white dark:bg-gray-900 rounded-3xl p-8 shadow space-y-6">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Funding Status
                </p>
                <h3 className="text-3xl font-black text-green-600">
                  ₹{proposal.raisedAmount.toLocaleString()}
                </h3>
                <p className="text-sm text-gray-500">
                  Goal ₹{proposal.targetAmount.toLocaleString()}
                </p>
              </div>

              <Progress progress={progress} size="lg" />
              <div className="flex justify-between text-xs font-bold">
                <span className="text-green-600">{progress}% funded</span>
                <span className="text-gray-400">
                  ₹{remaining.toLocaleString()} left
                </span>
              </div>

              {user && role === "investor" ? (
                proposal.status === "active" && (
                  <>
                    <Label value="Amount to Invest" />
                    <TextInput
                      type="number"
                      icon={TrendingUp}
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                    />
                    <Button
                      onClick={handleInvest}
                      disabled={investing}
                      className="bg-green-600 hover:bg-green-700 rounded-xl font-bold"
                    >
                      {investing ? "Processing…" : "Invest Now"}
                    </Button>
                  </>
                )
              ) : (
                <Button
                  as={Link}
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 rounded-xl font-bold"
                >
                  Create Investor Account
                </Button>
              )}

              <div className="flex justify-between pt-4 border-t text-center">
                <div>
                  <p className="text-orange-500">
                    {proposal.investments?.length || 0}
                  </p>
                  <p className="text-xs text-gray-400 uppercase">Invested</p>
                </div>
                <div>
                  <p className="font-black text-orange-500">
                    {proposal.expectedReturn}%
                  </p>
                  <p className="text-xs text-gray-400 uppercase">
                    Interest Rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
