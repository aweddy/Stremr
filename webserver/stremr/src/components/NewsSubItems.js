import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
//import './App.css';
import _ from 'lodash'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft, faChevronRight, faChevronCircleRight, faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import socketIOClient from "socket.io-client";

library.add(faChevronLeft);
library.add(faChevronRight);
library.add(faChevronCircleRight);
library.add(faComment);

export default class NewsSubItems extends Component {

  constructor(props) {
    super(props);
    this.state = {
        fullSet: props.items,
        bias: props.bias,
        count: props.count,
        tag: props.tag,
        articles: props.items.nodes,
        groupedList: [],
        selectedIndex: 0,
        showLeft: false,
        showRight: false,
        selectedArticleIndex: 0,
        endpoint: "35.196.130.18:1337",
        category: props.category
    }
    this._TogglePrev = this._TogglePrev.bind(this);
    this._ToggleNext = this._ToggleNext.bind(this);
    this._ToggleArticlePrev = this._ToggleArticlePrev.bind(this);
    this._ToggleArticleNext = this._ToggleArticleNext.bind(this);
    this.send = this.send.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.showComments = this.showComments.bind(this);

    this.state.groupedList = 
    _.chain(this.state.articles)
    .groupBy('provider')
    .map((value, key) => ({provider: key, articles: value}))
    .value();

  }

  _ToggleNext() {
    if(this.state.selectedIndex === this.state.groupedList[this.state.selectedIndex].length - 1)
      return;

    this.setState(prevState => ({
      selectedIndex: prevState.selectedIndex + 1
    }))
  }

  _ToggleSelected(num) {
    this.setState(prevState => ({
      selectedIndex: num,
      selectedArticleIndex: 0
    }))
  }

  _TogglePrev() {
    if(this.state.selectedIndex === 0)
      return;

    this.setState(prevState => ({
      selectedIndex: prevState.selectedIndex - 1
    }))
  }


  _ToggleArticlePrev() {
    if(this.state.selectedArticleIndex === 0)
      return;

    this.setState(prevState => ({
      selectedArticleIndex: prevState.selectedArticleIndex - 1
    }))
  }
  _ToggleArticleNext() {
    if(this.state.selectedArticleIndex === this.state.groupedList[this.state.selectedIndex].articles.length - 1)
      return;

    this.setState(prevState => ({
      selectedArticleIndex: prevState.selectedArticleIndex + 1
    }))
  }

  send = () => {
    let text = document.getElementById("message_" + this.state.tag);
    if (text.value != ""){
      const socket = socketIOClient(this.state.endpoint);
      socket.emit('msg', {room: "room_" + this.state.tag, text: text.value});
      text.value = '';
      text.focus();
    }
  }

  handleKeyPress = (event) => {
    if(event.key == 'Enter'){
      let text = document.getElementById("message_" + this.state.tag);
      if (text.value != ""){
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('msg', {room: "room_" + this.state.tag, text: text.value});
        text.value = '';
        text.focus();
      }
    }
  }

  componentDidMount = () => {
    const socket = socketIOClient(this.state.endpoint);
    //setInterval(this.send(), 1000)
    var room = "room_" + this.state.tag;
    socket.emit('join_room', {room: room});
    var that = this;
    socket.on('msg', function(data) {
        var chatBox =  document.getElementById("msgArea_" + that.state.tag);
        chatBox.innerHTML += '<p>' + data.text + '</p>';
        chatBox.scrollTop = chatBox.scrollHeight;
    });
  }

  showComments = () => {
    var allCommentAreas = document.getElementsByClassName("chatArea");
    for(var i=0; i < allCommentAreas.length; i++)
    {
      allCommentAreas[i].style["display"] = "none";
    }
    var cArea = document.getElementById(this.state.category + this.state.count);
    cArea.style.display = "block";
  }

  render() {
    let {selectedIndex, bias, groupedList, selectedArticleIndex, count, tag, category} = this.state;
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

    var providerList = groupedList.map((pro, index) => <li key={index} className={selectedIndex === index ? 'selected' : null} onClick={this._ToggleSelected.bind(this, index)}><span>{pro.provider} ({pro.articles.length})</span></li>);
    
    return (
      <div className='articleBlock' id={"article_" + tag}>
        {/* <div id='left' onClick={this._TogglePrev}></div>
        <div id='right' onClick={this._ToggleNext}></div> */}
        
        <div className="articleBlockMain" style={{width: '100%', height: '100%'}}>
          <div className="leftArrow" onClick={this._ToggleArticlePrev} style={groupedList[selectedIndex].articles[selectedArticleIndex-1] ? {color: 'black'} : {color:'#ddd'}}><FontAwesomeIcon icon="chevron-left" /></div>
          <div className="img" style={{backgroundImage: `url(${groupedList[selectedIndex].articles[selectedArticleIndex].metadata.ogImage})`}}>
          </div>
          <div className="content">
            <div className="title"><a href={groupedList[selectedIndex].articles[selectedArticleIndex].link}>{groupedList[selectedIndex].articles[selectedArticleIndex].title}</a></div>
            <div className="description">{groupedList[selectedIndex].articles[selectedArticleIndex].metadata.description}</div>
          </div>
          <div className={biasClass}></div>
          <div className="rightArrow" onClick={this._ToggleArticleNext} style={groupedList[selectedIndex].articles[selectedArticleIndex+1] ? {color: 'black'} : {color:'#ddd'}}><FontAwesomeIcon icon="chevron-right" /></div>

          <div className="mobileArrows">
            <div className="leftArrowMobile" onClick={this._ToggleArticlePrev} style={groupedList[selectedIndex].articles[selectedArticleIndex-1] ? {color: 'black'} : {color:'#ddd'}}><FontAwesomeIcon icon="chevron-left" /></div>
            <div className="rightArrowMobile" onClick={this._ToggleArticleNext} style={groupedList[selectedIndex].articles[selectedArticleIndex+1] ? {color: 'black'} : {color:'#ddd'}}><FontAwesomeIcon icon="chevron-right" /></div>
          </div>

        </div>
        <div className="providers">
            <ul>
              {providerList}
            </ul>
        </div>
        <div className="chatArea" id={category + count}> 
          <div id={"msgArea_" + tag} className="messageArea"></div>
          <input className="messageInput" id={"message_" + tag} onKeyPress={this.handleKeyPress} type="text" />
          <FontAwesomeIcon icon="chevron-circle-right" onClick={this.send} />
        </div>
        <div className="msgDownArrow" onClick={this.showComments}><FontAwesomeIcon icon="comment" /></div>
        <div style={{clear: 'both'}}></div>
      </div>
    )
  }
}