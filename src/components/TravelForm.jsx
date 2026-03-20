import { useState } from "react";
import { motion } from "framer-motion";

export default function TravelForm({ onGenerate, onBack }) {
  const [form, setForm] = useState({
    destination: "",
    days: "",
    budget: "",
    interests: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl mx-auto"
    >

      

      <h2 className="text-2xl font-semibold mb-4 text-center">
        Plan Your Trip 🌍
      </h2>

      <div className="grid gap-4">
        <input name="destination" placeholder="Destination" onChange={handleChange} className="input" />
        <input name="days" type="number" placeholder="Number of Days" onChange={handleChange} className="input" />
        <input name="budget" placeholder="Budget (₹)" onChange={handleChange} className="input" />
        <input name="interests" placeholder="Interests (food, adventure, etc.)" onChange={handleChange} className="input" />

        <button
          onClick={() => onGenerate(form)}
          className="bg-primary text-blue-500 py-2 rounded-lg hover:scale-105 transition"
        >
          Generate Itinerary ✨
        </button>
      </div>
    </motion.div>
  );
}