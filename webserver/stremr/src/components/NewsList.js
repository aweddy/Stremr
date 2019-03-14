import React, { Component } from 'react';
//import './App.css';
import axios from 'axios';
import NewsSubItems from './NewsSubItems';
import HashtagTop from './HashtagTop';

class NewsList extends Component {
  state = {
    posts: []
  }

  componentDidMount() {
    axios.get(`http://35.196.130.18:1337/api/lists/${this.props.category}`)
      .then(res => {
        const posts = res.data.map(obj => obj);
        this.setState({ posts });
      });
  }

  mode(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
  }

  render() {
    var posts = this.state.posts;

    var newsList = posts.map((item, index) => {
      return (
        <li key={index}>
        {
          <NewsSubItems items={item} bias={item.bias} count={index} />
        }
        </li>
      )
    })
    var hashTags = posts.map((item, index) => {
      return (
        <li key={index}><a href={'#article_'+ index}>
        {
          "#" + this.mode(item.combinedTags)
        }
        </a></li>
      )
    })
    return (
      <div>
        <div className="hashtagTop">
          <ul>{hashTags}</ul>
        </div>
        <ul id={this.props.category}>{newsList}</ul>
      </div>
    )
  }
}

export default NewsList;