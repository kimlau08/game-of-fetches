import React, { Component } from 'react';
import './App.css';

import axios from 'axios';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state={dataAvailable: false,
                dataReceived: []}
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div className="App">
          <h1>Game of Throne Questions & Answers</h1>
      </div>
    );
  }
}

