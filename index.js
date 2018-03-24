var api = 'https://api.iextrading.com/1.0'

$('#admin_container').hide()
$('#user_container').hide()
$('#search_stock_all').hide()
$('#searchStock_container').hide()
$('#searchStockResults_container').hide()
$('#register_div').hide()

// Admin operations forms
$('#addCash_div').hide()
$('#deleteUser_div').hide()

// admin var
var users
var addCashWindow_isOpen = false;
var deleteUserWindow_isOpen = false;

var newUserWindow_isOpen = false;

// this will contain the information about the user's stocks
// buy/sell var
var userStockInfoList = []
var stocks = {}
var avgPrice = {}
var cash
var marketValue
var totalProfitLoss

// searchStock var
var symbols
var symbolCompany
var prev


var username = ''

//if the user is logged in
if (sessionStorage.login == "user"){
  $('#login_container').hide()
  $('#user_container').show()
  $('#search_stock_all').show()
  $('#searchStock_container').show()

  $('#welcome_user').text('Welcome, ' + sessionStorage.username)

  userStockInfoList = []

  stocks = $.parseJSON(sessionStorage.stocks)
  avgPrice = $.parseJSON(sessionStorage.avgPrice)

  marketValue = 0
  totalProfitLoss = 0

  displayUserStanding(sessionStorage.cash, marketValue, totalProfitLoss)

  //calculate total equity from stocks that user holds and user's profit/loss
  $('#marketValue').text("Market Value: $" + marketValue)
  $('#totalProfitLoss').text('Total Profit/Loss: $' + totalProfitLoss)
  for (var key in stocks){
    var url = api.concat('/stock/' + key + '/delayed-quote')
    $.ajax({
      type:'GET',
      url: url,
      success:function(data){
          var ticker = data.symbol
          marketValue = parseFloat((parseFloat(marketValue) + parseFloat(parseFloat(stocks[ticker]) * parseFloat(data.delayedPrice))).toFixed(2))
          $('#marketValue').text("Market Value: $" + marketValue)
          totalProfitLoss = parseFloat((parseFloat(totalProfitLoss) + parseFloat(stocks[ticker]) * (parseFloat(data.delayedPrice) - parseFloat(avgPrice[ticker]))).toFixed(2))
          $('#totalProfitLoss').text('Total Profit/Loss: $' + totalProfitLoss)

          // create an userStockInfo element
          var userStockInfo = {'stock': ticker, 'quantity': stocks[ticker], 'yourAvgPrice': avgPrice[ticker], 'price': data.delayedPrice, 'profit': (stocks[ticker] * (data.delayedPrice - avgPrice[ticker])).toFixed(2) + "     "}
          userStockInfoList.push(userStockInfo)
          createUserStockTable(userStockInfoList)
      }
    })
  }


  symbols = []
  symbolCompany = {}
  prev = 0;
  $.ajax({
    type:'GET',
    url: api.concat('/ref-data/symbols'),
    success:function(data){
      //store all tickers in array symbol
      data.forEach(function(item){
        symbols.push(item.symbol)
        symbolCompany[item.symbol] = item.name
      })
      //autocomplete dropdown
      $('#searchSymbol').autocomplete({
        source: symbols,
        minLength: 2,
        appendTo: $('#searchStock_container')
      })
    }
  })

  // create table and updating entries in the table for stock history
  createHistoryTable('1w', 7)
  createHistoryTable('6m', 120)
  createHistoryTable('1y', 200)

  $('#stockHistoryDiv1y').hide()
  $('#stockHistoryDiv6m').hide()
  $('#stockHistoryDiv1w').hide()

  $('#stockHistory').hide()
}

$('#Login').click(function(){
  username = document.getElementById('uname').value
  password = document.getElementById('pswrd').value
  if (username === 'admin'){
    $('#admin_container').show()
    $('#login_container').hide()
/*
    //The object 'users' holds data about all users on the system
    var user1 = {
      'Username': 'User1',
      'Cash': 1000,
      'Holdings': ['AAPL', 'FB'],
      'StockQuantity': [1,2]
    }
    var user2 = {
      'Username': 'User2',
      'Cash': 100,
      'Holdings': ['FB'],
      'StockQuantity': [3]
    }
    var user3 = {
      'Username': 'User3',
      'Cash': 750,
      'Holdings': ['MSFT'],
      'StockQuantity': [2]
    }
    users = [user1, user2, user3]
*/
    $('#welcome_admin').text('Welcome, ' + username)

    // get allUsers from database and display the info
    displayAllUsers()


  }

  else{
    //if it is a user role
    var req = '{"user": "' + username + '", "password": "' + password + '"}'
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/login',
      data: req,
      contentType: 'application/json',
      success: function(data){
        if (data == "User doesn't exist"){
          window.alert(data)
        } else if (data == "Password Incorrect"){
          window.alert(data)
        } else{
          sessionStorage.login = "user"
          sessionStorage.username = username
          $('#login_container').hide()
          $('#user_container').show()
          $('#search_stock_all').show()
          $('#searchStock_container').show()

          $('#welcome_user').text('Welcome, ' + username)

          userStockInfoList = []

          //update cash value user has
          sessionStorage.cash = data.cash
          //get stocks user has
          stockList = data.stocks
          stocks = {}
          avgPrice = {}
          for (var i = 0; i < stockList.length; i++){
            stocks[stockList[i].symbol] = stockList[i].quantity
            avgPrice[stockList[i].symbol] = stockList[i].avgPrice
          }

          sessionStorage.stocks = JSON.stringify(stocks)
          sessionStorage.avgPrice = JSON.stringify(avgPrice)

          marketValue = 0
          totalProfitLoss = 0

          displayUserStanding(sessionStorage.cash, marketValue, totalProfitLoss)

          //calculate total equity from stocks that user holds and user's profit/loss
          $('#marketValue').text("Market Value: $" + marketValue)
          $('#totalProfitLoss').text('Total Profit/Loss: $' + totalProfitLoss)
          for (var key in stocks){
            var url = api.concat('/stock/' + key + '/delayed-quote')
            $.ajax({
              type:'GET',
              url: url,
              success:function(data){
                  var ticker = data.symbol
                  marketValue = parseFloat((parseFloat(marketValue) + parseFloat(parseFloat(stocks[ticker]) * parseFloat(data.delayedPrice))).toFixed(2))
                  $('#marketValue').text("Market Value: $" + marketValue)
                  totalProfitLoss = parseFloat((parseFloat(totalProfitLoss) + parseFloat(stocks[ticker]) * (parseFloat(data.delayedPrice) - parseFloat(avgPrice[ticker]))).toFixed(2))
                  $('#totalProfitLoss').text('Total Profit/Loss: $' + totalProfitLoss)

                  // create an userStockInfo element
                  var userStockInfo = {'stock': ticker, 'quantity': stocks[ticker], 'yourAvgPrice': avgPrice[ticker], 'price': data.delayedPrice, 'profit': (stocks[ticker] * (data.delayedPrice - avgPrice[ticker])).toFixed(2) + "     "}
                  userStockInfoList.push(userStockInfo)
                  createUserStockTable(userStockInfoList)
              }
            })
          }


          symbols = []
          symbolCompany = {}
          prev = 0;
          $.ajax({
            type:'GET',
            url: api.concat('/ref-data/symbols'),
            success:function(data){
              //store all tickers in array symbol
              data.forEach(function(item){
                symbols.push(item.symbol)
                symbolCompany[item.symbol] = item.name
              })
              //autocomplete dropdown
              $('#searchSymbol').autocomplete({
                source: symbols,
                minLength: 2,
                appendTo: $('#searchStock_container')
              })
            }
          })

          // create table and updating entries in the table for stock history
          createHistoryTable('1w', 7)
          createHistoryTable('6m', 120)
          createHistoryTable('1y', 200)

          $('#stockHistoryDiv1y').hide()
          $('#stockHistoryDiv6m').hide()
          $('#stockHistoryDiv1w').hide()

          $('#stockHistory').hide()
        }
      }
    })

  }//end of else
})

// Logout
$('.logout_class').click(function(){
  // clear login inputs
  document.getElementById('uname').value = ''
  document.getElementById('pswrd').value = ''

  // clear the search history input
  document.getElementById('searchSymbol').value = ''
  // clear buy/sell inputs
  document.getElementById('buySymbol').value = ''
  document.getElementById('quantity').value = ''

  //clear createNewUser inputs
  resetNewUserFields()
  //clear giveCash inputs
  resetAddCashFields()

  //clear session
  sessionStorage.clear()

  $('#admin_container').hide()
  $('#user_container').hide()
  $('#searchStock_container').hide()
  $('#searchStockResults_container').hide()
  $('#search_stock_all').hide()
  $('#login_container').show()

  $('#addCash_div').hide()
  $('#deleteUser_div').hide()

})




// add new user operation
$('#newUser_button').click(function(){
  if(!newUserWindow_isOpen) {
    resetNewUserFields()
    newUserWindow_isOpen = true;
    $('#register_div').show()
    $('#login_container').hide()
  }
})

// deleteUser button
$('#deleteUser_button').click(function(){
  if(addCashWindow_isOpen) {
    window.alert('Please finish or cancel your current request first.')
  }
  else if(!deleteUserWindow_isOpen) {
    deleteUserWindow_isOpen = true;
    $('#deleteUser_div').show()
    resetDeleteUserFields()
  }
})

$('#deleteUser_submit').click(function(){
  var del_username = document.getElementById('deleteUsername_input').value
  if(verifyFieldsNotEmpty(1, [del_username])) {
    if(verifyUsername_regex(del_username)) {
      // delete user from database
      var req = '{"user": "' + del_username + '"}'
      $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/deleteuser',
        data: req,
        contentType: 'application/json',
        success: function(data){
    //      console.log(data)
          if(data == "Username does not exist") {
            window.alert("Unable to proceed. Username does not exist.")
          } else {
            window.alert("Success! The following user has been deleted: " + del_username)
          }
          // update the list of users on admin screen
          displayAllUsers()
        }
      })


      // close form
      deleteUserWindow_isOpen = false
      $('#deleteUser_div').hide()
    }
  }
})


$('#deleteUser_cancel').click(function() {
  // close form and reset all fields
  deleteUserWindow_isOpen = false
  $('#deleteUser_div').hide()
  resetDeleteUserFields()
})

// add cash to existing user
$('#addCash_button').click(function(){
  if(deleteUserWindow_isOpen) {
    window.alert('Please finish or cancel your current request first.')
  }
  else if(!addCashWindow_isOpen) {
    addCashWindow_isOpen = true;
    $('#addCash_div').show()
    resetAddCashFields()
  }
})

$('#addCash_submit').click(function(){
  var recipient = document.getElementById('addCashUser_input').value
  var amount = document.getElementById('addCashValue_input').value

  if(verifyFieldsNotEmpty(2, [recipient, amount]) && verifyUsername_regex(recipient) && verifyCash_regex(amount)) {
    var req = '{' + '"user": "' + recipient + '", "cash": "' + amount + '"}'

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/addCash',
      data: req,
      contentType: 'application/json',
      success: function(data){
        if(data == "Username does not exist") {
          window.alert("Unable to proceed. Username does not exist.")
        } else {
          window.alert("Success! " + recipient + " has received $" + amount +".")
          // update the list of users on admin screen
          displayAllUsers()
          // close form
          addCashWindow_isOpen = false
          $('#addCash_div').hide()
        }
      }
    })

  }
})

$('#addCash_cancel').click(function() {
  // close addCash form and reset all fields
  addCashWindow_isOpen = false
  $('#addCash_div').hide()
  resetAddCashFields()
})

$('#newUser_submit').click(function() {
  var new_username = document.getElementById('newUsername_input').value
  var new_cash = document.getElementById('newCash_input').value
  var new_password1 = document.getElementById('newPassword_input1').value
  var new_password2 = document.getElementById('newPassword_input2').value

  if(verifyFieldsNotEmpty(4, [new_username, new_cash, new_password1, new_password2])) {
    if(!(new_password1 === new_password2)) window.alert('Unable to proceed. Passwords do not match.')
    else if(verifyUsername_regex(new_username) && verifyCash_regex(new_cash)) {
      var req = '{"user": "' + new_username + '", "password": "' + new_password1 + '", "cash": ' + new_cash + '}'
      //console.log(req)
      $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/newuser',
        data: req,
        contentType: 'application/json',
        success: function(data){
          if (data == "Username already exists"){
           window.alert('Unable to proceed. This username already exists.')
          } else{
            var new_user = {
              'Username': new_username,
              'Cash': parseInt(new_cash),
              'Holdings': [],
              'StockQuantity': []
            }
           window.alert('Success! User has been created. The username is: ' + new_username)
           // close newUser form
           newUserWindow_isOpen = false
           $('#register_div').hide()
           $('#login_container').show()
         }
        }
      })

    }
  }
})

$('#newUser_cancel').click(function() {
  // close newUser form and reset all fields
  newUserWindow_isOpen = false
  $('#register_div').hide()
  $('#login_container').show()
  resetNewUserFields()
})

$('#one_week').click(function(){
  var searchSymbol = document.getElementById('searchSymbol').value
  searchSymbol = searchSymbol.toUpperCase()
  $('#stockHistoryDiv1y').hide()
  $('#stockHistoryDiv6m').hide()
  $('#stockHistoryDiv1w').show()
  $.ajax({
    type:'GET',
    url: api.concat('/stock/' + searchSymbol + '/chart/1y'),
    success:function(data){
      updateHistoryTableValues('1w', data, 7, searchSymbol)
    }
  })
})

$('#six_months').click(function(){
  var searchSymbol = document.getElementById('searchSymbol').value
  searchSymbol = searchSymbol.toUpperCase()
  $('#stockHistoryDiv1w').hide()
  $('#stockHistoryDiv1y').hide()
  $('#stockHistoryDiv6m').show()
  $.ajax({
    type:'GET',
    url: api.concat('/stock/' + searchSymbol + '/chart/1y'),
    success:function(data){
      updateHistoryTableValues('6m', data, 120, searchSymbol)
    }
  })
})

$('#one_year').click(function(){
  var searchSymbol = document.getElementById('searchSymbol').value
  searchSymbol = searchSymbol.toUpperCase()
  $('#stockHistoryDiv1w').hide()
  $('#stockHistoryDiv6m').hide()
  $('#stockHistoryDiv1y').show()
  $.ajax({
    type:'GET',
    url: api.concat('/stock/' + searchSymbol + '/chart/1y'),
    success:function(data){
      updateHistoryTableValues('1y', data, 200, searchSymbol)
    }
  })
})


//get text in search bar
$('#searchButton').click(function(){
  $('#stockHistoryDiv1y').hide()
  $('#stockHistoryDiv6m').hide()
  $('#stockHistoryDiv1w').hide()
  var searchSymbol = document.getElementById('searchSymbol').value
  searchSymbol = searchSymbol.toUpperCase()
  if (!symbols.includes(searchSymbol)){
    window.alert("The symbol doesn't exist")
  }
  else {
    $('#searchStockResults_container').show()
    $.ajax({
      type:'GET',
      url: api.concat('/stock/' + searchSymbol + '/delayed-quote'),
      success:function(data){
        var price = data.delayedPrice
        $('#stockTicker').text(searchSymbol)
        $('#stockCompany').text(symbolCompany[searchSymbol])
        $('#stockPrice').text('Price: ' + data.delayedPrice)
        $('#stockHistory').show()

      }
    })
  }
})

//buy Stock
$('#buyButton').click(function(){
  if (confirm("Confirm buy these stocks?")){
    var searchSymbol = document.getElementById('buySymbol').value
    searchSymbol = searchSymbol.toUpperCase()
    //record quantity
    var quantity = document.getElementById('quantity').value
    if (!verifyDigitsOnly_regex(quantity)){
      window.alert("Quantity is not a positive integer.")
    } else {
      $.ajax({
        type:'GET',
        url: api.concat('/stock/' + searchSymbol + '/delayed-quote'),
        success:function(data){
          var price = data.delayedPrice
          var req = '{"user": "'+ sessionStorage.username + '", "stock": "' + searchSymbol + '", "quantity": ' + quantity + ', "price": ' + price + '}'
          $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/buy',
            data: req,
            contentType: 'application/json',
            success: function(data){
                if (data == "Cash Not Enough"){
                  window.alert("You don't have enough cash to by this many.")
                } else {
                  avgPrice = $.parseJSON(sessionStorage.avgPrice)
                  stocks = $.parseJSON(sessionStorage.stocks)
                  if (Object.keys(avgPrice).includes(searchSymbol) && stocks[searchSymbol] != 0){
                    stocks = $.parseJSON(sessionStorage.stocks)
                    avgPrice = $.parseJSON(sessionStorage.avgPrice)
                    //update total profit and loss to add new value after update
                    totalProfitLoss = parseFloat((parseFloat(totalProfitLoss) - parseFloat(stocks[searchSymbol]) * (parseFloat(price) - parseFloat(avgPrice[searchSymbol]))).toFixed(2))
                    stocks[searchSymbol] = parseInt(data.quantity)
                    avgPrice[searchSymbol] = parseFloat(data.avgPrice)
                    sessionStorage.stocks = JSON.stringify(stocks)
                    sessionStorage.avgPrice = JSON.stringify(avgPrice)
                    sessionStorage.cash = parseInt(data.cash)
                    //update html
                    $('#' + searchSymbol).text("Stock: " + searchSymbol + "    Quantity: " + stocks[searchSymbol] + "    YourAvgPrice: " + avgPrice[searchSymbol] + "    Price: " + price + "    Profict/Loss: " + (stocks[searchSymbol] * (price - avgPrice[searchSymbol])).toFixed(2))

                    for(var k = 0 ; k < userStockInfoList.length ; k++) {
                      if(userStockInfoList[k].stock === searchSymbol) {
                        userStockInfoList[k].quantity = stocks[searchSymbol]
                        userStockInfoList[k].yourAvgPrice = avgPrice[searchSymbol]
                        userStockInfoList[k].price = price
                        userStockInfoList[k].profit = (stocks[searchSymbol] * (price - avgPrice[searchSymbol])).toFixed(2)
                      }
                    }
                    createUserStockTable(userStockInfoList)

                    //calculate market value and profit/loss
                    marketValue = parseFloat((parseFloat(marketValue) + parseFloat(price * quantity)).toFixed(2))
                    //update total profit and loss
                    totalProfitLoss = parseFloat((parseFloat(totalProfitLoss) + parseFloat(stocks[searchSymbol]) * (parseFloat(price) - parseFloat(avgPrice[searchSymbol]))).toFixed(2))
                    $('#marketValue').text("Market Value: $" + marketValue)
                    $('#totalProfitLoss').text('Total Profit/Loss: $' + totalProfitLoss)
                    $('#cash').text('Cash: $' + sessionStorage.cash)
                  } else {
                    //the user bought a new stock
                    stocks = $.parseJSON(sessionStorage.stocks)
                    avgPrice = $.parseJSON(sessionStorage.avgPrice)
                    stocks[searchSymbol] = parseInt(data.quantity)
                    avgPrice[searchSymbol] = parseFloat(data.avgPrice)
                    sessionStorage.stocks = JSON.stringify(stocks)
                    sessionStorage.avgPrice = JSON.stringify(avgPrice)
                    // create an userStockInfo element
                    var userStockInfo = {'stock': searchSymbol, 'quantity': stocks[searchSymbol], 'yourAvgPrice': avgPrice[searchSymbol], 'price': price, 'profit': (stocks[searchSymbol] * (price - avgPrice[searchSymbol])).toFixed(2)}
                    userStockInfoList.push(userStockInfo)
                    createUserStockTable(userStockInfoList)


                    //calculate market value and profit/loss
                    marketValue = parseFloat((parseFloat(marketValue) + parseFloat((price * quantity).toFixed(2))).toFixed(2))
                    //update total profit and loss
                    totalProfitLoss = parseFloat((parseFloat(totalProfitLoss) + parseFloat(stocks[searchSymbol]) * (parseFloat(price) - parseFloat(avgPrice[searchSymbol]))).toFixed(2))
                    $('#marketValue').text("Market Value: $" + marketValue)
                    $('#totalProfitLoss').text('Total Profit/Loss: $' + totalProfitLoss)
                    cash = data.cash
                    sessionStorage.cash = parseFloat(data.cash)
                    $('#cash').text('Cash: $' + cash)
                  }
                }
            }
          })
        },
        error:function() {
            alert("Error: There is problem with stock symbol");
        }
      })

    }
  }
})

//sell stock
$('#sellButton').click(function(){
  if (confirm("Sell these stocks?")){
    var searchSymbol = document.getElementById('buySymbol').value
    searchSymbol = searchSymbol.toUpperCase()
    //record quantity
    var quantity = document.getElementById('quantity').value
    if (!verifyDigitsOnly_regex(quantity)){
      window.alert("Quantity is not a positive integer.")
    } else {
      $.ajax({
        type:'GET',
        url: api.concat('/stock/' + searchSymbol + '/delayed-quote'),
        success:function(data){
          var price = data.delayedPrice
          username = sessionStorage.username
          var req = '{"user": "'+ username + '", "stock": "' + searchSymbol + '", "quantity": ' + quantity + ', "price": ' + price + '}'
          $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/sell',
            data: req,
            contentType: 'application/json',
            success: function(data){
              if (data == "Stock Doesn't Exist"){
                window.alert("You don't have this stock.")
              } else{
                if (data == "Can't Sell More Than You Have"){
                  window.alert("You can't sell more than you have")
                } else{
                  //update total profit and loss
                  stocks = $.parseJSON(sessionStorage.stocks)
                  avgPrice = $.parseJSON(sessionStorage.avgPrice)
                  totalProfitLoss = parseFloat((parseFloat(totalProfitLoss) - parseFloat(stocks[searchSymbol]) * (parseFloat(price) - parseFloat(avgPrice[searchSymbol]))).toFixed(2))
                  stocks[searchSymbol] = parseInt(data.quantity)
                  sessionStorage.stocks = JSON.stringify(stocks)
                  // quantity is 0
                  if (stocks[searchSymbol] == 0){
                    delete stocks[searchSymbol]
                    delete avgPrice[searchSymbol]
                    sessionStorage.avgPrice = JSON.stringify(avgPrice)
                    sessionStorage.stocks = JSON.stringify(stocks)
                    //calculate market value and profit/loss
                    marketValue = parseFloat((parseFloat(marketValue) - parseFloat(price * quantity)).toFixed(2))
                    $('#marketValue').text("Market Value: $" + marketValue)
                    $('#totalProfitLoss').text('Total Profit/Loss: $' + totalProfitLoss)
                    cash = data.cash
                    sessionStorage.cash = cash
                    $('#cash').text('Cash: $' + cash)

                    // remove table entry if quantity of a stock is 0
                    for(var k = 0 ; k < userStockInfoList.length ; k++) {
                      if(userStockInfoList[k].stock === searchSymbol) {
                        userStockInfoList.splice(k,1)
                        break
                      }
                    }

                  } else{
                    //update avg price
                    avgPrice[searchSymbol] = data.avgPrice
                    sessionStorage.avgPrice = JSON.stringify(avgPrice)
                    //update html
                    $('#' + searchSymbol).text("Stock: " + searchSymbol + "    Quantity: " + stocks[searchSymbol] + "    YourAvgPrice: " + avgPrice[searchSymbol] + "    Price: " + price + "    Profict/Loss: " + (stocks[searchSymbol] * (price - avgPrice[searchSymbol])).toFixed(2))
                    //calculate market value and profit/loss
                    marketValue = parseFloat((parseFloat(marketValue) - parseFloat(price * quantity)).toFixed(2))
                    //update total profit and loss
                    totalProfitLoss = parseFloat((parseFloat(totalProfitLoss) + parseFloat(stocks[searchSymbol]) * (parseFloat(price) - parseFloat(avgPrice[searchSymbol]))).toFixed(2))
                    $('#marketValue').text("Market Value: $" + marketValue)
                    $('#totalProfitLoss').text('Total Profit/Loss: $' + totalProfitLoss)
                    cash = data.cash
                    sessionStorage.cash = cash
                    $('#cash').text('Cash: $' + cash)

                    for(var k = 0 ; k < userStockInfoList.length ; k++) {
                      if(userStockInfoList[k].stock === searchSymbol) {
                        userStockInfoList[k].quantity = stocks[searchSymbol]
                        userStockInfoList[k].yourAvgPrice = avgPrice[searchSymbol]
                        userStockInfoList[k].price = price
                        userStockInfoList[k].profit = (stocks[searchSymbol] * (price - avgPrice[searchSymbol])).toFixed(2)
                      }
                    }
                  }
                  createUserStockTable(userStockInfoList)
                }
              }
            }
          })
        },
        error: function(){
          alert("Error: There is problem with stock symbol")
        }
      })
    }
  }
})






// HELPER FUNCTIONS
//helper function to check if a variable is integer
function isInt(value) {
  return !isNaN(value) &&
         parseInt(Number(value)) == value &&
         !isNaN(parseInt(value, 10));
}

function verifyFieldsNotEmpty(num_of_fields, fields_array) {
  for(var i  = 0 ; i < num_of_fields ; i++) {
    if(fields_array[i] === '') {
      window.alert('Unable to proceed. All fields must be filled.')
      return false
    }
  }
  return true
}

function resetNewUserFields() {
  document.getElementById('newCash_input').value = ''
  document.getElementById('newPassword_input1').value = ''
  document.getElementById('newPassword_input2').value = ''
  document.getElementById('newUsername_input').value = ''
}

function resetAddCashFields() {
  document.getElementById('addCashValue_input').value = ''
  document.getElementById('addCashUser_input').value = ''
}

function resetDeleteUserFields() {
  document.getElementById('deleteUsername_input').value = ''
}


function verifyUsername_regex(username) {
  var username_isValid = /^\w+$/.test(username);
  if(!username_isValid) {
    window.alert('Unable to proceed. Usernames can only contain letters, numerical digits and underscores.')
    return false
  }
  return true
}


function verifyCash_regex(cash){
  var cash_isValid = /^[0-9]+(\.[0-9][0-9])?$/.test(cash);
  if(!cash_isValid) {
    window.alert('Unable to proceed. Cash value is invalid.')
    return false
  }
  return true
}

function verifyDigitsOnly_regex(value){
  var value_isValid = /^[0-9]+$/.test(value);
  if(!value_isValid) {
    return false
  }
  return true
}

function display_userlist(userlist_len, userlist) {
  $('#userlist_container').empty()

  // quantity list for determining stockValue
  // format: [{symbol: <company symbol>, quantity: <number of stocks user holds in this company>}]
  var quantityList = []

  for(var i = 0 ; i < userlist_len ; i++) {
    var cur_entry = $('<div>', {class: 'userlist_entry'}).appendTo('#userlist_container')
    $('<h2>', {
      text: 'User: ' + userlist[i].user,
      class: 'userlist_entry_username'
    }).appendTo(cur_entry)
    $('<p>', {
      text: 'Cash: $' + userlist[i].cash,
      class: 'userlist_entry_cash'
    }).appendTo(cur_entry)

    $('<p>', {
      text: 'Stock Value: $' + 0,
      id: 'stock_value' + userlist[i].user,
      class: 'userlist_entry_stockValue'
    }).appendTo(cur_entry)


    var stocks_string = ''
    // display user's stocks
    for(var j = 0 ; j < userlist[i].stocks.length ; j++) {
      var symbol_j = userlist[i].stocks[j].symbol
      var quantity_j = userlist[i].stocks[j].quantity
      var avgPrice_j = userlist[i].stocks[j].avgPrice
      stocks_string = '{symbol: ' + symbol_j + ', quantity: ' + quantity_j + ', avgPrice: ' + avgPrice_j + '}'
      quantityList.push({'symbol': symbol_j, 'quantity': quantity_j})
    }
    $('<p>', {
      text: 'Stocks: ' + stocks_string,
      id: 'stock_value' + userlist[i].user,
      class: 'userlist_entry_stocks'
    }).appendTo(cur_entry)

    /*
    $('<p>', {
      text: 'Holdings: ' + userlist[i].Holdings,
      class: 'userlist_entry_holdings'
    }).appendTo(cur_entry)

    $('<p>', {
      text: 'Holding Quantities: ' + userlist[i].StockQuantity,
      class: 'userlist_entry_quantity'
    }).appendTo(cur_entry)

    */


    // find stockWorth -- TODO: NOT WORKING!!!
    var stockWorth = 0
    var curUser = userlist[i].user
//    console.log(quantityList.length)
    for(var m = 0 ; m < quantityList.length ; m++) {
      var url = api.concat('/stock/' + quantityList[m].symbol + '/delayed-quote')
      $.ajax({
        type: 'GET',
        url: url,
        success:function(data) {
          var stockPrice = data.delayedPrice
          stockWorth += (parseFloat(quantityList[m]) * parseFloat(stockPrice)).toFixed(2)
          $('#stock_value' + curUser).text("Stock Value: $" + stockWorth)
        }
      })
    }




  }
/*
  // calculate stock value for each user
  for (var i = 0; i < userlist_len; i++) {
    var prices = {}

    for (var m = 0; m < quantityList.length; m++) {
      var url = api.concat('/stock/' + quantityList[m].symbol + '/delayed-quote')
      var quantity = quantityList[m].quantity
      var id = userlist[i].user
      var money = userlist[i].cash
      $.ajax({
        type: 'GET',
        url: url,
        success:function(data) {
          var ticker = data.symbol
          var stockPrice = data.delayedPrice
          prices[ticker] = stockPrice
          for (var c = 0; c < userlist_len; c++) {
            var stockWorth = 0
            var stockValue = 0
            for (var n = 0; n < (userlist[c].Holdings).length; n++) {
              if (Object.keys(prices).includes(userlist[c].Holdings[n])) {
                stockValue = parseFloat(parseFloat(parseFloat(userlist[c].StockQuantity[n]) * parseFloat(prices[userlist[c].Holdings[n]]))).toFixed(2)
                stockWorth = parseFloat(stockWorth) + parseFloat(stockValue)
                $('#stock_value' + userlist[c].Username).text("Stock Value: $" + stockWorth.toFixed(2))
              }
            }
          }
        }
      })
    }
  }
*/

}

// get all users from database and display them on screen
function displayAllUsers(){
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/users',
    success: function(data){
      console.log(data.length)
      console.log(data)
      display_userlist(data.length, data)  // display info of all users on the screen
    }
  })
}

function displayUserStanding(cash, marketValue, totalProfitLoss) {
  $('#current_standing_div').empty()
  //display cash, total, and profit/loss
  $('<p>', {
    text: 'Cash: $' + cash,
    id: 'cash'
  }).appendTo('#current_standing_div')
  $('<p>', {
    id: 'marketValue',
    text: 'marketValue' + marketValue
  }).appendTo('#current_standing_div')
  $('<p>', {
    id: 'totalProfitLoss',
    text: 'Total Profit/Loss' + totalProfitLoss
  }).appendTo('#current_standing_div')
}

function createHistoryTable(table_type, num_rows) {
    $('#stockHistoryDiv' + table_type).empty()
    $('<table>', {id: 'table_' + table_type}).appendTo('#stockHistoryDiv' + table_type)
    $('<tr>', {id: 'stockHistoryTitles' + table_type}).appendTo('#table_'+ table_type)
    $('#stockHistoryTitles' + table_type).empty()
    $('<th>', {id: 'tableTitleSymbol', text: 'Stock'}).appendTo('#stockHistoryTitles' + table_type)
    $('<th>', {id: 'tableTitleDate', text: 'Date'}).appendTo('#stockHistoryTitles' + table_type)
    $('<th>', {text: 'Open'}).appendTo('#stockHistoryTitles' + table_type)
    $('<th>', {text: 'Close'}).appendTo('#stockHistoryTitles' + table_type)
    $('<th>', {text: 'High'}).appendTo('#stockHistoryTitles' + table_type)
    $('<th>', {text: 'Low'}).appendTo('#stockHistoryTitles' + table_type)
    $('<th>', {text: 'Volume'}).appendTo('#stockHistoryTitles' + table_type)
    $('<th>', {text: 'Change Over Time'}).appendTo('#stockHistoryTitles' + table_type)


  for(var i = 0 ; i < num_rows ; i++) {
    $('<tr>', {id: table_type + i}).appendTo('#table_' + table_type)
    $('<td>', {id: table_type + i + 'symbol', text: ''}).appendTo('#' + table_type + i)
    $('<td>', {id: table_type + i + 'date', text: ''}).appendTo('#' + table_type + i)
    $('<td>', {id: table_type + i + 'open', text: ''}).appendTo('#' + table_type + i)
    $('<td>', {id: table_type + i + 'close', text: ''}).appendTo('#' + table_type + i)
    $('<td>', {id: table_type + i + 'high', text: ''}).appendTo('#' + table_type + i)
    $('<td>', {id: table_type + i + 'low', text: ''}).appendTo('#' + table_type + i)
    $('<td>', {id: table_type + i + 'volume', text: ''}).appendTo('#' + table_type + i)
    $('<td>', {id: table_type + i + 'change', text: ''}).appendTo('#' + table_type + i)
  }
}

function updateHistoryTableValues(table_type, data, num_rows, searchSymbol) {
  var data_size = data.length;
  for(var i = 0 ; i < num_rows ; i++) {
    $('#' + table_type + i + 'symbol').text(searchSymbol)
    $('#' + table_type + i + 'date').text(data[data.length-i-1].date)
    $('#' + table_type + i + 'open').text(data[data.length-i-1].open)
    $('#' + table_type + i + 'close').text(data[data.length-i-1].close)
    $('#' + table_type + i + 'high').text(data[data.length-i-1].high)
    $('#' + table_type + i + 'low').text(data[data.length-i-1].low)
    $('#' + table_type + i + 'volume').text(data[data.length-i-1].volume)
    $('#' + table_type + i + 'change').text(data[data.length-i-1].change)
  }
}

function createUserStockTable(userStockInfoList) {
  $('#userStockTable').empty()
  if (userStockInfoList.length != 0){
    $('<tr>', {id: 'stockTableRowTitles'}).appendTo('#userStockTable')
    $('<th>', {text: 'Stock'}).appendTo('#userStockTable')
    $('<th>', {text: 'Quantity'}).appendTo('#userStockTable')
    $('<th>', {text: 'Your Average Price'}).appendTo('#userStockTable')
    $('<th>', {text: 'Price'}).appendTo('#userStockTable')
    $('<th>', {text: 'Profit/Loss'}).appendTo('#userStockTable')

    for(var i = 0 ; i < userStockInfoList.length ; i++) {
      $('<tr>', {id: 'stockTableRow_' + i}).appendTo('#userStockTable')
      $('#stockTableRow_' + i).empty()
      $('<td>', {text: '' + userStockInfoList[i].stock}).appendTo('#stockTableRow_' + i)
      $('<td>', {text: '' + userStockInfoList[i].quantity}).appendTo('#stockTableRow_' + i)
      $('<td>', {text: '$' + userStockInfoList[i].yourAvgPrice}).appendTo('#stockTableRow_' + i)
      $('<td>', {text: '$' + userStockInfoList[i].price}).appendTo('#stockTableRow_' + i)
      $('<td>', {text: '$' + userStockInfoList[i].profit}).appendTo('#stockTableRow_' + i)
    }
  }
}
