var INIT_MODULE = (function() {
"use strict";

  // Include Modules
  var inc = {};
  
  inc.TXT = TXT_MODULE;
  inc.UTIL = UTILITIES_MODULE;
  inc.CONFIG = CONFIG_MODULE;
  inc.RENDER = RENDERING_MODULE;
  inc.DB = DB_MODULE;
  inc.ROUTES = ROUTES_MODULE;
  
  var config = inc.CONFIG.config,
      pages = {};
  
  var init = function() {
    
    //console.p('@Entered init()');
    
    // Load first page
    inc.ROUTES.route();
    
    __closePreloader();
    
    // The main thing for nav - add event listener
    config.jWindow.on('hashchange', _addHashEventListeners);
    
    function __closePreloader() {
      //console.p('@Closing loader');
      config.jPreloader.fadeOut(1000, function(){ $(this).addClass('disabled'); })
    }
  };
  
  // This is where we wait for the DB to load...
  inc.UTIL.waitJS(_preloadData, init);
  
  // Wait until the data gets loaded
  function _preloadData() {
    
    var loaded = false;
    
    //console.p('@Entered _preloadData()...');
    
    (DB_MODULE.isDataLoaded() === true) ? loaded = true : loaded;
    
    console.p('@isDataLoaded() = ' + loaded);
    
    return loaded;
  }
  
  // The main thing for nav, add event listener
  function _addHashEventListeners() {
    
    //console.p('@Added event listener call route() with window.location.hash');
    
    inc.ROUTES.route(decodeURI(window.location.hash));
  }
})(this);