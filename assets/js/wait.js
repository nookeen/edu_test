var globa = false;
function wait(callback, result, attempts) {
    
    result(); // execute
    
    console.log('lets begin');
    
    var counter = 0,
    retry = function() {
    
    	console.log('retrying');
      // Not more than 10 times please
      (attempts) ? attempts : attempts = 10;
      var timeout = setTimeout(function() {
        ++counter;
        console.log('counter:' + counter);
        if(globa === true){
        	callback();
          clearTimeout(timeout);
        } else if (attempts <= counter)
        	console.log('timeout');
        else
        	retry();
      }, 500);
    };
    retry();
  }
  
  function func() {
  	
    console.log('func was called');
    
    var timeout = setTimeout(function() {
    console.log('100000');
    globa = true;
      }, 2500);
  }
  
  function success() {
  	alert('Yes!');
  }
  
  wait(success, func);