var app = require('express')(),fs = require('fs');

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.set('view cache', false);

app.get('/api/:category', function (req, res) {
    let cat = req.params.category;
    try{
        var articles = fs.readFileSync(__dirname + '/JSON/'+ cat +'.json', 'utf8');
        res.send(articles);
    }catch(error){
        res.send(error);
    }
});

app.listen(1337);
console.log('Application Started on http://localhost:1337/');