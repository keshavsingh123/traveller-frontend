import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between">
      <h1 className="text-xl font-bold text-primary">
        <Link to='/dashboard'>✈️ AI Travel Planner</Link>
      </h1>

      {user && (
        <button
          onClick={logout}
          className="text-red-500 font-semibold"
        >
          Logout
        </button>
      )}
    </div>
  );
}