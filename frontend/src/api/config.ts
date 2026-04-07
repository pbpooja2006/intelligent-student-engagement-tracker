const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000/api"
    : "https://intelligent-student-engagement-tracker.onrender.com/api";

export default API_BASE_URL;