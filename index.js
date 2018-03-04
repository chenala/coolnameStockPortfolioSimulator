var api = 'https://api.iextrading.com/1.0'

$('.form_container2').hide()
$('.admin_container').hide()

$('#Login').click(function(){
  var username = document.getElementById('uname').value
  if (username === 'admin'){
    $('.form_container').hide()
    $('.admin_container').show()
    $('#login_container').hide()

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
    var users = [user1, user2, user3]

    $('#welcome_admin').text('Welcome, ' + username)

    display_userlist(users)


    // Admin operations
    $('#addCash_div').hide()
    $('#newUser_div').hide()

    $('#newUser_submit').click(function() {
      var new_username = document.getElementById('newUsername_input').value
      var new_cash = document.getElementById('newCash_input').value
      var new_password1 = document.getElementById('newPassword_input1').value
      var new_password2 = document.getElementById('newPassword_input2').value

      if(verifyFieldsNotEmpty(4, [new_username, new_cash, new_password1, new_password2])) {
        if(!(new_password1 === new_password2)) window.alert('Unable to proceed. Passwords do not match.')
        else if(verifyUsername_regex(new_username, users) && verifyCash_regex(new_cash)) {
          if(username_exists(new_username, users)) {
              window.alert('Unable to proceed. This username already exists.')
          }
          else {
            // create new user
            var new_user = {
              'Username': new_username,
              'Cash': parseInt(new_cash),
              'Holdings': [],
              'StockQuantity': []
            }
            users.push(new_user)

            display_userlist(users)
            window.alert('Success! User has been created. The username is: ' + new_username)
            // close newUser form
            newUserWindow_isOpen = false
            $('#newUser_div').hide()
          }
        }
      }
    })

    $('#newUser_cancel').click(function() {
      // close newUser form and reset all fields
      newUserWindow_isOpen = false
      $('#newUser_div').hide()
      resetNewUserFields()
    })

    $('#addCash_submit').click(function(){
      var recipient = document.getElementById('addCashUser_input').value
      var amount = document.getElementById('addCashValue_input').value

      if(verifyFieldsNotEmpty(2, [recipient, amount]) && verifyUsername_regex(recipient) && verifyCash_regex(amount)) {
        if(!username_exists(recipient, users)) {
            window.alert('Unable to proceed. This username does not exist.')
        }
        else {
          // add amount to the recipient
          for (var h = 0; h < users.length; h++) {
            if (recipient === users[h].Username) {
              users[h].Cash = parseFloat(users[h].Cash) + parseFloat(amount)
              $('#userCash' + recipient).text("Cash: " + users[h].Cash)
            }
          }
          window.alert('Succcess! Amount has been added to the recipient.')
          addCashWindow_isOpen = false
          $('#addCash_div').hide()
        }
      }
    })

    $('#addCash_cancel').click(function() {
      // close addCash form and reset all fields
      addCashWindow_isOpen = false
      $('#addCash_div').hide()
      resetAddCashFields()
    })

    var newUserWindow_isOpen = false;
    var addCashWindow_isOpen = false;
    // add new user operation
    $('#newUser_button').click(function(){
      if(addCashWindow_isOpen) {
        window.alert('Please finish or cancel your current request first.')
      }
      else if(!newUserWindow_isOpen) {
        resetNewUserFields()
        newUserWindow_isOpen = true;
        $('#newUser_div').show()
      }
    })

    // add cash to existing user
    $('#addCash_button').click(function(){
      if(newUserWindow_isOpen) {
        window.alert('Please finish or cancel your current request first.')
      }
      else if(!addCashWindow_isOpen) {
        addCashWindow_isOpen = true;
        $('#addCash_div').show()
        resetAddCashFields()
      }
    })

  }

  else{
    //if it is a user role
    $('#login_container').hide()

    $('<p>').appendTo('.form_container').text("welcome " + username)

    var standing = $('<div>').appendTo('.form_container')
    $('<p>').appendTo(standing).text('Your current standing:')

    //assume user has these stocks and cash
    //stocks store how many stocks of each company the user holds
    var stocks = {'AAPL': 1, 'FB': 1}
    //avg price holds the avg price of the stock the user bought
    var avgPrice = {'AAPL': 100, 'FB': 100}
    var cash = 1000
    var marketValue = 0
    var totalProfitLoss = 0

    //display cash, total, and profit/loss
    $('<p>', {
      text: 'Cash: ' + cash,
      id: 'cash'
    }).appendTo(standing)
    $('<p>', {
      id: 'marketValue',
      text: 'marketValue' + 0
    }).appendTo(standing)
    $('<p>', {
      id: 'totalProfitLoss',
      text: 'Total Profit/Loss' + 0
    }).appendTo(standing)

    //display list of stocks
    var stockList = $('<div>').appendTo('.form_container')
    var list = $('<ul>', {
      id: 'stockList'
    }).appendTo(stockList)

    //calculate total equity from stocks that user holds and user's profit/loss
    for (var key in stocks){
      var url = api.concat('/stock/' + key + '/delayed-quote')
      $.ajax({
        type:'GET',
        url: url,
        success:function(data){
            var ticker = data.symbol
            marketValue = parseFloat((parseFloat(marketValue) + parseFloat(parseFloat(stocks[ticker]) * parseFloat(data.delayedPrice))).toFixed(2))
            $('#marketValue').text("Market Value: " + marketValue)
            totalProfitLoss = parseFloat((parseFloat(totalProfitLoss) + parseFloat(stocks[ticker]) * (parseFloat(data.delayedPrice) - parseFloat(avgPrice[ticker]))).toFixed(2))
            $('#totalProfitLoss').text('Total Profit/Loss: ' + totalProfitLoss)
            $('<li>', {text: "Stock: " + ticker + "    Quantity: " + stocks[ticker] + "    YourAvgPrice: " + avgPrice[ticker] + "    Price: " + data.delayedPrice + "    Profict/Loss: " + (stocks[ticker] * (data.delayedPrice - avgPrice[ticker])).toFixed(2) + "     ",
              id: ticker
            }).appendTo(stockList)
        }
      })
    }

    //buystock button and sell
    $('<div>', {id: 'buyStock'}).appendTo('.form_container')
    $('<br>').appendTo('#buyStock')
    $('<label>', {text: 'Stock '}).appendTo('#buyStock')
    $('<input>', {id: 'buySymbol', type: 'text', placeholder: 'Enter symbol of the stock you want'}).appendTo('#buyStock')
    $('<label>', {text: 'Quantity '}).appendTo('#buyStock')
    $('<input>', {id: 'quantity', type: 'integer', placeholder: 'Enter how many you want'}).appendTo('#buyStock')
    $('<button>', {text: 'Buy',id: 'buyButton'}).appendTo('#buyStock')
    $('<button>', {text: 'Sell',id: 'sellButton'}).appendTo('#buyStock')

    //search stocks
    $('<br>').appendTo('.form_container')
    $('<div>', {id: 'searchStock'}).appendTo('.form_container')
    $('<label>', {text: 'Search Stock '}).appendTo('#searchStock')
    $('<input>', {id: 'searchSymbol', type: 'text', placeholder: 'Enter Stock Symbol'}).appendTo('#searchStock')
    $('<button>', {text: 'Search',id: 'searchButton'}).appendTo('#searchStock')

    var symbols = []
    var symbolCompany = {}
    var prev = 0;
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
          appendTo: $('#searchStock')
        })

        //display stock info
        // $('<div>', {id: 'stockInfo'}).appendTo('.form_container')
        $('<h1>', {id: 'stockTicker', text: ''}).appendTo('.form_container2')
        $('<h2>', {id: 'stockCompany', text: ''}).appendTo('.form_container2')
        $('<p>', {id: 'stockPrice', text: ''}).appendTo('.form_container2')
        $('<div>', {id: 'stockHistory'}).appendTo('.form_container2')
        $('<ul>', {id: 'histories'}).appendTo('#stockHistory')
        $('<button>', {id: 'one_week', text: '1-Week History'}).appendTo('#stockHistory')
        $('<button>', {id: 'six_months', text: '6-Month History'}).appendTo('#stockHistory')
        $('<button>', {id: 'one_year', text: '1-Year History'}).appendTo('#stockHistory')

        $('<div>', {id: 'stockHistoryDetails'}).appendTo('#stockHistory')
        $('<div>', {id: 'stockHistoryDiv1w'}).appendTo('#stockHistoryDetails')
        $('<div>', {id: 'stockHistoryDiv6m'}).appendTo('#stockHistoryDetails')
        $('<div>', {id: 'stockHistoryDiv1y'}).appendTo('#stockHistoryDetails')

        createTable('1w', 7)
        createTable('6m', 186)
        createTable('1y', 366)

        $('#stockHistoryDiv1y').hide()
        $('#stockHistoryDiv6m').hide()
        $('#stockHistoryDiv1w').hide()

        $('#stockHistory').hide()
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
          $.ajax({
            type:'GET',
            url: api.concat('/stock/' + searchSymbol + '/delayed-quote'),
            success:function(data){
              $('.form_container2').show()
              var price = data.delayedPrice
              $('#stockTicker').text(searchSymbol)
              $('#stockCompany').text(symbolCompany[searchSymbol])
              $('#stockPrice').text('Price: ' + data.delayedPrice)
              $('#stockHistory').show()


            }
          })
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
              updateTableValues('1w', data, 7, searchSymbol)
//                    console.log(data)
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
//                    console.log(data)
              updateTableValues('6m', data, 120, searchSymbol)
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
//                    console.log(data)
              updateTableValues('1y', data, 253, searchSymbol)

            }
          })
        })
      }
    })

    //buyStock
    $('#buyButton').click(function(){
      if (confirm("Confirm buy these stocks?")){
        var searchSymbol = document.getElementById('buySymbol').value
        searchSymbol = searchSymbol.toUpperCase()
        //record quantity
        var quantity = document.getElementById('quantity').value
        if (!isInt(quantity)){
          window.alert("Quantity is not an integer.")
        } else {
          $.ajax({
            type:'GET',
            url: api.concat('/stock/' + searchSymbol + '/delayed-quote'),
            success:function(data){
              var price = data.delayedPrice
              if ((quantity * price) > cash){
                window.alert("You don't have enough cash to by this many.")
              } else{
                if (Object.keys(avgPrice).includes(searchSymbol) && stocks[searchSymbol] != 0){
                  //if the stock exists, calculate avg price you bought it
                  var totalValueBefore = avgPrice[searchSymbol] * stocks[searchSymbol]
                  var totalValueAfter = totalValueBefore + price*quantity
                  //update total profit and loss
                  totalProfitLoss = parseFloat((parseFloat(totalProfitLoss) - parseFloat(stocks[searchSymbol]) * (parseFloat(data.delayedPrice) - parseFloat(avgPrice[searchSymbol]))).toFixed(2))
                  //update avg price
                  stocks[searchSymbol] = parseInt(stocks[searchSymbol]) + parseInt(quantity)
                  avgPrice[searchSymbol] = parseFloat((totalValueAfter/stocks[searchSymbol]).toFixed(2))
                  //update html
                  $('#' + searchSymbol).text("Stock: " + searchSymbol + "    Quantity: " + stocks[searchSymbol] + "    YourAvgPrice: " + avgPrice[searchSymbol] + "    Price: " + data.delayedPrice + "    Profict/Loss: " + (stocks[searchSymbol] * (data.delayedPrice - avgPrice[searchSymbol])).toFixed(2))

                  //calculate market value and profit/loss
                  marketValue = parseFloat((parseFloat(marketValue) + parseFloat(price*quantity)).toFixed(2))
                  //update total profit and loss
                  totalProfitLoss = parseFloat((parseFloat(totalProfitLoss) + parseFloat(stocks[searchSymbol]) * (parseFloat(data.delayedPrice) - parseFloat(avgPrice[searchSymbol]))).toFixed(2))
                  $('#marketValue').text("Market Value: " + marketValue)
                  $('#totalProfitLoss').text('Total Profit/Loss: ' + totalProfitLoss)
                  cash = parseFloat((cash - parseFloat((price*quantity).toFixed(2))).toFixed(2))
                  $('#cash').text('Cash: ' + cash)
                } else{
                  //if the stock doesn't exist
                  stocks[searchSymbol] = quantity
                  avgPrice[searchSymbol] = price

                  $('<li>', {text: "Stock: " + searchSymbol + "    Quantity: " + stocks[searchSymbol] + "    YourAvgPrice: " + avgPrice[searchSymbol] + "    Price: " + data.delayedPrice + "    Profict/Loss: " + (stocks[searchSymbol] * (data.delayedPrice - avgPrice[searchSymbol])).toFixed(2),
                    id: searchSymbol
                  }).appendTo(stockList)

                  //calculate market value and profit/loss
                  marketValue = parseFloat((parseFloat(marketValue) + parseFloat((price*quantity).toFixed(2))).toFixed(2))
                  //update total profit and loss
                  totalProfitLoss = parseFloat((parseFloat(totalProfitLoss) + parseFloat(stocks[searchSymbol]) * (parseFloat(data.delayedPrice) - parseFloat(avgPrice[searchSymbol]))).toFixed(2))
                  $('#marketValue').text("Market Value: " + marketValue)
                  $('#totalProfitLoss').text('Total Profit/Loss: ' + totalProfitLoss)
                  cash = parseFloat((cash - parseFloat((price*quantity).toFixed(2))).toFixed(2))
                  $('#cash').text('Cash: ' + cash)
                }
              }
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
        if (!isInt(quantity)){
          window.alert("Quantity is not an integer.")
        } else {
          $.ajax({
            type:'GET',
            url: api.concat('/stock/' + searchSymbol + '/delayed-quote'),
            success:function(data){
              var price = data.delayedPrice
              if (!Object.keys(avgPrice).includes(searchSymbol)){
                window.alert("You don't have this stock.")
              } else{
                if (quantity > stocks[searchSymbol]){
                  window.alert("You can't sell more than you have")
                } else{
                  var totalValueBefore = avgPrice[searchSymbol] * stocks[searchSymbol]
                  var totalValueAfter = totalValueBefore - price*quantity
                  //update total profit and loss
                  totalProfitLoss = parseFloat((parseFloat(totalProfitLoss) - parseFloat(stocks[searchSymbol]) * (parseFloat(data.delayedPrice) - parseFloat(avgPrice[searchSymbol]))).toFixed(2))
                  stocks[searchSymbol] = parseInt(stocks[searchSymbol]) - parseInt(quantity)
                  if (stocks[searchSymbol] == 0){
                    document.getElementById(searchSymbol).remove();
                    avgPrice[searchSymbol] = 0
                    //calculate market value and profit/loss
                    marketValue = parseFloat((parseFloat(marketValue) - parseFloat(price*quantity)).toFixed(2))
                    $('#marketValue').text("Market Value: " + marketValue)
                    $('#totalProfitLoss').text('Total Profit/Loss: ' + totalProfitLoss)
                    cash = parseFloat((cash + parseFloat((price*quantity).toFixed(2))).toFixed(2))
                    $('#cash').text('Cash: ' + cash)
                  } else{
                    //update avg price
                    avgPrice[searchSymbol] = parseFloat((totalValueAfter/stocks[searchSymbol]).toFixed(2))
                    //update html
                    $('#' + searchSymbol).text("Stock: " + searchSymbol + "    Quantity: " + stocks[searchSymbol] + "    YourAvgPrice: " + avgPrice[searchSymbol] + "    Price: " + data.delayedPrice + "    Profict/Loss: " + (stocks[searchSymbol] * (data.delayedPrice - avgPrice[searchSymbol])).toFixed(2))
                    //calculate market value and profit/loss
                    marketValue = parseFloat((parseFloat(marketValue) - parseFloat(price*quantity)).toFixed(2))
                    //update total profit and loss
                    totalProfitLoss = parseFloat((parseFloat(totalProfitLoss) + parseFloat(stocks[searchSymbol]) * (parseFloat(data.delayedPrice) - parseFloat(avgPrice[searchSymbol]))).toFixed(2))
                    $('#marketValue').text("Market Value: " + marketValue)
                    $('#totalProfitLoss').text('Total Profit/Loss: ' + totalProfitLoss)
                    cash = parseFloat((cash + parseFloat((price*quantity).toFixed(2))).toFixed(2))
                    $('#cash').text('Cash: ' + cash)
                  }
                }
              }
            }
          })
        }
      }
    })
  }//end of else
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

function verifyUsername_regex(username) {
  var username_isValid = /^\w+$/.test(username);
  if(!username_isValid) {
    window.alert('Unable to proceed. Usernames can only contain letters, numerical digits and underscores.')
    return false
  }
  return true
}

function username_exists(username, users) {
  for(var cur= 0 ; cur < users.length ; cur++) {
    if (users[cur].Username === username) {
      return true
    }
  }
  return false
}

function verifyCash_regex(cash){
  var cash_isValid = /^[0-9]+$/.test(cash);
  if(!cash_isValid) {
    window.alert('Unable to proceed. Cash value is invalid.')
    return false
  }
  return true
}

function display_userlist(userlist) {
  $('#userlist_container').empty()
  for(var i = 0 ; i < userlist.length ; i++) {
    var cur_entry = $('<div>', {class: 'userlist_entry'}).appendTo('#userlist_container')
    $('<h2>', {
      text: 'User: ' + userlist[i].Username,
      class: 'userlist_entry_username'
    }).appendTo(cur_entry)
    $('<p>', {
      text: 'Cash: ' + userlist[i].Cash,
      class: 'userlist_entry_cash'
    }).appendTo(cur_entry)

    $('<p>', {
      text: 'Stock Value: ' + userlist[i].Cash,
      class: 'userlist_entry_stockValue'
    }).appendTo(cur_entry)

    $('<p>', {
      text: 'Holdings: ' + userlist[i].Holdings,
      class: 'userlist_entry_holdings'
    }).appendTo(cur_entry)

    $('<p>', {
      text: 'Holding Quantities: ' + userlist[i].StockQuantity,
      class: 'userlist_entry_quantity'
    }).appendTo(cur_entry)
  }

  // calculate stock value for each user
  for (var i = 0; i < userlist.length; i++) {
    var stockWorth = 0
    var prices = {}

    for (var m = 0; m < (userlist[i].Holdings).length; m++) {
      var url = api.concat('/stock/' + userlist[i].Holdings[m] + '/delayed-quote')
      var quantity = userlist[i].StockQuantity[m]
      var id = userlist[i].Username
      var money = userlist[i].Cash
      $.ajax({
        type: 'GET',
        url: url,
        success:function(data) {
          var ticker = data.symbol
          var stockPrice = data.delayedPrice
          prices[ticker] = stockPrice
          for (var c = 0; c < userlist.length; c++) {
            var stockValue = 0
            for (var n = 0; n < (userlist[c].Holdings).length; n++) {
              if (Object.keys(prices).includes(userlist[c].Holdings[n])) {
                stockWorth = parseFloat(parseFloat(parseFloat(userlist[c].StockQuantity[n]) * parseFloat(prices[userlist[c].Holdings[n]]))).toFixed(2)
                stockWorth = parseFloat(stockWorth) + parseFloat(stockValue)
                $('#userStockValue' + userlist[c].Username).text("Stock Value: " + stockWorth.toFixed(2))
              }
            }
          }
        }
      })
    }
  }
}


function createTable(table_type, num_rows) {
  for(var i = 0 ; i < 3 ; i++) {
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
  }

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

function updateTableValues(table_type, data, num_rows, searchSymbol) {
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
