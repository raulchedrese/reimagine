import React, { Component } from "react";
import { render } from "react-dom";
import "./main.css";

import Example from "../../src";

class Demo extends Component {
  render() {
    return (
      <div className="main">
        <h1>React Image Uploder</h1>
        <Example />

        {/* <div className="container">
          <Example />
          <div>
            <dl>
              <dt>First Name</dt>
              <dd>Malcom</dd>
              <dt>Last Name</dt>
              <dd>Reynolds</dd>
              <dt>Age</dt>
              <dd>34</dd>
            </dl>
          </div>
        </div> */}
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
