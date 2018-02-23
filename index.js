var api = 'https://api.iextrading.com/1.0'

$('#Login').click(function(){
  var username = document.getElementById('uname').value
  if (username === 'admin'){
    //if it is admin role
    $('div').remove('.username')
    $('div').remove('.password')
    $('div').remove('.login')
    $('<p>').appendTo('body').text("welcome " + username)
  } else{
    //if it is a user role
    $('div').remove('.username')
    $('div').remove('.password')
    $('div').remove('.login')
    $('<p>').appendTo('body').text("welcome " + username)

    var standing = $('<div>').appendTo('body')
    $('<p>').appendTo(standing).text('Your current standing:')

    //assume user has these stocks and cash
    //stocks store how many stocks of each company the user holds
    var stocks = {'AAPL': 1, 'FB': 10, 'MSFT': 20}
    //avg price holds the avg price of the stock the user bought
    var avgPrice = {'AAPL': 100, 'FB': 100, 'MSFT': 100}
    var cash = 1000
    var marketValue = 0
    var totalProfitLoss = 0

    $('<p>').appendTo(standing).text("Cash: " + cash)
    $('<p>', {
      id: 'marketValue',
      text: 'marketValue' + 0
    }).appendTo(standing)
    $('<p>', {
      id: 'totalProfitLoss',
      text: 'Total Profit/Loss' + 0
    }).appendTo(standing)

    var stockList = $('<div>').appendTo('body')
    var list = $('<ul>', {
      id: 'stockList'
    }).appendTo(stockList)

    //calculate total equity from stocks that user holds
    for (var key in stocks){
      var url = api.concat('/stock/' + key + '/delayed-quote')
      $.ajax({
        type:'GET',
        url: url,
        success:function(data){
            var ticker = data.symbol
            marketValue = parseFloat((marketValue + stocks[ticker] * data.delayedPrice).toFixed(2))
            $('#marketValue').text("Market Value: " + marketValue)
            totalProfitLoss = parseFloat((totalProfitLoss + stocks[ticker] * (data.delayedPrice - avgPrice[ticker])).toFixed(2))
            $('#totalProfitLoss').text('Total Profit/Loss: ' + totalProfitLoss)
            $('<li>').text("Stock: " + ticker + "    YourAvgPrice: " + avgPrice[ticker] + "    Price: " + data.delayedPrice + "    Profict/Loss: " + (stocks[ticker] * (data.delayedPrice - avgPrice[ticker])).toFixed(2)).appendTo(stockList)
        }
      })
    }

  }//end of else
})
