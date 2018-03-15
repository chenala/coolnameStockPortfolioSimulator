const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient
const url = "mongodb://csc309f:csc309fall@ds117316.mlab.com:17316/csc309db"

MongoClient.connect(url, function(err,res){
  if(err) console.log(err)
  console.log("Database created");
  const db = res.db('csc309db')

  app.get('/hello', function(req, res){
    res.send("Hello World")
  })

  app.get('/login/:userId', function(req, res){
    console.log("userId trying to login: " + req.params.userId)
    db.collection('coolname-stocks').findOne({user: req.params.userId}).then(function(document){
      if (document){
        res.send(document)
      }
    })
  })

  app.listen(3000)
})
