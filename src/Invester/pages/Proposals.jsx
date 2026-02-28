import { useEffect, useState } from "react";
import { Button, Badge, Progress, TextInput } from "flowbite-react";
import { CheckCircle, TrendingUp, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InvestProposalsAPI } from "../../services/allAPIs";
import { serverURL } from "../../services/serverURL";
import { useUser } from "../../contexts/UserContext";
import { LineChart, Sprout, BarChart3 } from "lucide-react";
import { HiOutlineClock } from "react-icons/hi";
import { getCountdown } from "../../utils/getCountdown";


const normalizeRisk = (risk) => {
  if (!risk) return "Low";
  return risk.charAt(0).toUpperCase() + risk.slice(1);
};

const getRiskColor = (risk) => {
  switch (risk) {
    case "Low":
      return "success";
    case "Medium":
      return "warning";
    case "High":
      return "failure";
    default:
      return "gray";
  }
};

const getSizeBucket = (target) => {
  if (target <= 200000) return "₹1 - ₹2L";
  if (target <= 400000) return "₹2L - ₹4L";
  return "₹4L+";
};



export default function Proposals() {
  const { user } = useUser();
  const [risk, setRisk] = useState("All");
  const [size, setSize] = useState("All");
  const [search, setSearch] = useState("");
  const [proposals, setProposals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const ITEMS_PER_PAGE = 6;


  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await InvestProposalsAPI();
        if (res?.data?.success) {
          setProposals(res.data.proposals);
        }
      } catch (error) {
        console.error("Failed to load proposals", error);
      }
    };
    fetchProposals();
  }, []);


  const projects = proposals.map((p) => ({
    id: p._id,
    title: p.title,
    description: p.description,
    image: p.image ? `${p.image}` : "/farm.jpg",
    farmerName: p.farmerName,
    farmerAvatar: p.farmerAvatar,
    location: p.location,
    category: p.category,
    targetAmount: p.targetAmount,
    raisedAmount: p.raisedAmount || 0,
    duration: p.duration,
    expectedReturn: p.expectedReturn,
    riskRating: normalizeRisk(p.risk),
    size: getSizeBucket(p.targetAmount),
    progress: p.updates || [],
    lastDate: p.lastDate,
  }));

  // filters and search
  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return (
      (risk === "All" || p.riskRating === risk) &&
      (size === "All" || p.size === size) &&
      (p.title?.toLowerCase().includes(q) ||
        p.farmerName?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q))
    );
  });

  // pagination 
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

 

  return (
    <div className="bg-[#FBF9F4] dark:bg-gray-900 min-h-screen px-4 md:px-16 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white flex items-center justify-center shadow-md">
          <LineChart size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Farm Investments
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Partner with farmers, earn returns
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap justify-between gap-4 mb-6 items-center">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <TextInput
            placeholder="Search by title, farmer, location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            size="sm"
            className="pl-9"
          />
        </div>

        {/* Size Filter */}
        <div className="flex gap-2 flex-wrap dark:text-white">
          {["All", "₹1 - ₹2L", "₹2L - ₹4L", "₹4L+"].map((s) => (
            <Button
              key={s}
              size="sm"
              color={size === s ? "success" : "gray"}
              onClick={() => {
                setSize(s);
                setCurrentPage(1);
              }}
            >
              {s}
            </Button>
          ))}
        </div>

        {/* Risk Filter */}
        <div className="flex gap-2 flex-wrap dark:text-white">
          {["All", "Low", "Medium", "High"].map((r) => (
            <Button
              key={r}
              size="sm"
              color={risk === r ? "warning" : "gray"}
              onClick={() => {
                setRisk(r);
                setCurrentPage(1);
              }}
            >
              {r} Risk
            </Button>
          ))}
        </div>
      </div>

      <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
        Showing {filtered.length} investment opportunities
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedData.map((funding) => {
          const progressPercent = Math.round(
            (funding.raisedAmount / funding.targetAmount) * 100,
          );

          return (
            <div
              key={funding.id}
              className="group relative rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* IMAGE */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={funding.image}
                  alt={funding.title}
                  className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110"
                />

                {/* BADGES */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <Badge
                    color={getRiskColor(funding.riskRating)}
                    className="backdrop-blur-sm"
                  >
                    {funding.riskRating} Risk
                  </Badge>
                  <Badge color="info">{funding.category}</Badge>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col flex-grow space-y-4">
                {/* PROGRESS */}
                <Progress progress={progressPercent} size="sm" />

                <div className="flex justify-between text-xs text-gray-500">
                  <span>{progressPercent}% funded</span>
                  <span>
                    ₹{funding.targetAmount - funding.raisedAmount} left
                  </span>
                </div>

                {/* FARMER */}
                <div className="flex items-center gap-3 pt-1">
                  <img
                    src={`${funding.farmerAvatar}`}
                    alt={funding.farmerName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-900"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {funding.farmerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {funding.location}, India
                    </p>
                  </div>
                </div>

                {/* TITLE and DESC */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                    {funding.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {funding.description}
                  </p>
                </div>

                {/* UPDATES */}
                <div className="min-h-[26px]">
                  {funding.progress.length > 0 && (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      {funding.progress.length} updates available
                    </div>
                  )}
                </div>

                {/* other */}
                <div className="flex justify-between text-xs pt-1">
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <HiOutlineClock />
                    {funding.duration} months
                  </span>

                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    ↗ {funding.expectedReturn}% returns
                  </span>
                </div>

                {/* COUNTDOWN */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <HiOutlineClock />
                  {getCountdown(funding.lastDate)}
                </div>

                <button
                  onClick={() => navigate(`/proposals/${funding.id}`)}
                  className="mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold tracking-wide hover:opacity-90 transition-all group-hover:shadow-lg"
                >
                  <TrendingUp className="h-4 w-4" />
                  Invest Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10 dark:text-white">
          <Button
            size="sm"
            color="gray"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </Button>

          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              size="sm"
              color={currentPage === i + 1 ? "success" : "gray"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            size="sm"
            color="gray"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
