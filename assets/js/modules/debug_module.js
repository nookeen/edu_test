var DEBUG_MODULE = (function() {
"use strict";
  
  var isDebugMode = true;
  
  // Let's hide all console msgs from one place,
  // and let's use console.p (p for print) to separate from main fn
  (isDebugMode) ? console.p = console.log : console.p = '';
  
  //console.p('loaded');
  
})();