import {
  Navbar,
  Button,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  NavbarLink,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  DropdownDivider,
} from "flowbite-react";
import { ShoppingCart, LayoutDashboard, LogOut, Settings, Sprout } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";

import ThemeToggle from "./ThemeToggle";
import SettingDrawer from "../Invester/components/BuyerInvestorSettingsDrawer";
import SettingsDrawer from "../Farmer/pages/FarmerSettingsDrawer";
import AdminSettingDrawer from "../Admin/components/AdminSettingDrawer";

import { serverURL } from "../services/serverURL";

function Header() {
  const { user, fetchUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [openSettings, setOpenSettings] = useState(false);

  const isLoggedIn = Boolean(user);
  const role = user?.role?.toLowerCase();
  const username = user?.username || "User";
  


  const profileImage = user?.profile
    // ? `${serverURL}/uploads/${user.profile}`
     ? `${user.profile}`
    : null;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success("Logged out successfully", {
      position: "top-center",
      autoClose: 1500,
      theme: "colored",
      transition: Bounce,
    });
    fetchUser();
    navigate("/login");
  };


  const getDashboardLink = () => {
    switch (role) {
      case "investor": return "/investdashboard";
      case "farmer": return "/farmer";
      case "admin": return "/admin";
      default: return "/";
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <Navbar fluid rounded className="bg-[#FAF9F6] dark:bg-gray-900 px-4 py-3">
        {/* BRAND */}
        <NavbarBrand as={Link} to="/">
          <div className="flex items-center gap-2 group">
            <div className="bg-[#245b3e] p-2 rounded-xl transition-transform group-hover:rotate-12">
              <Sprout size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-[#245b3e] dark:text-green-400">Farm</span>
              <span className="text-yellow-400">Fund</span>
            </span>
          </div>
        </NavbarBrand>

        {/* ACTIONS & USER PROFILE */}
        <div className="flex items-center gap-3 md:order-2">
          <ThemeToggle />

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {/* Action Icons */}

              {(role === "investor" || role === "farmer" || role === "admin") && (
                <Link 
                  to={getDashboardLink()} 
                  title="Dashboard"
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <LayoutDashboard className="w-6 h-6" />
                </Link>
              )}

              {/* User Dropdown */}
              <Dropdown
                inline
                arrowIcon={false}
                placement="bottom-end"
                label={
                  profileImage ? (
                    <img
                      src={profileImage}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500 p-0.5"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold shadow-md hover:bg-emerald-800 transition-colors">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  )
                }
              >
                <DropdownHeader className="px-4 py-3">
                  <span className="block text-sm font-bold text-gray-900 dark:text-white">{username}</span>
                  <span className="block truncate text-xs font-medium text-emerald-600 dark:text-emerald-400 capitalize">{role} Account</span>
                </DropdownHeader>

                <DropdownItem onClick={() => setOpenSettings(true)} icon={Settings}>
                  Account Settings
                </DropdownItem>

                <DropdownDivider />

                <DropdownItem 
                  className="text-red-600 dark:text-red-400 font-medium" 
                  onClick={handleLogout} 
                  icon={LogOut}
                >
                  Sign Out
                </DropdownItem>
              </Dropdown>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button as={Link} to="/login" color="gray" size="sm" pill>
                Login
              </Button>
              <Button as={Link} to="/register" className="bg-[#245b3e] hover:!bg-emerald-800" size="sm" pill>
                Get Started
              </Button>
            </div>
          )}
          
          <NavbarToggle className="ml-1" />
        </div>

        {/* NAVIGATION LINKS */}
        <NavbarCollapse>
          <NavbarLink as={Link} to="/" active={isActive("/")} className="text-base font-medium">
            Home
          </NavbarLink>
          <NavbarLink as={Link} to="/working" active={isActive("/working")} className="text-base font-medium">
            How it works
          </NavbarLink>
          <NavbarLink as={Link} to="/proposals" active={isActive("/proposals")} className="text-base font-medium">
            Invest
          </NavbarLink>
        </NavbarCollapse>
      </Navbar>
      
      {/* RENDER CORRECT DRAWER BASED ON ROLE */}
      {isLoggedIn && openSettings && (
        <>
          {role === "investor" && (
            <SettingDrawer
              openSettings={openSettings}
              setOpenSettings={setOpenSettings}
              userData={user}
              refreshUser={fetchUser}
            />
          )}

          {role === "farmer" && (
            <SettingsDrawer
              openSettings={openSettings}
              setOpenSettings={setOpenSettings}
              userData={user} 
            />
          )}

          {role === "admin" && (
            <AdminSettingDrawer
              openSettings={openSettings}
              setOpenSettings={setOpenSettings}
              userData={user}
              refreshUser={fetchUser}
            />
          )}
        </>
      )}
    </header>

  );
}

export default Header;