var CONFIG_MODULE = (function() {
"use strict";

  // Put jQuery stuff into variables
  var config = {
    // cache jQuery
    jWindow: $(window),
    jBody: $('body'),
    // sessionStorage setup
    appSession: {
      currentUser: sessionStorage.getItem('userName'), // Get user's name to see if there is a session
      currentPage: null, //sessionStorage.getItem('currentPage'), // Get user's name to see if there is a session
      dataLoaded: false
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
      unprotected: ['', '#register'],
      mainUnprotected: '',
      mainProtected: 'tests',
      protected_: ['tests', 'questions', 'singleQuestion'],
      pageObjects: {},
      built: false
    },
    // When creating unique IDs we'll need to set them apart by section
    sectionHashID: {
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
    tests: {},
    // Used for page render
    pageObjects: {},
    waitJS: {}
  };
  
  // Cache the pages section
  config.jAlertBox = config.jBody.find('.alertBox');
  config.pages.jPages = config.jBody.find('.page');
  config.jPreloader = config.jBody.find('.preloader');
  
  return {
    config: config
  };
})(this);