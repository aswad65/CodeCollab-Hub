import axios from "axios";

export const getAuthUser = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/user/profile", {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("getAuthUser error:", err);
    return null;
  }
};
