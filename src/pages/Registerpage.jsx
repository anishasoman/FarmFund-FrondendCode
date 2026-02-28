import { Button, TextInput, Checkbox } from "flowbite-react";
import { HiUser, HiMail, HiLockClosed } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sprout } from "lucide-react";
import { LuLeaf, LuBuilding2, LuTrendingUp } from "react-icons/lu";
import { registerUserAPI } from "../services/allAPIs";
import { ToastContainer, toast, Bounce } from "react-toastify";
import homeimage from '../assets/home1.jpg'

function RoleCard({ icon: Icon, title, description, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition
      ${
        active
          ? "border-green-600 bg-green-50 dark:bg-green-900/30"
          : "border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700"
      }`}
    >
      <div
        className={`p-3 rounded-xl ${
          active
            ? "bg-green-600 text-white"
            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400"
        }`}
      >
        <Icon size={22} />
      </div>
      <div className="text-left">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </button>
  );
}


export default function Registerpage() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [userType, setUserType] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const roles = [
    { id: "farmer", title: "Farmer", icon: LuLeaf, desc: "Sell produce" },
    { id: "investor", title: "Investor", icon: LuTrendingUp, desc: "Invest in farms" },
  ];

  const showError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 4000,
      theme: "colored",
      transition: Bounce,
    });
  };

const handleRegister = async (e) => {
  e.preventDefault();

  const { name, email, password } = userData;

  if (!userType) return showError("Please select a role");
  if (!name || !email || !password) return showError("Please fill all fields");

  try {
    const response = await registerUserAPI({
      username: name,
      email,
      password,
      role: userType,
    });

    if (response.status === 200 || response.status === 201) {

      toast.success(response.data.message || "Registration successful", {
        position: "top-center",
        autoClose: 1500,
        theme: "colored",
        transition: Bounce,
        onClose: () => navigate("/login"),
      });
    } else {
      showError(response.data?.message || "User already exists");
    }
  } catch (err) {
    const errorMsg =
      err.response?.data?.message ||
      err.response?.data ||
      "Registration failed. Please try again.";

    showError(errorMsg);
  }
};


  return (
    <div className="min-h-screen flex bg-green-50 dark:bg-gray-900">
      {/* Left Image */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src={homeimage}
          className="object-cover w-full h-full"
          alt="Farm"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center px-10 text-white">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold">
              Join the Agricultural Revolution
            </h1>
            <p className="text-lg text-gray-200">
              FarmFund connects farmers with investors.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center text-white">
              <Sprout />
            </div>
            <span className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Farm<span className="text-yellow-500">Fund</span>
            </span>
          </div>

          {/* Role Selection */}
          {!showForm && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Choose your role
              </h2>
              <div className="space-y-3">
                {roles.map((r) => (
                  <RoleCard
                    key={r.id}
                    icon={r.icon}
                    title={r.title}
                    description={r.desc}
                    active={userType === r.id}
                    onClick={() => {
                      setUserType(r.id);
                      setShowForm(true);
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Register Form */}
          {showForm && (
            <form onSubmit={handleRegister} className="space-y-4">
              <TextInput
                icon={HiUser}
                placeholder="Full Name"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                required
              />

              <TextInput
                icon={HiMail}
                type="email"
                placeholder="Email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                required
              />

              <TextInput
                icon={HiLockClosed}
                type="password"
                placeholder="Password"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                required
              />

              <div className="flex items-start gap-2">
                <Checkbox />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the terms & privacy policy
                </span>
              </div>

              <Button type="submit" className="w-full bg-green-700">
                Create Account
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer transition={Bounce} />
    </div>
  );
}
