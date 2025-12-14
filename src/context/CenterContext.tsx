"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getCenterContextClient } from "@/lib/client-network";

interface CenterContextData {
  canSwitch: boolean;
  currentCenterId: string | null;
  currentCenterName: string | null;
}

interface CenterContextType {
  selectedCenter: string;
  setSelectedCenter: (centerId: string) => void;
  centerContext: CenterContextData | null;
  isLoading: boolean;
}

const CenterContext = createContext<CenterContextType | null>(null);

export const CenterProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCenter, _setSelectedCenter] = useState("all");
  const [centerContext, setCenterContext] = useState<CenterContextData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch center context on mount
  useEffect(() => {
    const fetchCenterContext = async () => {
      try {
        const context = await getCenterContextClient();
        
        // Handle different possible field names from API
        // Also handle case where API returns center object directly
        let currentCenterId = context.currentCenterId ?? context.current_center_id ?? context.centerId ?? context.center_id ?? null;
        let currentCenterName = context.currentCenterName ?? context.current_center_name ?? context.centerName ?? context.center_name ?? null;
        
        // If API returns center object, extract id and name from it
        if (context.center && typeof context.center === 'object') {
          currentCenterId = context.center.id ?? currentCenterId;
          currentCenterName = context.center.name ?? currentCenterName;
        }
        if (context.currentCenter && typeof context.currentCenter === 'object') {
          currentCenterId = context.currentCenter.id ?? currentCenterId;
          currentCenterName = context.currentCenter.name ?? currentCenterName;
        }
        
        const centerContextData = {
          canSwitch: context.canSwitch ?? context.can_switch ?? false,
          currentCenterId,
          currentCenterName,
        };
        
        setCenterContext(centerContextData);
        
        // If user cannot switch centers (and doesn't have a role that allows it),
        // set selectedCenter to their current center
        // Note: Role-based permission checking happens in components, not here
        // This is a fallback for users locked to a specific center
        if (!context.canSwitch && context.currentCenterId) {
          _setSelectedCenter(context.currentCenterId);
        }
      } catch (error) {
        // Default to allowing center switch if API fails (fallback)
        setCenterContext({
          canSwitch: true,
          currentCenterId: null,
          currentCenterName: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCenterContext();
  }, []);

  const setSelectedCenter = (centerId: string) => {
    // Allow switching - permission checking is handled by components (e.g., Centerdropdown)
    // Components check user role before calling this function
    _setSelectedCenter(centerId);
  };

  return (
    <CenterContext.Provider value={{ selectedCenter, setSelectedCenter, centerContext, isLoading }}>
      {children}
    </CenterContext.Provider>
  );
};

export const useCenter = () => {
  const ctx = useContext(CenterContext);
  if (!ctx) throw new Error("useCenter must be used within a CenterProvider");
  return ctx;
};
