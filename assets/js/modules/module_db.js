var MODULE_DB = (function() {
"use strict";

  if (!('indexedDB' in window)) {
    alert('This browser doesn\'t support IndexedDB. Please use a modern browser.');
    return;
  }
  
  var db = new Dexie('astrnomyDBtest18s');
  
  // Init the DBs
  (function _INIT_DB() {
    db.version(1).stores({
      users: '++userId, &userUniqueID, userName, &userNameLowerCase, userAnswers',
      tests: '++testId, &testUniqueID, &testTitle, testSequence, *questions, &questions.questionUniqueID, &questions.questionTitle, &questions.questionContent, questions.questionSequence, questions.answerHint, *questions.answers, questions.answers.answerUniqueID, questions.answers.answerSequence, questions.answers.answerText, questions.answers.correctAnswer',
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
  _getTests();
  
  
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
      // Forward to tests page
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
      // Forward to tests page
      inc.RENDER.redirect('#tests');
      
    }).catch(function (e) {
        console.p(e, "error");
        return false;
    });
  }
  
  function _getTests() {
    
    var collection = db.tests.where('testId').equals(1);
    collection.first(function(entry) {
    
      //console.p(userName);
      //console.p(user);
      
      if(!entry)
        populateSomeData();
      
      db.tests.each(function (data) {
        
        //console.p(JSON.stringify(data));
        
        // Save data into global var
        settings.tests = data;
        
        // Forward to tests pagea
        (window.location.hash !== '#tests') ? inc.RENDER.redirect('#tests') : inc.RENDER.renderTestPages();
        
        //console.p(data);
        
      }).catch(function (e) {
        console.p(e, "error");
      });
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
      },
      'getTests' : function() {
        return _getTests(params);
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
})(this);