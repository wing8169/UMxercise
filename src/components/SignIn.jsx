import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import SignUpPage from "./SignUp";
import PasswordForgetForm from "./PasswordForget";
import * as routes from "../constants/routes";

import { auth } from "../firebase";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core";

const SignInPage = ({ history }) => (
  <div>
    <SignInFormStyled history={history} />
    <PasswordForgetForm />
    <SignUpPage />
  </div>
);
const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

const styles = {
  alignMiddle: {
    textAlign: "center"
  },
  redColor: {
    color: "red"
  }
};

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { email, password } = this.state;
    const { history } = this.props;
    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(byPropKey("error", error));
      });
    event.preventDefault();
  };
  render() {
    const { classes } = this.props;

    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";
    return (
      <form onSubmit={this.onSubmit}>
        <Grid container spacing={24} className={classes.alignMiddle}>
          <Grid item xs={12}>
            <TextField
              type="text"
              value={email}
              onChange={event =>
                this.setState(byPropKey("email", event.target.value))
              }
              placeholder="Email Address"
              style={{ width: 250 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              value={password}
              onChange={event =>
                this.setState(byPropKey("password", event.target.value))
              }
              placeholder="Password"
              style={{ width: 250 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" disabled={isInvalid} type="submit">
              Sign In
            </Button>
          </Grid>
        </Grid>
        {error && (
          <p className={[classes.alignMiddle, classes.redColor].join(" ")}>
            {error.message}
          </p>
        )}
      </form>
    );
  }
}

const SignInFormStyled = withStyles(styles)(SignInForm);

export default withRouter(SignInPage);
