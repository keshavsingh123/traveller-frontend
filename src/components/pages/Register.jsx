// src/pages/Register.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import { register } from "../../services/travelService";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "",confirmPassword: "", });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (form.name.length < 4) {
      newErrors.name = "name must at least 4 char.";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 4) {
      newErrors.password = "Password must be at least 4 char.";
    }
    if (
  form.password !==
  form.confirmPassword
) {
  newErrors.confirmPassword =
    "Passwords do not match.";
}

    return newErrors;
  };

  const handleRegister = async () => {
    if (submitting) return;

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await register(form);

      if (res.code === 200) {
        toast.success(res.message || "Account created successfully!");
        navigate("/login");
      } else {
        toast.error(res.message || "Unable to create account");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to create account. Please try again.",
      );
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
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create Account 🚀
        </h2>
        <div className="mb-2">
          <input
            placeholder="Name"
            className="input mb-2"
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
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
          onClick={handleRegister}
          disabled={submitting}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200
    ${
      submitting
        ? "bg-indigo-400 cursor-not-allowed"
        : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5"
    }
    text-white shadow-sm
  `}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            "Create account"
          )}
        </button>

        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
