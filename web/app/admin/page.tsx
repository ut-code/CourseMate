"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/admin/validate");
      if (!res.ok) {
        router.replace("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  return <div>Welcome to the Admin Dashboard</div>;
}
