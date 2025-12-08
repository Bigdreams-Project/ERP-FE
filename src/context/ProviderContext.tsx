"use client";
import { createContext, useContext, useState } from "react";

interface ProviderContextType {
  selectedProvider: string;
  setSelectedProvider: (provider: string) => void;
}

const ProviderContext = createContext<ProviderContextType | null>(null);

export const ProviderProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedProvider, _setSelectedProvider] = useState("all");

  const setSelectedProvider = (provider: string) => {
    console.log("Updating selected provider to:", provider);
    _setSelectedProvider(provider);
  };

  return (
    <ProviderContext.Provider value={{ selectedProvider, setSelectedProvider }}>
      {children}
    </ProviderContext.Provider>
  );
};

export const useProvider = () => {
  const ctx = useContext(ProviderContext);
  if (!ctx) throw new Error("useProvider must be used within a ProviderProvider");
  return ctx;
};

