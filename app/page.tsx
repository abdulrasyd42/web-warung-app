"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataWarung from "./data-warung";

export default function HomePage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      router.push("/login");
    } else {
      setIsReady(true);
    }
  }, [router]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  return <DataWarung />;
}
