//=============================================================================
// HANDLER_TXT
//=============================================================================
var HANDLER_TXT = (function() {
"use strict";

  // Everything related to view in terms of content and text goes here
  var txt = {};
  
  txt.already_registered = "There is a user with this name already, please select a different name or login.";
  txt.account_created = "Your account is created!";
  txt.success = "success";
  txt.warning = "warning";
  txt.error = "error";
  txt.please_login = "Please login to view this page.";
  
  return {
    txt: txt
  };
  
})();

//=============================================================================
// HANDLER_UTILITIES
//=============================================================================
var HANDLER_UTILITIES = (function() {
"use strict";

  // Put jQuery stuff into variables
  var settings = {
    // cache jQuery
    jWindow: $(window),
    jBody: $('#app'),
    // sessionStorage setup
    appSession: {
      currentUser: sessionStorage.getItem('userName'), // Get user's name to see if there is a session
      currentPage: null //sessionStorage.getItem('currentPage'), // Get user's name to see if there is a session
    },
    // Define page structure
    pages: {
      // A list of available pages
      pagesList: {
        login: 'login',
        register: 'register',
        tests: 'tests',
        questions: 'questions',
        singleQuestion: 'single-question'
      },
    },
    // When creating unique IDs we'll need to set them apart by section
    hashids: new Hashids('astronomyCourse'),
    idHashNumber: {
      tests: 1,
      questions: 2,
      answers: 3,
      users: 4
    },
    // What forms to look out for
    formClassNames: {
      register: '.register_form',
      login: '.login_form'
    },
  };
  
  // Cache the pages section
  settings.pages.jPages = settings.jBody.find('.page');
  settings.jAlertBox = settings.jBody.find('.alertBox');
  
  
  function getIdHashNumber(section) {
    return settings.idHashNumber[section];
  }
  
  function getRandomInt() {
    return Math.floor(Math.random() * Math.floor(1000000));
  }
  
  function showAlertBox(text, prependToObj, alertClass) {
    var content = {
      alertClass: alertClass, // success, warning, error
      txtAlertTitle: "",
      txtAlertDetails: text
    };
    var source    = document.getElementById("alert-box-template").innerHTML;
    var template  = Handlebars.compile(source);
    var html      = template(content);
    
    settings.jAlertBox.prependTo(prependToObj).slideDown(500);
  }
  
  // Very useful Date helper
  var setDate = Date.now();
  //var timestamp = setDate.toString('yyyy-MM-dd hh:mm:ss');
  var year = setDate.toString('yyyy');
  settings.jBody.find('.txt-year').html(year);
  
  
  return {
    settings: settings,
    getIdHashNumber: getIdHashNumber,
    getRandomInt: getRandomInt,
    showAlertBox: showAlertBox,
    setDate: setDate
  };
})();
