/* ========================================================
* A. Pasternak's Astronomy Course DEMO (Swiiiiish)
*
* This script gets a json object and builds
* a course with questions and explanations with it
*
* Hi-ho Hi-ho off to astronomy we go
======================================================== */

(function() {

  //============================================================================
  // Let's create a decent include fn to work with load.js
  //============================================================================
  
  var path = 'assets/js/';
  var min = false;
  
  var include = {
    'main' : function(name, min){
      return process('', name, min);
    },
    'module' : function(name, min){
      return process('modules', name, min);
    },
    'lib' : function(name, min){
      return process('lib', name, min);
    }
  };
  
  function process (directory, name, min) {
    (min) ? min = '.min' : min = '';
    (directory) ? directory = directory + '/' : directory;
    
    //console.log(path + directory + name + min + '.js');
    
    return path + directory + name + min + '.js';
  }
  
  min = true;
  
  //============================================================================
  // Load Libraries and scripts
  //============================================================================
  
  load(include.lib('jquery-3.1.1', min))
    .then(include.lib('dexie'),
          include.lib('bootstrap', min),
          include.lib('hashids', min),
          include.lib('lodash', min),
          include.lib('localscroll'),
          include.lib('handlebars-v4.0.11'),
    // Data for DB import
          include.main('content') )
    // Load modules
    .then(include.module('txt_module'))
    .then(include.module('config_module'))
    .then(include.module('utilities_module'))
    .then(include.module('debug_module'))
    .then(include.module('rendering_module.v5'))
    .then(include.module('routes_module'))
    .then(include.module('db_module.v2'))
    .then(include.module('users_module'))
    .then(include.module('init_module'))
    .thenRun(function () {
      //console.log('load.js: All loaded');
    });
})(this);
