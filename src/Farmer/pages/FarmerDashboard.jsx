import { useState } from "react";
import {
  HiChartPie,
  HiUserGroup,
  HiMenu,
  HiLocationMarker,
} from "react-icons/hi";
import { Toaster } from "sonner";
import Proposalplan from "./ProposalPlan";
import { useUser } from "../../contexts/UserContext";
import { serverURL } from "../../services/serverURL";
import InvestorsTab from "../components/InvestorsTab";

function Avatar({ image, fallback, size = "md" }) {
  const sizes = {
    sm: "w-10 h-10 rounded-lg text-base",
    md: "w-12 h-12 rounded-xl text-xl",
  };

  return (
    <div
      className={`${sizes[size]} bg-green-700 flex items-center justify-center overflow-hidden text-white font-bold`}
    >
      {image ? (
        <img src={image} alt="profile" className="w-full h-full object-cover" />
      ) : (
        fallback
      )}
    </div>
  );
}

export default function FarmerDashboard() {
  const { user, loading } = useUser();

  const [activeTab, setActiveTab] = useState("proposals");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div className="p-10">Loading user...</div>;
  if (!user) return <div className="p-10">No user found</div>;

  const firstLetter = user.username?.charAt(0).toUpperCase() || "F";

  const profileImage = user.profile
    ? `${user.profile}`
    : null;

  const menuItems = [
    { id: "proposals", label: "Proposals", icon: HiChartPie },
    { id: "investors", label: "Investors", icon: HiUserGroup },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Toaster position="top-right" />

      <div className="flex relative">
        {/* MOBILE*/}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MOBILE SIDEBAR */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 transform transition-transform duration-300 lg:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col px-5 py-6 overflow-y-auto">
            <div className="mb-6 flex items-center gap-3">
              <Avatar image={profileImage} fallback={firstLetter} size="sm" />
              <div>
                <p className="text-lg font-bold dark:text-white">
                  {user.farmName || "FarmDash"}
                </p>
                <p className="text-xs text-gray-500">
                  {user.location || "Location"}
                </p>
              </div>
            </div>

            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                    activeTab === item.id
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/*SIDEBAR */}
        <aside className="hidden lg:flex w-64 h-screen flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
          <div className="flex flex-col px-5 py-6 overflow-y-auto sticky top-0">
            <div className="mb-6 flex items-center gap-3">
              <Avatar image={profileImage} fallback={firstLetter} size="md" />
              <div>
                <p className="text-lg font-bold dark:text-white">
                  {user.farmName || "FarmDash"}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <HiLocationMarker className="h-4 w-4" />
                  {user.location || "Location"}
                </p>
              </div>
            </div>

            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                    activeTab === item.id
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 md:p-8">
          {/* MOBILE HEADER */}
          <div className="lg:hidden sticky top-0 z-20 bg-white dark:bg-gray-900 border-b flex items-center justify-between px-4 py-3 mb-6">
            <button onClick={() => setSidebarOpen(true)}>
              <HiMenu className="h-7 w-7" />
            </button>
            <span className="font-bold">FarmDash</span>
            <span />
          </div>

          {/* HEADER */}
          <div className="flex items-center gap-3 mb-10">
            <Avatar image={profileImage} fallback={firstLetter} size="md" />
            <div>
              <h2 className="text-xl md:text-2xl font-bold dark:text-white">
                {user.farmName || "Your Farm"}
              </h2>
              <p className="text-gray-500 flex items-center gap-1">
                <HiLocationMarker /> {user.location || "Location"}
              </p>
            </div>
          </div>

          {activeTab === "investors" && <InvestorsTab />}

          {activeTab === "proposals" && <Proposalplan />}
        </main>
      </div>
    </div>
  );
}
