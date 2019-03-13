import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faNewspaper, faGlobeAmericas, faArrowUp, faMapPin, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NewsList from './components/NewsList';
import MenuNav from './components/MenuNav';

library.add(faGlobeAmericas)
library.add(faNewspaper)
library.add(faArrowUp)
library.add(faMapPin)
library.add(faUserCog)

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { isEmptyState: true, selectedMenu: "topNews" }
  }

  handleMenu = (menuValue) => {
    this.setState({selectedMenu: menuValue});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-title">stremr</div>
          <MenuNav onSelectMenu={this.handleMenu} />
          {/* <div className="Header-icons">
            <div className="icon"><FontAwesomeIcon icon="user-cog" /></div>
          </div> */}
        </header>
        <div id="newsList">
          {this.state.selectedMenu == "topNews" && <NewsList category="topNews"/>}
          {this.state.selectedMenu == "politics" && <NewsList category="politics"/>}
          {this.state.selectedMenu == "world" && <NewsList category="world"/>}
          {this.state.selectedMenu == "sports" && <NewsList category="sports"/>}
        </div>
      </div>
    );
  }
}

export default App;