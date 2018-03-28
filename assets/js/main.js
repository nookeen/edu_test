(function() {
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

  // Load Libraries
  load(include.lib('jquery-3.1.1', min))
    .then(include.lib('dexie'),
          include.lib('bootstrap', min),
          include.lib('hashids', min),
          include.lib('underscore-min'),
          include.lib('handlebars-v4.0.11'),
    // Data for DB import
          include.main('content') )
    // Load modules
    .then(include.module('module_txt'))
    .then(include.module('module_config'))
    .then(include.module('module_utilities'))
    .then(include.module('module_debug'))
    .then(include.module('module_rendering.v3'))
    .then(include.module('module_db.v2'))
    .then(include.module('module_users'))
    .thenRun(function () {
      //console.log('load.js: All loaded');
    });
})(this);