"use client";

import { AuthContext } from "@/contexts/AuthContext/AuthContext";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import {auth, db} from "@/utils/firebase/firebase";
import useCookies from "@/hooks/useCookies";

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const {cookies} = useCookies();
  const [isLoading, setLoading] = useState(true);
  const [isLogged, setLogged] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (!!cookies[0]['USER-AUTH']) {
      setLogged(true);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLogged, isLoading, setLogged, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
