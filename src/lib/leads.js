import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase.js";

// Усі заявки лягають в одну колекцію. Набір полів має збігатися з firestore.rules (там дозволені ключі).
export function saveLead(fields) {
  return addDoc(collection(db, "project_leads"), {
    ...fields,
    createdAt: serverTimestamp(),
    page: window.location.href,
  });
}
