import React, { Component } from 'react';
import './App.css';
import splash from './animation/splash';

class App extends Component {
  componentDidMount(){
    new splash();
  }
  render() {
    return (
      <div className="App">
        <div className="background"></div>
      </div>
    );
  }
}

export default App;
