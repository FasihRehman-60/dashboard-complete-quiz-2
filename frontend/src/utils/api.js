import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Swal.fire({
        title: "Session Expired",
        text: "Please sign in again to continue.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiry");
          window.location.href = "/signin";
        }, 1500);
      });
    }
    return Promise.reject(error);
  }
);

export default api;

const relatedCache = {};
const CACHE_DURATION = 10 * 60 * 1000;

export const fetchRelatedNews = async (keyword) => {
  if (!keyword) return [];

  const key = keyword.toLowerCase().trim();
  const now = Date.now();

  if (
    relatedCache[key] &&
    now - relatedCache[key].timestamp < CACHE_DURATION
  ) {
    return relatedCache[key].data;
  }

  try {
    const res = await api.get(`/news/related?q=${encodeURIComponent(key)}`);
    const articles = res.data.articles || [];
    
    relatedCache[key] = {
      data: articles,
      timestamp: now,
    };

    return articles;
  } catch (err) {
    console.error("Error fetching related news:", err);
    return [];
  }
};
