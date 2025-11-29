export function startSessionWatcher() {
  const checkSession = () => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");

    if (token && expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      window.location.href = "/signin";
    }
  };
  setInterval(checkSession, 5000);
}
