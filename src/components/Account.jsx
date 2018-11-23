import React, { Component } from "react";

import AuthUserContext from "./AuthUserContext";
import PasswordChangeForm from "./PasswordChange";
import withAuthorization from "./withAuthorization";
import profile1 from "./img/profile/1.png";

import { firebase } from "../firebase";

class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.state = { uid: "", profile: "1.png" };
  }

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };
  componentDidMount() {
    if (firebase.auth.currentUser !== null) {
      this.setState({ uid: firebase.auth.currentUser.uid });
    }
  }
  render() {
    let profile;
    if (this.state.profile === "1.png") profile = profile1;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div style={{ margin: "75px" }}>
            <h1>Account: {authUser.email}</h1>
            <img
              src={profile}
              alt="profile"
              style={{ width: "250px", borderRadius: "50%" }}
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
