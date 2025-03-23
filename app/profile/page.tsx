"use client";

import { useEffect, useState } from "react";
import ProfilePage from "@/app/profile/components/profile-page";
import MobileProfileForm from "@/app/profile/components/mobile-profile-form";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return isMobile ? <MobileProfileForm /> : <ProfilePage />;
}
