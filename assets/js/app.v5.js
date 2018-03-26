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
  // HANDLER_RENDERING
  //=============================================================================
  var HANDLER_RENDERING = (function() {
    
    var settings = HANDLER_UTILITIES.settings,
        pages = {};
    
    render('#register');
    
    // On every hash change the render function is called with the new hash.
    // This is how the navigation of our app happens.
    
    //function _addHashEventListener() {
    //    settings.jWindow.on('hashchange', function() {
    //    render( decodeURI( window.location.hash ) );
    //  });
    //}_addHashEventListener();
    
    settings.jWindow.on('hashchange', _addHashEventListener);
    
    //var counter = 0;
    
    function _addHashEventListener(e) {
      
      //console.p(++counter);
      
      render(decodeURI(window.location.hash));
    }
    
    function redirect(url, alert) {
      
      (alert) ? HANDLER_UTILITIES.showAlertBox(HANDLER_TXT.txt.please_login, '.login.page', HANDLER_TXT.txt.error) : alert;
      
      location.hash = url;
    }
    
    function render(url) {
      
      //console.p('RENDER CALLED url:' + url);
      
      // If url empty, read it
      if(url === undefined) {
        url = decodeURI(window.location.hash);
          
        //console.p('window.location.hash:' + url);
      }
      
      // Get the keyword from the url.
      var temp = url.split('/')[0];
      
      var map = {
          
        // The Homepage.
        '': function() {
          
          //(_loginCheck() === true) ? redirect('#tests') : _renderStandardPage('.login');
          if(_loginCheck() === true) {
            redirect('#tests')
          } else {
            _renderStandardPage('.login');
            
            //console.p('Opened #');
          }
        },
        
        '#register': function() {
          (_loginCheck() === true) ? redirect('#tests') : _renderStandardPage('.register');
        },
        
        '#tests': function() {
          (_loginCheck() === false) ? redirect('', true) : _renderStandardPage('.tests');
        },
        
        '#questions': function() {
          (_loginCheck() === false) ? redirect('', true) : _renderStandardPage('.questions');
        },
        
        '#single-question': function() {
          (_loginCheck() === false) ? redirect('', true) : _renderSingleQuestionPage();
        }
      };
      
      // Execute the needed function depending on the url keyword (stored in temp).
      if(map[temp]){
        map[temp]();
      } else { // If the keyword isn't listed in the above - render the error page.
        
        console.p('Error: '+url);
        // 00000 SHOOT ALERT
        //renderErrorPage();
      }
    }
    
    function _renderStandardPage(requestedPage) {
      
      // 00000000
      // remove aria tags that it is hidden, move it into view
      
      // This is the previous page which we are hiding
      var previousPage = {};
      var myVar;
      previousPage.name = settings.appSession.currentPage;
      
      //console.p('Previous page: ' + previousPage.name);
      //console.p(requestedPage);
      //return false;
      
      // If there is no previous page skip the hiding part
      if(previousPage.name === null){
        _renderRequestedPage(requestedPage);
        return true;
      // If the previous page is the same as requested page, do nothing
      } else if (previousPage.name === requestedPage){
        
        //console.p('Same page, req stops here: ' + previousPage.name);
        
        return true;
      }
      
      previousPage.jObj = settings.pages.jPages.siblings(previousPage.name);
      
      // Fisrt bring the opacity down, move from right to left, then move it to middle of nowhere
      if(previousPage.jObj.css('opacity') > 0)
      {
        previousPage.jObj.removeClass('classic').addClass('classic2');
        // Hide it from view
        
        myVar = setTimeout(function() {
          _helperAnimationFn(previousPage); // runs first
          _renderRequestedPage(requestedPage); // runs second
        }, 450);
        
      
      }
    }
    
    function _helperAnimationFn(previousPage) {
      previousPage.jObj.addClass('offscreen').removeClass('classic2');
    }
    
    function _renderRequestedPage(requestedPage) {
      
      // This is the new page which we are showing
      var jNewPage = settings.pages.jPages.siblings(requestedPage);
      
      // 00000000
      // remove aria tags that it is hidden, move it into view
      
      // Get the page ready before showing it then bring opacity and animate it
      jNewPage.removeClass('offscreen classic2');
      jNewPage.addClass('classic');
      
      //console.p('requestedPage:'+requestedPage);
      
      // SAVE into session and settings
      //sessionStorage.setItem('currentPage', requestedPage);
      settings.appSession.currentPage = requestedPage;
    }
    
    function renderSingleProductPage(index, data){
      var page = $('.single-question'),
        container = $('.preview-large');
      
      // Find the wanted product by iterating the data object and searching for the chosen index.
      if(data.length){
        data.forEach(function (item) {
          if(item.id == index){
            
            // Populate '.preview-large' with the chosen product's data.
            container.find('h3').text(item.name);
            container.find('img').attr('src', item.image.large);
            container.find('p').text(item.description);
          }
        });
      }
      // Show the page.
      //page.addClass('visible');
    }
    
    function _loginCheck() {
      if(settings.appSession.currentUser) {
        return true;
      } else {
        return false;
      }
    }
    
    return {
      redirect: redirect
    };
  })();
  
  
  
  //=============================================================================
  // HANDLER_DB
  //=============================================================================
  var HANDLER_DB = (function() {
    
    var db = new Dexie('astrnomyDBtest7'+HANDLER_UTILITIES.getRandomInt());
    
    // inits
    _INIT_DB();
    //getIdHashNumber('users');
    
    function _INIT_DB() {
      
      db.version(1).stores({
        friends: "++id,name,shoeSize"
      });
      db.open();
    }
    
    
    function addUser(){}
    //
    // Populate some data
    //
    function populateSomeData() {
        return db.transaction("rw", db.friends, function () {
            db.friends.clear();
            db.friends.add({ name: "David", shoeSize: 43 });
            db.friends.add({ name: "Ylva", shoeSize: 37 });
            db.friends.add({ name: "Jon", shoeSize: 44 });
            db.friends.add({ name: "Mans", shoeSize: 42 });
            db.friends.add({ name: "Daniel", shoeSize: 39 });
            db.friends.add({ name: "Nils", shoeSize: 45 });
            db.friends.add({ name: "Zlatan", shoeSize: 47 });
            // Log data from DB:
            db.friends.orderBy('name').each(function (friend) {
                //console.log(JSON.stringify(friend));
            });
        }).catch(function (e) {
            log(e, "error");
        });
    }
    
    //
    // Examples
    //
    function equalsAnyOf() {
      
      var collection = db.friends.where('name').equalsIgnoreCase('david');
      collection.first(function(friend) {
          console.log(friend);
      });
    }
    
    
    (function runSamples() {
        populateSomeData()
            .then(equalsAnyOf)
        //    .then(equalsIgnoreCase)
        //    .then(startsWithIgnoreCase)
        //    .then(logicalOR)
        //    .then(logicalAND)
        .catch(function (e) {
            console.log(e, "error");
        });
    })();
    
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
        jB = settings.jBody,
        submittedData = {},
        userData = {},
        // PREPARE ALL FORMS
        forms = {
          register: {
            formClass: settings.formClassNames.register,
            jObj: jB.find(settings.formClassNames.register),
            fields: {}
          },
          login: {
            formClass: settings.formClassNames.login,
            jObj: jB.find(settings.formClassNames.login),
            fields: {}
          }
        },
        txt = HANDLER_TXT.txt;
    
    // Add event listener
    forms.register.jObj.on('submit', _createAccount);
    forms.login.jObj.on('submit', _login);
    
    function _createAccount(e){
      
      e.preventDefault();
      
      // FIND ALL DATA FIELDS SUBMITTED BY USER
      forms.register.fields.jUserName = forms.register.jObj.find('#registerUserName');
      // SAVE THE DATA INTO A VAR
      submittedData.userName = forms.register.fields.jUserName.val();
      
      // RESET it after we saved it
      forms.register.fields.jUserName.val('');
      
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
      if(HANDLER_DB.addUser(userData) === false){
        HANDLER_UTILITIES.showAlertBox(HANDLER_TXT.txt.already_registered); // If yes, show popup warning
        
        console.p("Can't use this name, man!");
        
      } else {
        //settings.appSession.currentUser = userData.userName;
        //sessionStorage.setItem('userName', userData.userName);
        
        HANDLER_RENDERING.redirect('#tests');
        HANDLER_UTILITIES.showAlertBox(txt.account_created, '.tests.page', txt.success);
      }
      // otherwise read last question and forward him to it
    }
    
    function _login() {
      // If user is already logged in go to the tests
      if(settings.appSession.currentUser || sessionStorage.getItem('userName')) {
        HANDLER_RENDERING.redirect('#tests');
        return true;
      }
      
      // Get user from DB by userName
      
      // If success set session and go to tests
      sessionStorage.setItem('userName', xxx);
      HANDLER_RENDERING.redirect('#tests');
    }
    
    return {};
  })();
});
