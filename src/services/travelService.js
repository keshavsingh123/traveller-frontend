import api from "./api";

export const register = async(data) =>{
    const res = await api.post("/auth/register",data)
    return res.data
}
export const loginTrip = async(data) =>{
    const res = await api.post("/auth/login",data)
    return res.data
}
export const getTrips = async () => {
  const res = await api.get("/trips");
  console.log("res api",res)
  return res?.data?.trip;
};

export const createTrip = async (data) => {
  const res = await api.post("/trips/generate", data);
  return res.data;
};

export const suggestActivity = async (data) => {
  const res = await api.post("/trips/suggest-activity", data);
  return res.data;
};

export const optimizeBudget = async (tripId, level) => {
  const res = await api.put(`/trips/optimize-budget/${tripId}`, {
    level,
  });
  return res.data;
};