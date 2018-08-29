var app = require('express')(),
  swig = require('swig');
var fs = require('fs');

// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use('/static', express.static('public'))

app.get('/api/:category', function (req, res) {
    let cat = req.params.category;
    try{
        var articles = fs.readFileSync(__dirname + '/JSON/'+ cat +'.json', 'utf8');
        res.send(articles);
    }catch(error){
        res.send(error);
    }
});

app.get('/', function (req, res) {
    res.render('index', {
        //articles: JSON.parse(articles)  
    });
});

app.listen(1337);
console.log('Application Started on http://localhost:1337/');