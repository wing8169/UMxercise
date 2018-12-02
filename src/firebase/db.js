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

export const onceGetActivity = aid => db.ref(`activities/${aid}`).once("value");

export const doAddActivity = (id, aid, callback) => {
  db.ref(`users/${id}`)
    .once("value")
    .then(snapshot => {
      let tmp = snapshot.val().activities;
      if (tmp == null) tmp = [];
      tmp.push(aid);
      db.ref(`users/${id}/activities`)
        .set(tmp)
        .then(() => callback());
    });
};

export const doJoinActivity = (aid, members, callback) => {
  db.ref(`activities/${aid}/members`)
    .set(members)
    .then(() => callback());
};

export const doCreateActivity = (
  name,
  place,
  time,
  url,
  host,
  id,
  members,
  callback
) => {
  let tmpRef = db.ref("activities").push();
  tmpRef
    .set({
      id: tmpRef.key,
      name: name,
      place: place,
      url: url,
      time: time,
      host: host,
      members: members
    })
    .then(() => {
      doAddActivity(id, tmpRef.key, callback);
    });
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
