import React, { Component } from "react";
import { Link } from "react-router-dom";

import Home from "./Home";
import Account from "./Account";
import AuthUserContext from "./AuthUserContext";
import SignOutButton from "./SignOut";
import * as routes from "../constants/routes";

import logo from "./img/logotransparent.png";
import profile1 from "./img/profile/1.png";
import ListItem from "@material-ui/core/ListItem";

import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Divider from "@material-ui/core/Divider";
import MenuIcon from "@material-ui/icons/Menu";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "100vh",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  appBar: {
    position: "absolute",
    backgroundColor: "black",
    marginLeft: drawerWidth,
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up("md")]: {
      position: "relative"
    }
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  }
});

class ResponsiveDrawer extends React.Component {
  state = {
    mobileOpen: false
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { classes, theme, isHome } = this.props;

    const drawer = (
      <div style={{ height: "100vh", backgroundColor: "#b0b8c4" }}>
        <div className={classes.toolbar} />
        <div style={{ textAlign: "center" }}>
          <img src={logo} alt="UMxercise" style={{ width: "200px" }} />
        </div>
        <Divider />
        <div style={{ textAlign: "center" }}>
          <img
            src={profile1}
            alt="profile"
            style={{ width: "150px", borderRadius: "50%", margin: "10px" }}
          />
        </div>
        <Divider />
        <List>
          <ListItem button component={Link} to={routes.HOME}>
            Home
          </ListItem>
          <ListItem button component={Link} to={routes.ACCOUNT}>
            Account
          </ListItem>
          <ListItem>
            <SignOutButton />
          </ListItem>
        </List>
        <Divider />
      </div>
    );

    let pageTitle, pageElement;
    if (isHome) {
      pageTitle = "Home";
      pageElement = <Home />;
    } else {
      pageTitle = "Account";
      pageElement = <Account />;
    }

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              {pageTitle}
            </Typography>
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <main
          className={classes.content}
          style={{ backgroundColor: "#fbd157" }}
        >
          <div className={classes.toolbar} />
          {pageElement}
        </main>
      </div>
    );
  }
}

const NavigationAuthStyled = withStyles(styles, { withTheme: true })(
  ResponsiveDrawer
);

const Navigation = props => (
  <AuthUserContext.Consumer>
    {authUser => (authUser ? <NavigationAuthStyled {...props} /> : <div />)}
  </AuthUserContext.Consumer>
);

export default Navigation;
