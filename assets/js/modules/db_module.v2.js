var DB_MODULE = (function() {
"use strict";

  if (!('indexedDB' in window)) {
    alert('This browser doesn\'t support IndexedDB. Please use a modern browser.');
    return;
  }
  
  var db = new Dexie('astrnomyDBtest34');
  
  // Init the DBs
  (function _INIT_DB() {
    db.version(1).stores({
      users: '++userID, &userUniqueID, userName, &userNameLowerCase, userAnswers',
      //testing: '++testID, &testUniqueID, testTitle, testSequence, *questions, &questions.questionUniqueID, questions.questionTitle, questions.questionContent, questions.questionSequence, questions.answerHint, *questions.answers, questions.answers.answerUniqueID, questions.answers.answerSequence, questions.answers.answerText, questions.answers.correctAnswer',
      tests: '++testID, &testUniqueID, testTitle, sequence, *questions',
      questions: '++questionID, &questionUniqueID, questionTitle, questionContent, sequence, answerHint, testUniqueID, *answers',
      answers: '++answerID, &answerUniqueID, sequence, answerText, correctAnswer, testUniqueID, questionUniqueID'
    });
  })();
  
  // Include Modules
  var inc = {};
  
  inc.TXT = TXT_MODULE;
  inc.UTIL = UTILITIES_MODULE;
  inc.RENDER = RENDERING_MODULE;
  inc.CONFIG = CONFIG_MODULE;
  inc.ROUTES = ROUTES_MODULE;
  
  var txt = inc.TXT.txt, // Add text library into a local var
      config = inc.CONFIG.config; // config too
  
  var rawTestsContent = rawData, // That comes form content.js
  processedData = {
    tests: [],
    questions: [],
    answers: []
  },
  proceed = false;
  
  var init = (function() {
    
    console.p('@Init the DB.');
    
    // Load data into config.tests
    // Imitating DB: set, get
    _loadDBdata();
    
  })();
  
  function _loadDBdata() {
    
    //db.tests.clear();
    //db.questions.clear();
    //db.answers.clear();
    
    // Check if DB has been filled
    db.tests.where('testID').above(0).first(function(entry) {
      
      console.p('@Checking if data exists.');
      
      //console.p(entry);
      
      // Pre-process data before import data
      if(!entry) {
        
        console.p('@No record was found.');
        
        proceed = true;
        
        _processRawData();
      
      } else {
        
        console.p('@DB is there.');
        
        return _getTests(); // Get data
      }
      
    }).then(function() {
      
      if(proceed === false)
        return;
      
      console.p('@Starting bulkAdd.');
      
      db.tests.bulkAdd( processedData.tests ).catch(Dexie.BulkError, function (e) {
        // Explicitely catching the bulkAdd() operation makes those successful
        // additions commit despite that there were errors.
        console.error ("db.tests: Some entries did not succeed. " + e.failures);
      });
      
      db.questions.bulkAdd( processedData.questions ).catch(Dexie.BulkError, function (e) {
        
        console.error ("db.questions: Some entries did not succeed. " + e.failures);
      });
      
      db.answers.bulkAdd( processedData.answers ).then(function() {
        
        console.p('@Done uploading data.');
        
        // Get data
        return _getTests();
      
      }).catch(Dexie.BulkError, function (e) {
        // Explicitely catching the bulkAdd() operation makes those successful
        // additions commit despite that there were errors.
        console.error ("db.answers: Some entries did not succeed. " + e.failures);
      });
      
    }).catch(function(e) {
      
      console.error(e, "error");
      
      return false;
    });
    
    // Log data from DB:
    //db.tests.each(function (entry) {
    //  console.p(JSON.stringify(entry));
    //});
  }
  
  function _getTests() {
    
    console.p('@Entering _getTests()');
    
    if(isDataLoaded() === true) {
      
      console.p('The data is available.');
      
      return;
    }
    
    db.tests.toArray(function (data) {
      
      config.tests.tests = data;
      
    }).catch(function (e) {
      console.error(e, "error");
      return false;
    });
    
    db.questions.toArray(function (data) {
    
      config.tests.questions = data;
      
    }).catch(function (e) {
      console.error(e, "error");
      return false;
    });
    
    db.answers.toArray(function (data) {
      
      config.tests.answers = data;
      
      console.p('@Loaded last batch!');
      
      console.p('config.tests =');
      console.p(config.tests);
      
      // Mark that the data is uplaoded into the DB
      config.appSession.dataLoaded = true;
      
    }).catch(function (e) {
      console.error(e, "error");
      return false;
    });
  }
  
  function _processRawData() {
    
    //var deferred = new $.Deferred();
    console.p("rawTestsContent =");
    console.p(rawTestsContent);
    
    // Need to populate uniqueIDs
    $.each(rawTestsContent, function (key, val) {
      
      // Set uniqueIDs for tests 
      val.testUniqueID = inc.UTIL.createUniqueID(config.sectionHashID.tests);
      
      // Save tests into its own object
      processedData.tests.push(val);
      
      $.each(val.questions, function (key2, val2) {
        
        // Set uniqueIDs for questions 
        val2.questionUniqueID = inc.UTIL.createUniqueID(config.sectionHashID.questions);
        val2.testUniqueID = val.testUniqueID;
        
        // Save questions into its own object
        processedData.questions.push(val2);
        
        $.each(val2.answers, function (key3, val3) {
        
          // Set uniqueIDs for answers 
          val3.answerUniqueID = inc.UTIL.createUniqueID(config.sectionHashID.answers);
          val3.questionUniqueID = val2.questionUniqueID;
          val3.testUniqueID = val.testUniqueID;
          
          // Save answers into its own object
          processedData.answers.push(val3);
        });
      });
    });
    
    console.p('@Data processed in _processRawData.');
      console.p('processedData =');
        console.p(processedData);
    
    // This line is what resolves the deferred object
    // and it triggers the .done to execute
    //deferred.resolve();
    
    //return deferred.promise();
  }
  
  function isDataLoaded() {
    var loaded = false;
    
    console.p('@Entering isDataLoaded()');
      console.p('config.appSession.dataLoaded='+config.appSession.dataLoaded);
    
    (config.appSession.dataLoaded === true) ? loaded = true : null;
      return loaded;
  }
  
  //function _getAllUsers() {
  //  db.users.each(function(user) {
  //    console.p(JSON.stringify(user));
  //  });
  //}
  
  function _addUser(userData) {
    
    db.transaction("rw", db.users, function() {
      
      return db.users.add({
        userUniqueID: userData.userUniqueID,
        userName: userData.userName,
        userAnswers: {},
        userNameLowerCase: userData.userName.toLowerCase()
      });
    
    }).then(function(user) {
      
      if(!user) {
        inc.UTIL.showAlertBox(txt.unable_to_create_an_account, 'danger'); // If yes, show popup warning
        //_getAllUsers();
        
        return;
      }
      
      console.p('@Adding user: ' + user);
      
      // Added user, login time
      config.appSession.currentUser = userData.userName;
      
      sessionStorage.setItem('userName', userData.userName);
      
      // Account created msg
      inc.UTIL.showAlertBox(txt.account_created, 'success');
      
      // Show menu
      config.jBody.find('nav').addClass('visible').removeClass('disabled');
      
      // Forward to tests page
      inc.ROUTES.route('#tests');
      
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
      config.appSession.currentUser = userName;
      
      // Show menu
      config.jBody.find('nav').addClass('visible').removeClass('disabled');
      
      // Forward to tests page
      inc.ROUTES.route('#tests');
      
    }).catch(function (e) {
        
        console.p(e, "error");
        
        return false;
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
      'isDataLoaded' : function() {
        return isDataLoaded();
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
    dbRequests: dbRequests,
    isDataLoaded: isDataLoaded
  };
})(this);