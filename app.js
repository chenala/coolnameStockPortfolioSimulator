const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
const url = "mongodb://csc309f:csc309fall@ds117316.mlab.com:17316/csc309db"

app.use(bodyParser.json())

app.use(express.static(__dirname + '/'))

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

  //homepage
  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
  })

  //based on userId, retrieve information of this user from database
  //format of input {"user": "", "password": ""}
  app.post('/login', function(req, res){
    var input = req.body
    db.collection('coolname-stocks').findOne({user: input.user}).then(function(document){
      if (document){
        if (input.password != document.password){
          res.send("Password Incorrect")
        } else{
          var returnValue = {'cash': document.cash, 'stocks': document.stocks}
          res.send(returnValue)
        }
      } else{
        res.send("User doesn't exist")
      }
    })
  })

  //api for creating user
  //input format: {"user": , "password": , "cash": }
  app.post('/newuser', function(req, res){
    var input = req.body
    db.collection('coolname-stocks').findOne({user: input.user}).then(function(document){
      if (document){
        res.send("Username already exists")
      } else{
        var newUser = {"user": input.user, "password": input.password, "cash": input.cash, "stocks": []}
        db.collection("coolname-stocks").insertOne(newUser, function(err, response){
          res.send("success")
        })
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
            stocks.push(newStock)
            index = stocks.length - 1
          }
          var cash = parseFloat((document.cash - parseFloat((input.price*input.quantity).toFixed(2))).toFixed(2))
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


  //sell stock for a user
  //format of post: {"user": "", "stock": "", quantity: "", price:""}
  //return value is quantity of the stock after selling, avgPrice after selling,
  //and cash after selling
  app.post('/sell', function(req, res){
    var input = req.body
    console.log(input)
    //check the user in database
    db.collection("coolname-stocks").findOne({user: input.user}).then(function(document){
      if (document){
        var stocks = document.stocks
        var index = containsStock(input.stock, stocks)
        if (index != -1){
          if (input.quantity > stocks[index].quantity){
            res.send("Can't Sell More Than You Have")
          } else{
            var quantityAfter
            var avgPriceAfter
            var totalValueBefore = stocks[index].avgPrice * stocks[index].quantity
            var totalValueAfter = totalValueBefore - input.price * input.quantity
            var cash = parseFloat((document.cash + parseFloat((input.price * input.quantity).toFixed(2))).toFixed(2))
            stocks[index].quantity = parseInt(stocks[index].quantity) - parseInt(input.quantity)
            quantityAfter = stocks[index].quantity
            if (stocks[index].quantity == 0){
              stocks.splice(index, 1)
              avgPriceAfter = 0
            } else{
              stocks[index].avgPrice = parseFloat((totalValueAfter/stocks[index].quantity).toFixed(2))
              avgPriceAfter = stocks[index].avgPrice
            }
            //update database
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
            var returnValue = {"quantity": quantityAfter, "avgPrice": avgPriceAfter, "cash": cash}
            res.send(returnValue)
          }
        } else {
          res.send("Stock Doesn't Exist")
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
