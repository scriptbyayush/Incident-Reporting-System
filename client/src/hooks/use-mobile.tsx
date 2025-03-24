import { useState, useEffect } from "react";

// Custom hook to detect mobile screen
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);
    
    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return isMobile;
}
