var UTILITIES_MODULE = (function() {
"use strict";
  
  // Import Modules
  var inc = {};
  
  inc.CONFIG = CONFIG_MODULE;
  
  var config = inc.CONFIG.config;
  
  (function updateYear() {
    var year = new Date().getFullYear();
    config.jBody.find('.txt-year').html(year);
  })(this);
  
  function getRandomInt() {
    return Math.floor(Math.random() * Math.floor(1000000));
  }
  
  var alertBoxtimeout;
  function showAlertBox(text, alertClass) {
    
    clearTimeout(alertBoxtimeout);
    //console.p(text);
    //console.p(alertClass);
    
    // Close any opened alerts
    config.jAlertBox.hide();
    config.jAlertBox.removeClass('alert-success alert-warning alert-danger');
    
    config.jAlertBox.addClass('alert-'+alertClass); // success, warning, danger
    config.jAlertBox.find('span.content').html(text);
    config.jAlertBox.slideDown(500);
    
    // Events
    config.jAlertBox.find('.close').on('click', _hideAlertBox);
    
    alertBoxtimeout = setTimeout(function() {
      _hideAlertBox();
    }, 5000);
  }
  function _hideAlertBox() {
    // Events
    config.jAlertBox.find('.close').off('click', _hideAlertBox);
    
    config.jAlertBox.slideUp(250);
  }
  
  function createUniqueID(section) {
    var _1 = section,
        _2 = getRandomInt(),
        _3 = getRandomInt(),
        hashids = new Hashids('astronomyCourse');
        
    //console.p(_1);
    //console.p(_2);
    //console.p(hashids.encode(_1, _2, _3));
    
    return hashids.encode(_1, _2, _3);
  }
  
  function waitJS(runFunction, callback, options) {
    
    var defaultSettings = {
      attempts: 10,
      waitFor:  'general'
    },
    response,
    timeout,
    counter,
    retry,
    proceed = false,
    success = function(){
      callback();
      clearTimeout(timeout);
      proceed = true;
      return proceed;
    };
    
    options = _.assign({}, defaultSettings, options);
    
    //console.log('@Entered WaitJS, you\'re in a JS timezone now!');
    
    //console.log(options);
    
    if(_.isEmpty(window.waitJS))
      window.waitJS = {}; 
    config.waitJS[options.waitFor] = false;
    
    runFunction(); // execuuuuuute
    
    //console.p('Lets begin...');
    
    counter = 0,
    
    retry = function() {
      
      //console.log('retrying...');
      
      response = runFunction();
      
      timeout = setTimeout(function() {
        
        ++counter;
        
        //console.log('counter:' + counter);
        
        (config.waitJS[options.waitFor] === true || response === true) ? success() : // ... otherwise
        (options.attempts <= counter && proceed === false) ? console.log('timeout!') : retry();
        
      }, 500);
    };
    retry();
  }
  
  return {
    showAlertBox: showAlertBox,
    createUniqueID: createUniqueID,
    waitJS: waitJS,
    getRandomInt: getRandomInt
  };
})(this);