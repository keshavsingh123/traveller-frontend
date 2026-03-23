// src/pages/Login.jsx
import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { loginTrip } from "../../services/travelService";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters.";
    }

    return newErrors;
  };
  const handleLogin = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await loginTrip(form);
      console.log(res.token);
      if (res?.token) {
        login(res.token); // 🔥 THIS IS THE MISSING LINE

        toast.success("Login Successfully!");
         navigate("/dashboard", { replace: true });
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    // Clear error for this field on change
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome Back 👋</h2>
        <div className="mb-2">
          <input
            placeholder="Email"
            className="input mb-2"
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input pr-10"
            onChange={(e) => handleChange("password", e.target.value)}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>

          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>
        <button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-700 text-white w-full py-2 rounded-lg hover:scale-105 transition"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-3">
          Don’t have an account?{" "}
          <Link to="/register" className="text-primary font-semibold">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
