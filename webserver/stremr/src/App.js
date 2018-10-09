import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faNewspaper, faGlobeAmericas, faArrowUp, faMapPin, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faGlobeAmericas)
library.add(faNewspaper)
library.add(faArrowUp)
library.add(faMapPin)
library.add(faUserCog)

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-title">stremr</div>
          <div className="dropdown">
            <div><FontAwesomeIcon icon="arrow-up" /> Top News</div>
            <div className="dropdown-content">
              <p>Hello World!</p>
            </div>
          </div>
          <div className="Header-icons">
            <div className="icon"><FontAwesomeIcon icon="user-cog" /></div>
          </div>
        </header>
        {/* <div id="newsSelect">
          <ul>
            <li className="top"><FontAwesomeIcon icon="arrow-up" />Top</li>
            <li className="us"><FontAwesomeIcon icon="map-pin" />US</li>
            <li className="world"><FontAwesomeIcon icon="globe-americas" />World</li>
            <li className="politics"><FontAwesomeIcon icon="globe-americas" />Politics</li>
            <li className="sports"><FontAwesomeIcon icon="globe-americas" />Sports</li>
          </ul>
        </div> */}
        <div id="newsList">
          <ul id="topNews"></ul>
          <ul id="politics"></ul>
        </div>
      </div>
    );
  }
}

export default App;