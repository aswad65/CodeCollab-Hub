import axios from "axios";

export const getAuthUser = async () => {
  try {
    const res = await axios.get("https://backend-cv0c.onrender.com/api/user/profile", {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("getAuthUser error:", err);
    return null;
  }
};
