import { useEffect, useState } from "react";
import { getMyId } from "../api/user";

export const useCurrentUserId = () => {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getMyId();
        if (id == null) {
          throw new Error("User not found!");
        }
        setCurrentUserId(id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  return { currentUserId, loading };
};
