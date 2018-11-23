import React, { Component } from "react";

import withAuthorization from "./withAuthorization";
import { db } from "../firebase";

import Grid from "@material-ui/core/Grid";

// activities: [
//   id: {
//       activity:
//       place:
//       time:
//       creatorID:
//       creatorName:
//       createdTime:
//       joinedMembers:
//       active:
//   }
// ]

// users:[
//   id:{
//       username:
//       email:
//       activities:[]
//   }
// ]

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = { users: null };
  }
  componentDidMount() {
    db.onceGetUsers().then(snapshot => {
      this.setState({ users: snapshot.val() });
    });
  }
  render() {
    const { classes } = this.props;
    const { users } = this.state;
    return (
      <div style={{ backgroundColor: "#fbd157" }}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <h1>Link your sports with friends.</h1>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const UserList = ({ users }) => (
  <div>
    <h2>List of Usernames of Users</h2>
    <p>(Saved on Sign Up in Firebase Database)</p>
    {Object.keys(users).map(key => (
      <div key={key}>{users[key].username}</div>
    ))}
  </div>
);

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(HomePage);
