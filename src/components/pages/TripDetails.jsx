import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import {
  getTripById,
  optimizeBudget,
  suggestActivity,
  regenerateTrip,
  deleteTrip,
} from "../../services/travelService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function TripDetails() {
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [expandedDay, setExpandedDay] = useState(0);

  const [loadingSuggestion, setLoadingSuggestion] = useState(null);

  const [suggestions, setSuggestions] = useState({});

  const [optimizing, setOptimizing] = useState(false);

  const [budgetLevel, setBudgetLevel] = useState("Low");
  const navigate = useNavigate();

  const [regenerating, setRegenerating] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const fetchTrip = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTripById(tripId);

      setTrip(response.trip);
    } catch (err) {
      console.error("GET TRIP ERROR:", err);

      setError(err.response?.data?.message || "Unable to load this trip.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  const handleSuggest = async (dayIndex) => {
    if (loadingSuggestion !== null) return;

    try {
      setLoadingSuggestion(dayIndex);

      const response = await suggestActivity({
        destination: trip.destination,
        interest: trip.interests || "popular attractions",
      });

      let activities = response?.activity || [];

      if (!Array.isArray(activities)) {
        activities = [activities];
      }

      activities = activities
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return item?.name || item?.activity || "";
        })
        .filter(Boolean);

      setSuggestions((prev) => ({
        ...prev,
        [dayIndex]: activities,
      }));

      toast.success("New activities suggested");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to suggest activities",
      );
    } finally {
      setLoadingSuggestion(null);
    }
  };
  const handleShare = async () => {
    const shareData = {
      title: `${trip.destination} - TripPilot AI`,
      text: `Check out my ${trip.days}-day trip to ${trip.destination}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);

        return;
      }

      await navigator.clipboard.writeText(window.location.href);

      toast.success("Trip link copied");
    } catch (err) {
      if (err.name !== "AbortError") {
        toast.error("Unable to share trip");
      }
    }
  };
  const handlePrint = () => {
    window.print();
  };
  const handleRegenerate = async () => {
    if (regenerating) return;

    const confirmed = window.confirm(
      "Regenerate this entire trip? Your current itinerary, hotels and budget will be replaced.",
    );

    if (!confirmed) return;

    try {
      setRegenerating(true);

      const response = await regenerateTrip(trip._id);

      setTrip(response.trip);

      setSuggestions({});

      toast.success("Trip regenerated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to regenerate trip");
    } finally {
      setRegenerating(false);
    }
  };
  const handleDeleteTrip = async () => {
    const confirmed = window.confirm(
      `Delete your trip to ${trip.destination}? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteTrip(trip._id);

      toast.success("Trip deleted");

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to delete trip");
    } finally {
      setDeleting(false);
    }
  };
  const handleOptimize = async () => {
    if (optimizing) return;

    try {
      setOptimizing(true);

      const response = await optimizeBudget(trip._id, budgetLevel);

      if (response?.trip) {
        setTrip(response.trip);
      }

      toast.success("Budget optimized successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to optimize budget");
    } finally {
      setOptimizing(false);
    }
  };

  if (loading) {
    return <TripDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-16">
        <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-10 text-center">
          <div className="w-14 h-14 mx-auto bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl font-bold">
            !
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-5">
            Trip unavailable
          </h2>

          <p className="text-slate-500 mt-2">{error}</p>

          <Link
            to="/dashboard"
            className="inline-block mt-6 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  const totalActivities =
    trip.itinerary?.reduce(
      (total, day) => total + (day.activities?.length || 0),
      0,
    ) || 0;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}

      <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-14">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-indigo-200 hover:text-white text-sm font-medium transition"
          >
            <span>←</span>
            Back to my trips
          </Link>

          <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <span className="inline-flex px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-indigo-100">
                TripPilot AI Journey
              </span>

              <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">
                {trip.destination}
              </h1>

              <p className="text-indigo-200 mt-3 max-w-2xl">
                Your personalized AI-generated travel itinerary.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <HeroChip>
                  📅 {trip.days} {trip.days === 1 ? "day" : "days"}
                </HeroChip>

                <HeroChip>✨ {totalActivities} activities</HeroChip>

                <HeroChip>💳 {trip.budgetType || "Flexible"} budget</HeroChip>

                <HeroChip>🏨 {trip.hotels?.length || 0} hotels</HeroChip>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm font-medium hover:bg-white/20 disabled:opacity-50 transition"
              >
                {regenerating ? "Regenerating..." : "✨ Regenerate"}
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm font-medium hover:bg-white/20 transition"
              >
                Share Trip
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-7">
          {/* LEFT */}

          <div className="space-y-7">
            {/* Interests */}

            {trip.interests && (
              <section className="bg-white border border-slate-200 rounded-2xl p-6">
                <SectionTitle
                  title="Trip Preferences"
                  subtitle="Interests used to personalize this itinerary"
                />

                <div className="flex flex-wrap gap-2 mt-5">
                  {trip.interests.split(",").map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium"
                    >
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Itinerary */}

            <section className="bg-white border border-slate-200 rounded-2xl p-6">
              <SectionTitle
                title="Your Itinerary"
                subtitle={`${trip.itinerary?.length || 0} day personalized travel plan`}
              />

              <div className="space-y-3 mt-6">
                {trip.itinerary?.map((day, index) => {
                  const isOpen = expandedDay === index;

                  const extra = suggestions[index] || [];

                  return (
                    <div
                      key={index}
                      className={`border rounded-2xl overflow-hidden transition ${
                        isOpen
                          ? "border-indigo-200 shadow-sm"
                          : "border-slate-200"
                      }`}
                    >
                      <button
                        onClick={() => setExpandedDay(isOpen ? null : index)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
                              isOpen
                                ? "bg-indigo-600 text-white"
                                : "bg-indigo-50 text-indigo-600"
                            }`}
                          >
                            {day.day || index + 1}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              Day {day.day || index + 1}
                            </p>

                            <p className="text-sm text-slate-500 mt-0.5">
                              {day.activities?.length || 0} planned activities
                            </p>
                          </div>
                        </div>

                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 transition-transform ${
                            isOpen ? "rotate-180 bg-slate-100" : ""
                          }`}
                        >
                          ↓
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-5">
                          <div className="relative">
                            <div className="absolute left-[9px] top-4 bottom-4 w-px bg-slate-200" />

                            <div className="space-y-5">
                              {day.activities?.map(
                                (activity, activityIndex) => (
                                  <TimelineActivity
                                    key={activityIndex}
                                    activity={activity}
                                    number={activityIndex + 1}
                                  />
                                ),
                              )}

                              {extra.map((activity, activityIndex) => (
                                <TimelineActivity
                                  key={`suggested-${activityIndex}`}
                                  activity={activity}
                                  number={
                                    (day.activities?.length || 0) +
                                    activityIndex +
                                    1
                                  }
                                  suggested
                                />
                              ))}
                            </div>
                          </div>

                          <button
                            disabled={loadingSuggestion === index}
                            onClick={() => handleSuggest(index)}
                            className={`mt-6 px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
                              loadingSuggestion === index
                                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                                : "bg-white text-violet-700 border-violet-200 hover:bg-violet-50"
                            }`}
                          >
                            {loadingSuggestion === index
                              ? "Finding activities..."
                              : "✨ Suggest more activities"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Hotels */}

            <section className="bg-white border border-slate-200 rounded-2xl p-6">
              <SectionTitle
                title="Suggested Hotels"
                subtitle="AI-selected stays for your trip"
              />

              {trip.hotels?.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  {trip.hotels.map((hotel, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-xl p-4 hover:border-indigo-200 hover:shadow-sm transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 shrink-0 bg-amber-50 rounded-xl flex items-center justify-center">
                          🏨
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {hotel}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            Recommended by TripPilot AI
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-sm text-slate-500">
                  No hotel recommendations available.
                </p>
              )}
            </section>
          </div>

          {/* RIGHT SIDEBAR */}

          <aside className="space-y-5">
            {/* Budget */}

            <div className="bg-white border border-slate-200 rounded-2xl p-5 lg:sticky lg:top-24">
              <div>
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Trip Budget
                </p>

                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Cost Estimate
                </h3>
              </div>

              <div className="space-y-4 mt-6">
                <BudgetRow label="Flights" value={trip.budget?.flights} />

                <BudgetRow label="Hotel" value={trip.budget?.hotel} />

                <BudgetRow label="Food" value={trip.budget?.food} />

                <BudgetRow label="Activities" value={trip.budget?.activities} />
              </div>

              <div className="h-px bg-slate-200 my-5" />

              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  Estimated Total
                </span>

                <span className="text-xl font-bold text-indigo-700">
                  {formatCurrency(trip.budget?.total)}
                </span>
              </div>

              <div className="mt-6 bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Optimize budget
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Let AI adjust your trip based on a different budget level.
                </p>

                <select
                  value={budgetLevel}
                  disabled={optimizing}
                  onChange={(e) => setBudgetLevel(e.target.value)}
                  className="w-full mt-4 bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="Low">Budget</option>

                  <option value="Medium">Balanced</option>

                  <option value="High">Premium</option>
                </select>

                <button
                  onClick={handleOptimize}
                  disabled={optimizing}
                  className={`w-full mt-3 py-2.5 rounded-lg text-sm font-semibold text-white transition ${
                    optimizing
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {optimizing ? "Optimizing..." : "Optimize with AI"}
                </button>
              </div>

              <div className="mt-5 p-4 bg-indigo-50 rounded-xl">
                <p className="text-xs text-indigo-700 leading-relaxed">
                  AI-generated prices are estimates. Always verify actual prices
                  before booking.
                </p>
              </div>
              <div className="mt-5 p-4 bg-indigo-50 rounded-xl">
                <p className="text-sm font-semibold text-slate-900">
                  Manage trip
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Permanently remove this journey.
                </p>

                <button
                  onClick={handleDeleteTrip}
                  disabled={deleting}
                  className="w-full mt-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Trip"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function HeroChip({ children }) {
  return (
    <span className="px-3 py-2 bg-white/10 border border-white/10 rounded-xl text-sm text-indigo-50">
      {children}
    </span>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>

      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}

function TimelineActivity({ activity, number, suggested = false }) {
  return (
    <div className="relative flex gap-4">
      <div
        className={`relative z-10 w-[19px] h-[19px] rounded-full border-4 shrink-0 mt-0.5 ${
          suggested
            ? "bg-violet-500 border-violet-100"
            : "bg-indigo-500 border-indigo-100"
        }`}
      />

      <div className="flex-1 pb-1">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-400 font-medium">
            Activity {number}
          </span>

          {suggested && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold">
              AI Suggestion
            </span>
          )}
        </div>

        <p className="text-sm text-slate-700 mt-1 leading-relaxed">
          {typeof activity === "string"
            ? activity
            : activity?.name || activity?.activity || JSON.stringify(activity)}
        </p>
      </div>
    </div>
  );
}

function BudgetRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>

      <span className="font-medium text-slate-800">
        {formatCurrency(value)}
      </span>
    </div>
  );
}

function formatCurrency(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function TripDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      <div className="h-72 bg-slate-900" />

      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-7">
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-52 bg-white border border-slate-200 rounded-2xl"
              />
            ))}
          </div>

          <div className="h-96 bg-white border border-slate-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
