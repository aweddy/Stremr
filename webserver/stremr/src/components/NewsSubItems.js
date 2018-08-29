import React, { Component } from 'react';
//import './App.css';
import axios from 'axios';

export default class NewsSubItems extends Component {

  constructor(props) {
      super(props);
      this.state = {
          articles: props.items,
          selectedIndex: 0
      }
      this._TogglePrev = this._TogglePrev.bind(this);
      this._ToggleNext = this._ToggleNext.bind(this);
  }

  _ToggleNext() {
      if(this.state.selectedIndex == this.state.articles.length - 1)
          return;

      this.setState(prevState => ({
          selectedIndex: prevState.selectedIndex + 1
      }))
  }

  _TogglePrev() {
      if(this.state.selectedIndex == 0)
       return;

      this.setState(prevState => ({
          selectedIndex: prevState.selectedIndex - 1
      }))
  }

  render() {
      let {selectedIndex, articles} = this.state;
      return (
           <div className="articleBlock" style={{width: '100%', height: '100%'}}>
              <div>{articles[selectedIndex].title}</div>
              <div className="controls">
                <button className="toggle toggle--prev" onClick={this._TogglePrev}>Prev</button>
                <button className="toggle toggle--next" onClick={this._ToggleNext}>Next</button>
              </div>
           </div>
      )
  }
}