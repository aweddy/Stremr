import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
//import './App.css';

export default class NewsSubItems extends Component {

  constructor(props) {
    super(props);
    this.state = {
        fullSet: props.items,
        bias: props.bias,
        articles: props.items.nodes,
        selectedIndex: 0,
    }
    this._TogglePrev = this._TogglePrev.bind(this);
    this._ToggleNext = this._ToggleNext.bind(this);
  }

  _ToggleNext() {
    if(this.state.selectedIndex === this.state.articles.length - 1)
      return;

    this.setState(prevState => ({
      selectedIndex: prevState.selectedIndex + 1
    }))
  }

  _ToggleSelected(num) {
    this.setState(prevState => ({
      selectedIndex: num
    }))
  }

  _TogglePrev() {
    if(this.state.selectedIndex === 0)
      return;

    this.setState(prevState => ({
      selectedIndex: prevState.selectedIndex - 1
    }))
  }

  render() {
    let {selectedIndex, articles, bias} = this.state;
    var biasClass = 'bias neutral';
    switch (true){
      case (bias >= 2.5): biasClass = 'bias darkestRed'; break;
      case (bias >= 2): biasClass = 'bias darkRed'; break;
      case (bias >= 1.5): biasClass = 'bias darkerRed'; break;
      case (bias > 1): biasClass = 'bias red'; break;
      case (bias >= .5): biasClass = 'bias lightRed'; break;
      case (bias < .5 && bias > -.5): biasClass = 'bias neutral'; break;
      case (bias <= -.5 && bias >= -1): biasClass = 'bias lightBlue'; break;
      case (bias < -1 && bias > -1.5): biasClass = 'bias blue'; break;
      case (bias <= -1.5 && bias > -2): biasClass = 'bias darkerBlue'; break;
      case (bias <= -2 && bias > -2.5): biasClass = 'bias darkBlue'; break;
      case (bias <= -2.5): biasClass = 'bias darkestBlue'; break;
    }
    const providerList = articles.map((pro, index) => <li key={index} className={selectedIndex === index ? 'selected' : null} onClick={this._ToggleSelected.bind(this, index)}><span>{pro.provider}</span></li>);
    return (
      <div className='articleBlock'>
        {/* <div id='left' onClick={this._TogglePrev}></div>
        <div id='right' onClick={this._ToggleNext}></div> */}
        
        <div className="articleBlockMain" style={{width: '100%', height: '100%'}}>
          <div className="img" style={{backgroundImage: `url(${articles[selectedIndex].metadata.ogImage})`}}>
          </div>
          <div className="content">
            <div className="title"><a href={articles[selectedIndex].link}>{articles[selectedIndex].title}</a></div>
            <div className="description">{articles[selectedIndex].metadata.description}</div>
            <div className="providers">
              <ul>
                {providerList}
              </ul>
            </div>
          </div>
          <div className={biasClass}>{bias}</div>
        </div>
        <div style={{clear: 'both'}}></div>
      </div>
    )
  }
}