$(function() {
"use strict";
  
  //=============================================================================
  // MODULE_TXT
  //=============================================================================
  var MODULE_TXT = (function() {
    
    // Everything related to view in terms of content and text goes here
    var txt = {};
    
    txt.already_registered = "There is a user with this name already, please select a different name or login.";
    txt.account_created = "Your account is created!";
    txt.please_login = "Please login to view this page.";
    txt.only_letters = "User names can only contain letters.";
    txt.user_does_not_exist = "User with this name does not exist. Please register or check the spelling.";
    
    return {
      txt: txt
    };
    
  })();
  
  //=============================================================================
  // MODULE_UTILITIES
  //=============================================================================
  var MODULE_UTILITIES = (function() {
    
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
      forms: {
        register: 'register',
        login: 'login'
      },
      formClassNames: {
        register: '.register_form',
        login: '.login_form',
        inputField: '.userNameClass'
      }
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
    
    function _hideAlerBox() {
      settings.jAlertBox.slideUp(250);
    }
    
    function showAlertBox(text, alertClass) {
      
      //console.p(text);
      //console.p(prependToObj);
      //console.p(alertClass);
      
      // Close any opened alerts
      settings.jAlertBox.hide();
      
      settings.jAlertBox.addClass('alert-'+alertClass), // success, warning, error
      settings.jAlertBox.find('p').html(text);
      settings.jAlertBox.prependTo('#app').slideDown(500);
      
      // Events
      settings.jAlertBox.find('.close').on('click', _hideAlerBox);
    }
    
    function createUniqueId(section) {
      var _1 = MODULE_UTILITIES.getIdHashNumber(section),
          _2 = MODULE_UTILITIES.getRandomInt(),
          _3 = MODULE_UTILITIES.getRandomInt(),
          hashids = MODULE_UTILITIES.settings.hashids;
      return hashids.encode(_1, _2, _3);
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
      setDate: setDate,
      createUniqueId: createUniqueId
    };
  })();
  
  //=============================================================================
  // MODULE_DEBUG
  //=============================================================================
  var MODULE_DEBUG = (function() {
    
    var isDebugMode = true;
    
    // Let's hide all console msgs from one place,
    // and let's use console.p (p for print) to separate from main fn
    (isDebugMode) ? console.p = console.log : console.p = '';
    
    console.p('loaded'+MODULE_UTILITIES.getRandomInt());
    
  })();
  
  //=============================================================================
  // MODULE_RENDERING
  //=============================================================================
  var MODULE_RENDERING = (function() {
    
    // Include Modules
    var inc = {};
    
    inc.USER = MODULE_USERS;
    inc.TXT = MODULE_TXT;
    inc.UTIL = MODULE_UTILITIES;
    
    
    var settings = inc.UTIL.settings,
        pages = {};
    
    _render();
    
    // On every hash change the render function is called with the new hash.
    // This is how the navigation of our app happens.
    
    //function _addHashEventListener() {
    //    settings.jWindow.on('hashchange', function() {
    //    _render( decodeURI( window.location.hash ) );
    //  });
    //}_addHashEventListener();
    
    settings.jWindow.on('hashchange', _addHashEventListener);
    
    //var counter = 0;
    
    function _addHashEventListener(e) {
      
      //console.p(++counter);
      
      _render(decodeURI(window.location.hash));
    }
    
    function redirect(url, alert) {
      
      (alert) ? inc.UTIL.showAlertBox(inc.TXT.txt.please_login, 'warning') : alert;
      
      location.hash = url;
    }
    
    function _render(url) {
      
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
          if(_loginCheck() === true)
            redirect('#tests');
          else {
            
            // Render
            _renderStandardPage('.login');
          }
        },
        
        '#register': function() {
          if (_loginCheck() === true)
            redirect('#tests');
          else {
            
            // Render
            _renderStandardPage('.register');
          }
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
  // MODULE_DB
  //=============================================================================
  var MODULE_DB = (function() {
    
    if (!('indexedDB' in window)) {
      alert('This browser doesn\'t support IndexedDB. Please use a modern browser.');
      return;
    }
    
    var db = new Dexie('astrnomyDBtest12');
    
    // Init the DBs
    (function _INIT_DB() {
      db.version(1).stores({
        users: '++userId, &userUniqueId, userName, &userNameLowerCase, userAnswers',
        tests: '++testId, &testUniqueId, testTitle, testNotes, testSequence, *questions, questions.questionId, &questions.questionUniqueId, *questions.answers',
      });
    })();
    
    // Include Modules
    var inc = {};
    
    inc.USER = MODULE_USERS;
    inc.TXT = MODULE_TXT;
    inc.UTIL = MODULE_UTILITIES;
    inc.RENDER = MODULE_RENDERING;
    
    var txt = inc.TXT.txt,
        settings = inc.UTIL.settings;
    
    function _addUser(userData) {
      db.transaction("rw", db.users, function() {
        return db.users.add({
          userUniqueId: userData.userUniqueId,
          userName: userData.userName,
          userAnswers: {},
          userNameLowerCase: userData.userName.toLowerCase()
        });
      }).then(function() {
        
        settings.appSession.currentUser = userData.userName;
        sessionStorage.setItem('userName', userData.userName);
        
        // Remove event handlers
        inc.USER.removeEventListeners();
        
        inc.RENDER.redirect('#tests');
        inc.UTIL.showAlertBox(txt.account_created, 'success');
        
        inc.USER.resetForm(settings.forms.register);
        
        // Test Log
        _getAllUsers();
        
      }).catch(function(e) {
          
          inc.UTIL.showAlertBox(txt.already_registered, 'danger'); // If yes, show popup warning
          
          console.p(e, "error");
          return false;
      });
    }
    
    function _getUser(userName) {
      var collection = db.users.where('userNameLowerCase').equalsIgnoreCase(userName);
      collection.first(function(user) {
        
        console.p(userName);
        console.p(user);
        
        if(!user) {
          inc.UTIL.showAlertBox(txt.user_does_not_exist, 'danger'); // If yes, show popup warning
          _getAllUsers();
          
          return;
        }
        
        // Found user, login time
        //sessionStorage.setItem('userName', userName);
        //settings.appSession.currentUser = userName;
        
        //console.p(settings.forms.login);
        // Clear fields and remove event listener 000000
        inc.USER.resetForm(settings.forms.login);
        //inc.USER.removeEventListeners();
        
        //inc.RENDER.redirect('#tests');
        
      }).catch(function (e) {
          console.p(e, "error");
          return false;
      });
    }
    
    
    function _getAllUsers() {
      db.users.each(function(user) {
        console.p(JSON.stringify(user));
      });
    }
    
    function dbRequests(action, params) {
      
      //console.p(action);
      //console.p(params);
      
      var requests = {
        'getUser' : function() {
          return _getUser(params);
        },
        'addUser' : function() {
          return _addUser(params);
        }
      };
      
      if (requests[action]) {
        requests[action]();
      } else { // If the keyword isn't listed in the above - show error
        console.p('Error: ' + action);
        console.p(params);
      }
    }
    
    return {
      dbRequests: dbRequests
    };
  })();
  
  var MODULE_USERS = (function() {
    
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
    
    //console.p(forms['login'].jObj.find(settings.formClassNames.inputField));
    //console.p(forms['register'].jObj.find(settings.formClassNames.inputField));
    //console.p(forms.register.jObj);
    
    // Add event listener
    setEventListeners();
    //resetForm();
    
    function resetForm(form) {
      // Reset form field
      console.p(form);
      //forms.login.fields.jUserName.val('YES');
      //forms['login'].fields.jUserName.val('YES2');
      
      //forms[form].fields.jUserName.val('');
    }
    
    
    function setEventListeners(){
      forms.register.jObj.on('submit', _register);
      forms.login.jObj.on('submit', _login);
    }
    
    // Remove event listener
    function removeEventListeners(){
      forms.register.jObj.off('submit', _register);
      forms.login.jObj.off('submit', _login);
    }
    
    function _register(e){
      
      e.preventDefault();
      
      // Save the data into an object
      submittedData.userName = forms.register.fields.jUserName.val();
      
      //console.p(submittedData);
      
      // Validate the input
      if (_validateUserName(submittedData.userName, settings.formClassNames.register) === false)
        return;
      
      userData = {
        userUniqueId: inc.UTIL.createUniqueId('users'),
        userName: submittedData.userName,
        userAnswers: {}
      };
      
      // Add new user
      inc.DB.dbRequests('addUser', userData);
    }
    
    function _login(e) {
      
      e.preventDefault();
      
      // If user is already logged in go to the tests
      if(settings.appSession.currentUser) {
        inc.RENDER.redirect('#tests');
        return true;
      }
      
      // Save the data into an object
      submittedData.userName = forms.login.fields.jUserName.val();
      
      //console.p(submittedData);
      
      if (_validateUserName(submittedData.userName, settings.formClassNames.login) === false)
        return;
      
      // Get user from DB by userName
      inc.DB.dbRequests('getUser', submittedData.userName);
    }
    
    
    
    function _validateUserName(txt, prependTo) {
      var lettersOnly = /^[A-Za-z]+$/,
          result;
      
      (txt.match(lettersOnly)) ? result = true : result = false;
      
      // Since there is only one case we don't need to map the answers
      if(result === false){
        inc.UTIL.showAlertBox(inc.TXT.txt.only_letters, 'danger');
      }
      
      console.p(result);
      
      return result;
    }
    
    return {
      resetForm: resetForm,
      setEventListeners: setEventListeners,
      removeEventListeners: removeEventListeners
    };
  })();
  
  
});
