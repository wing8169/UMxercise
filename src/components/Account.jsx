import React from "react";

import AuthUserContext from "./AuthUserContext";
import PasswordChangeForm from "./PasswordChange";
import withAuthorization from "./withAuthorization";

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div style={{ margin: "75px" }}>
        <h1>Account: {authUser.email}</h1>
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(AccountPage);
