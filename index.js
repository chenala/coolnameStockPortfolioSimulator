$('#Login').click(function(){
  var username = document.getElementById('uname').value
  if (username === 'admin'){
    //if it is admin role
    $('<p>').appendTo('body').text("welcome " + username)
  } else{
    //if it is a user role
    $('div').remove('.username')
    $('div').remove('.password')
    $('div').remove('.login')

    $('<p>').appendTo('body').text("welcome " + username)

    var standing = $('<div>').appendTo('body')
    var stocks = {'AAPL': 10, 'FB': 10, 'MSFT': 20}
    var cash = 1000
    
  }
})
