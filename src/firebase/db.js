import { db } from "./firebase";

// User API
export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
    profile: "1.png"
  });
// to-do: change profile icon

export const onceGetUsers = () => db.ref("users").once("value");

export const onceGetUser = id => db.ref(`users/${id}`).once("value");
