import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TripCard from "../TripCard";
import { getTrips } from "../../services/travelService";

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTrips();

      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("GET TRIPS ERROR:", err);

      setError(err.response?.data?.message || "Unable to load your trips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch =
        trip.destination?.toLowerCase().includes(search.toLowerCase()) ||
        trip.interests?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        trip.budgetType?.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [trips, search, filter]);

  const totalDays = trips.reduce(
    (total, trip) => total + Number(trip.days || trip.itinerary?.length || 0),
    0,
  );

  const destinations = new Set(
    trips.map((trip) => trip.destination).filter(Boolean),
  ).size;
  const handleTripDeleted = (tripId) => {
    setTrips((prev) => prev.filter((trip) => trip._id !== tripId));
  };
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero header */}

      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-indigo-600 mb-2">
                TRIPPILOT AI
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Where are we going next?
              </h1>

              <p className="mt-3 text-slate-500 max-w-xl">
                Explore your planned journeys, revisit itineraries, and create
                your next AI-powered adventure.
              </p>
            </div>

            <Link
              to="/generate"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="text-lg">+</span>
              Plan New Trip
            </Link>
          </div>

          {/* Stats */}

          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <StatCard icon="✈" label="Total trips" value={trips.length} />

            <StatCard icon="🌍" label="Destinations" value={destinations} />

            <StatCard icon="📅" label="Travel days" value={totalDays} />
          </div>
        </div>
      </section>

      {/* Content */}

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
        {/* Search + filters */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">My Trips</h2>

            <p className="text-sm text-slate-500 mt-1">
              {trips.length === 0
                ? "No journeys planned yet"
                : `${trips.length} ${
                    trips.length === 1 ? "journey" : "journeys"
                  } saved`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}

            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              >
                <circle cx="11" cy="11" r="8" strokeWidth="2" />

                <path
                  d="m21 21-4.35-4.35"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destination..."
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition"
              />
            </div>

            {/* Filter */}

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="all">All budgets</option>

              <option value="low">Low budget</option>

              <option value="medium">Medium budget</option>

              <option value="high">High budget</option>
            </select>
          </div>
        </div>

        {/* Loading */}

        {loading && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3].map((item) => (
              <TripSkeleton key={item} />
            ))}
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="bg-white border border-red-100 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 mx-auto bg-red-50 rounded-full flex items-center justify-center text-xl">
              !
            </div>

            <h3 className="font-semibold text-slate-900 mt-4">
              Unable to load trips
            </h3>

            <p className="text-sm text-slate-500 mt-1">{error}</p>

            <button
              onClick={fetchTrips}
              className="mt-5 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}

        {!loading && !error && trips.length === 0 && <EmptyTrips />}

        {/* Search empty */}

        {!loading &&
          !error &&
          trips.length > 0 &&
          filteredTrips.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center">
              <p className="text-4xl">🔎</p>

              <h3 className="font-semibold text-slate-900 mt-4">
                No trips found
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Try another destination or budget filter.
              </p>
            </div>
          )}

        {/* Trips */}

        {!loading && !error && filteredTrips.length > 0 && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onDeleted={handleTripDeleted}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-sm">
        {icon}
      </div>

      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>

        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function TripSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-36 bg-slate-200" />

      <div className="p-5">
        <div className="h-5 bg-slate-200 rounded w-1/2" />

        <div className="h-3 bg-slate-100 rounded w-3/4 mt-3" />

        <div className="flex gap-2 mt-6">
          <div className="h-8 bg-slate-100 rounded-lg w-20" />
          <div className="h-8 bg-slate-100 rounded-lg w-20" />
        </div>
      </div>
    </div>
  );
}

function EmptyTrips() {
  return (
    <div className="bg-white border border-dashed border-slate-300 rounded-3xl px-6 py-20 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl">
        ✈️
      </div>

      <h3 className="text-xl font-bold text-slate-900 mt-5">
        Your next adventure starts here
      </h3>

      <p className="text-slate-500 mt-2 max-w-md mx-auto">
        Tell TripPilot AI where you want to go and we'll build a personalized
        itinerary for you.
      </p>

      <Link
        to="/generate"
        className="inline-flex mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition"
      >
        Plan My First Trip
      </Link>
    </div>
  );
}
