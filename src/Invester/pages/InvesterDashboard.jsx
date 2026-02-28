import { Card } from "flowbite-react";
import { TrendingUp, Wallet, Percent, ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { getMyInvestmentsAPI } from "../../services/allAPIs";
import { serverURL } from "../../services/serverURL";
import { Eye } from "lucide-react";

export default function InvestorDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const username = user?.username || "Investor";
  const [updates, setUpdates] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const LIMIT = 4;

  useEffect(() => {
    fetchInvestments(page);
  }, [page]);

  const fetchInvestments = async (currentPage) => {
    try {
      const res = await getMyInvestmentsAPI(currentPage, LIMIT, {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      });

      if (res.status === 200) {
        setInvestments(res.data.investments || []);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stats = useMemo(() => {
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

    const activeInvestments = investments.filter(
      (inv) => inv.proposalStatus === "active",
    ).length;

    const avgReturn =
      investments.length > 0
        ? (
            investments.reduce((sum, inv) => sum + inv.expectedReturn, 0) /
            investments.length
          ).toFixed(1)
        : 0;

    const projectedEarnings = investments.reduce(
      (sum, inv) => sum + (inv.amount * inv.expectedReturn) / 100,
      0,
    );

    return {
      totalInvested,
      activeInvestments,
      avgReturn,
      projectedEarnings,
    };
  }, [investments]);
  useEffect(() => {
    const map = {};

    investments.forEach((inv) => {
      if (!inv.updates || inv.updates.length === 0) return;

      const latest = [...inv.updates].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      )[0];

      map[inv.proposalId] = {
        updateId: latest._id,
        content: latest.content,
        media: latest.media || [],
        createdAt: latest.createdAt,
        farmerName: inv.farmerName,
        farmerAvatar: inv.farmerAvatar,
        proposalTitle: inv.proposalTitle,
      };
    });

    setUpdates(Object.values(map));
  }, [investments]);

  return (
    <div className="min-h-screen bg-[#d8f2d0] dark:bg-gray-900 p-16">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">
          Welcome, {username}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your investments and returns
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          icon={<Wallet />}
          value={`₹${stats.totalInvested.toLocaleString()}`}
          label="Total Invested"
        />
        <StatCard
          icon={<TrendingUp />}
          value={stats.activeInvestments}
          label="Active Investments"
        />
        <StatCard
          icon={<Percent />}
          value={`${stats.avgReturn}%`}
          label="Avg. Expected Return"
        />
        <StatCard
          icon={<ArrowUpRight />}
          value={`₹${Math.round(stats.projectedEarnings).toLocaleString()}`}
          label="Projected Earnings"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN – INVESTMENTS */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold dark:text-white">
              My Investments
            </h2>
            <button
              onClick={() => navigate("/proposals")}
              className="border border-green-700 text-green-700 px-4 py-1 rounded-lg text-sm hover:bg-green-50 dark:hover:bg-gray-800"
            >
              Browse More
            </button>
          </div>

          {investments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              You haven’t invested in any proposals yet.
            </p>
          ) : (
            investments.map((inv) => (
              <InvestmentCard
                key={inv.paymentId}
                proposalId={inv.proposalId}
                title={inv.proposalTitle}
                invested={`₹${inv.amount.toLocaleString()}`}
                returnRate={`${inv.expectedReturn}%`}
                status={inv.proposalStatus}
                image={
                  inv.proposalImage
                    ? `${inv.proposalImage}`
                    : "/no-image.png"
                }
              />
            ))
          )}

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-1 border rounded disabled:opacity-40 dark:border-gray-600 dark:text-white"
            >
              Prev
            </button>

            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-1 border rounded disabled:opacity-40 dark:border-gray-600 dark:text-white"
            >
              Next
            </button>
          </div>
        </div>

        {/* RIGHT – UPDATES */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Latest Updates
          </h2>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {updates.length === 0 ? (
              <Card className="p-4 text-center dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No updates yet
                </p>
              </Card>
            ) : (
              updates.map((u) => (
                <Card key={u.updateId} className="p-4 dark:bg-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={`${u.farmerAvatar}`}
                      className="w-10 h-10 rounded-full object-cover"
                      alt={u.farmerName}
                    />
                    <div>
                      <p className="font-medium dark:text-white">
                        {u.farmerName}
                      </p>
                      <p className="text-xs text-green-600">
                        {u.proposalTitle}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(u.createdAt).toDateString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {u.content}
                  </p>

                  {u.media.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {u.media.map((m, idx) =>
                        m.type === "video" ? (
                          <video
                            key={`${u.updateId}-v-${idx}`}
                            controls
                            className="rounded-lg h-28 w-full object-cover"
                          >
                            <source src={`${m.url}`} />
                          </video>
                        ) : (
                          <img
                            key={`${u.updateId}-i-${idx}`}
                            src={`${m.url}`}
                            className="rounded-lg h-28 w-full object-cover"
                            alt="update"
                          />
                        ),
                      )}
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* STAT CARD */
function StatCard({ icon, value, label }) {
  return (
    <Card className="p-5 dark:bg-gray-800">
      <div className="p-2 bg-green-100 rounded-lg w-fit text-green-700">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mt-4 dark:text-white">{value}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </Card>
  );
}

/* INVESTMENT CARD */
function InvestmentCard({
  title,
  invested,
  returnRate,
  image,
  status,
  proposalId,
}) {
  const navigate = useNavigate();

  return (
    <Card className="mb-4 hover:shadow-md transition dark:bg-gray-800">
      <div className="flex gap-4 items-center">
        {/* Image */}
        <img
          src={image}
          onError={(e) => (e.target.src = "/no-image.png")}
          className="w-24 h-24 object-cover rounded-lg"
          alt={title}
        />

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold dark:text-white">{title}</h3>

            {/* Eye Icon */}
            <button
              onClick={() => navigate(`/proposals/${proposalId}`)}
              className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-gray-700"
              title="View Proposal"
            >
              <Eye className="w-5 h-5 text-green-700 dark:text-green-400" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Invested</p>
              <p className="font-medium dark:text-white">{invested}</p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400">
                Expected Return
              </p>
              <p className="text-green-600 font-medium">{returnRate}</p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400">Status</p>
              <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded text-xs">
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
