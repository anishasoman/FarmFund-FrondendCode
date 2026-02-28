import { useState, useEffect } from "react";
import { Button, TextInput, Checkbox } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { Sprout } from "lucide-react";
import { loginUserAPI, googleLoginUserAPI } from "../services/allAPIs";
import { ToastContainer, toast, Bounce } from "react-toastify";
import {jwtDecode} from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { useUser } from "../contexts/UserContext";
import heroImage from "../assets/heroimage.jpg"
export default function LoginPage() {
  const navigate = useNavigate();
  const { fetchUser, user, loading } = useUser(); //  get fetchUser from context

  const roleRedirectMap = {
    farmer: "/farmer",
    investor: "/investdashboard",
    admin: "/admin",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const showError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 4000,
      theme: "colored",
      transition: Bounce,
    });
  };

const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast.error("Please fill in all fields");
    return;
  }

  try {
    const response = await loginUserAPI({ email, password });
    const { token, existingUser } = response.data;

    // Save to sessionStorage or localStorage
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("userDetails", JSON.stringify(existingUser));
    sessionStorage.setItem("role", existingUser.role);

    // Update context immediately
    await fetchUser();

    const role = existingUser.role.toLowerCase();

    toast.success(response.data.message || "Login successful", {
      position: "top-center",
      autoClose: 1500,
      theme: "colored",
      transition: Bounce,
    });

    // Navigate immediately after login
    navigate(roleRedirectMap[role] || "/");

  } catch (err) {
    console.error("Login Error:", err);
    toast.error(err?.response?.data?.message || "Invalid email or password", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
    });
  }
};



  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decode = jwtDecode(credentialResponse.credential);

      const response = await googleLoginUserAPI({
        username: decode.name,
        email: decode.email,
        profile: decode.picture,
      });

      if (response.status === 200 || response.status === 201) {
        const { token, existingUser, message } = response.data;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userDetails", JSON.stringify(existingUser));
        sessionStorage.setItem("role", existingUser.role);

        // Update context immediately
        await fetchUser();

        const role = existingUser.role.toLowerCase();
        navigate(roleRedirectMap[role] || "/");

        toast.success(message || "Login successful", {
          autoClose: 1200,
          transition: Bounce,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Google login failed");
    }
  };
useEffect(() => {
  if (!loading && user) {
    const role = user.role?.toLowerCase();
    navigate(roleRedirectMap[role] || "/");
  }
}, [user, loading, navigate]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#faf9f6] dark:bg-gray-900 dark:text-white">
      {/* Form Section */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[#245b3e] dark:bg-green-500 p-2 rounded-xl flex items-center justify-center text-white">
              <Sprout className="h-6 w-6" />
            </div>
            <span className="text-xl font-semibold">
              Farm<span className="text-yellow-300 dark:text-yellow-600">Fund</span>
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-6 dark:text-gray-300">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <TextInput
              icon={HiMail}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextInput
              icon={HiLockClosed}
              type="password"
              placeholder="......"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox />
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-green-700 hover:underline dark:text-green-600"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-800"
              size="lg"
            >
              Sign In
            </Button>

            <div className="flex justify-center mt-2">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google Login Failed")}
              />
            </div>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-green-700 font-medium hover:underline dark:text-green-600"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src={heroImage}
          alt="Farm"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center px-10">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Join the Agricultural Revolution</h1>
            <p className="text-lg">
              Whether you're a farmer seeking funding or an investor looking for returns, FarmFund connects you.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer transition={Bounce} />
    </div>
  );
}
