import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { optimizeBudget, suggestActivity } from "../services/travelService";

export default function TripCard({ trip }) {
  const [loadingSuggest, setLoadingSuggest] = useState(null); // day index
  const [loadingOptimize, setLoadingOptimize] = useState(false);
  const [suggestions, setSuggestions] = useState({}); 
  const [newActivities, setNewActivities] = useState({});
  const [expandedDay, setExpandedDay] = useState(null);
  const [optimized, setOptimized] = useState(false);

  const handleSuggest = async (dayIndex) => {
  setLoadingSuggest(dayIndex);

  try {
    let raw = await suggestActivity({
      destination: trip.destination,
      interest: "nightlife",
    });

    console.log("RAW ACTIVITY:", raw);

    // ✅ Explicitly extract the activity array
    let activities = [];

    if (Array.isArray(raw)) {
      activities = raw;
    } else if (raw?.activity && Array.isArray(raw.activity)) {
      activities = raw.activity;                        // ✅ this is your case
    } else if (raw?.suggestions && Array.isArray(raw.suggestions)) {
      activities = raw.suggestions;
    } else if (typeof raw === "string") {
      activities = raw.split(",").map((s) => s.trim());
    }

    // Ensure every item is a string
    activities = activities.map((a) =>
      typeof a === "string" ? a : a?.name || a?.activity || JSON.stringify(a)
    );

    setSuggestions((prev) => ({ ...prev, [dayIndex]: activities }));
  } catch (err) {
    console.error("suggestActivity error:", err);
    setSuggestions((prev) => ({ ...prev, [dayIndex]: [] }));
  } finally {
    setLoadingSuggest(null);
  }
};

  const handleOptimize = async () => {
    setLoadingOptimize(true);
    try {
      await optimizeBudget(trip._id, "Low");
      setOptimized(true);
      setTimeout(() => window.location.reload(), 800);
    } catch {
      setLoadingOptimize(false);
    }
  };

  const handleAddActivity = (dayIndex) => {
    const activity = newActivities[dayIndex]?.trim();
    if (!activity) return;
    // TODO: wire up API call
    setNewActivities((prev) => ({ ...prev, [dayIndex]: "" }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Destination avatar */}
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
            {trip.destination?.slice(0, 2).toUpperCase() || "??"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base leading-tight">
              {trip.destination}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {trip.itinerary?.length ?? 0} days
            </p>
          </div>
        </div>

        {/* Budget badge */}
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
            ₹{trip.budget?.total?.toLocaleString() ?? "—"}
          </span>
          <button
            onClick={handleOptimize}
            disabled={loadingOptimize || optimized}
            className={`text-xs font-medium px-2.5 py-1 rounded-full border transition
              ${
                optimized
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
              }`}
          >
            {optimized
              ? "✓ Optimized"
              : loadingOptimize
                ? "Optimizing…"
                : "💰 Optimize"}
          </button>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-gray-100 mx-5" />

      {/* ── Itinerary ── */}
      <div className="px-5 py-4 space-y-3">
        {trip.itinerary?.map((day, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-100 overflow-hidden"
          >
            {/* Day header — toggle */}
            <button
              onClick={() => setExpandedDay(expandedDay === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  Day {i + 1}
                </span>
                <span className="text-xs text-gray-400">
                  · {day.activities.length} activities
                </span>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedDay === i ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <AnimatePresence initial={false}>
              {expandedDay === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-gray-50/50">
                    {/* Activities list */}
                    {/* <ul className="space-y-1.5 mb-3">
                      {day.activities.map((a, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul> */}
                    <ul className="space-y-1.5 mb-3">
                      {[...day.activities, ...(suggestions[i] ?? [])].map(
                        (a, idx) => {
                          const isNew = idx >= day.activities.length;
                          return (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm"
                            >
                              <span
                                className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                                  isNew ? "bg-purple-400" : "bg-indigo-400"
                                }`}
                              />
                              <span
                                className={
                                  isNew
                                    ? "text-purple-700 font-medium"
                                    : "text-gray-700"
                                }
                              >
                                {a}
                                {isNew && (
                                  <span className="ml-1.5 text-[10px] bg-purple-100 text-purple-500 px-1.5 py-0.5 rounded-full">
                                    new
                                  </span>
                                )}
                              </span>
                            </li>
                          );
                        },
                      )}
                    </ul>

                    {/* Suggested activities */}
                    

                    {/* Add activity inline */}
                    {/* <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Add an activity…"
                        value={newActivities[i] || ""}
                        onChange={(e) =>
                          setNewActivities((prev) => ({ ...prev, [i]: e.target.value }))
                        }
                        onKeyDown={(e) => e.key === "Enter" && handleAddActivity(i)}
                        className="flex-1 text-sm px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                      />
                      <button
                        onClick={() => handleAddActivity(i)}
                        className="text-sm px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                      >
                        Add
                      </button>
                    </div> */}

                    <button
                      onClick={() => handleSuggest(i)}
                      disabled={loadingSuggest === i}
                      className="text-xs font-medium text-purple-600 border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition disabled:opacity-50"
                    >
                      {loadingSuggest === i
                        ? "Loading…"
                        : "✨ Suggest Activities"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* ── Hotels ── */}
      {trip.hotels?.length > 0 && (
        <>
          <div className="h-px bg-gray-100 mx-5" />
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Hotels
            </p>
            <div className="flex flex-wrap gap-2">
              {trip.hotels.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full"
                >
                  🏨 {h}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
