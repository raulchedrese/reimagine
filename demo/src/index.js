import React, { Component } from "react";
import { render } from "react-dom";
import "./main.css";

import Example from "../../src";

class Demo extends Component {
  render() {
    return (
      <div className="main">
        <h1>image-crop Demo</h1>
        <Example />
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
