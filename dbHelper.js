const MongoClient = require('mongodb').MongoClient
const url = "mongodb://csc309f:csc309fall@ds117316.mlab.com:17316/csc309db"

MongoClient.connect(url, function(err,res){
	if(err) console.log(err)
	console.log("Database created");
	const db = res.db('csc309db')

	// Add functions here

  //data to be inserted
  //var data = {user:"user2", password:"123456", cash: 1000, stocks:[{symbol: "AAPL", quantity: 1, avgPrice: 100}, {symbol:"FB", quantity: 1, avgPrice: 100}]}
  //insert one entry into database
  // db.collection("coolname-stocks").insertOne(data, function(err, res){
  //   console.log("INSERT ONE")
  // })

  //   check all data in database
  db.collection('coolname-stocks').find({}).forEach(function(doc) {
    console.log(doc)
  }, (err) => {
    console.log(err);
  })


  // //check specific entry in Database
  // db.collection('coolname-stocks').findOne({user: "sb"}).then(function(document){
  //   if (document){
  //     console.log(document)
  //   }
  // })

  //delete all entry in Database
  //db. collection('coolname-stocks').deleteMany({})

	//update an entry
	// db.collection("coolname-stocks").updateOne(
	// 	{user: "user2"},
	// 	{$set: {"cash": 200000}}
	// ).then(function(document){
	// 	if (!document){
	// 		res.send("Update cash fail!")
	// 	}
	// })

})
