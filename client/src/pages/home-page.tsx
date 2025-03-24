import { useEffect } from "react";
import { useLocation } from "wouter";

export default function HomePage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Redirect to dashboard for authenticated users
    navigate("/dashboard");
  }, [navigate]);

  return null;
}
