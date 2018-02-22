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

    $('<p>').appendTo('body').text('Your current standing')
    var standing = $('<div>').appendTo('body')

    //assume user has these stocks and cash
    var stocks = {'AAPL': 10, 'FB': 10, 'MSFT': 20}
    var cash = 1000
    var marketValue = 0

    $('<p>').appendTo(standing).text("Cash: " + cash)
    $('<p>', {
      id: 'marketValue',
      text: 'marketValue' + 0
    }).appendTo(standing)

    //calculate total equity from stocks that user holds
    for (var key in stocks){
      var url = api.concat('/stock/' + key + '/price')
      $.ajax({
        type:'GET',
        url: url,
        success:function(data){
            marketValue = marketValue + stocks[key] * data
            console.log(marketValue)
            $('#marketValue').text("Market Value: " + marketValue)
        }
      })
    }
  }
})
