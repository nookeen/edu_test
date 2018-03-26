//=============================================================================
// MODULE_UTILITIES
//=============================================================================
var MODULE_UTILITIES = (function() {
  
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
  
  // DOM manipulations
  var year = new Date().getFullYear();
  settings.jBody.find('.txt-year').html(year);
  
  function getRandomInt() {
    return Math.floor(Math.random() * Math.floor(1000000));
  }
  
  function _hideAlertBox() {
    settings.jAlertBox.slideUp(250);
  }
  
  function showAlertBox(text, alertClass) {
    
    console.p(text);
    console.p(alertClass);
    
    // Close any opened alerts
    settings.jAlertBox.hide();
    settings.jAlertBox.removeClass('[class$=success] [class$=warning] [class$=danger]');
    
    settings.jAlertBox.addClass('alert-'+alertClass); // success, warning, danger
    settings.jAlertBox.find('span.content').html(text);
    settings.jAlertBox.slideDown(500);
    
    // Events
    settings.jAlertBox.find('.close').on('click', _hideAlertBox);
  }
  
  function createUniqueID(number) {
    var _1 = number,
        _2 = getRandomInt(),
        _3 = getRandomInt(),
        hashids = settings.hashids;
        
    //console.p(_1);
    //console.p(_2);
    //console.p(hashids.encode(_1, _2, _3));
    
    return hashids.encode(_1, _2, _3);
  }
  
  return {
    settings: settings,
    showAlertBox: showAlertBox,
    createUniqueID: createUniqueID
  };
})();