import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faNewspaper, faGlobeAmericas, faArrowUp, faMapPin } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faGlobeAmericas)
library.add(faNewspaper)
library.add(faArrowUp)
library.add(faMapPin)

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Stremr</h1>
        </header>
        <div id="newsSelect">
          <ul>
            <li className="top"><FontAwesomeIcon icon="arrow-up" />Top News</li>
            <li className="us"><FontAwesomeIcon icon="map-pin" />US News</li>
            <li className="world"><FontAwesomeIcon icon="globe-americas" />World News</li>
            <li className="politics"><FontAwesomeIcon icon="globe-americas" />Politics</li>
            <li className="sports"><FontAwesomeIcon icon="globe-americas" />Sports</li>
          </ul>
        </div>
        <div id="newsList">
          <ul id="topNews"></ul>
          <ul id="politics"></ul>
        </div>
      </div>
    );
  }
}

export default App;