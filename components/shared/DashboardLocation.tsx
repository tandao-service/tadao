"use client"
import React, { useEffect, useState } from 'react'
import MapWithFeatures from './MapWithFeatures';
import { mode } from '@/constants';
type CardProps = {
    id: string;
    lat: number;
    lng: number;
    title: string;
    price: number;
    imageUrls: string[];
  };
  
const DashboardLocation = ({ id, title, price, imageUrls, lat, lng }: CardProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
   
       useEffect(() => {
          const savedTheme = localStorage.getItem("theme") || mode; // Default to "dark"
          const isDark = savedTheme === mode;
          
          setIsDarkMode(isDark);
          document.documentElement.classList.toggle(mode, isDark);
        }, []);
      
        useEffect(() => {
          if (isDarkMode === null) return; // Prevent running on initial mount
      
          document.documentElement.classList.toggle(mode, isDarkMode);
          localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        }, [isDarkMode]);
      
        if (isDarkMode === null) return null; // Avoid flickering before state is set
      
    return ( <div className="dark:bg-[#2D3236] bg-gray-300 min-h-screen">
    <MapWithFeatures lat={Number(lat)} lng={Number(lng)} id={""} title={title} price={Number(price)} imageUrls={[]}/></div>
  )
}

export default DashboardLocation