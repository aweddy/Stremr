var app = require('express')(),
  swig = require('swig');
var fs = require('fs');

// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!
app.get('/api/:category', function (req, res) {
    let cat = req.params.category;
    var articles = fs.readFileSync(__dirname + '/JSON/'+ cat +'.json', 'utf8');
    res.send(articles);
});

app.get('/', function (req, res) {
    res.render('index', {
        //articles: JSON.parse(articles)  
    });
});

app.listen(1337);
console.log('Application Started on http://localhost:1337/');