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
      tileData: [],
      tileData2: [],
      uid: "",
      userData: {},
      activities: {},
      openCreateActivityDialog: false,
      openSuccess: false,
      openJoinSuccess: false
    };
  }
  componentDidMount() {
    if (firebase.auth.currentUser !== null) {
      this.setState({ uid: firebase.auth.currentUser.uid });
      db.onceGetUser(firebase.auth.currentUser.uid).then(snapshot => {
        this.setState({ userData: snapshot.val() }, () => {
          db.onceGetActivities().then(snapshot => {
            let tmp = snapshot.val();
            if (tmp == null) tmp = {};
            this.setState({ activities: tmp }, () => {
              let tmpUse = this.state.userData;
              if (tmpUse.activities == null) tmpUse.activities = [];
              let tmpAct = this.state.activities;
              let td = [];
              let td2 = [];
              if (tmpAct) {
                Object.keys(tmpAct).forEach(function(key) {
                  if (
                    tmpUse.activities.includes(key) &&
                    tmpAct[key].time >= new Date().getTime()
                  ) {
                    td.push(tmpAct[key]);
                  }
                  if (
                    !tmpUse.activities.includes(key) &&
                    tmpAct[key].time >= new Date().getTime()
                  ) {
                    td2.push(tmpAct[key]);
                  }
                });
              }
              this.setState({ tileData: td, tileData2: td2 });
            });
          });
        });
      });
    }
  }
  handleCloseJoinSuccess = () => {
    this.setState({ openJoinSuccess: false });
  };
  handleCloseCreateActivityDialog = () => {
    this.setState({ openCreateActivityDialog: false });
  };
  handleOpenCreateActivityDialog = () => {
    this.setState({ openCreateActivityDialog: true });
  };
  handleCloseSuccess = () => {
    this.setState({ openSuccess: false });
  };
  createActivity = (name, place, time, url) => {
    db.doCreateActivity(
      name,
      place,
      new Date(time).getTime(),
      url,
      this.state.userData.username,
      this.state.uid,
      [this.state.userData.username],
      () => {
        this.setState({ openCreateActivityDialog: false });
        this.setState({ openSuccess: true });
        db.onceGetUser(firebase.auth.currentUser.uid).then(snapshot => {
          this.setState({ userData: snapshot.val() }, () => {
            db.onceGetActivities().then(snapshot => {
              let tmp = snapshot.val();
              if (tmp == null) tmp = {};
              this.setState({ activities: tmp }, () => {
                let tmpUse = this.state.userData;
                if (tmpUse.activities == null) tmpUse.activities = [];
                let tmpAct = this.state.activities;
                let td = [];
                let td2 = [];
                if (tmpAct) {
                  Object.keys(tmpAct).forEach(function(key) {
                    if (
                      tmpUse.activities.includes(key) &&
                      tmpAct[key].time >= new Date().getTime()
                    ) {
                      td.push(tmpAct[key]);
                    }
                    if (
                      !tmpUse.activities.includes(key) &&
                      tmpAct[key].time >= new Date().getTime()
                    ) {
                      td2.push(tmpAct[key]);
                    }
                  });
                }
                this.setState({ tileData: td, tileData2: td2 });
              });
            });
          });
        });
      }
    );

    // window.location.reload();
  };
  handleJoinActivity = aid => e => {
    db.onceGetUser(this.state.uid).then(snapshot => {
      // get the latest user data
      let temp = snapshot.val();
      // if the activity id already in user data, don't update
      if (temp.activities == null) temp.activities = [];
      if (temp.activities.includes(aid)) {
        return;
      }
      // get data of the activity
      db.onceGetActivity(aid).then(snapshot2 => {
        let tmp = snapshot2.val();
        // push the user id into activity members
        tmp.members.push(this.state.userData.username);
        // update the database
        db.doJoinActivity(aid, tmp.members, () => {
          // update the database
          db.doAddActivity(this.state.uid, aid, () => {
            this.setState({ openCreateActivityDialog: false });
            this.setState({ openSuccess: true });
            db.onceGetUser(firebase.auth.currentUser.uid).then(snapshot => {
              this.setState({ userData: snapshot.val() }, () => {
                db.onceGetActivities().then(snapshot => {
                  let tmp = snapshot.val();
                  if (tmp == null) tmp = {};
                  this.setState({ activities: tmp }, () => {
                    let tmpUse = this.state.userData;
                    if (tmpUse.activities == null) tmpUse.activities = [];
                    let tmpAct = this.state.activities;
                    let td = [];
                    let td2 = [];
                    if (tmpAct) {
                      Object.keys(tmpAct).forEach(function(key) {
                        if (
                          tmpUse.activities.includes(key) &&
                          tmpAct[key].time >= new Date().getTime()
                        ) {
                          td.push(tmpAct[key]);
                        }
                        if (
                          !tmpUse.activities.includes(key) &&
                          tmpAct[key].time >= new Date().getTime()
                        ) {
                          td2.push(tmpAct[key]);
                        }
                      });
                    }
                    this.setState({ tileData: td, tileData2: td2 }, () => {
                      // pop out success message
                      this.setState({
                        openJoinSuccess: true
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  };
  render() {
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
          open={this.state.openJoinSuccess}
          autoHideDuration={6000}
          onClose={this.handleCloseJoinSuccess}
          ContentProps={{
            "aria-describedby": "message-id2"
          }}
          message={
            <span id="message-id2">
              You have successfully joined an activity! Check your scheduled
              activities for further updates on your activity!
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleCloseJoinSuccess}
            >
              <CloseIcon />
            </IconButton>
          ]}
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
            <h3>Welcome back, {this.state.userData.username} !</h3>
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
            <ActivitiesGridListStyled
              joined={true}
              tileData={this.state.tileData}
            />
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
              tileData={this.state.tileData2}
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
                "1": {
                  title: "Simple Ways to Live a Healthy Lifestyle",
                  desc: "by Paige Waehner",
                  url:
                    "https://www.verywellfit.com/simple-ways-to-live-a-healthy-lifestyle-1231193",
                  img: "1"
                },
                "2": {
                  title: "3 Ways to Make Your Exercise Habit Stick",
                  desc: "by Paige Waehner",
                  url:
                    "https://www.verywellfit.com/ways-to-make-your-exercise-habit-stick-4142816",
                  img: "2"
                },
                "3": {
                  title: "The Benefits of Healthy Habits",
                  desc: "by Healthline Editorial Team",
                  url:
                    "https://www.healthline.com/health/5-benefits-healthy-habits",
                  img: "3"
                },
                "4": {
                  title: "Importance Of Healthy Lifestyles",
                  desc: "by ANGELA OSWALT, MSW",
                  url:
                    "https://www.mentalhelp.net/articles/importance-of-healthy-lifestyles/",
                  img: "4"
                },
                "5": {
                  title:
                    "10 Reasons Why You Need To Embrace A Healthy Lifestyle",
                  desc: "by Nina Redza",
                  url:
                    "https://www.streetdirectory.com/travel_guide/46811/lose_weight/10_reasons_why_you_need_to_embrace_a_healthy_lifestyle.html",
                  img: "5"
                },
                "6": {
                  title: "Top Ways to Make Exercise Fun",
                  desc: "by Mark Stibich",
                  url:
                    "https://www.verywellfit.com/top-ways-to-make-exercise-fun-2223778",
                  img: "6"
                },
                "7": {
                  title: "7 Ways to Boost Your Workout Plan",
                  desc: "by Malia Frey",
                  url:
                    "https://www.verywellfit.com/how-to-boost-your-workout-plan-3495620",
                  img: "7"
                },
                "8": {
                  title: "Changing Your Lifestyle",
                  desc: "by Tanya Whitfield",
                  url:
                    "http://www.weightloss.com.au/healthy-lifestyle/healthy-lifestyle-articles/changing-your-lifestyle.html",
                  img: "8"
                },
                "9": {
                  title: "Tips to Avoid Holiday Weight Gain",
                  desc: "by Tim Lamborn",
                  url:
                    "http://www.weightloss.com.au/healthy-lifestyle/healthy-lifestyle-articles/avoiding-holiday-weight-gain.html",
                  img: "9"
                },
                "10": {
                  title: "Long-Term Effects of Aerobic Exercise",
                  desc: "by Betty Holt",
                  url:
                    "https://www.livestrong.com/article/329586-long-term-effects-of-aerobic-exercise/",
                  img: "10"
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
