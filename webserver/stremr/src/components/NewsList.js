import React, { Component } from 'react';
//import './App.css';
import axios from 'axios';
import NewsSubItems from './NewsSubItems';

class NewsList extends Component {
  state = {
    posts: []
  }

  componentDidMount() {
    axios.get(`http://localhost:1337/api/lists/${this.props.category}`)
      .then(res => {
        const posts = res.data.map(obj => obj);
        this.setState({ posts });
      });
  }

  render() {
    var newsList = this.state.posts.map((item, index) => {
      return (
        <li key={index}>
        {
          <NewsSubItems items={item} bias={item.bias} />
        }
        </li>
      )
    })
    return (
      <ul id={this.props.category}>{newsList}</ul>
    )
  }
}

export default NewsList;