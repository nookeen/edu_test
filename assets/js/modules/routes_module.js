var ROUTES_MODULE = (function() {
"use strict";

  // Include Modules
  var inc = {};
  
  inc.TXT = TXT_MODULE;
  inc.UTIL = UTILITIES_MODULE;
  inc.CONFIG = CONFIG_MODULE;
  inc.RENDER = RENDERING_MODULE;
  
  var config = inc.CONFIG.config,
      pages = {};
  
  // A very important public function that handles requests
  function route(url) {
    
    //console.p('@Entered route() with url=' + url);
    
    var changeHash = function() { // In other words, redirect
      
      //console.p('@Redirecting with url=' + url);
      
      location.hash = url;
    };
    
    var login = function() {
      
      //console.p('@Entered login() => config.pages.mainUnprotected' + config.pages.mainUnprotected);
      
      route(config.pages.mainUnprotected);
      
      inc.UTIL.showAlertBox(inc.TXT.txt.please_login, 'warning'); // Show warning for the need to login
    };
    
    // If no url given, get it from the hash
    (url === undefined) ? url = decodeURI(window.location.hash) : null;
    
    if(window.location.hash !== url)
      return changeHash();
    
    //console.log('If this is a local scroll, stop here');
    
    if(window.location.hash.match(/#answers/g))
      return;
    
    console.log('after');
    
    // Check perms and proceed or redirect
    (_validateRequest(url) === true) ? inc.RENDER.render(url) :
      (inc.UTIL.isLoggedIn() === true) ? route(config.pages.mainProtected) : login();
    
  }
  
  // Very strict function
  function _validateRequest(url) {
    
    //console.p('@_validateRequest');
    
    var protectedPage = false, // e.g. tests, questions, pages where you need to be signed in
    proceed = false,
    i;
    
    for(i = 0; i < config.pages.unprotected.length; i++) { // For login or register
      if(config.pages.unprotected[i] === url) {
        (inc.UTIL.isLoggedIn() === true) ? proceed = false : proceed = true;
        
        // Logged in users have nothing to do here
        //console.p('@Match! The page we're looking for is either login or register');
          //console.p('config.pages.unprotected[i] === url');
            //console.p('proceed=' + proceed);
        
        return proceed;
      }
    }
    
    //console.p('@We're looking for a private page');
    
    protectedPage = true;
    
    (inc.UTIL.isLoggedIn() === true) ? proceed = true : proceed = false;
    
    //console.p('protectedPage = true;');
    //console.p('proceed=' + proceed);
    
    return proceed;
  }
  
  
  // The main thing for nav, add event listener
  function _addHashEventListeners() {
    
    //console.p('@Added event listener call route() with window.location.hash');
    
    route(decodeURI(window.location.hash));
  }
  
  return {
    route: route
  };
})(this);