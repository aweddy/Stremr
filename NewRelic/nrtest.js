require('newrelic');
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/error', (req, res) => {
    throw ("error");
    res.send('');
});

app.get('/timeout', (req, res) => {
    setTimeout(function(){ res.send('Done timeout'); }, 10000);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))