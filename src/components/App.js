import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import withAuthentication from "./withAuthentication";

import LandingPage from "./Landing";
import Navigation from "./Navigation";

import * as routes from "../constants/routes";

const HomePage = props => {
  return <Navigation {...props} isHome={true} />;
};

const Account = props => {
  return <Navigation {...props} isHome={false} />;
};

const App = () => (
  <Router>
    <div>
      <Route exact path={routes.LANDING} component={LandingPage} />
      <Route exact path={routes.HOME} render={HomePage} />
      <Route exact path={routes.ACCOUNT} render={Account} />
    </div>
  </Router>
);

export default withAuthentication(App);
