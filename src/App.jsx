import React, { Component } from "react";

import { COLOR_BG, COLOR_TEXT } from "./utils/colors.js";

const halfScreenStyle = {
  alignSelf: "stretch",
  flex: 1
};

const styles = {
  root: {
    alignItems: "center",
    backgroundColor: COLOR_BG,
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 24
  },
  halfScreensContainer: {
    alignSelf: "stretch",
    display: "flex",
    flex: 1
  },
  halfScreenHidden: {
    ...halfScreenStyle,
    backgroundColor: "transparent"
  },
  halfScreenShown: {
    ...halfScreenStyle,
    backgroundColor: "white"
  },
  resultText: {
    color: "white",
    fontSize: "2em"
  }
};

class App extends Component {
  constructor() {
    super();

    this.state = {
      shownHalf: "waiting",
      result: undefined
    };
  }

  getShowTime = () => {
    return (1 + Math.random() * 2) * 1000;
  };

  componentDidMount() {
    this.startShowTimer();
  }

  startShowTimer = () => {
    this.showTimer = setTimeout(() => {
      this.setState(state => ({
        ...state,
        shownHalf: Math.random() < 0.5 ? "left" : "right",
        result: undefined
      }));
      this.startHideTimer();
    }, this.getShowTime());
  };

  startHideTimer = () => {
    this.hideTimer = setTimeout(() => {
      this.setState(
        state => ({
          ...state,
          shownHalf: "hidden",
          result: "late"
        }),
        () => {
          this.startShowTimer();
        }
      );
    }, 1000);
  };

  getStatusText = status => {
    switch (status) {
      case "correct":
        return "Oh Hoy!";
      case "incorrect":
        return "Nah! That wasn’t it";
      case "late":
        return "Too late";
      case "early":
        return "Have some patience!";
      default:
        return "";
    }
  };

  getStyleForHalf = half =>
    this.state.shownHalf && this.state.shownHalf === half
      ? styles.halfScreenShown
      : styles.halfScreenHidden;

  getResultForClick = (currentHalf, clickedHalf) => {
    switch (currentHalf) {
      case "waiting":
        return "early";
      case "hidden":
        return "late";
      case "left":
        return clickedHalf === "left" ? "correct" : "incorrect";
      case "right":
        return clickedHalf === "right" ? "correct" : "incorrect";
      default:
        console.error("Unknown state");
    }
  };

  onClickContainer = event => {
    const clickedHalf = event.pageX < window.innerWidth / 2 ? "left" : "right";
    this.showTimer && clearTimeout(this.showTimer);
    this.hideTimer && clearTimeout(this.hideTimer);
    this.setState(
      state => ({
        ...state,
        shownHalf: "waiting",
        result: this.getResultForClick(state.shownHalf, clickedHalf)
      }),
      () => {
        this.startShowTimer();
      }
    );
  };

  render() {
    const { shownHalf } = this.state;
    return (
      <div onClick={this.onClickContainer} style={styles.root}>
        <div style={styles.halfScreensContainer}>
          <div style={this.getStyleForHalf("left")} />
          <div style={this.getStyleForHalf("right")} />
        </div>
        <span style={styles.resultText}>
          {this.getStatusText(this.state.result)}
        </span>
      </div>
    );
  }
}

export default App;
