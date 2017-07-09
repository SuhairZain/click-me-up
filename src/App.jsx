import React, { Component } from "react";

import { COLOR_BG, COLOR_TEXT } from "./utils/colors.js";

const styles = {
  root: {
    alignItems: "center",
    backgroundColor: COLOR_BG,
    display: "flex",
    flex: 1,
    justifyContent: "center",
    padding: 24
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return <div style={styles.root} />;
  }
}

export default App;
