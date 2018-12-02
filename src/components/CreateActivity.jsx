import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const INITIAL_STATE = {
  name: "",
  place: "",
  time: "",
  url: ""
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value
});

export default class CreateActivity extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  render() {
    const { name, place, time, url } = this.state;

    const isInvalid = name === "" || place === "" || time === "" || url === "";

    return (
      <div style={{ textAlign: "center", marginTop: 13 }}>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create New Activity</DialogTitle>
          <DialogContent>
            <DialogContentText>Create a new activity now!</DialogContentText>
            <TextField
              type="text"
              style={{ marginTop: 15 }}
              value={name}
              onChange={event => this.setState({ name: event.target.value })}
              placeholder="Name of the activity"
              fullWidth
            />
            <TextField
              type="text"
              style={{ marginTop: 15 }}
              fullWidth
              value={place}
              onChange={event => this.setState({ place: event.target.value })}
              placeholder="Venue"
            />
            <TextField
              type="datetime-local"
              style={{ marginTop: 15 }}
              fullWidth
              value={time}
              onChange={event => this.setState({ time: event.target.value })}
              InputLabelProps={{
                shrink: true
              }}
              label="Date and time"
            />
            <TextField
              type="text"
              style={{ marginTop: 15 }}
              fullWidth
              value={url}
              onChange={event => this.setState({ url: event.target.value })}
              placeholder="URL to WhatsApp Group"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={isInvalid}
              onClick={() =>
                this.props.createActivity(
                  this.state.name,
                  this.state.place,
                  this.state.time,
                  this.state.url
                )
              }
              color="primary"
            >
              Create activity now
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
