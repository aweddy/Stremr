import React, { Component } from 'react';
//import './App.css';

export default class NewsSubItems extends Component {

  constructor(props) {
    super(props);
    this.state = {
        articles: props.items,
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
    let {selectedIndex, articles} = this.state;
    const providerList = articles.map((pro, index) => <li key={index} className={this.state.selectedIndex === index ? 'selected' : null} onClick={this._ToggleSelected.bind(this, index)}><span>{pro.provider}</span></li>);
    return (
      <div className='articleBlock'>
        {/* <div id='left' onClick={this._TogglePrev}></div>
        <div id='right' onClick={this._ToggleNext}></div> */}
        <div className="articleBlockMain" style={{width: '100%', height: '100%'}}>
          <div className="img">
            <img src={articles[selectedIndex].metadata.ogImage} />
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
          <div className="bias"></div>
        </div>
        <div style={{clear: 'both'}}></div>
      </div>
    )
  }
}