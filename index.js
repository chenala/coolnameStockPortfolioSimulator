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
        $('<button>', {id: 'one_week', text: '1-Week History'}).appendTo('#stockHistory')
        $('<button>', {id: 'six_months', text: '6-Month History'}).appendTo('#stockHistory')
        $('<button>', {id: 'one_year', text: '1-Year History'}).appendTo('#stockHistory')

        var time_break = ['1w', '6m', '1y']

        $('<div>', {id: 'stockHistoryDetails'}).appendTo('#stockHistory')
        $('<div>', {id: 'stockHistoryDiv1w'}).appendTo('#stockHistoryDetails')
        $('<div>', {id: 'stockHistoryDiv6m'}).appendTo('#stockHistoryDetails')
        $('<div>', {id: 'stockHistoryDiv1y'}).appendTo('#stockHistoryDetails')

        for(var i = 0 ; i < 3 ; i++) {
          $('<table>', {id: 'table_' + time_break[i]}).appendTo('#stockHistoryDiv' + time_break[i])
          $('<tr>', {id: 'stockHistoryTitles' + time_break[i]}).appendTo('#table_'+ time_break[i])
          $('#stockHistoryTitles' + time_break[i]).empty()
          $('<th>', {id: 'tableTitleSymbol', text: 'Stock'}).appendTo('#stockHistoryTitles' + time_break[i])
          $('<th>', {id: 'tableTitleDate', text: 'Date'}).appendTo('#stockHistoryTitles' + time_break[i])
          $('<th>', {text: 'High'}).appendTo('#stockHistoryTitles' + time_break[i])
          $('<th>', {text: 'Low'}).appendTo('#stockHistoryTitles' + time_break[i])
          $('<th>', {text: 'Average'}).appendTo('#stockHistoryTitles' + time_break[i])
          $('<th>', {text: 'Volume'}).appendTo('#stockHistoryTitles' + time_break[i])
          $('<th>', {text: 'Change Over Time'}).appendTo('#stockHistoryTitles' + time_break[i])
        }
        for(var i = 0 ; i < 7 ; i++) {
          $('<tr>', {id: '1w' + i}).appendTo('#table_1w')
          $('<td>', {id: '1w' + i + 'symbol', text: ''}).appendTo('#1w' + i)
          $('<td>', {id: '1w' + i + 'date', text: ''}).appendTo('#1w' + i)
          $('<td>', {id: '1w' + i + 'high', text: ''}).appendTo('#1w' + i)
          $('<td>', {id: '1w' + i + 'low', text: ''}).appendTo('#1w' + i)
          $('<td>', {id: '1w' + i + 'close', text: ''}).appendTo('#1w' + i)
          $('<td>', {id: '1w' + i + 'volume', text: ''}).appendTo('#1w' + i)
          $('<td>', {id: '1w' + i + 'change', text: ''}).appendTo('#1w' + i)
        }
        for(var i = 0 ; i < 186 ; i++) {
          $('<tr>', {id: '6m' + i}).appendTo('#table_6m')
          $('<td>', {id: '6m' + i + 'symbol', text: ''}).appendTo('#6m' + i)
          $('<td>', {id: '6m' + i + 'date', text: ''}).appendTo('#6m' + i)
          $('<td>', {id: '6m' + i + 'high', text: ''}).appendTo('#6m' + i)
          $('<td>', {id: '6m' + i + 'low', text: ''}).appendTo('#6m' + i)
          $('<td>', {id: '6m' + i + 'close', text: ''}).appendTo('#6m' + i)
          $('<td>', {id: '6m' + i + 'volume', text: ''}).appendTo('#6m' + i)
          $('<td>', {id: '6m' + i + 'change', text: ''}).appendTo('#6m' + i)
        }
        for(var i = 0 ; i < 366 ; i++) {
          $('<tr>', {id: '1y' + i}).appendTo('#table_1y')
          $('<td>', {id: '1y' + i + 'symbol', text: ''}).appendTo('#1y' + i)
          $('<td>', {id: '1y' + i + 'date', text: ''}).appendTo('#1y' + i)
          $('<td>', {id: '1y' + i + 'high', text: ''}).appendTo('#1y' + i)
          $('<td>', {id: '1y' + i + 'low', text: ''}).appendTo('#1y' + i)
          $('<td>', {id: '1y' + i + 'close', text: ''}).appendTo('#1y' + i)
          $('<td>', {id: '1y' + i + 'volume', text: ''}).appendTo('#1y' + i)
          $('<td>', {id: '1y' + i + 'change', text: ''}).appendTo('#1y' + i)
        }
        $('#stockHistoryDiv1y').hide()
        $('#stockHistoryDiv6m').hide()
        $('#stockHistoryDiv1w').hide()

        $('#stockHistory').hide()
        //get text in search bar
        $('#searchButton').click(function(){
//          $("#stockHistoryDetails").empty()
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


              $('#one_week').click(function(){
                $('#stockHistoryDiv1y').hide()
                $('#stockHistoryDiv6m').hide()
                $('#stockHistoryDiv1w').show()
                $.ajax({
                  type:'GET',
                  url: api.concat('/stock/' + searchSymbol + '/chart/1y'),
                  success:function(data){
                    var data_size = data.length;
                    console.log(data)
                    for(var i = 0 ; i < 7 ; i++) {
                      $('#1w' + i + 'symbol').text(searchSymbol)
                      $('#1w' + i + 'date').text(data[data.length-i-1].date)
                      $('#1w' + i + 'high').text(data[data.length-i-1].high)
                      $('#1w' + i + 'low').text(data[data.length-i-1].low)
                      $('#1w' + i + 'close').text(data[data.length-i-1].close)
                      $('#1w' + i + 'volume').text(data[data.length-i-1].volume)
                      $('#1w' + i + 'change').text(data[data.length-i-1].change)
                    }
                  }
                })
              })

              $('#six_months').click(function(){
                $('#stockHistoryDiv1w').hide()
                $('#stockHistoryDiv1y').hide()
                $('#stockHistoryDiv6m').show()
                $.ajax({
                  type:'GET',
                  url: api.concat('/stock/' + searchSymbol + '/chart/1y'),
                  success:function(data){
                    var data_size = data.length;
                    console.log(data)
                    for(var i = 0 ; i < 120 ; i++) {
                      $('#6m' + i + 'symbol').text(searchSymbol)
                      $('#6m' + i + 'date').text(data[data.length-i-1].date)
                      $('#6m' + i + 'high').text(data[data.length-i-1].high)
                      $('#6m' + i + 'low').text(data[data.length-i-1].low)
                      $('#6m' + i + 'close').text(data[data.length-i-1].close)
                      $('#6m' + i + 'volume').text(data[data.length-i-1].volume)
                      $('#6m' + i + 'change').text(data[data.length-i-1].change)
                    }
                  }
                })
              })

              $('#one_year').click(function(){
                $('#stockHistoryDiv1w').hide()
                $('#stockHistoryDiv6m').hide()
                $('#stockHistoryDiv1y').show()
                $.ajax({
                  type:'GET',
                  url: api.concat('/stock/' + searchSymbol + '/chart/1y'),
                  success:function(data){
                    var data_size = data.length;
                    console.log(data)
                    for(var i = 0 ; i < 253 ; i++) {
                      $('#1y' + i + 'symbol').text(searchSymbol)
                      $('#1y' + i + 'date').text(data[data.length-i-1].date)
                      $('#1y' + i + 'high').text(data[data.length-i-1].high)
                      $('#1y' + i + 'low').text(data[data.length-i-1].low)
                      $('#1y' + i + 'close').text(data[data.length-i-1].close)
                      $('#1y' + i + 'volume').text(data[data.length-i-1].volume)
                      $('#1y' + i + 'change').text(data[data.length-i-1].change)
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
