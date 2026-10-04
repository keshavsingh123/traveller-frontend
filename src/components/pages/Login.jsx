import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginTrip } from "../../services/travelService";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 4) {
      newErrors.password =
        "Password must be at least 4 characters.";
    }

    return newErrors;
  };

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

  const handleLogin = async (e) => {
    e?.preventDefault();

    if (submitting) return;

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await loginTrip(form);

      if (res?.token) {
        login(res.token);

        toast.success("Welcome back!");

        navigate("/dashboard", {
          replace: true,
        });
      } else {
        toast.error(
          res?.message || "Invalid credentials"
        );
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* LEFT SIDE */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-20 -left-20 blur-3xl" />

          <div className="absolute w-96 h-96 bg-purple-400/20 rounded-full bottom-0 right-0 blur-3xl" />
        </div>

        <div className="relative z-10 px-16 py-12 flex flex-col justify-between w-full text-white">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center text-2xl">
                ✈
              </div>

              <span className="text-xl font-semibold">
                TripPilot AI
              </span>
            </div>
          </div>

          <div className="max-w-lg">
            <p className="text-indigo-200 text-sm font-medium uppercase tracking-[0.25em] mb-5">
              Your intelligent travel companion
            </p>

            <h1 className="text-5xl font-bold leading-tight">
              Travel smarter.
              <br />
              Explore further.
            </h1>

            <p className="text-indigo-100/80 text-lg mt-6 leading-relaxed">
              Build personalized itineraries, discover
              activities and plan your next adventure with
              AI.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <div className="text-2xl">✨</div>

                <p className="text-sm mt-2">
                  AI itineraries
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <div className="text-2xl">🏨</div>

                <p className="text-sm mt-2">
                  Smart hotels
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <div className="text-2xl">💰</div>

                <p className="text-sm mt-2">
                  Budget planning
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-indigo-200">
            Plan less. Experience more.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
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
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
              ✈
            </div>

            <span className="text-xl font-bold">
              TripPilot AI
            </span>
          </div>

          <p className="text-sm text-indigo-600 font-semibold mb-2">
            WELCOME BACK
          </p>

          <h2 className="text-4xl font-bold text-slate-900">
            Sign in to your account
          </h2>

          <p className="text-slate-500 mt-3 mb-8">
            Continue planning your next adventure.
          </p>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
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
                  handleChange(
                    "email",
                    e.target.value
                  )
                }
                className={`w-full px-4 py-3.5 rounded-xl border bg-white outline-none transition
                  ${
                    errors.email
                      ? "border-red-400 focus:ring-4 focus:ring-red-100"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  }
                `}
              />

              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={form.password}
                  placeholder="Enter your password"
                  disabled={submitting}
                  onChange={(e) =>
                    handleChange(
                      "password",
                      e.target.value
                    )
                  }
                  className={`w-full px-4 py-3.5 pr-14 rounded-xl border bg-white outline-none transition
                    ${
                      errors.password
                        ? "border-red-400 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    }
                  `}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-200 text-white shadow-sm
                ${
                  submitting
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-md"
                }
              `}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />

                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-sm text-center text-slate-500 mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}