import { useEffect, useMemo, useState } from "react";
import { AppContext } from "./AppContext";
import { getUser } from "../services/authentication";

const TOKEN_STORAGE_KEY = "token";

export function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [authLoading, setAuthLoading] = useState(Boolean(token));

  useEffect(() => {
    let isMounted = true;

    async function resolveUser() {
      if (!token) {
        if (isMounted) {
          setUser(null);
          setAuthLoading(false);
        }
        return;
      }

      if (isMounted) {
        setAuthLoading(true);
      }

      const profile = await getUser(token);
      if (!isMounted) {
        return;
      }

      if (profile) {
        setUser(profile);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      }

      setAuthLoading(false);
    }

    resolveUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const setSession = (nextToken, nextUser) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setAuthLoading(false);
  };

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      token,
      setToken,
      authLoading,
      setSession,
      logout,
    }),
    [user, token, authLoading],
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}
