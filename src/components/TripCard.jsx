import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { deleteTrip } from "../services/travelService";

import { toast } from "react-toastify";

import { useState } from "react";
export default function TripCard({ trip, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const days = trip.days || trip.itinerary?.length || 0;

  const activityCount =
    trip.itinerary?.reduce(
      (total, day) => total + (day.activities?.length || 0),
      0,
    ) || 0;

  const hotelCount = trip.hotels?.length || 0;

  const initials = trip.destination?.slice(0, 2).toUpperCase() || "TR";

  const interests =
    typeof trip.interests === "string"
      ? trip.interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 3)
      : [];

  const createdDate = trip.createdAt
    ? new Date(trip.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;
  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmed = window.confirm(`Delete your ${trip.destination} trip?`);

    if (!confirmed) return;

    if (deleting) return;

    try {
      setDeleting(true);

      await deleteTrip(trip._id);

      toast.success("Trip deleted");

      onDeleted?.(trip._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to delete trip");
    } finally {
      setDeleting(false);
    }
  };
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.25,
      }}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/60 transition-all"
    >
      {/* Cover */}

      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600">
        {/* Decorative elements */}

        <div className="absolute w-40 h-40 bg-white/10 rounded-full -right-8 -top-12" />

        <div className="absolute w-32 h-32 bg-white/10 rounded-full -bottom-14 left-10" />

        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur border border-white/20 text-white flex items-center justify-center font-bold">
              {initials}
            </div>

            {trip.budgetType && (
              <span className="bg-white/15 backdrop-blur border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {trip.budgetType}
              </span>
            )}
          </div>

          <div>
            <p className="text-indigo-100 text-xs font-medium">
              TRIPPILOT JOURNEY
            </p>

            <h3 className="text-2xl font-bold text-white mt-1 truncate">
              {trip.destination || "Untitled Trip"}
            </h3>
          </div>
        </div>
      </div>

      {/* Content */}

      <div className="p-5">
        {/* Main stats */}

        <div className="grid grid-cols-3 gap-2">
          <MiniStat value={days} label={Number(days) === 1 ? "Day" : "Days"} />

          <MiniStat value={activityCount} label="Activities" />

          <MiniStat value={hotelCount} label="Hotels" />
        </div>

        {/* Interests */}

        {interests.length > 0 && (
          <div className="mt-5">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-2">
              Interests
            </p>

            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span
                  key={`${interest}-${index}`}
                  className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1.5 rounded-lg font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* First day preview */}

        {trip.itinerary?.[0] && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Day 1 Preview
            </p>

            <div className="mt-2 space-y-1.5">
              {trip.itinerary[0].activities
                ?.slice(0, 2)
                .map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2" />

                    <span className="line-clamp-1">
                      {typeof activity === "string"
                        ? activity
                        : activity?.name || activity?.activity || "Activity"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Footer */}

        <div className="flex items-center justify-between mt-6">
          <span className="text-xs text-slate-400">
            {createdDate ? `Created ${createdDate}` : `${days} day itinerary`}
          </span>

          <div className="flex items-center gap-3">
            <button
              disabled={deleting}
              onClick={handleDelete}
              className="text-sm font-medium text-red-500 hover:text-red-700 disabled:text-slate-300"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>

            <button
              onClick={() => navigate(`/trips/${trip._id}`)}
              className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              Explore trip
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function MiniStat({ value, label }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <p className="font-bold text-slate-900">{value || 0}</p>

      <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}
