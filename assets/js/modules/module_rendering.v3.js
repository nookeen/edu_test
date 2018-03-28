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
      
      console.p(DB_MODULE);
      console.p('IM IN BOYS');
      
      (DB_MODULE.isDataLoaded() === true) ? loaded = true : null;
      
      console.p('Yahooo! Cuz it\'s ' + loaded);
      
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
    
    console.p('@_render(url) = ' + url);
    
    // Get the keyword from the url.
    var temp = url.split('/')[0],
        index,
        map = {
        
      // Main
      '': function() {
        console.p('@home');
        
        _switchPageTo('login');
      },
      
      '#register': function() {
        
        console.p('@register');
        
        _switchPageTo('register');
      },
      
      '#tests': function() {
        
        console.p('@tests');
        
        _switchPageTo('tests');
      },
      
      '#questions': function() {
        
        console.p('@questions');
        
        // Get the index of which question we want to show and call the appropriate function
        index = url.split('#questions/')[1].trim();
        
        console.p(index);
        
        _switchPageTo('questions');
      },
      
      '#single-question': function() {
        
        console.p('@single-question-page');
        
        // Get the index of which question we want to show and call the appropriate function
        index = url.split('#single-question/')[1].trim();
        
        console.p(index);
        
        _switchPageTo('singleQuestion');
      }
    };
    
    // Execute the needed function depending on the url keyword (stored in temp).
    if(map[temp]){
      map[temp]();
    } else { // If the keyword isn't listed in the above - render the error page.
      
      console.error('Error: ' + url);
      
      // 000000000
      //renderErrorPage();
    }
  }
  
  function _switchPageTo(nextPage) {
    
    //console.p('_hidePreviousPage');
    
    var previousPage = {
      className: ''
    };
    
    // This is the previous page which we are hiding
    previousPage.name = config.appSession.currentPage;
    
    //console.p('Previous page: ' + previousPage.name);
    //console.p(requestedPageClass);
    
    // 00000000
    // show aria tags that it is hidden, move it into view
    
    // If there is no previous page or it's same page request skip the hiding part
    if(previousPage.name === null || previousPage.name === nextPage){
      
      //console.p(previousPage.name);
      //console.p(nextPage);
      
      _showNextPage(nextPage);
      
      return true;
    }
    
    previousPage.className = '.' + previousPage.name;
    
    // Get the jQuery object of the page
    previousPage.jObj = config.pages.jPages.siblings(previousPage.className);
    
    // Fisrt bring the opacity down, move from right to left, then move it to middle of nowhere
    previousPage.jObj.removeClass('visible').addClass('offset-page');
    
    // CSS is set to 500ms, so before pushing the nextPage, we wan to wait until this one is gone
    setTimeout(function() {
      previousPage.jObj.addClass('offscreen').removeClass('offset-page');
      _showNextPage(nextPage);
      //window.waitJS.session_hide = true;
      return true;
    }, 550);
  }
  
  
  function _showNextPage(nextPage) {
    
    _renderTestPages();
    
    //console.p('_showNextPages');
    
    var className =  '.' + nextPage;
    
    // This is the new page which we are showing
    var jNewPage = config.pages.jPages.siblings(className);
    
    // 00000000
    // remove aria tags that it is hidden, move it into view
    //console.p('nextPage:'+nextPage);
    //console.p(jNewPage);
    
    // Get the page ready, before showing it bring opacity up and then animate it
    jNewPage.removeClass('offscreen');
    jNewPage.addClass('visible'); // And CSS transition will do the rest
    
    // save into session and config
    sessionStorage.setItem('currentPage', nextPage);
    config.appSession.currentPage = nextPage;
  }
  
  
  function _renderTestPages(){
    
    console.p('@_renderTestPages');
    
    if(config.pages.built === true)
      return;
    
    if (_.isEmpty( config.tests )) {
      return console.p('@No data, man.');
    }
    
    console.p('@Found data in memory, getting the data.');
    
    var contextTests = {
      tests : config.tests.tests
    };
    var contextQuestions = {
      questions : _.find(contextTests.tests, { 'testUniqueID': 'kyc310JUZEzV' })
    };
    
    
    console.p(contextTests);
    console.p(contextQuestions);
    
    var context = {
      tests: contextTests,
      questions: contextQuestions.questions,
    };
    
    //var context = {
    //people: [ 
    //  { firstName: 'Homer', lastName: 'Simpson' },
    //  { firstName: 'Peter', lastName: 'Griffin' },
    //  { firstName: 'Eric', lastName: 'Cartman' },
    //  { firstName: 'Kenny', lastName: 'McCormick' },
    //  { firstName: 'Bart', lastName: 'Simpson' }
    //]
    //};
    
    _template(context);
    
    return;
  }
  
  function _template(context) {
    
    // Grab the template script
    var theTemplateScriptsForTests = $("#test-list").html();
    var theTemplateScriptsForQuestions = $("#question-list").html();
    
    // Compile the template
    var theTemplateForTests = Handlebars.compile(theTemplateScriptsForTests);
    var theTemplateForQuestions = Handlebars.compile(theTemplateScriptsForQuestions);
    
    // Define our data object
    //var context = {
    //  people: [ 
    //    { firstName: 'Homer', lastName: 'Simpson' },
    //    { firstName: 'Peter', lastName: 'Griffin' },
    //    { firstName: 'Eric', lastName: 'Cartman' },
    //    { firstName: 'Kenny', lastName: 'McCormick' },
    //    { firstName: 'Bart', lastName: 'Simpson' }
    //  ]
    //};
    
    // Pass our data to the template
    var theCompiledHtmlForTests = theTemplateForTests(context.tests);
    var theCompiledHtmlForQuestions = theTemplateForQuestions(context.questions);
    
    // Add the compiled html to the page
    $('.content-tests').html(theCompiledHtmlForTests);
    $('.content-questions').html(theCompiledHtmlForQuestions);
  }
  
  
  function _renderSingleQuestionPage(className){
    
    
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