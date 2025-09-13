// context/GlobalDataContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

type GlobalDataContextType = {
  categories: any[];
  subcategories: any[];
  packages: any[];
  adsCount: any[];
  loans: any[];
  setGlobalData: (data: Partial<GlobalDataContextType>) => void;
};

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

export function GlobalDataProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: {
    categories: any[];
    subcategories: any[];
    packages: any[];
    adsCount: any[];
    loans: any;
  };
}) {
  const [categories, setCategories] = useState(initialData.categories);
  const [subcategories, setSubcategories] = useState(initialData.subcategories);
  const [packages, setPackages] = useState(initialData.packages);
  const [adsCount, setAdsCount] = useState(initialData.adsCount);
  const [loans, setLoans] = useState(initialData.loans);

  const setGlobalData = (data: Partial<GlobalDataContextType>) => {
    if (data.categories) setCategories(data.categories);
    if (data.subcategories) setSubcategories(data.subcategories);
    if (data.packages) setPackages(data.packages);
    if (data.adsCount) setAdsCount(data.adsCount);
    if (data.loans) setLoans(data.loans);
  };

  return (
    <GlobalDataContext.Provider
      value={{
        categories,
        subcategories,
        packages,
        adsCount,
        loans,
        setGlobalData,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
}

export function useGlobalData() {
  const ctx = useContext(GlobalDataContext);
  if (!ctx) {
    throw new Error("useGlobalData must be used inside GlobalDataProvider");
  }
  return ctx;
}
