import React, { Component } from 'react';
//import './App.css';
import axios from 'axios';

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
    return <ul>
    {
      this.state.posts.map((item, index) => {
        return (
          <li><ul>
          {
          item.map((subitem, i) => {
            return (
                <li>{subitem.title}</li>
            )
          })
          }
          </ul></li>
        )
      })
    }  
    </ul>;
  }
}

export default NewsList;