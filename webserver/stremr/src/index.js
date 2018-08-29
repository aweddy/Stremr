import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import FetchDemo from './newsList';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<FetchDemo subreddit="topNews"/>, document.getElementById('list'));
registerServiceWorker();
