import api from "./api";

export const register = async (
  data
) => {
  const res =
    await api.post(
      "/auth/register",
      data
    );

  return res.data;
};

export const loginTrip = async (
  data
) => {
  const res =
    await api.post(
      "/auth/login",
      data
    );

  return res.data;
};

export const getTrips = async () => {
  const res =
    await api.get("/trips");

  return res?.data?.trip;
};

export const getTripById =
  async (tripId) => {
    const res =
      await api.get(
        `/trips/${tripId}`
      );

    return res.data;
  };

export const createTrip = async (
  data
) => {
  const res =
    await api.post(
      "/trips/generate",
      data
    );

  return res.data;
};

export const deleteTrip = async (
  tripId
) => {
  const res =
    await api.delete(
      `/trips/${tripId}`
    );

  return res.data;
};

export const regenerateTrip =
  async (tripId) => {
    const res =
      await api.post(
        `/trips/${tripId}/regenerate`
      );

    return res.data;
  };

export const suggestActivity =
  async (data) => {
    const res =
      await api.post(
        "/trips/suggest-activity",
        data
      );

    return res.data;
  };

export const optimizeBudget =
  async (
    tripId,
    level
  ) => {
    const res =
      await api.put(
        `/trips/optimize-budget/${tripId}`,
        {
          level,
        }
      );

    return res.data;
  };