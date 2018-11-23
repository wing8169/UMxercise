import React, { Component } from "react";

import { auth } from "../firebase";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

const INITIAL_STATE = {
  email: "",
  error: null
};

export default class PasswordForgetForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE, open: false, openSuccess: false };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClickOpenSuccess = () => {
    this.setState({ openSuccess: true });
  };

  handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ openSuccess: false });
  };

  onSubmit = event => {
    const { email } = this.state;
    auth
      .doPasswordReset(email)
      .then(() => {
        this.handleClickOpenSuccess();
        this.setState({ ...INITIAL_STATE, open: false, openSuccess: true });
      })
      .catch(error => {
        this.setState(byPropKey("error", error));
      });

    event.preventDefault();
    this.handleClose();
  };

  render() {
    const { email } = this.state;

    const isInvalid = email === "";

    return (
      <div style={{ textAlign: "center", marginTop: 13 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={this.handleClickOpen}
        >
          Forget my password?
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Reset Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To reset your password, please enter your email address here. We
              will send an email to guide you along the way.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="text"
              value={this.state.email}
              onChange={event =>
                this.setState(byPropKey("email", event.target.value))
              }
              fullWidth
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
              Reset My Password
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.openSuccess}
          autoHideDuration={6000}
          onClose={this.handleCloseSuccess}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={
            <span id="message-id">
              An email will be sent to you, check your mail box soon! (The email
              might be recognized as junk mail)
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleCloseSuccess}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
      </div>
    );
  }
}
