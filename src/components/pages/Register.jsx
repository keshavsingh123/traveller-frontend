import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/travelService";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (submitting) return;

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      };

      const res = await register(payload);

      if (res?.code === 200 || res?.success === true) {
        toast.success(
          res?.message || "Account created successfully!"
        );

        navigate("/login", {
          replace: true,
        });
      } else {
        toast.error(
          res?.message || "Unable to create account."
        );
      }
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      toast.error(
        err.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* LEFT BRANDING SECTION */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700">
        {/* Background decoration */}

        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-20 -left-20 blur-3xl" />

          <div className="absolute w-96 h-96 bg-purple-400/20 rounded-full bottom-0 right-0 blur-3xl" />

          <div className="absolute w-72 h-72 bg-indigo-300/10 rounded-full top-1/2 right-1/4 blur-3xl" />
        </div>

        <div className="relative z-10 px-16 py-12 flex flex-col justify-between w-full text-white">
          {/* Logo */}

          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center text-xl font-bold border border-white/10">
                ✦
              </div>

              <div>
                <span className="text-xl font-semibold block">
                  TripPilot AI
                </span>

                <span className="text-xs text-indigo-200">
                  Your intelligent travel companion
                </span>
              </div>
            </div>
          </div>

          {/* Hero */}

          <div className="max-w-lg">
            <p className="text-indigo-200 text-sm font-medium uppercase tracking-[0.25em] mb-5">
              Start your journey
            </p>

            <h1 className="text-5xl font-bold leading-tight">
              Plan smarter.
              <br />
              Travel better.
            </h1>

            <p className="text-indigo-100/80 text-lg mt-6 leading-relaxed">
              Create personalized itineraries, discover experiences,
              manage budgets, and build your perfect trip with AI.
            </p>

            {/* Feature cards */}

            <div className="grid grid-cols-3 gap-4 mt-10">
              <FeatureCard
                icon="✨"
                label="AI itineraries"
              />

              <FeatureCard
                icon="🏨"
                label="Smart stays"
              />

              <FeatureCard
                icon="💰"
                label="Budget planning"
              />
            </div>
          </div>

          <p className="text-sm text-indigo-200">
            Your next adventure starts with TripPilot AI.
          </p>
        </div>
      </div>

      {/* RIGHT REGISTER SECTION */}

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 sm:py-12">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}

          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-xl flex items-center justify-center font-bold">
              ✦
            </div>

            <div>
              <span className="text-xl font-bold text-slate-900">
                TripPilot AI
              </span>

              <p className="text-xs text-slate-400">
                Plan smarter. Travel better.
              </p>
            </div>
          </div>

          {/* Heading */}

          <p className="text-sm text-indigo-600 font-semibold mb-2">
            CREATE YOUR ACCOUNT
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Start exploring smarter
          </h2>

          <p className="text-slate-500 mt-3 mb-8">
            Create your account and let AI help plan your next
            unforgettable journey.
          </p>

          {/* Form */}

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >
            {/* Name */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full name
              </label>

              <input
                type="text"
                value={form.name}
                placeholder="Enter your full name"
                disabled={submitting}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
                className={`w-full px-4 py-3.5 rounded-xl border bg-white outline-none transition ${
                  errors.name
                    ? "border-red-400 focus:ring-4 focus:ring-red-100"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                }`}
              />

              {errors.name && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>

              <input
                type="email"
                value={form.email}
                placeholder="you@example.com"
                disabled={submitting}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
                className={`w-full px-4 py-3.5 rounded-xl border bg-white outline-none transition ${
                  errors.email
                    ? "border-red-400 focus:ring-4 focus:ring-red-100"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                }`}
              />

              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  placeholder="Create a password"
                  disabled={submitting}
                  onChange={(e) =>
                    handleChange("password", e.target.value)
                  }
                  className={`w-full px-4 py-3.5 pr-16 rounded-xl border bg-white outline-none transition ${
                    errors.password
                      ? "border-red-400 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  }`}
                />

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  placeholder="Enter password again"
                  disabled={submitting}
                  onChange={(e) =>
                    handleChange(
                      "confirmPassword",
                      e.target.value
                    )
                  }
                  className={`w-full px-4 py-3.5 pr-16 rounded-xl border bg-white outline-none transition ${
                    errors.confirmPassword
                      ? "border-red-400 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  }`}
                />

                <button
                  type="button"
                  disabled={submitting}
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password hint */}

            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                Use at least 6 characters. A stronger password should
                include uppercase, lowercase, numbers and symbols.
              </p>
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-200 text-white shadow-sm ${
                submitting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-md"
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />

                  Creating your account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          {/* Login link */}

          <p className="text-sm text-center text-slate-500 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Sign in
            </Link>
          </p>

          <p className="text-xs text-center text-slate-400 mt-5 leading-relaxed">
            By creating an account, you agree to use TripPilot AI
            responsibly and verify travel details before booking.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, label }) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/5">
      <div className="text-2xl">
        {icon}
      </div>

      <p className="text-sm mt-2 text-indigo-50">
        {label}
      </p>
    </div>
  );
}