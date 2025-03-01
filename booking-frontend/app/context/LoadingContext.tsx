"use client";
import { createContext, useContext, ReactNode, useState } from "react";

interface LoadingContextType {
  loading: boolean;
  message: string;
  setLoading: (value: boolean) => void;
  setMessage: (message: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

// Provider component
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  return (
    <LoadingContext.Provider value={{ loading, message, setLoading, setMessage }}>
      {children}
    </LoadingContext.Provider>
  );
};
