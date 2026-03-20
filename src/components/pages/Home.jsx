import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../Loader";
import TripCard from "../TripCard";
import { getTrips } from "../../services/travelService";

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    const fetchTrips = async () => {
      try {
        const data = await getTrips();
        console.log("API DATA:", data);
        setTrips(data);
      } catch (err) {
        setError("Failed to load trips. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">My Trips</h2>

        <Link
          to="/generate"
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded hover:scale-105 transition"
        >
          + New Trip
        </Link>
      </div>

      {loading && <Loader />}

      {!loading && Array.isArray(trips) && (
        <div className="grid md:grid-cols-2 gap-4">
          {trips.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
