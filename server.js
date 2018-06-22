// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const Log = require('./models/logs');
mongoose.connect(process.env.URI);
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// use body-parser to get form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post('/api/newuser', function(req,res){
  var name = req.body.name;
  User.findOne({username:name},function(err,user){
    if(err) throw err;
    if(user!=null){
      res.send('User Already Exists');
    } else {
      var user = new User();
      user.username = name;
      console.log(user)
      user.save(function(err){
        if(err) throw err
      });
      res.send(`req.body: ${JSON.stringify(req.body)}\nuser probably saved successfully`);
    }
  })
});

app.post('/api/newlog', function(req,res){
  var name = req.body.name;
  var ex = req.body.exercise;
  var dur = req.body.duration;
  var date = new Date(req.body.date).getTime();
  
  User.findOne({username:name},function(err,user){
    if(err) throw err;
    if(user==null){
      res.send('No such user exists');
    } else {
      var log = new Log();
      log.exercise = ex;
      log.duration = dur;
      log.date = date;
      log.username = name;
      log.save(function(err){
        if(err){
          throw err;
          res.send(`There was an err:\n${JSON.stringify(err)}`)
        } else {
          res.send(`${JSON.stringify(log)}`);
        }
      });
    }
  })
});

app.get('/api/logs',function(req,res){
  var username = req.query.username;
  var from = new Date(req.query.from).getTime();
  var to = new Date(req.query.to).getTime();
  var limit = req.query.limit;
  User.findOne({username:username},function(err,users){
    if(users==null){
      res.send('No such username exists');
    } else {
      if(from==false){
        from=0;
      }
      to == false ? to = new Date().now().getTime() :
      Log.find({username:username,date:{$gt:from,$lt:to}},{},function(err,log){
        if(err)throw err;
        res.send(log);
      }).limit(Number(limit))
    }
  });
});

console.log("Hello, World!")
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
