import React, { Component } from "react";
import SignIn from "./SignIn";

import withAuthorization from "./withAuthorization";

import { withStyles } from "@material-ui/core";

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
  componentDidMount() {
    const rippleSettings = {
      maxSize: 100,
      animationSpeed: 7,
      strokeColor: [39, 78, 122]
    };

    const canvasSettings = {
      blur: 8,
      ratio: 1
    };

    function Coords(x, y) {
      this.x = x || null;
      this.y = y || null;
    }

    const Ripple = function Ripple(x, y, circleSize, ctx) {
      this.position = new Coords(x, y);
      this.circleSize = circleSize;
      this.maxSize = rippleSettings.maxSize;
      this.opacity = 1;
      this.ctx = ctx;
      this.strokeColor = `rgba(${Math.floor(rippleSettings.strokeColor[0])},
        ${Math.floor(rippleSettings.strokeColor[1])},
        ${Math.floor(rippleSettings.strokeColor[2])},
        ${this.opacity})`;

      this.animationSpeed = rippleSettings.animationSpeed;
      this.opacityStep = this.animationSpeed / (this.maxSize - circleSize) / 2;
    };

    Ripple.prototype = {
      update: function update() {
        this.circleSize = this.circleSize + this.animationSpeed;
        this.opacity = this.opacity - this.opacityStep;
        this.strokeColor = `rgba(${Math.floor(rippleSettings.strokeColor[0])},
          ${Math.floor(rippleSettings.strokeColor[1])},
          ${Math.floor(rippleSettings.strokeColor[2])},
          ${this.opacity})`;
      },
      draw: function draw() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.arc(
          this.position.x,
          this.position.y,
          this.circleSize,
          0,
          2 * Math.PI
        );
        this.ctx.stroke();
      },
      setStatus: function setStatus(status) {
        this.status = status;
      }
    };

    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    const ripples = [];

    const height = document.body.clientHeight;
    const width = document.body.clientWidth;

    canvas.style.filter = `blur(${canvasSettings.blur}px)`;

    canvas.width = width * canvasSettings.ratio;
    canvas.height = height * canvasSettings.ratio;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    let animationFrame;

    // Function which is executed on mouse hover on canvas
    const canvasMouseOver = e => {
      const x = e.clientX * canvasSettings.ratio;
      const y = e.clientY * canvasSettings.ratio;
      ripples.unshift(new Ripple(x, y, 2, ctx));
    };

    const animation = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const length = ripples.length;
      for (let i = length - 1; i >= 0; i -= 1) {
        const r = ripples[i];

        r.update();
        r.draw();

        if (r.opacity <= 0) {
          ripples[i] = null;
          delete ripples[i];
          ripples.pop();
        }
      }
      animationFrame = window.requestAnimationFrame(animation);
    };

    animation();
    canvas.addEventListener("mousemove", canvasMouseOver);
  }
  render() {
    const { classes } = this.props;
    return (
      <div id="canvas-wrap" style={{ position: "relative" }}>
        <canvas id="canvas" width="1000" height="1000" />
        <div
          id="overlay"
          style={{
            position: "absolute",
            top: "20px",
            left: "30px",
            textAlign: "center",
            marginLeft: "25%"
          }}
        >
          <div className={classes.logo}>
            <img src={logo} alt="UMxercise" className={classes.logoImg} />
          </div>
          <h1 className={classes.title}>Link your sports with friends.</h1>
          <SignIn />
        </div>
      </div>
    );
  }
}

const LandingStyled = withStyles(styles)(Landing);

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition, true)(LandingStyled);
