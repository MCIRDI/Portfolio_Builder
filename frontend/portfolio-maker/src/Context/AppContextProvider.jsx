import { useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import { getUser } from "../services/authentication";

export function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  useEffect(() => {
    if (token) {
      getUser().then((data) => {
        setUser(data || null);
        console.log("Fetched user data:", data);
        console.log("tooken", data || null);
      });
    }
  }, [token]);
  return (
    <AppContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </AppContext.Provider>
  );
}
