import React, { Component } from 'react';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state={dataAvailable: false,
                dataReceived: []}
  }

  render() {
    return (
      <div className="App">
      </div>
    );
  }
}

export default App;
