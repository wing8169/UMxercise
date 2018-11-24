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

export const onceGetActivities = () => db.ref("activities").once("value");

const onceGetActivity = aid => db.ref(`activities/${aid}`).once("value");

const doAddActivity = (id, aid) => {
  db.ref(`users/${id}`)
    .once("value")
    .then(snapshot => {
      let tmp = snapshot.val().activities;
      if (tmp == null) tmp = [];
      tmp.push(aid);
      db.ref(`users/${id}/activities`).set(tmp);
    });
};

export const doCreateActivity = (name, place, time, host, id, members) => {
  let tmpRef = db.ref("activities").push();
  tmpRef.set({
    id: tmpRef.key,
    name: name,
    place: place,
    time: time,
    host: host,
    members: members
  });
  doAddActivity(id, tmpRef.key);
};

export const onceGetJoinedActivites = uid => {
  let tmp = [];
  onceGetUser(uid).then(snapshot => {
    let aids = snapshot.val().activities;
    for (let i = 0; i < aids.length; i++) {
      onceGetActivity(aids[i]).then(dt => {
        tmp.push(dt.val());
      });
    }
  });
  return tmp;
};
