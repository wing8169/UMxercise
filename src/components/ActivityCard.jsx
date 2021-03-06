import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import sportsLogo from "./img/sports/1.jpg";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// Activity Card
const styles = {
  card: {
    maxWidth: 345,
    boxShadow: "0 8px 6px -6px black"
  },
  media: {
    height: 140
  }
};

Date.prototype.customFormat = function(formatString) {
  var YYYY,
    YY,
    MMMM,
    MMM,
    MM,
    M,
    DDDD,
    DDD,
    DD,
    D,
    hhhh,
    hhh,
    hh,
    h,
    mm,
    m,
    ss,
    s,
    ampm,
    AMPM,
    dMod,
    th;
  YY = ((YYYY = this.getFullYear()) + "").slice(-2);
  MM = (M = this.getMonth() + 1) < 10 ? "0" + M : M;
  MMM = (MMMM = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ][M - 1]).substring(0, 3);
  DD = (D = this.getDate()) < 10 ? "0" + D : D;
  DDD = (DDDD = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ][this.getDay()]).substring(0, 3);
  th =
    D >= 10 && D <= 20
      ? "th"
      : (dMod = D % 10) == 1
      ? "st"
      : dMod == 2
      ? "nd"
      : dMod == 3
      ? "rd"
      : "th";
  formatString = formatString
    .replace("#YYYY#", YYYY)
    .replace("#YY#", YY)
    .replace("#MMMM#", MMMM)
    .replace("#MMM#", MMM)
    .replace("#MM#", MM)
    .replace("#M#", M)
    .replace("#DDDD#", DDDD)
    .replace("#DDD#", DDD)
    .replace("#DD#", DD)
    .replace("#D#", D)
    .replace("#th#", th);
  h = hhh = this.getHours();
  if (h == 0) h = 24;
  if (h > 12) h -= 12;
  hh = h < 10 ? "0" + h : h;
  hhhh = hhh < 10 ? "0" + hhh : hhh;
  AMPM = (ampm = hhh < 12 ? "am" : "pm").toUpperCase();
  mm = (m = this.getMinutes()) < 10 ? "0" + m : m;
  ss = (s = this.getSeconds()) < 10 ? "0" + s : s;
  return formatString
    .replace("#hhhh#", hhhh)
    .replace("#hhh#", hhh)
    .replace("#hh#", hh)
    .replace("#h#", h)
    .replace("#mm#", mm)
    .replace("#m#", m)
    .replace("#ss#", ss)
    .replace("#s#", s)
    .replace("#ampm#", ampm)
    .replace("#AMPM#", AMPM);
};

class ActivityCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  render() {
    const { classes, activity, joined } = this.props;
    let button;
    if (joined)
      button = (
        <Button
          size="small"
          color="primary"
          onClick={() => window.open(activity.url, "_blank")}
        >
          Enter Chatroom
        </Button>
      );
    else {
      button = (
        <Button
          size="small"
          color="primary"
          onClick={this.props.handleJoinActivity(activity.id)}
        >
          Join Now&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </Button>
      );
    }
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Joined Members</DialogTitle>
          <DialogContent>
            {this.props.activity.members.map((item, index) => (
              <DialogContentText>{item}</DialogContentText>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              title="Sports"
              style={{ textAlign: "center" }}
            >
              <img src={sportsLogo} alt="Sports" style={{ height: "100%" }} />
            </CardMedia>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {activity.name}
              </Typography>
              <Typography component="p">
                At {activity.place} at{" "}
                {new Date(activity.time).customFormat(
                  "#DD#/#MM#/#YYYY# #hh#:#mm#:#ss#"
                )}{" "}
                by {activity.host}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            {button}
            <Button size="small" color="primary" onClick={this.handleOpen}>
              Joined members
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

const ActivityCardStyled = withStyles(styles)(ActivityCard);

export default ActivityCardStyled;
