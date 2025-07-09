import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (err) {
      setUser(null);
      toast.error("Logout failed. Please try again.");
      navigate("/");
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, [location.pathname]);

  return (
    <nav className="w-full bg-white shadow flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-3 mb-6 gap-2 md:gap-0">
      {/* Left: Logo */}
      <div
        className="text-2xl font-bold text-green-700 cursor-pointer mb-2 md:mb-0"
        onClick={() => navigate("/")}
      >
        Mutual
      </div>
      {/* Right: User info and actions */}
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto">
        {user ? (
          <>
            <span className="font-semibold text-gray-700 text-center md:text-left">
              Hello! {user.name}
            </span>
            <button
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 cursor-pointer w-full md:w-auto"
              onClick={() => navigate("/saved")}
            >
              Saved Funds
            </button>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 cursor-pointer w-full md:w-auto"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 cursor-pointer w-full md:w-auto"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="bg-gray-200 text-black px-4 py-1 rounded hover:bg-gray-300 cursor-pointer w-full md:w-auto"
              onClick={() => navigate("/register")}
            >
              Signup
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
