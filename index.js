var api = 'https://api.iextrading.com/1.0'

$('#Login').click(function(){
  var username = document.getElementById('uname').value
  if (username === ''){
    //if it is admin role
    $('.username').hide()
    $('.password').hide()
    $('.login').hide()
    $('<p>').appendTo('body').text("welcome " + username)

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

    //Display user data
    var adminPanel = $('<div>').appendTo('body')
    $('<p>').appendTo(adminPanel).text('User Data:')

    console.log(users.length)
    for (var i = 0; i < users.length; i++) {
      var portfolioWorth = 0
      console.log(users[i].Cash)
      portfolioWorth = portfolioWorth + users[i].Cash
      var stockWorth = 0
      for (var stock in user.Holdings) {
        var url = api.concat('/stock/' + stock + '/delayed-quote')
        $.ajax({
          type:'GET',
          url: url,
          success:function(data){
              var ticker = data.symbol
              stockWorth = stockWorth + parseFloat(parseFloat(parseFloat(stock[ticker]) * parseFloat(data.delayedPrice))).toFixed(2)
          }
        })
      }
      portfolioWorth = portfolioWorth + stockWorth
      $('<li>', {text: "User: " + user + "    Cash: " + user.Cash + "    Holdings: " + user.Holdings  + "    Total Portfolio Value: " + portfolioWorth,
        //id: userData
      }).appendTo(adminPanel)
    }

  } else{
    //if it is a user role
    $('.username').hide()
    $('.password').hide()
    $('.login').hide()
    $('<p>').appendTo('body').text("welcome " + username)

    var standing = $('<div>').appendTo('body')
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
    var stockList = $('<div>').appendTo('body')
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
    $('<div>', {id: 'buyStock'}).appendTo('body')
    $('<br>').appendTo('#buyStock')
    $('<label>', {text: 'Stock '}).appendTo('#buyStock')
    $('<input>', {id: 'buySymbol', type: 'text', placeholder: 'Enter symbol of the stock you want'}).appendTo('#buyStock')
    $('<label>', {text: 'Quantity '}).appendTo('#buyStock')
    $('<input>', {id: 'quantity', type: 'integer', placeholder: 'Enter how many you want'}).appendTo('#buyStock')
    $('<button>', {text: 'Buy',id: 'buyButton'}).appendTo('#buyStock')
    $('<button>', {text: 'Sell',id: 'sellButton'}).appendTo('#buyStock')

    //search stocks
    $('<br>').appendTo('body')
    $('<div>', {id: 'searchStock'}).appendTo('body')
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
        $('<div>', {id: 'stockInfo'}).appendTo('body')
        $('<h1>', {id: 'stockTicker', text: ''}).appendTo('#stockInfo')
        $('<h2>', {id: 'stockCompany', text: ''}).appendTo('#stockInfo')
        $('<p>', {id: 'stockPrice', text: ''}).appendTo('#stockInfo')
        $('<div>', {id: 'stockHistory'}).appendTo('#stockInfo')
        $('<ul>', {id: 'histories'}).appendTo('#stockHistory')
        $('<button>', {id: '1day', text: '1 Day History'}).appendTo('#stockHistory')
        $('<button>', {id: '1month', text: '1 Month History'}).appendTo('#stockHistory')
        $('<button>', {id: '6month', text: '6 Month History'}).appendTo('#stockHistory')


        $('<div>', {id: 'stockHistoryDetails'}).appendTo('#stockHistory')
        $('<table>', {id: 'stockHistoryTable'}).appendTo('#stockHistoryDetails')

        $('#stockHistory').hide()
        //get text in search bar
        $('#searchButton').click(function(){
          $("#stockHistoryTable").empty()
          var searchSymbol = document.getElementById('searchSymbol').value
          searchSymbol = searchSymbol.toUpperCase()
          if (!symbols.includes(searchSymbol)){
            window.alert("The symbol doesn't exist")
          }
          $.ajax({
            type:'GET',
            url: api.concat('/stock/' + searchSymbol + '/delayed-quote'),
            success:function(data){
              var price = data.delayedPrice
              $('#stockTicker').text(searchSymbol)
              $('#stockCompany').text(symbolCompany[searchSymbol])
              $('#stockPrice').text('Price: ' + data.delayedPrice)
              $('#stockHistory').show()


              $('#1day').click(function(){
                $("#stockHistoryTable").empty()

                var date = new Date()
    //            console.log(date)
                var month = date.getMonth() + 1
                var monthString = month.toString()
                var day = date.getDate()
                var year = date.getFullYear()
                var time = "09:30" //unused

                var url_extend;
                if (month < 10) url_extend = '/stock/'+ searchSymbol +'/chart/date/' + year.toString() + '0' + month.toString() + day.toString()
                else url_extend = '/stock/'+ searchSymbol +'/chart/date/' + year.toString() + month.toString() + day.toString()

//                console.log(url_extend)

                $('<tr>', {id: 'stockHistoryTitles'}).appendTo('#stockHistoryTable')
                $("#stockHistoryTitles").empty()
                $('<th>', {id: 'tableTitleSymbol', text: 'Stock'}).appendTo('#stockHistoryTitles')
                $('<th>', {id: 'tableTitleDate', text: 'Date'}).appendTo('#stockHistoryTitles')
                $('<th>', {id: 'tableTitleMinute', text: 'Time'}).appendTo('#stockHistoryTitles')
                $('<th>', {text: 'High'}).appendTo('#stockHistoryTitles')
                $('<th>', {text: 'Low'}).appendTo('#stockHistoryTitles')
                $('<th>', {text: 'Volume'}).appendTo('#stockHistoryTitles')
                $('<th>', {text: 'Change Over Time'}).appendTo('#stockHistoryTitles')

                $.ajax({
                  type:'GET',
//                  async: false,
                  url: api.concat(url_extend),
                  success:function(data){
//                    console.log(data)

                    for(var i = 1; i < data.length; i += 5) {
                      $('#rowEntry' + i.toString() + searchSymbol).empty()
                      $('<tr>', {id: 'rowEntry' + i.toString() + searchSymbol}).appendTo('#stockHistoryTable')
                      $('<td>', {id: 'obj_symbol',text: searchSymbol}).appendTo('#rowEntry' + i.toString() + searchSymbol)
                      var objDate = data[i].date
                      // format date so it is easier to read for users
                      $('<td>', {id: 'obj_date', text: objDate.slice(0,4) + '-' + objDate.slice(4,6) + "-" + objDate.slice(6,8)}).appendTo('#rowEntry' + i.toString() + searchSymbol)
                      $('<td>', {id: 'obj_label',text: data[i].label}).appendTo('#rowEntry' + i.toString() + searchSymbol)
                      $('<td>', {id: 'obj_high',text: data[i].high}).appendTo('#rowEntry' + i.toString() + searchSymbol)
                      $('<td>', {id: 'obj_low',text: data[i].low}).appendTo('#rowEntry' + i.toString() + searchSymbol)
                      $('<td>', {id: 'obj_volume',text: data[i].volume}).appendTo('#rowEntry' + i.toString() + searchSymbol)
                      $('<td>', {id: 'obj_changeOverTime',text: data[i].changeOverTime}).appendTo('#rowEntry' + i.toString() + searchSymbol)

                    }
                  }
                })

              })


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

function isInt(value) {
  return !isNaN(value) &&
         parseInt(Number(value)) == value &&
         !isNaN(parseInt(value, 10));
}

function resetRow(i, func) {

}
