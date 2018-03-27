var MODULE_USERS = (function() {
"use strict";
  
  // Import Modules
  var inc = {};
  
  inc.UTIL = MODULE_UTILITIES;
  inc.DB = MODULE_DB;
  inc.TXT = MODULE_TXT;
  inc.RENDER = MODULE_RENDERING;
  
  var settings = inc.UTIL.settings,
      submittedData = {},
      userData = {},
      forms = {},
      temp;
  
  // Setup form object for forms
  for (var key in settings.forms) {
    
    temp = settings.jBody.find(settings.formClassNames[key]);
    forms[key] = {
      from: key,
      formClass: settings.formClassNames[key],
      jObj: temp,
      fields: {
        jUserName: temp.find(settings.formClassNames.inputField) // Get form field as jQuery object
      }
      
    };
  }
  
  // Check if logged in and add needed event listeners
  // Add event listener
  forms.login.jObj.on('submit', _login);
  forms.register.jObj.on('submit', _register);
  
  // If user is already logged in go to the tests
  if(inc.RENDER.isLoggedIn() === true) {
    // Add event listener to logout
    settings.jBody.find('.logout').on('click', _logout);
    settings.jBody.find('nav').addClass('visible');
  } else {
    // Hide nav
    settings.jBody.find('nav').removeClass('visible');
  }
  
  
  function _login(e) {
    
    e.preventDefault();
    
    // Save the data into an object
    submittedData.userName = forms.login.fields.jUserName.val();
    
    //console.p(submittedData);
    
    if (_validateUserName(submittedData.userName, settings.formClassNames.login) === false)
      return;
    
    // Get user from DB by userName
    inc.DB.dbRequests('getUser', submittedData.userName);
  }
  
  function _register(e){
    
    e.preventDefault();
    
    // Save the data into an object
    submittedData.userName = forms.register.fields.jUserName.val();
    
    // Validate the input
    if (_validateUserName(submittedData.userName, settings.formClassNames.register) === false)
      return;
    
    userData = {
      userUniqueID: inc.UTIL.createUniqueID(settings.idHashNumber.users),
      userName: submittedData.userName,
      userAnswers: {}
    };
    
    // Add new user
    inc.DB.dbRequests('addUser', userData);
  }
  
  function _logout(e) {
    sessionStorage.removeItem('userName');
    settings.appSession.currentUser = '';
    
    // Clear login and register fields
    _resetForm(settings.forms.login);
    _resetForm(settings.forms.register);
    
    // Hide nav
    settings.jBody.find('nav').removeClass('visible');
    $('.navbar-collapse').collapse('hide');
    
    inc.RENDER.redirect('#');
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
