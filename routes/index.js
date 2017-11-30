var express = require('express');
var router = express.Router();

/* Set up mongoose in order to connect to mongo database */
var mongoose = require('mongoose'); //Adds mongoose as a usable dependency

mongoose.connect('mongodb://localhost/jokeDB', { useMongoClient: true }); //Connects to a mongo database called "commentDB"

var jokeSchema = mongoose.Schema({ //Defines the Schema for this database
	joke: String
});

var Joke = mongoose.model('Joke', jokeSchema); //Makes an object from that schema as a model

var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
	console.log('Connected');
});

router.post('/joke', function(req, res, next) {
	console.log("POST joke route");
	console.log(req.body);
	var newJoke = new Joke(req.body);
	console.log(newJoke);
	newJoke.save(function(err, post) {
	  if (err) return console.error(err);
	  console.log(post);
	  res.sendStatus(200);
	});
});

/* GET random joke from database */
router.get('/joke', function(req, res, next) {
	console.log("GET joke route");
	Joke.find(function(err,commentList) {
	  if (err) return console.error(err);
	  else {
	    console.log(commentList);
	    randomJoke = commentList[Math.floor(Math.random()*commentList.length)];
	    res.json(randomJoke);
	  }
	});
});

module.exports = router;
