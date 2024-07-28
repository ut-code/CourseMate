import { useState, useEffect } from "react";
import { getMyId } from "../api/user";

export const useCurrentUserId = () => {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getMyId();
        setCurrentUserId(id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  return currentUserId;
};
