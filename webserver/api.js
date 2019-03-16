var app = require('express')(),fs = require('fs');
var server = require('http').createServer(app);
// var Comments = require('./schema/comments');
var bodyParser = require('body-parser');
const io = require('socket.io')(server);

server.listen(1337);
io.set('origins', '*:*');

// var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/comments_db', { useNewUrlParser: true })
// .then(() => console.log('connection succesful'))
// .catch((err) => console.error(err));

io.on('connection', (socket) => {
	console.log('New user connected')

    var room = '';
	//default username
	socket.username = "Anonymous"

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    });

    socket.on('join_room', (data) => {
        socket.join(data.room);
    });

    //listen on new_message
    socket.on('msg', (data) => {
        //broadcast the new message
        console.log(data);
        console.log(data.room)
        socket.to(data.room).emit('msg', {text: data.text});
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
})


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

console.log('Application Started on http://localhost:1337/');