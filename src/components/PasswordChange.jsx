import React, { Component } from "react";

import { auth } from "../firebase";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    auth
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState(byPropKey("error", error));
      });

    event.preventDefault();
  };

  render() {
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

    return (
      <div>
        <h3>Change Password</h3>
        <form onSubmit={this.onSubmit} style={{ marginTop: "0px" }}>
          <TextField
            value={passwordOne}
            onChange={event =>
              this.setState(byPropKey("passwordOne", event.target.value))
            }
            type="password"
            placeholder="New Password"
            style={{ display: "block", marginBottom: "20px" }}
          />
          <TextField
            value={passwordTwo}
            onChange={event =>
              this.setState(byPropKey("passwordTwo", event.target.value))
            }
            type="password"
            placeholder="Confirm New Password"
            style={{ display: "block", marginBottom: "20px" }}
          />
          <Button variant="outlined" disabled={isInvalid} type="submit">
            Reset My Password
          </Button>

          {error && <p>{error.message}</p>}
        </form>
      </div>
    );
  }
}

export default PasswordChangeForm;
