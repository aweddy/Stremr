import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import NewsList from './components/NewsList';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<NewsList category="topNews"/>, document.getElementById('list'));

registerServiceWorker();
