const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
const url = "mongodb://csc309f:csc309fall@ds117316.mlab.com:17316/csc309db"

app.use(bodyParser.json())

//handle CORS problem
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next();
});

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

  //buy stock for a user
  //format of post: {"user": "", "stock": "", quantity: "", price:""}
  //return value is quantity of the stock after buying, avgPrice after buying,
  //and cash after buying
  app.post('/buy', function(req, res){
    var input = req.body
    console.log(input)
    //check the user in database
    db.collection("coolname-stocks").findOne({user: input.user}).then(function(document){
      if (document){
        if (((input.quantity) * (input.price)) > document.cash){
          res.send("Cash Not Enough")
        } else{
          //check if the stock exists. If return is -1, doesn't exist. If return
          //is not -1, it is the index number in the stock list of this user
          var stocks = document.stocks
          var index = containsStock(input.stock, stocks)
          if (index != -1){
            //if user owns the stock
            //update avgprice, quantity, and cash in database
            var totalValueBefore = stocks[index].avgPrice * stocks[index].quantity
            var totalValueAfter = totalValueBefore + input.price * input.quantity
            stocks[index].quantity = parseInt(stocks[index].quantity) + parseInt(input.quantity)
            stocks[index].avgPrice = parseFloat((totalValueAfter/stocks[index].quantity).toFixed(2))
          } else{
            var newStock = {"symbol": input.stock, "quantity": input.quantity, "avgPrice": input.price}
            cash = parseFloat((document.cash - parseFloat((input.price*input.quantity).toFixed(2))).toFixed(2))
            stocks.push(newStock)
            index = stocks.length - 1
          }
          cash = parseFloat((document.cash - parseFloat((input.price*input.quantity).toFixed(2))).toFixed(2))
          db.collection("coolname-stocks").updateOne(
            {user: input.user},
            {$set: {"stocks": stocks}}
          ).then(function(document){
            if (!document){
              res.send("Update stock quantity and avgPrice fail!")
            }
          })
          db.collection("coolname-stocks").updateOne(
            {user: input.user},
            {$set: {"cash": cash}}
          ).then(function(document){
            if (!document){
              res.send("Update cash fail!")
            }
          })
          var returnValue = {"quantity": stocks[index].quantity, "avgPrice": stocks[index].avgPrice, "cash": cash}
          res.send(returnValue)
        }

      } else{ //if the user doesn't exists
        res.send("User doesn't exists!")
      }
    })

  })

  app.listen(3000)
})

//helper function that checks if stock with symbol exists in the list
function containsStock(symbol, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].symbol === symbol) {
            return i;
        }
    }

    return -1;
}
