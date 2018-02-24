var api = 'https://api.iextrading.com/1.0'

$('#Login').click(function(){
  var username = document.getElementById('uname').value
  if (username === 'admin'){
    //if it is admin role
    $('.username').hide()
    $('.password').hide()
    $('.login').hide()
    $('<p>').appendTo('body').text("welcome " + username)
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
            $('<li>', {text: "Stock: " + ticker + "    Quantity: " + stocks[ticker] + "    YourAvgPrice: " + avgPrice[ticker] + "    Price: " + data.delayedPrice + "    Profict/Loss: " + (stocks[ticker] * (data.delayedPrice - avgPrice[ticker])).toFixed(2),
              id: ticker
            }).appendTo(stockList)
        }
      })
    }

    //buystock button
    $('<div>', {id: 'buyStock'}).appendTo('body')
    $('<br>').appendTo('#buyStock')
    $('<label>', {text: 'Buy Stock '}).appendTo('#buyStock')
    $('<input>', {id: 'buySymbol', type: 'text', placeholder: 'Enter symbol of the stock you want'}).appendTo('#buyStock')
    $('<label>', {text: 'Quantity '}).appendTo('#buyStock')
    $('<input>', {id: 'quantity', type: 'integer', placeholder: 'Enter how many you want'}).appendTo('#buyStock')
    $('<button>', {text: 'Buy',id: 'buyButton'}).appendTo('#buyStock')

    //search stocks
    $('<br>').appendTo('body')
    $('<div>', {id: 'searchStock'}).appendTo('body')
    $('<label>', {text: 'Search Stock '}).appendTo('#searchStock')
    $('<input>', {id: 'searchSymbol', type: 'text', placeholder: 'Enter Stock Symbol'}).appendTo('#searchStock')
    $('<button>', {text: 'Search',id: 'searchButton'}).appendTo('#searchStock')

    var symbols = []
    var symbolCompany = {}
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
        $('#stockHistory').hide()
        //get text in search bar
        $('#searchButton').click(function(){
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
                if (Object.keys(avgPrice).includes(searchSymbol)){
                  //if the stock exists
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

  }//end of else
})

function isInt(value) {
  return !isNaN(value) &&
         parseInt(Number(value)) == value &&
         !isNaN(parseInt(value, 10));
}
