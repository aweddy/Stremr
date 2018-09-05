var app = require('express')(),fs = require('fs');
var Comments = require('./schema/comments');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/comments_db', { useNewUrlParser: true })
.then(() => console.log('connection succesful'))
.catch((err) => console.error(err));


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('view engine', 'html');
app.set('view cache', false);

app.get('/api/lists/:category', function (req, res) {
    let cat = req.params.category;
    try{
        var articles = fs.readFileSync(__dirname + '/JSON/'+ cat +'.json', 'utf8');
        res.send(articles);
    }catch(error){
        res.send(error);
    }
});

app.get('/api/comments/:tags',function(req,res){
    Comments.find({'tags': {$regex: req.params.tags}}, function (err, comments) {
        res.send(comments);
    });
});

app.get('/api/commentTest', function(req,res){
    try{
        var commentData = new Comments({tags:"tag1 tag2 tag3", comments:"na na na  na na", postId: "myID"});
        commentData.save();
        res.send("success");
    }catch(error){
        res.send(error);
    }
});

app.post('/api/comments/', function(req,res){
    var commentData = new Comments(req.body);
    commentData.save();
});

app.listen(1337);
console.log('Application Started on http://localhost:1337/');