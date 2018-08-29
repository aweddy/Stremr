import React, { Component } from 'react';
//import './App.css';
import axios from 'axios';
import NewsSubItems from './NewsSubItems';

class NewsList extends Component {
  state = {
    posts: []
  }

  componentDidMount() {
    axios.get(`http://localhost:1337/api/${this.props.category}`)
      .then(res => {
        const posts = res.data.map(obj => obj);
        this.setState({ posts });
      });
  }

  render() { 
    return (
      this.state.posts.map((item, index) => {
        return (
          <li key={index}>
          {
            <NewsSubItems items={item} />
          }
          </li>
        )
      })
    )
  }
}

export default NewsList;