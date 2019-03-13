import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React, { Component } from 'react';

library.add(faChevronCircleDown);
library.add(faChevronCircleUp);

class Dropdown extends React.Component {
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


// import React, { Component } from 'react';
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { faNewspaper, faGlobeAmericas, faArrowUp, faMapPin, faUserCog } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// library.add(faGlobeAmericas)
// library.add(faNewspaper)
// library.add(faArrowUp)
// library.add(faMapPin)
// library.add(faUserCog)
// //import './App.css';

// class MenuNav extends React.Component {
//     state = {}

//     constructor() {
//         super();
        
//         this.state = {
//           showMenu: false,
//         };
        
//         this.showMenu = this.showMenu.bind(this);
//         this.closeMenu = this.closeMenu.bind(this);
//         this.handleMenuChange = this.handleMenuChange.bind(this);
//       }
      
//     showMenu(event) {
//         event.preventDefault();
        
//         this.setState({ showMenu: true }, () => {
//           document.addEventListener('click', this.closeMenu);
//         });
//     }
      
//     closeMenu(event) {
        
//         if (!this.dropdownMenu.contains(event.target)) {
          
//           this.setState({ showMenu: false }, () => {
//             document.removeEventListener('click', this.closeMenu);
//           });  
          
//         }
//     }

//     handleMenuChange = (event) => {
//         event.preventDefault();

//         var item = this.dropdown.value;
//         this.props.onSelectMenu(item);            
//     }

//     render() {
//         return (
//             <div>
//                 <button onClick={this.showMenu}>
//                     Show menu
//                 </button>
//                 {
//                     this.state.showMenu
//                         ? (
//                         <div
//                             className="menu"
//                             ref={(element) => {
//                               this.dropdownMenu = element;
//                             }}
//                         >
//                             <button ref={(element) => {this.dropdown = element}} value="topNews" onClick={this.handleMenuChange}>Top News</button>
//                             <button ref={(element) => {this.dropdown = element}} value="politics" onClick={this.handleMenuChange}>Politics</button>
//                             <button ref={(element) => {this.dropdown = element}} value="world" onClick={this.handleMenuChange}>World News</button>
//                         </div>
//                     ) : (
//                         null
//                     )
//                 }
//             </div>  
//         );
//     }
// }

// export default MenuNav;