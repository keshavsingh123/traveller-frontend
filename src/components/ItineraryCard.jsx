import { motion } from "framer-motion";

export default function ItineraryCard({ itinerary }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-6 max-w-3xl mx-auto"
    >
      {itinerary.map((day, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-4 mb-4"
        >
          <h3 className="text-lg font-bold text-primary">
            Day {index + 1}
          </h3>
          <p>{day}</p>
        </div>
      ))}
    </motion.div>
  );
}