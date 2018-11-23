import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { auth, db } from "../firebase";
import * as routes from "../constants/routes";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const SignUpPage = ({ history }) => (
  <div>
    <SignUpForm history={history} />
  </div>
);

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE, open: false };
  }
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  onSubmit = event => {
    const { username, email, passwordOne } = this.state;
    const { history } = this.props;
    auth
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        console.log(authUser);
        // create profile in realtime db
        db.doCreateUser(authUser.user.uid, username, email)
          .then(() => {
            this.setState({ ...INITIAL_STATE, open: false });
            history.push(routes.HOME);
          })
          .catch(error => {
            this.setState(byPropKey("error", error));
          });
      })
      .catch(error => {
        this.setState(byPropKey("error", error));
      });
    event.preventDefault();
    this.handleClose();
  };
  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";

    return (
      <div style={{ textAlign: "center", marginTop: 13 }}>
        <Button onClick={this.handleClickOpen}>Sign up Now</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Just a few steps from being our members! Thank you for joining
              UMxercise!
            </DialogContentText>
            <TextField
              type="text"
              style={{ marginTop: 15 }}
              value={username}
              onChange={event =>
                this.setState(byPropKey("username", event.target.value))
              }
              placeholder="Full Name"
              fullWidth
            />
            <TextField
              type="text"
              style={{ marginTop: 15 }}
              fullWidth
              value={email}
              onChange={event =>
                this.setState(byPropKey("email", event.target.value))
              }
              placeholder="Full Email Address"
            />
            <TextField
              type="password"
              style={{ marginTop: 15 }}
              fullWidth
              value={passwordOne}
              onChange={event =>
                this.setState(byPropKey("passwordOne", event.target.value))
              }
              placeholder="Password"
            />
            <TextField
              type="password"
              style={{ marginTop: 15 }}
              fullWidth
              value={passwordTwo}
              onChange={event =>
                this.setState(byPropKey("passwordTwo", event.target.value))
              }
              placeholder="Confirm Password"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={isInvalid}
              onClick={this.onSubmit}
              color="primary"
            >
              Sign Up
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withRouter(SignUpPage);
