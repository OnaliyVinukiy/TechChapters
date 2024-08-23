import { ref, get } from "firebase/database";
import { database } from "../firebase";

export const getPosts = async () => {
  const postsRef = ref(database, "posts/");
  try {
    const snapshot = await get(postsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Convert object to array
      return Object.values(data);
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("Error getting posts data:", error);
    return [];
  }
};

export const getUsers = async (userId) => {
  if (!userId) {
    console.error("Invalid userId provided");
    return [];
  }

  const postsRef = ref(database, `users/${userId}/payments`);

  try {
    const snapshot = await get(postsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      // Convert object to array
      return Object.values(data);
    } else {
      console.log("No data available for the provided userId");
      return [];
    }
  } catch (error) {
    console.error("Error getting payments data:", error);
    return [];
  }
};
