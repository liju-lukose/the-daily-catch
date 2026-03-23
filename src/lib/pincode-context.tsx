import React, { createContext, useContext, useState, useCallback } from 'react';

interface PincodeContextType {
  pincode: string | null;
  isAvailable: boolean;
  setPincodeData: (pincode: string) => void;
  clearPincode: () => void;
}

const PincodeContext = createContext<PincodeContextType | undefined>(undefined);

export function PincodeProvider({ children }: { children: React.ReactNode }) {
  const [pincode, setPincode] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  const setPincodeData = useCallback((code: string) => {
    setPincode(code);
    setIsAvailable(true);
  }, []);

  const clearPincode = useCallback(() => {
    setPincode(null);
    setIsAvailable(false);
  }, []);

  return (
    <PincodeContext.Provider value={{ pincode, isAvailable, setPincodeData, clearPincode }}>
      {children}
    </PincodeContext.Provider>
  );
}

export function usePincode() {
  const context = useContext(PincodeContext);
  if (!context) throw new Error('usePincode must be used within PincodeProvider');
  return context;
}
