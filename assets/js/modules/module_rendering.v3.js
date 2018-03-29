var RENDERING_MODULE = (function() {
"use strict";

// Include Modules
  var inc = {};
  
  inc.TXT = TXT_MODULE;
  inc.UTIL = UTILITIES_MODULE;
  inc.CONFIG = CONFIG_MODULE;
  
  // Add scope after it's loaded
  //inc.UTIL.selfsetup(inc.DB = DB_MODULE);
  
  var config = inc.CONFIG.config,
      pages = {};
  
  function preloadData() {
    
    var loaded = false;
    
    //console.p(inc);
    
    if(typeof DB_MODULE !== "undefined") {
      
      //console.p(DB_MODULE);
      //console.p('IM IN BOYS');
      
      (DB_MODULE.isDataLoaded() === true) ? loaded = true : null;
      
      //console.p('Yahooo! Cuz it\'s ' + loaded);
      
      return loaded;
    }
  }
  
  var init = function() {
    route();
    _closePreloader();
    // The main thing for nav - add event listener
    config.jWindow.on('hashchange', _addHashEventListeners);
  };
  
  inc.UTIL.waitJS(preloadData, init);
  
  function _closePreloader(){
    config.jPreloader.fadeOut(1000, function(){ $(this).addClass('disabled'); })
  }
  
  
  // QQQ: redirect=>route
  function route(url) {
    
    var changeHash = function() {
      location.hash = url;
    };
    var login = function() {
      route(config.pages.mainUnprotected);
      inc.UTIL.showAlertBox(inc.TXT.txt.please_login, 'warning'); // Show warning for the need to login
    };
    
    // If no url given, get it from the hash
    (url === undefined) ? url = decodeURI(window.location.hash) : null;
    if(window.location.hash !== url)
      return changeHash();
    
    //console.p('url:' + url);
    
    // Check perms and proceed or redirect
    (_validateRequest(url) === true) ? _render(url) :
      (isLoggedIn() === true) ? route(config.pages.mainProtected) : login();
  }
  
  
  function _render(url) {
    
    console.p('@Entering _render(' + url +')');
    
    if (_.isEmpty( config.tests )) {
      return console.p('@No data, man. Stop!');
    }
    var context = {};
    
    console.p('@Data is available in config.tests');
    
    var nextPageId = url.split('/')[0];
    var nextPageClass = nextPageId.replace('#','.');
    var nextPageName = nextPageId.replace('#','');
    
    console.p('@Set nextPageId=' + nextPageId + ' from the url: ' + url);
      console.p('@Set nextPageClass=' + nextPageClass);
        console.p('@Set nextPageName=' + nextPageName);
    
    var index = false;
    
    // Handlbars' object structure
    //var context = {
    //  tests: [ 
    //    { uiD: 'SJHDHF', blabla: 'blabla' },
    //    { uiD: 'SJHDHF', blabla: 'blabla' },
    //    { uiD: 'SJHDHF', blabla: 'blabla' },
    //  ]
    //};
    
    var map = {
        
      // Main
      '': function() {
        
        console.p('@home');
      },
      
      '#register': function() {
        
        console.p('@register');
      },
      
      '#tests': function() {
        
        context.tests = config.tests.tests;
        
        console.p('#tests: set context={} for _Template()');
          console.p('context=');
            console.p(context);
        
        _Template(context, nextPageId, nextPageClass);
      },
      
      '#questions': function() {
        
        index = url.split('#questions/')[1].trim();
        
        var x = _.filter(config.tests.questions, { 'testUniqueID': index });
        
        console.p('@Find all questions for the testUniqueID' + index);
        //context.questions = [x];
        console.p(x);
        
        context.questions = x;
        
        console.p('#questions: set context={} for _Template()');
          console.p('index=' + index);
            console.p('context=');
              console.p(context);
        
        _Template(context, nextPageId, nextPageClass);
      },
      
      '#single-question': function() {
        
        index = url.split('#single-question/')[1].trim();
        
        context.singleQuestion = _.find(config.tests.questions, { 'testUniqueID': index } , { 'questionUniqueID': index });
        
        console.p('#single-questions: set context={} for _Template()');
        console.p('index=' + index);
          console.p('context=');
            console.p(context);
        
        _Template(context, nextPageId, nextPageClass);
      }
    };
    
    // Execute the needed function depending on the url keyword (stored in nextPage).
    if(map[nextPageId]){
      
      map[nextPageId]();
      
      _switchPageTo(nextPageClass);
      
      // Save into session and config
      sessionStorage.setItem('currentPage', nextPageName); /////
      config.appSession.currentPage = nextPageName; ///////
      
    } else {
      // If the keyword isn't listed in the above - show error alert.
      inc.UTIL.showAlertBox(inc.TXT.txt.page_does_not_exist, 'danger'); // Show warning for the need to login
      
      console.error('Error: ' + url);
    }
  }
  
  function _switchPageTo(nextPageClass) {
    
    var previousPage = {
      name: '',
      className: ''
    },
    // This is the new page which we are showing
    jNewPage = config.pages.jPages.siblings(nextPageClass),
    showNewPage = function(jPrevPage) {
      
      console.p('@Animating view for new page...');
      
      // 00000000
      // Update aria-hidden => false on next page
      
      // => move it to middle of nowhere
      if(jPrevPage)
        jPrevPage.removeClass('offset-page')
                 .addClass('offscreen');
      
      // => move it back from the middle of nowhere
      // => bring opacity up
      // => move from right to left
      jNewPage.removeClass('offscreen')
              .addClass('visible'); // CSS 'transition' will do the rest
    };
    
    previousPage.name = config.appSession.currentPage;
    
    console.p('@Previous page: ' + previousPage.name);
    
    if(previousPage.name === null || previousPage.className === nextPageClass){
      
      console.p('@previousPage.className="' + previousPage.className + '", so there is no need to hide it since it does not exist or is the same page.');
      
      // Start showing new page
      showNewPage();
      
      return;
    }
    
    console.p('@Let\'s hide this: ' + previousPage.name);
    
    previousPage.className = '.' + previousPage.name;
    
    // Get the jQuery object of the page
    previousPage.jObj = config.pages.jPages.siblings(previousPage.className);
    
    // => bring the opacity down,
    // => move from right to left,
    previousPage.jObj.removeClass('visible')
                     .addClass('offset-page');
    
    // 00000000
    // Update aria-hidden => true on previousPage
    
    // CSS is set to 500ms, so before showing nextPageClass,
    // we want to wait until animation is done
    setTimeout(function() {
      showNewPage(previousPage.jObj);
    }, 550);
  }
  
  
  function _Template(context, nextPageId, nextPageClass) {
    
    console.p('@Entered _Template. nextPageId=' + nextPageId + ', nextPageClass=' + nextPageClass);
    
    // Grab the _Template script
    var theTemplateScript = $(nextPageId + "-list").html();
    
    // Compile the _Template
    var theTemplate = Handlebars.compile(theTemplateScript);
    var theCompiledHtml = theTemplate(context);
    
    // Add the compiled html to the page
    $(nextPageClass+'-content').html(theCompiledHtml);
  }
  
  
  function _renderSingleQuestionPage(){
    
    
    // Add event listeners to checkboxes and submit button
    singleQestionPage.jObj.find('.fnSubmit').on('click', _processAnswer('submit'));
    singleQestionPage.jObj.find('.answerOption').on('click', _processAnswer('select'));
    
    //$( "#book" ).toggle( "slow", function() {
    //  // Animation complete.
    //});
  }
  
  function _classesForLists() {
    
    
    //'glyphicon glyphicon-ok-sign done'
    //'glyphicon glyphicon-hourglass in-progress'
    //'glyphicon glyphicon-remove-circle locked'
  
  
  }
  
  
  function _resolvedAnswersAmount(callback) {
    
    if(config.appSession.currentUserAnswers) {
      
      var answeres = config.appSession.currentUserAnswers;
      
      var calculations = {
        'countSolvedTests' : function() {
          return _countSolvedTests(answeres);
        },
        'countSolvedQuestions' : function() {
          return _countSolvedQuestions(answeres);
        }
      };
      
      if (requests[callback]) {
        requests[callback]();
      } else {
        console.p('Error: ' + callback); // If the keyword isn't listed in the above - show error
      }
    }
  }
  
  function _countSolvedTests(answeres) {
    /*
      [
        testUniqueID : kjhjkhj
        testSolved : true
        testInProgress : false
        questions :
        [
          questionUniqueID : sdsds
          questionSolved : true
          questionInProgress : false
        ],
        [
          questionUniqueID : sdsds
          questionSolved : false
          questionInProgress : true
        ],
        [
          questionUniqueID : sdsds
          questionSolved : false
          questionInProgress : true
        ],
      ],
      [
        testUniqueID : kjhjkhj
        testSolved : true
        testInProgress : false
        questions :
        [
          questionUniqueID : sdsds
          questionSolved : true
          questionInProgress : false
        ],
        [
          questionUniqueID : sdsds
          questionSolved : false
          questionInProgress : true
        ],
      ]
    */
  }
  
  function _countSolvedQuestions(answeres) {
    
  }
  
  function _validateRequest(url) {
    
    //console.p('@_validateRequest');
    
    var protectedPage = false,
    proceed = false,
    i;
    
    for(i = 0; i < config.pages.unprotected.length; i++) { // For login or register
      if(config.pages.unprotected[i] === url) {
        (isLoggedIn() === true) ? proceed = false : proceed = true;
        
        //console.p('config.pages.unprotected[i] === url');
        //console.p('proceed=' + proceed);
        
        return proceed;
      }
    }
    protectedPage = true;
    (isLoggedIn() === true) ? proceed = true : proceed = false;
    
    //console.p('protectedPage = true;');
    //console.p('proceed=' + proceed);
    
    return proceed;
  }
  
  function isLoggedIn() {
    var loggedIn = false;
    (config.appSession.currentUser) ? loggedIn = true : null;
    return loggedIn;
  }
  
  // The main thing for nav
  function _addHashEventListeners() {
    route(decodeURI(window.location.hash));
  }
  
  return {
    route: route,
    isLoggedIn: isLoggedIn
  };
})(this);