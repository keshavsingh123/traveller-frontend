import { useState } from "react";
import { createTrip } from "../../services/travelService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function CreateTrip() {
  const [form, setForm] = useState({});
  const navigate = useNavigate()
  const handleSubmit = async () => {
  const res = await createTrip(form);
  console.log(res);
  if(res.code === 200){
    toast.success(res.message || "created successfully")
    navigate("/dashboard")
  }else{
    toast.error(res.message || "Failed to create trip")

  }
};

  return (
    <div className="p-6 max-w-xl mx-auto from-indigo-100 to-purple-100">
    <div className="flex justify-between">
      <button
      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      <Link to="/dashboard">Back </Link>
    </button>
      <h2 className="text-xl font-bold">Generate Trip</h2>
    </div>

      <input className="input mb-2" placeholder="Destination"
        onChange={(e)=>setForm({...form,destination:e.target.value})}/>

      <input className="input mb-2" placeholder="Days"
        onChange={(e)=>setForm({...form,days:e.target.value})}/>

      <select className="input mb-2"
        onChange={(e)=>setForm({...form,budget:e.target.value})}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <input className="input mb-4" placeholder="Interests"
        onChange={(e)=>setForm({...form,interests:e.target.value})}/>
      <div className="text-center">
        <button onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">
        Generate Trip ✨
      </button>
      </div> 
    </div>
  );
}