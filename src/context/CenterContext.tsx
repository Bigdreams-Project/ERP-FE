"use client";
import { createContext, useContext, useState } from "react";

interface CenterContextType {
  selectedCenter: string;
  setSelectedCenter: (centerId: string) => void;
}

const CenterContext = createContext<CenterContextType | null>(null);

export const CenterProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCenter, _setSelectedCenter] = useState("all");

  const setSelectedCenter = (centerId: string) => {
    console.log("Updating selected center to:", centerId);
    _setSelectedCenter(centerId);
  };

  return (
    <CenterContext.Provider value={{ selectedCenter, setSelectedCenter }}>
      {children}
    </CenterContext.Provider>
  );
};

export const useCenter = () => {
  const ctx = useContext(CenterContext);
  if (!ctx) throw new Error("useCenter must be used within a CenterProvider");
  return ctx;
};
