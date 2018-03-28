var USERS_MODULE = (function() {
"use strict";
  
  // Import Modules
  var inc = {};
  
  inc.UTIL = UTILITIES_MODULE;
  inc.DB = DB_MODULE;
  inc.TXT = TXT_MODULE;
  inc.RENDER = RENDERING_MODULE;
  inc.CONFIG = CONFIG_MODULE;
  
  var config = inc.CONFIG.config,
      submittedData = {},
      userData = {},
      forms = {},
      temp;
  
  // Setup form object for forms
  for (var key in config.forms) {
    
    temp = config.jBody.find(config.formClassNames[key]);
    forms[key] = {
      from: key,
      formClass: config.formClassNames[key],
      jObj: temp,
      fields: {
        jUserName: temp.find(config.formClassNames.inputField) // Get form field as jQuery object
      }
      
    };
  }
  
  var disableNav = function(){
    clearTimeout(delay);
    var delay = setTimeout(function(){config.jBody.find('nav').addClass('disabled');}, 2000);
  };
  
  // Do isLoggedIn add set event listeners
  forms.login.jObj.on('submit', _login);
  forms.register.jObj.on('submit', _register);
  // Add event listener to logout
  config.jBody.find('.logout').on('click', _logout);
  
  // Show/hide the nav bar
  (inc.RENDER.isLoggedIn() === true) ? config.jBody.find('nav').addClass('visible').removeClass('disabled') :
    config.jBody.find('nav').removeClass('visible', disableNav()); // Hide nav
  
  
  function _login(e) {
    
    e.preventDefault();
    
    // Save the data into an object
    submittedData.userName = forms.login.fields.jUserName.val();
    
    //console.p(submittedData);
    
    if (_validateUserName(submittedData.userName, config.formClassNames.login) === false)
      return;
    
    // Get user from DB by userName
    inc.DB.dbRequests('getUser', submittedData.userName);
  }
  
  function _register(e){
    
    e.preventDefault();
    
    // Save the data into an object
    submittedData.userName = forms.register.fields.jUserName.val();
    
    // Validate the input
    if (_validateUserName(submittedData.userName, config.formClassNames.register) === false)
      return;
    
    userData = {
      userUniqueID: inc.UTIL.createUniqueID(config.sectionHashID.users),
      userName: submittedData.userName,
      userAnswers: {}
    };
    
    // Add new user
    inc.DB.dbRequests('addUser', userData);
  }
  
  function _logout(e) {
    sessionStorage.removeItem('userName');
    config.appSession.currentUser = '';
    
    console.p('dsd');
    
    // Clear login and register fields
    _resetForm(config.forms.login);
    _resetForm(config.forms.register);
    
    // Hide nav
    config.jBody.find('nav').removeClass('visible');
    $('.navbar-collapse').collapse('hide');
    
    inc.RENDER.route('');
  }
  
  function _resetForm(form) {
    // Reset form field
    forms[form].fields.jUserName.val('');
  }
  
  function _validateUserName(txt) {
    var lettersOnly = /^[A-Za-z]+$/,
        result;
    
    (txt.match(lettersOnly)) ? result = true : result = false;
    
    // Since there is only one case we don't need to map the answers
    if(result === false){
      inc.UTIL.showAlertBox(inc.TXT.txt.only_letters, 'danger');
    }
    
    //console.p(result);
    
    return result;
  }
  
  return {};
})(this);
