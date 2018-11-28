import React, { Component } from "react";

import withAuthorization from "./withAuthorization";
import { db, firebase } from "../firebase";

import CreateActivity from "./CreateActivity";
import ActivityCardStyled from "./ActivityCard";
import ArticleCardStyled from "./ArticleCard";
import Grid from "@material-ui/core/Grid";
import { Divider } from "@material-ui/core";

import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import Button from "@material-ui/core/Button";

import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

// activities: [
//   id: {
//       activity:
//       place:
//       time:
//       creatorID:
//       creatorName:
//       createdTime:
//       joinedMembers:
//       active:
//   }
// ]

// users:[
//   id:{
//       username:
//       email:
//       activities:[]
//   }
// ]

// Lists of activities joined
const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    width: "80vw"
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)"
    // height: "100%"
  },
  title: {
    color: "white"
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 90%, rgba(0,0,0,0) 100%)"
  }
});

const ActivitiesGridList = props => {
  const { classes, tileData, joined, handleJoinActivity } = props;

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={4}>
        {Object.keys(tileData).map(key => (
          <GridListTile
            key={key}
            style={{
              height: "320px",
              margin: "10px",
              marginTop: "0px",
              width: "300px"
            }}
          >
            <ActivityCardStyled
              key={key}
              activity={tileData[key]}
              joined={joined}
              handleJoinActivity={handleJoinActivity}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

const ActivitiesGridListStyled = withStyles(styles)(ActivitiesGridList);

const ArticlesGridList = props => {
  const { classes, tileData } = props;

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={4}>
        {Object.keys(tileData).map(key => (
          <GridListTile
            key={key}
            style={{
              height: "320px",
              margin: "10px",
              marginTop: "0px",
              width: "300px"
            }}
          >
            <ArticleCardStyled article={tileData[key]} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

const ArticlesGridListStyled = withStyles(styles)(ArticlesGridList);

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      userData: {},
      activities: {},
      openCreateActivityDialog: false,
      openSuccess: false
    };
  }
  componentDidMount() {
    if (firebase.auth.currentUser !== null) {
      this.setState({ uid: firebase.auth.currentUser.uid });
      db.onceGetUser(firebase.auth.currentUser.uid).then(snapshot => {
        this.setState({ userData: snapshot.val() });
      });
      db.onceGetActivities().then(snapshot => {
        let tmp = snapshot.val();
        if (tmp == null) tmp = {};
        this.setState({ activities: tmp });
      });
    }
  }
  handleCloseCreateActivityDialog = () => {
    this.setState({ openCreateActivityDialog: false });
  };
  handleOpenCreateActivityDialog = () => {
    this.setState({ openCreateActivityDialog: true });
  };
  handleCloseSuccess = () => {
    this.setState({ openSuccess: false });
  };
  createActivity = (name, place, time) => {
    db.doCreateActivity(
      name,
      place,
      new Date(time).getTime(),
      this.state.userData.email,
      this.state.uid,
      [this.state.userData.email]
    );

    this.setState({ openCreateActivityDialog: false });
    this.setState({ openSuccess: true });

    window.location.reload();
  };
  handleJoinActivity = aid => {
    db.onceGetUser(this.state.uid).then(snapshot => {
      // get the latest user data
      let temp = snapshot.val();
      // if the activity id already in user data, don't update
      if (temp.activities == null) temp.activities = [];
      if (temp.activities.includes(aid)) return;
      // get data of the activity
      db.onceGetActivity(aid).then(snapshot2 => {
        let tmp = snapshot2.val();
        // push the user id into activity members
        tmp.members.push(this.state.userData.email);
        // update the database
        db.doJoinActivity(aid, tmp.members);
      });
      // update the database
      db.doAddActivity(this.state.uid, aid);
      // update local
      db.onceGetUser(this.state.uid).then(snapshot => {
        this.setState({ userData: snapshot.val() });
      });
      db.onceGetActivities().then(snapshot => {
        let tmp = snapshot.val();
        if (tmp == null) tmp = {};
        this.setState({ activities: tmp });
      });
    });
  };
  render() {
    let tileData = [];
    let tileData2 = [];
    let tmpUse = this.state.userData;
    if (tmpUse.activities == null) tmpUse.activities = [];
    let tmpAct = this.state.activities;
    if (tmpAct) {
      Object.keys(tmpAct).forEach(function(key) {
        if (
          tmpUse.activities.includes(key) &&
          tmpAct[key].time >= new Date().getTime()
        ) {
          tileData.push(tmpAct[key]);
        }
        if (
          !tmpUse.activities.includes(key) &&
          tmpAct[key].time >= new Date().getTime()
        ) {
          tileData2.push(tmpAct[key]);
        }
      });
    }
    return (
      <div
        style={{
          backgroundColor: "#fbd157",
          overflow: "scroll",
          height: "95%"
        }}
      >
        <CreateActivity
          open={this.state.openCreateActivityDialog}
          createActivity={this.createActivity}
          handleClose={this.handleCloseCreateActivityDialog}
        />
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
              You have successfully created an activity! Check your scheduled
              activities for further updates on your activity!
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
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <h3>Welcome back, {this.state.userData.email} !</h3>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={this.handleOpenCreateActivityDialog}
            >
              Create new sports activity
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <h3>Your scheduled activities</h3>
          </Grid>
          <Grid item xs={12}>
            <ActivitiesGridListStyled joined={true} tileData={tileData} />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <h3>Available activities</h3>
          </Grid>
          <Grid item xs={12}>
            <ActivitiesGridListStyled
              joined={false}
              tileData={tileData2}
              handleJoinActivity={this.handleJoinActivity}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <h3>Some articles related to health</h3>
          </Grid>
          <Grid item xs={12}>
            <ArticlesGridListStyled
              tileData={{
                "0": {
                  title: "Hello World",
                  desc: "Hello its me hellooooooooo",
                  url: "https://www.google.com/"
                },
                "01": {
                  title: "Hello World",
                  desc: "Hello its me hellooooooooo",
                  url: "https://www.google.com/"
                },
                "02": {
                  title: "Hello World",
                  desc: "Hello its me hellooooooooo",
                  url: "https://www.google.com/"
                },
                "03": {
                  title: "Hello World",
                  desc: "Hello its me hellooooooooo",
                  url: "https://www.google.com/"
                },
                "04": {
                  title: "Hello World",
                  desc: "Hello its me hellooooooooo",
                  url: "https://www.google.com/"
                },
                "05": {
                  title: "Hello World",
                  desc: "Hello its me hellooooooooo",
                  url: "https://www.google.com/"
                },
                "06": {
                  title: "Hello World",
                  desc: "Hello its me hellooooooooo",
                  url: "https://www.google.com/"
                },
                "07": {
                  title: "Hello World",
                  desc: "Hello its me hellooooooooo",
                  url: "https://www.google.com/"
                },
                "08": {
                  title: "Hello World",
                  desc: "Hello its me hellooooooooo",
                  url: "https://www.google.com/"
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(HomePage);
