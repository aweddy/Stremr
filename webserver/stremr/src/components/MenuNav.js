import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faNewspaper, faGlobeAmericas, faArrowUp, faMapPin, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faGlobeAmericas)
library.add(faNewspaper)
library.add(faArrowUp)
library.add(faMapPin)
library.add(faUserCog)
//import './App.css';

class MenuNav extends React.Component {
  state = {}

  handleMenuChange = () => {
      var item = this.dropdown.value;
      this.props.onSelectMenu(item);            
  }

  render() {
      return (
          <div >
              <select ref={(ref) => this.dropdown = ref} onChange={this.handleMenuChange}>
                <option value="topNews">Top</option>
                <option value="politics">Politics</option>
                <option value="world">World</option>
              </select>
          </div>            
      );
  }
}

export default MenuNav;