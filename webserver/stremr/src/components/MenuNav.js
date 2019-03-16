import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React, { Component } from 'react';

library.add(faChevronCircleDown);
library.add(faChevronCircleUp);

class Dropdown extends Component {
    constructor(){
        super();
        
        this.state = {
            displayMenu: false,
        };
    
        this.showDropdownMenu = this.showDropdownMenu.bind(this);
        this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
        this.menuIcon = "chevron-circle-down";
    
    };
    
    showDropdownMenu(event) {
        event.preventDefault();
        this.setState({ displayMenu: true }, () => {
            document.addEventListener('click', this.hideDropdownMenu);
        });
        this.menuIcon = "chevron-circle-up";
      }
    
    hideDropdownMenu() {
        this.setState({ displayMenu: false }, () => {
          document.removeEventListener('click', this.hideDropdownMenu);
        });
        this.menuIcon = "chevron-circle-down";
    }
    handleMenuChange = (event) => {
        event.preventDefault();

        var item = event.target.getAttribute("value");
        this.props.onSelectMenu(item);   
        this.menuIcon = "chevron-circle-down";         
    }
    render() {
        return (
            <div  className="dropdown">
                <div className="dropButton" onClick={this.showDropdownMenu}><FontAwesomeIcon icon={this.menuIcon} /></div>

                { this.state.displayMenu ? (
                <ul>
                    <li><a className="active" href="#top" onClick={this.handleMenuChange} value="topNews">Top News</a></li>
                    <li><a href="#politics" onClick={this.handleMenuChange} value="politics">Politics</a></li>
                    <li><a href="#world" onClick={this.handleMenuChange} value="world">World News</a></li>
                    <li><a href="#sports" onClick={this.handleMenuChange} value="sports">Sports</a></li>
                </ul>
                ):
                (
                    null
                )
                }
            </div>
        );
    }
}
    
export default Dropdown;