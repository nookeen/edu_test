//=============================================================================
// MODULE_DEBUG
//=============================================================================
var MODULE_DEBUG = (function() {
  
  var isDebugMode = true;
  
  // Let's hide all console msgs from one place,
  // and let's use console.p (p for print) to separate from main fn
  (isDebugMode) ? console.p = console.log : console.p = '';
  
  //console.p('loaded');
  
})();