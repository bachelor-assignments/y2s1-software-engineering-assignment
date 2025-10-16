"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    router.push(token ? "/assets" : "/login");
  }, [router]);

  return (
    <div>
      <h1>Welcome to Asset Management System</h1>
      <p>Redirecting...</p>
    </div>
  );
}
