import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">STREMR</h1>
        </header>
        <ul id="topNews"></ul>
        <ul id="politics"></ul>
      </div>
    );
  }
}

export default App;