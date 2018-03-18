const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
const url = "mongodb://csc309f:csc309fall@ds117316.mlab.com:17316/csc309db"

app.use(bodyParser.json())

MongoClient.connect(url, function(err,res){
  if(err) console.log(err)
  console.log("Database created");
  const db = res.db('csc309db')

  //test
  app.get('/hello', function(req, res){
    res.send("Hello World")
  })

  //based on userId, retrieve information of this user from database
  app.get('/login/:userId', function(req, res){
    console.log("userId trying to login: " + req.params.userId)
    db.collection('coolname-stocks').findOne({user: req.params.userId}).then(function(document){
      if (document){
        res.send(document)
      }
    })
  })

  //format of post: {"userId": "", "stock": "", amount: ""}
  app.post('/buy', function(req, res){
    var input = req.body
    console.log(input)
    //res.send("What is posted: " + req.body.nima)
  })

  app.listen(3000)
})
