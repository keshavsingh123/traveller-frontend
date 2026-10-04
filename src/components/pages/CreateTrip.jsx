import { useState } from "react";
import { createTrip } from "../../services/travelService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function CreateTrip() {
  const [form, setForm] = useState({
    destination: "",
    days: "",
    budgetType: "Low",
    interests: "",
  });
  const [submitting, setSubmitting] =
  useState(false);
  const navigate = useNavigate();

 const handleSubmit = async () => {
  if (submitting) return;

  try {
    setSubmitting(true);

    const payload = {
      ...form,
      days: Number(form.days),
    };

    const res =
      await createTrip(payload);

    if (res.code === 200) {
      toast.success(
        res.message ||
          "Trip created successfully"
      );

      navigate("/dashboard");
    }
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        "Unable to generate trip"
    );
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Let's Plan Trip
        </h2>
      </div>

      <div className="flex justify-between">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 text-lg text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
        >
          Back
        </Link>
      </div>

      <input
        className="input mb-2"
        placeholder="Destination"
        value={form.destination}
        onChange={(e) =>
          setForm({
            ...form,
            destination: e.target.value,
          })
        }
      />

      <input
        type="number"
        min="1"
        className="input mb-2"
        placeholder="Days"
        value={form.days}
        onChange={(e) =>
          setForm({
            ...form,
            days: e.target.value,
          })
        }
      />

      <select
        className="input mb-2"
        value={form.budgetType}
        onChange={(e) =>
          setForm({
            ...form,
            budgetType: e.target.value,
          })
        }
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <input
        className="input mb-4"
        placeholder="Interests (eg. mountain, club, food...)"
        value={form.interests}
        onChange={(e) =>
          setForm({
            ...form,
            interests: e.target.value,
          })
        }
      />

      <div className="text-center">
        <button
  onClick={handleSubmit}
  disabled={submitting}
  className={`px-6 py-3 rounded-xl font-semibold text-white transition
    ${
      submitting
        ? "bg-indigo-400 cursor-not-allowed"
        : "bg-indigo-600 hover:bg-indigo-700"
    }
  `}
>
  {submitting ? (
    <span className="flex items-center gap-2">
      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      Building your itinerary...
    </span>
  ) : (
    "✨ Generate itinerary"
  )}
</button>
      </div>
    </div>
  );
}