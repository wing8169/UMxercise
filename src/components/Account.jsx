import React, { Component } from "react";

import AuthUserContext from "./AuthUserContext";
import PasswordChangeForm from "./PasswordChange";
import withAuthorization from "./withAuthorization";
import profile from "./img/profile/1.png";

import { firebase } from "../firebase";
import { db } from "../firebase";

class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = { uid: "", userData: {} };
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };
  componentDidMount() {
    if (firebase.auth.currentUser !== null) {
      this.setState({ uid: firebase.auth.currentUser.uid });
      db.onceGetUser(firebase.auth.currentUser.uid).then(snapshot => {
        this.setState({ userData: snapshot.val() });
      });
    }
  }
  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div style={{ margin: "75px", marginTop: "10px" }}>
            <h5>{authUser.email}</h5>
            <img
              src={profile}
              alt="profile"
              style={{
                width: "250px",
                borderRadius: "50%",
                border: "solid 5px green"
              }}
            />
            <PasswordChangeForm />
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const authCondition = authUser => !!authUser;
export default withAuthorization(authCondition)(AccountPage);
