import { useState, useEffect } from "react";
import { getMyId } from "../api/user";

export const useCurrentUserId = () => {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

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
      }
    };

    fetchUserId();
  }, []);

  return currentUserId;
};
