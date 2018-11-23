import React from "react";
import { withRouter } from "react-router-dom";

import AuthUserContext from "./AuthUserContext";
import { firebase } from "../firebase";
import * as routes from "../constants/routes";

const withAuthorization = (authCondition, reverse) => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        if (reverse && authCondition(authUser))
          this.props.history.push(routes.HOME);
        else if (!reverse && !authCondition(authUser)) {
          this.props.history.push(routes.LANDING);
        }
      });
    }
    render() {
      if (reverse) {
        return (
          <AuthUserContext.Consumer>
            {authUser => (!authUser ? <Component {...this.props} /> : null)}
          </AuthUserContext.Consumer>
        );
      }
      return (
        <AuthUserContext.Consumer>
          {authUser => (authUser ? <Component {...this.props} /> : null)}
        </AuthUserContext.Consumer>
      );
    }
  }
  return withRouter(WithAuthorization);
};

export default withAuthorization;
