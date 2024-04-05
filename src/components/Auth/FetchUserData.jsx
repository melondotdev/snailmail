import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "@firebase/firestore";

const fetchUserData = async (uid) => {
  try {
    const q = query(
      collection(db, "users"),
      where("uid", "==", uid)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export default fetchUserData;
