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
    txt.unable_to_create_an_account = 'Wooops! An error occured, please try again.';
    
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
      }
    };
    
    // Cache the pages section
    settings.pages.jPages = settings.jBody.find('.page');
    settings.jAlertBox = settings.jBody.find('.alertBox');
    
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
      
      settings.jAlertBox.addClass('alert-'+alertClass); // success, warning, error
      settings.jAlertBox.find('span.content').html(text);
      settings.jAlertBox.slideDown(500);
      
      // Events
      settings.jAlertBox.find('.close').on('click', _hideAlerBox);
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
    
    // Very useful Date helper
    var setDate = Date.now();
    //var timestamp = setDate.toString('yyyy-MM-dd hh:mm:ss');
    var year = setDate.toString('yyyy');
    settings.jBody.find('.txt-year').html(year);
    
    
    return {
      settings: settings,
      getRandomInt: getRandomInt,
      showAlertBox: showAlertBox,
      setDate: setDate,
      createUniqueID: createUniqueID
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
          
          //(isLoggedIn() === true) ? redirect('#tests') : _renderStandardPage('.login');
          if(isLoggedIn() === true)
            redirect('#tests');
          else {
            
            // Render
            _renderStandardPage('.login');
          }
        },
        
        '#register': function() {
          if (isLoggedIn() === true)
            redirect('#tests');
          else {
            
            // Render
            _renderStandardPage('.register');
          }
        },
        
        '#tests': function() {
          (isLoggedIn() === false) ? redirect('', true) : _renderStandardPage('.tests');
        },
        
        '#questions': function() {
          (isLoggedIn() === false) ? redirect('', true) : _renderStandardPage('.questions');
        },
        
        '#single-question': function() {
          if(isLoggedIn() === false) {
            redirect('', true);
            
          } else {
          
            // Get the index of which product we want to show and call the appropriate function.
            var index = url.split('#single-question/')[1].trim();
            
            console.p(index);
            
            _renderSingleQuestionPage(index);
            _renderStandardPage('.singleQuestion');
          }
        }
      };
      
      // Execute the needed function depending on the url keyword (stored in temp).
      if(map[temp]){
        map[temp]();
      } else { // If the keyword isn't listed in the above - render the error page.
        
        console.p('Error: ' + url);
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
    
    function _renderSingleQuestionPage(index){
      
      // Find the wanted product by iterating the data object and searching for the chosen index.
      //if(data.length){
      //  data.forEach(function (item) {
      //    if(item.id == index){
      //      
      //      // Populate '.preview-large' with the chosen product's data.
      //      container.find('h3').text(item.name);
      //      container.find('img').attr('src', item.image.large);
      //      container.find('p').text(item.description);
      //    }
      //  });
      //}
    }
    
    function isLoggedIn() {
      if(settings.appSession.currentUser) {
        return true;
      } else {
        return false;
      }
    }
    
    return {
      redirect: redirect,
      isLoggedIn: isLoggedIn
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
    
    var db = new Dexie('astrnomyDBtest18s');
    
    // Init the DBs
    (function _INIT_DB() {
      db.version(1).stores({
        users: '++userId, &userUniqueID, userName, &userNameLowerCase, userAnswers',
        tests: '++testId, &testUniqueID, testTitle, testSequence, *questions, &questions.questionUniqueID, questions.questionTitle, questions.questionContent, questions.questionSequence, questions.answerHint, *questions.answers, questions.answers.answerUniqueID, questions.answers.answerSequence, questions.answers.answerText, questions.answers.correctAnswer',
        test: '++tId, data'
      });
    })();
    
    // Include Modules
    var inc = {};
    
    inc.TXT = MODULE_TXT;
    inc.UTIL = MODULE_UTILITIES;
    inc.RENDER = MODULE_RENDERING;
    
    var txt = inc.TXT.txt,
        settings = inc.UTIL.settings;
    
    
    //console.log($('.tests .content') );
    //console.log($('.tests .content').parent().html() );
    //console.log($('.tests .content').get(0) );
    //console.log($('.tests .content')[0]);
    //var data = $('.tests .content').html();
    
    var data = testsContent;
    
    // need to populate some uniqueIDs
    $.each(data, function (key, val) {
      // Set uniqueIDs for tests 
      val.testUniqueID = inc.UTIL.createUniqueID(settings.idHashNumber.tests);
      
      $.each(val.questions, function (key2, val2) {
        // Set uniqueIDs for questions 
        val2.questionUniqueID = inc.UTIL.createUniqueID(settings.idHashNumber.questions);
        
        $.each(val2.answers, function (key3, val3) {
          // Set uniqueIDs for answers 
          val3.answerUniqueID = inc.UTIL.createUniqueID(settings.idHashNumber.answers);
        });
      });
    });
    
    //console.p("AFTER");
    //console.p(data);
    
    //showMe();
    populateSomeData();
    
    function showMe() {
      var collection = db.tests.where('testId').equals(1);
        collection.first(function(entry) {
          console.p(entry);
          //var yo = $.parseHTML( entry );
          
          console.log(entry);
          //data = $('footer').html(entry.data);
          
          db.tests.each(function (entry) {
            console.p(JSON.stringify(entry));
          });
      }).catch(function (e) {
        log(e, "error");
      });
    }
    
    function populateSomeData() {
      return db.transaction("rw", db.tests, function () {
        
        //db.friends.clear();
        db.tests.add({ data });
        // Log data from DB:
        //db.tests.each(function (entry) {
        //    console.p(JSON.stringify(entry));
        //});
      }).catch(function (e) {
        log(e, "error");
      });
    }
    
    
    function _addUser(userData) {
      db.transaction("rw", db.users, function() {
        return db.users.add({
          userUniqueID: userData.userUniqueID,
          userName: userData.userName,
          userAnswers: {},
          userNameLowerCase: userData.userName.toLowerCase()
        });
      }).then(function(user) {
        
        console.p(user);
        
        if(!user) {
          inc.UTIL.showAlertBox(txt.unable_to_create_an_account, 'danger'); // If yes, show popup warning
          //_getAllUsers();
          
          return;
        }
        
        // Added user, login time
        settings.appSession.currentUser = userData.userName;
        sessionStorage.setItem('userName', userData.userName);
        
        // Account created msg
        inc.UTIL.showAlertBox(txt.account_created, 'success');
        // Show menu
        settings.jBody.find('nav').addClass('visible');
        // Hide any alerts
        settings.jAlertBox.hide();
        
        inc.RENDER.redirect('#tests');
        
        // Test Log
        //_getAllUsers();
        
      }).catch(function(e) {
          
          inc.UTIL.showAlertBox(txt.already_registered, 'danger'); // If yes, show popup warning
          
          console.p(e, "error");
          return false;
      });
    }
    
    function _getUser(userName) {
      var collection = db.users.where('userNameLowerCase').equalsIgnoreCase(userName);
      collection.first(function(user) {
        
        //console.p(userName);
        //console.p(user);
        
        if(!user) {
          inc.UTIL.showAlertBox(txt.user_does_not_exist, 'danger'); // If yes, show popup warning
          //_getAllUsers();
          
          return;
        }
        
        // Found user, login time
        sessionStorage.setItem('userName', userName);
        settings.appSession.currentUser = userName;
        
        // Show menu
        settings.jBody.find('nav').addClass('visible');
        // Hide any alerts
        settings.jAlertBox.hide();
        
        inc.RENDER.redirect('#tests');
        
      }).catch(function (e) {
          console.p(e, "error");
          return false;
      });
    }
    
    
    function _getQuestion(params) {
      var collection = db.users.where('userNameLowerCase').equalsIgnoreCase(userName);
      collection.first(function(user) {
        
        //console.p(userName);
        //console.p(user);
        
        if(!user) {
          inc.UTIL.showAlertBox(txt.user_does_not_exist, 'danger'); // If yes, show popup warning
          //_getAllUsers();
          
          return;
        }
        
        // Found user, login time
        sessionStorage.setItem('userName', userName);
        settings.appSession.currentUser = userName;
        
        // Show menu
        settings.jBody.find('nav').addClass('visible');
        // Hide any alerts
        settings.jAlertBox.hide();
        
        inc.RENDER.redirect('#tests');
        
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
    
    // Check if logged in and add needed event listeners
    // Add event listener
    forms.register.jObj.on('submit', _register);
    forms.login.jObj.on('submit', _login);
    
    // If user is already logged in go to the tests
    if(inc.RENDER.isLoggedIn() === true) {
      // Add event listener to logout
      settings.jBody.find('.logout').on('click', _logout);
      settings.jBody.find('nav').addClass('visible');
    } else {
      // Hide nav
      settings.jBody.find('nav').removeClass('visible');
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
        userUniqueID: inc.UTIL.createUniqueID(settings.idHashNumber.users),
        userName: submittedData.userName,
        userAnswers: {}
      };
      
      // Add new user
      inc.DB.dbRequests('addUser', userData);
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
  })();
  
  //=============================================================================
  // MODULE_DB
  //=============================================================================
  var MODULE_TESTS = (function() {
    
    
    
    //db.transaction("rw", db.test, function() {
    //  return db.test.add({
    //    data: 'hiphip'
    //  });
    //}).then(function(entry) {
    //  
    //  console.p(entry);
    //  
    //}).catch(function(e) {
    //    console.p(e, "error");
    //    return false;
    //});
    //
    //db.transaction("rw", db.test, function() {
    //  return db.test.add({
    //    data: data
    //  });
    //}).then(function(entry) {
    //  
    //  console.p(entry);
    //  
    //  db.test.each(function(t) {
    //    console.p(JSON.stringify(t));
    //  });
    //  
    //}).catch(function(e) {
    //    console.p(e, "error");
    //    return false;
    //});
    
    //// OPERATIONS
    //goto_tests_overview()
    //goto_questions_overview(test_id, test_sequence)
    //goto_start_test(test_id, test_sequence)
    //goto_continue_test(test_id, test_sequence)
    //
    //hide_page_from_view()
    //show_page_from_view(page_section)
    //
    //show_alert(txt, class)
    //
    //// TEST RELATED
    //show_question(question_id, question_sequence)
    //show_next_question(question_id, question_sequence)
    //show_answer(question_id, answer_id)
    //show_hint(question_id, answer_id)
    //check_answer(question_id, answer_id)
    //
    //// REPLIES
    //txt.module_done
    //txt.registration_success
    
  })();
  
});
