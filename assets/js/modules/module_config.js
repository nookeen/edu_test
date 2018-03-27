var CONFIG_MODULE = (function() {
"use strict";

  // Put jQuery stuff into variables
  var settings = {
    // cache jQuery
    jWindow: $(window),
    jBody: $('body'),
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
    forms: {
      register: 'register',
      login: 'login'
    },
    formClassNames: {
      register: '.register_form',
      login: '.login_form',
      inputField: '.userNameClass'
    },
    // Used for page render
    pageObjects: {}
  };
  
  // Cache the pages section
  settings.pages.jPages = settings.jBody.find('.page');
  settings.jAlertBox = settings.jBody.find('.alertBox');
  
  return {
    settings: settings
  };
})(this);