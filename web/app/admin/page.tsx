"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { adminAuth } from "../../api/admin/validate/route";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await adminAuth();

      if (!response.ok) {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  return <div>Welcome to the Admin Dashboard</div>;
}
