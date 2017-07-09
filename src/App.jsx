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
      result: undefined,
      count: {
        success: 0,
        failure: 0
      },
      lastHideTime: 1000
    };
  }

  getShowTime = () => {
    return (1 + Math.random() * 2) * 1000;
  };

  getHideTime = () => {
    const { lastHideTime } = this.state;
    const { success, failure } = this.state.count;
    const successPercentage = success / (success + failure);

    let correctedTime;
    if (success + failure === 0 || successPercentage === 0.8) {
      correctedTime = lastHideTime;
    } else if (successPercentage < 0.8) {
      correctedTime = lastHideTime + 100;
    } else {
      correctedTime = lastHideTime - 100;
    }

    correctedTime = correctedTime <= 0 ? 100 : correctedTime;
    this.setState(state => ({
      ...state,
      lastHideTime: correctedTime
    }));
    return correctedTime;
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
      this.setState(state => ({
        ...state,
        shownHalf: "hidden",
        result: "late",
        count: this.getCountForResult("late", state.count)
      }));
      this.startShowTimer();
    }, this.getHideTime());
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

  getResultForClick = (shownHalf, clickedHalf) => {
    switch (shownHalf) {
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

  getCountForResult = (result, count) => {
    return result === "correct"
      ? {
          ...count,
          success: count.success + 1
        }
      : {
          ...count,
          failure: count.failure + 1
        };
  };

  getResultAndCount = (shownHalf, clickedHalf, count) => {
    const result = this.getResultForClick(shownHalf, clickedHalf);
    return {
      result,
      count: this.getCountForResult(result, count)
    };
  };

  onClickContainer = event => {
    const clickedHalf = event.pageX < window.innerWidth / 2 ? "left" : "right";
    this.showTimer && clearTimeout(this.showTimer);
    this.hideTimer && clearTimeout(this.hideTimer);
    this.setState(
      state => ({
        ...state,
        shownHalf: "waiting",
        ...this.getResultAndCount(state.shownHalf, clickedHalf, state.count)
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
