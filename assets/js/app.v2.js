$(function() {
"use strict";
  
  
  //=============================================================================
  // HANDLER_TXT
  //=============================================================================
  var HANDLER_TXT = (function() {
    
    // Everything related to view in terms of content and text goes here
    var txt = {};
    
    txt.already_registered = "There is a user with this name already, please select a different name or login.";
    txt.account_created = "Your account is created!";
    
    return {
      txt: txt
    }
    
  })();
  
  //=============================================================================
  // HANDLER_UTILITIES
  //=============================================================================
  var HANDLER_UTILITIES = (function() {
    
    // Put jQuery stuff into variables
    var settings = {
      // cache jQuery
      window: $(window),
      body: $('body'),
      // Let's use our own tracking in case localStorage is not supported
      appSession: {
        currentUser: sessionStorage.getItem('userName'), // Get the logged in user session
        currentPage: sessionStorage.getItem('currentPage') // Get saved data from sessionStorage
      },
      // Define page structure
      pages: {
        jPages: settings.body.find('.page'), // Cache the pages section
        // Setup pages
        pagesList: {
          login: '.page.login',
          register: '.page.register',
          tests: '.page.tests',
          questions: '.page.questions',
          singleQuestion: '.page.singleQuestion'
        },
        // Main landing page
        main: settings.pages.pagesList.login
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
        register: '.register',
        login: '.login'
      },
      jAlertBox: settings.body.find('.alertBox'),
    };
    
    function getIdHashNumber(section) {
      return settings.idHashNumber[section];
    }
    
    function getRandomInt() {
      return Math.floor(Math.random() * Math.floor(1000000));
    }
    
    function showAlertBox(obj, className) {
      settings.jAlertBox.prependTo(obj).slideDown(500);
    }
    
    var context = {alertClass: "My New Post", txtAlertTitle: "This is my first post!", txtAlertDetails: "this is it!"};
    var html    = template(context);
    ////00000000000000000
    var source   = document.getElementById("alert-box-template").innerHTML;
    var template = Handlebars.compile(source);
    
    // Very useful Date helper
    var setDate = Date.now();
    //var timestamp = setDate.toString('yyyy-MM-dd hh:mm:ss');
    var year = setDate.toString('yyyy');
    settings.body.find('.txt-year').html(year);
    
    
    return {
      settings: settings,
      getIdHashNumber: getIdHashNumber,
      getRandomInt: getRandomInt,
      showAlertBox, showAlertBox,
      setDate: setDate
    };
  })();
  
  //=============================================================================
  // HANDLER_DEBUG
  //=============================================================================
  var HANDLER_DEBUG = (function() {
    
    var isDebugMode = true;
    
    // Let's hide all console msgs from one place,
    // and let's use console.p (p for print) to separate from main fn
    (isDebugMode) ? console.p = console.log : console.p = '';
    
    console.p('loaded'+HANDLER_UTILITIES.getRandomInt());
    
  })();
  
  //=============================================================================
  // HANDLER_NAVIGATION
  //=============================================================================
  var HANDLER_NAVIGATION = (function() {
    
    var settings = HANDLER_UTILITIES.settings,
        currentPage = settings.appSession.currentPage,
        pages = {};
    
    //console.p(sessionStorage);
    
    (currentPage) ? showPage(currentPage) : showPage(settings.pages.main);
    
    function hidePage() {
      // fisrt bring the opacity down, move from left to right, then remove it to middle of nowhere
      
      // then add those aria things that were hidden
      
      // Just in case remove any active classes
      //settings.pages.jPages.removeClass(txt_active);
      
    }
    
    function showPage(pageClass) {
      
      pages.jCurrentPage = settings.pages.jPages.siblings(pageClass);
      
      // 00000000 remove aria tags that it is hidden, move it into view
      
      //console.p(pageClass);
      //console.p(settings.pages.jPages);
      //console.p(pages.jCurrentPage);
      
      // BRING TO VIEW
      pages.jCurrentPage.css({
        'margin-left':'150px',
        'text-indent':'0',
        'position': 'relative'
      });
      
      // bring opacity and move it
      pages.jCurrentPage.stop(true, false).animate({
        opacity: 1,
        marginLeft: 0
      }, 1000);
      
      // SAVE into session and settings
      sessionStorage.setItem('currentPage', pageClass);
      currentPage = pageClass;
    }
    
    return {
      hidePage: hidePage,
      showPage: showPage
    };
  })();
  
  //=============================================================================
  // HANDLER_DB
  //=============================================================================
  
  var HANDLER_DB = (function() {
    
    var db = new Dexie('astrnomyDBtest2');
    
    // inits
    _INIT_DB();
    //getIdHashNumber('users');
    
    function _INIT_DB() {
      
      db.version(1).stores({
        
        users: '++userId, &userUniqueId, userName, userAnswers',
        
        tests: '++testId, &testUniqueId, testTitle, testNotes, testSequence, *questions, questions.questionId, &questions.questionUniqueId, *questions.answers',
      });
    }
    
    function addUser(userData) {
      
      db.transaction("rw", db.users, function() {
          db.users.add({ uniqueId:userData.uniqueId, userName:userData.userName, userAnswers:{} }); // unhandled promise = ok!
      }).then(function (user) {
        
        var promise = db.users.where("uniqueId").equals(userData.uniqueId).toArray();
        
        // after adding the user move on to the tests page
        if(promise){
          console.log("Welcome " + userData.userName + ", please proceed to the tests.");
          return true;
        } else {
          console.log("Hmmm...");
          return false;
        }
        
      }).catch(function (error) {
        // Log or display the error.
        console.error(error);
      });
    }
    
    function userExists(userData){
      var userExists;
      db.users.where("userName").equals(userData.userName).then(function(result) {
        
        console.p(result);
        
        (result) ? userExists = true : userExists = false;
        return userExists;
      });
    }
      
      
    return {
      addUser: addUser,
      userExist: userExists
      // deleteUser: deleteUser,
      // updateUserData: upadteUserData
    };
  })();
  
  var HANDLER_USERS = (function() {
    
    var settings = HANDLER_UTILITIES.settings,
        jB = settings.body,
        submittedData = {},
        userData = {},
        form = {};
    form.fields = {};
    
    // add event listener
    form.jObj.on('submit', _createAccount);
    
    function _createAccount(e){
      
      e.preventDefault();
      
      formClass = settings.formClassNames.register;
      form.jObj = jB.find(formClass);
      
      // FIND ALL DATA FIELDS SUBMITTED BY USER
      form.fields.jUserName = form.jObj.find('#registerUserName');
      // SAVE THE DATA INTO A VAR
      submittedData.userName = form.fields.jUserName.val();
      
      // Reset it after we saved it
      form.fields.jUserName.val('');
      
      var x1 = HANDLER_UTILITIES.getIdHashNumber('users'),
          x2 = HANDLER_UTILITIES.getRandomInt(),
          x3 = HANDLER_UTILITIES.getRandomInt(),
          hashids = HANDLER_UTILITIES.settings.hashids;
      
      userData = {
        userUniqueId: hashids.encode(x1, x2, x3),
        userName: submittedData.userName,
        userAnswers: {}
      };
      
      //console.p(userData);
      
      // check if user already exists
      if(_addUser(userData) === false){
        HANDLER_UTILITIES.showAlertBox(HANDLER_TXT.txt.already_registered) // If yes, show popup warning
        console.p("Can't use this name, man!")
      } else {
        HANDLER_NAVIGATION.showPage(settings.pages.pagesList.tests)
        HANDLER_TXT.txt.account_created
        console.p("Show da page, mate!")
      }
      // otherwise read last question and forward him to it
    }
    
    
    
    function _isUserLoggedIn() {
      //(HANDLER_DB.addUser(userData) !== false ) ? return true : return false;
    }
    
    function _login() {
      
      //sessionStorage.setItem('currentPage', pageClass);
      
      // check if already logged in if so go to the tests
      // grab user name and get the user, if success go to tests
      if(settings.appSession.currentUser || sessionStorage.getItem('userName')) {
        
        // redirect to the last question if the test is started
        
        // if not started a test, redirect to tests
        HANDLER_NAVIGATION.showPage(settings.pages.pagesList);
      }
    }
    
    return {
      //get_id_tracker: get_id_tracker
      //create_account: create_account
    }
  })();
});
