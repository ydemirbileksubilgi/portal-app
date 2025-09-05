import { useEffect } from "react";

export const useAuthCleanup = () => {
  useEffect(() => {
    const clearAuthData = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("expiresAt");
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      localStorage.removeItem("password");

      console.log("Authentication data cleared due to browser/tab close");
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      clearAuthData();
      console.log(event);
    };

    const handlePageHide = () => {
      clearAuthData();
    };

    const handleUnload = () => {
      clearAuthData();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("unload", handleUnload);
    };
  }, []);
};

export const clearAllAuthData = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("expiresAt");
  localStorage.removeItem("user");
  localStorage.removeItem("username");
  localStorage.removeItem("password");

  console.log("Authentication data manually cleared");
};

