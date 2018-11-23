import React, { Component } from "react";
import SignIn from "./SignIn";

import withAuthorization from "./withAuthorization";

import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import logo from "./img/logo.PNG";

const styles = {
  logo: {
    width: "auto",
    height: "auto",
    textAlign: "center",
    margin: 0
  },

  logoImg: {
    display: "inline-block",
    margin: 0
  },

  title: {
    textAlign: "center",
    marginTop: 0,
    padding: 15
  },
  paper: {
    backgroundColor: "black",
    color: "white",
    paddingTop: 75,
    paddingBottom: 75
  }
};

class Landing extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <div className={classes.logo}>
              <img src={logo} alt="UMxercise" className={classes.logoImg} />
            </div>
          </Grid>
          <Grid item xs={12}>
            <h1 className={classes.title}>Link your sports with friends.</h1>
          </Grid>
          <Grid item xs={12}>
            <SignIn />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const LandingStyled = withStyles(styles)(Landing);

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition, true)(LandingStyled);
