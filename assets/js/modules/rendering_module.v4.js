var RENDERING_MODULE = (function() {
"use strict";

  // Include Modules
  var inc = {};
  
  inc.TXT = TXT_MODULE;
  inc.UTIL = UTILITIES_MODULE;
  inc.CONFIG = CONFIG_MODULE;
  
  var config = inc.CONFIG.config,
      pages = {};
  
  // The main function for rendering
  function render(url) {
    
    console.p('@Entering _render(' + url +')');
    
    if (_.isEmpty( config.tests )) {
      return console.p('@No data, man. Stop!');
    }
    var context = {};
    
    console.p('@Data is available in config.tests');
    
    var nextPageID = url.split('/')[0];
    
    // URL adjustments
    (nextPageID === '') ? nextPageID = '#login' : null; // If '#', it's a login page
    (nextPageID === 'single-question') ? nextPageID = '#singleQuestion' : null; // If '#', it's a login page
    
    var nextPageClass = nextPageID.replace('#','.'),
        nextPageName = nextPageID.replace('#','');
    
    console.p('@Set nextPageID=' + nextPageID + ' from the url: ' + url);
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
      '#login': function() {
        
        //console.p('@home');
      },
      
      '#register': function() {
        
        //console.p('@register');
      },
      
      '#tests': function() {
        
        context.tests = config.tests.tests;
        
        _.orderBy(context.tests, ['sequence'], ['asc']);
        
        //console.p('#tests: set context={} for _Template()');
        //  console.p('context=');
        //    console.p(context);
        
        _Template(context, nextPageID, nextPageClass);
      },
      
      '#questions': function() {
        
        index = url.split('#questions/')[1].trim();
        
        context.questions = _.filter(config.tests.questions, { 'testUniqueID': index });
        _.orderBy(context.questions, ['sequence'], ['asc']);
        
        
        //console.p('@Find all questions for the testUniqueID' + index);
        
        // Change questionTitle since we do not want to expose them,
        // So users would not know what to expect
        inc.UTIL.updateProperties(context.questions, 'questionNumber', 'Question ', true);
        
        console.p('#questions: set context={} for _Template()');
          console.p('index=' + index);
            console.p('context=');
              console.p(context);
        
        _Template(context, nextPageID, nextPageClass);
      },
      
      '#single-question': function() {
        
        index = [];
        index[0] = url.split('#single-question/')[1].trim();
        index[1] = index[0].split( '/' )[0].trim();
        index[2] = index[0].split( '/' )[1].trim();
        
        context.singleQuestion = _.filter(config.tests.answers, { 'testUniqueID': index[1] } && { 'questionUniqueID': index[2] });
        context.singleQuestion = _.orderBy(context.singleQuestion, ['sequence'], ['asc']);
        
        var jSingleQuestion = config.pages.jPages.siblings('.single-question.page');
        context.currentQuestion = _.find(config.tests.questions, { 'questionUniqueID': index[2] });
        
        //console.p('context.currentQuestion=');
        //  console.p(context.currentQuestion);
        //    console.p('index=');
        //      console.p(index);
        //       console.p('config.tests.questions=');
        //         console.p(config.tests.questions);
        
        // Add title thru jQuery
        jSingleQuestion.find('h2.questionTitle').text(context.currentQuestion.questionTitle);
        
        //console.p('#single-questions: set context={} for _Template()');
        //  console.p('index=');
        //    console.p(index);
        //      console.p('context=');
        //        console.p(context);
                //return
        
        setTimeout(function() {
          _Template(context, nextPageID, nextPageClass);
          
          _renderSingleQuestionPage(jSingleQuestion, context);
        }, 700);
        
      }
    };
    
    // Execute the needed function depending on the url keyword (stored in nextPage).
    if(map[nextPageID]){
      
      map[nextPageID]();
      
      _switchPageTo(nextPageClass);
      
      // Save into session and config
      sessionStorage.setItem('currentPage', nextPageName);
      config.appSession.currentPage = nextPageName;
      
    } else {
      // If the keyword isn't listed in the above - show error alert.
      inc.UTIL.showAlertBox(inc.TXT.txt.page_does_not_exist, 'danger'); // Need to login
      
      // Add errors for more segments 000000000
      // (...)
      
      console.error('Error: ' + url);
      
      return;
    }
  }
  
  function _switchPageTo(nextPageClass) {
    
    var previousPage = {
      name: '',
      className: ''
    },
    
    // New page which we gonna show
    jNewPage = config.pages.jPages.siblings(nextPageClass);
    
    previousPage.name = config.appSession.currentPage;
    
    //console.p('@previousPage=');
      //console.p(previousPage);
    
    if(__doesPreviousPageExist(previousPage) === false){ // single pages need pause
      
      //console.p('nextPageClass=' + nextPageClass);
      
      __showNewPage(); // Show new page
      
      return;
    }
    
    __hidePreviousPage(previousPage);
    
    // CSS is set to 500ms, so before showing nextPageClass,
    // we want to wait until animation is done
    setTimeout(function() {
      
      // 4. => Remove offset so it would not cause slide conflict
      previousPage.jObj.addClass('offscreen').removeClass('offset-page');
      
      __showNewPage();
    
    }, 500);
    
    
    function __hidePreviousPage(previousPage) {
      
      //console.p('@Let\'s hide this: ' + previousPage.name);
      
      previousPage.className = '.' + previousPage.name;
      
      // Get the jQuery object of the page
      previousPage.jObj = config.pages.jPages.siblings(previousPage.className);
      
      // 1. => bring the opacity down,
      // 2. => move from right to left,
      // 3. => move previous page to middle of nowhere
      
      previousPage.jObj.removeClass('visible').addClass('offset-page');
      
      // Update aria-hidden => true on previousPage
      // (...)
    }
    
    function __showNewPage() {
      
      //console.p('@Animating view for new page...');
      
      // Update aria-hidden => false on next page
      // (...)
      
      // 1. => move it back from the middle of nowhere
      // 2. => bring opacity up
      // 3. => move from right to left
      jNewPage.removeClass('offscreen hidden').addClass('visible'); // CSS 'transition' will do the rest
    }
    
    
    function __doesPreviousPageExist(previousPage) {
      
      var exists = false;
      
      (previousPage.name === null || previousPage.className === nextPageClass) ? exists : exists = true;
      
      //console.p('@previousPage.className="' + previousPage.className + '", exists = ' + exists);
      
      return exists;
    }
  }
  
  function _Template(context, nextPageID, nextPageClass) {
  
    //console.p('@Entered _Template. nextPageID=' + nextPageID + ', nextPageClass=' + nextPageClass);
    
    // Grab the _Template script
    var theTemplateScript = $(nextPageID + "-list").html();
    
    // Compile the _Template
    var theTemplate = Handlebars.compile(theTemplateScript);
    var theCompiledHtml = theTemplate(context);
    
    // Add the compiled html to the page
    $(nextPageClass+'-content').html(theCompiledHtml);
  }
  
  
  // ---
  // Everything below needs modulation !!!
  // ---
  function _renderSingleQuestionPage(jPageObj, context){
    
    //console.p(jPageObj);
    //console.p(context.singleQuestion);
    
    var qID = context.singleQuestion[0].questionUniqueID;
    var tID = context.singleQuestion[0].testUniqueID;
    var aID = '';
    
    // Set Questions Overview
    jPageObj.find('.btn.questionList').attr('href','#questions/' + tID);
    
    //console.log('localStorage=');
      //console.log(localStorage);
    
    var f = _.find(config.tests.tests, { 'testUniqueID': tID });
    var n = _.findKey(f.questions, { 'questionUniqueID': qID, });
    n = parseInt(n);
    
    var x = n+1;
    var thisone = f.questions[n];
    var next = f.questions[x];
    var previous = f.questions[n-1];
    
    //console.log('KEY='+n);
      //console.log(config.tests.questions);
        //console.log(config.tests.tests);
        //console.log(x + '= x');
        //console.log(f);
        //console.log('next=');
        //console.log(next);
        //console.log('previous=');
        //console.log(previous);
        //console.log('thisone=');
        //console.log(thisone);
      //console.log(context.singleQuestion);
      //console.log('context.currentQuestion=');
      //console.log(context.currentQuestion);
      
    var jsvoid = 'javascript:void(0)';
    
    if(previous)
      jPageObj.find('.btn.previous').attr('href','#single-question/' + tID + '/' + previous.questionUniqueID).removeAttr('disabled');
    else
      jPageObj.find('.btn.previous').attr('href', jsvoid).attr('disabled','disabled');
    
    if(next)
      jPageObj.find('.btn.next').attr('href','#single-question/' + tID + '/' + next.questionUniqueID).removeAttr('disabled');
    else
      jPageObj.find('.btn.next').attr('href','#questions/' + tID);
    
    
    aID = localStorage.getItem(qID);
    
    //console.log(aID);
    //console.log(qID);
    //console.log(tID);
    //console.log(sessionStorage);
    //console.log(localStorage);
    
    if(aID !== null){
      
      //console.log("SOLVED!");
      
      answerSolved(aID);
      
      return;
    }
    
    // E V E N T S .on
    //
    //
    // Add toggle event to this set
    jPageObj.find('.list li a').on('click', function(){
      
      var jThis = $(this);
      
      jPageObj.find('.list li').removeClass('selected');
      
      jThis.parent().addClass('selected');
    });
    //
    // Then on submit check if the answer is correct
    jPageObj.find('.btn.confirm').on('click', function() {
    
      _onQuestionSubmit();
    });
    //
    //
    // ------
    
    
    // Hide questionContent
    jPageObj.find('.questionContent, .answerHint').slideUp(1);
    
    // Remove attribute 
    jPageObj.find('.btn.confirm').removeAttr('disabled');
    
    // Disable NEXT button
    jPageObj.find('.next').attr('disabled', 'disabled');
    
    // Remove class selected from li elements
    jPageObj.find('.list li').removeClass('selected');
    
    
    
    function _onQuestionSubmit(){
      
      console.p('@Entered _onQuestionSubmit');
      
      
      
      var auID = jPageObj.find('.list li.selected a').attr("data-unique-id");
      
      //console.log('auID = ' + auID);
      //console.log('context.singleQuestion=');
      //console.log(context.singleQuestion);
      //console.log('context.currentQuestion=');
      //console.log(context.currentQuestion);
      
      aID = auID;
      
      var row = {};
      row = _.find(context.currentQuestion.answers, { 'answerUniqueID': auID });
      
      console.p(row);
      
      // if not correct answer, show hint
      (row.correctAnswer === true) ? answerSolved(auID) : showHint();
    }
    
    function showHint(hide) {
      
      var jObj = jPageObj.find('.answerHint');
      
      (hide === false) ? jObj.slideUp(100) : jObj.html(context.currentQuestion.answerHint).slideUp(1).slideDown(500);
    }
    
    function answerSolved(auID) {
      
      //console.p(context.currentQuestion.questionContent);
      var object = context.currentQuestion.questionContent;
      
      //console.log(object);
      //console.log('auID = ' + auID);
      
      $.scrollTo('#answers',{
      duration: 1000,
      easing: 'swing',
      onAfter: function() {
      jPageObj.find('.questionContent').html(object).slideDown(1000);
    }
  });
      
      
      
      // E V E N T S .off
      //
      //
      jPageObj.find('.btn.confirm').off('click').attr('disabled','disabled');
      //
      jPageObj.find('.list li a').off('click');
      //
      //
      //---
      
      // Enable NEXT button, add URL to it
      jPageObj.find('.next').removeAttr('disabled');
      
      //console.log(jPageObj.find('.list li a#' + qID));
      //  console.log(jPageObj.find('.list li a#' + qID).parent('li'));
      //    console.log(auID);
      //      console.log(qID);
      
      showHint(false);
      
      jPageObj.find('.list li a#' + auID).parent().addClass('selected');
      
      // Mark question as solved by adding it to session variable and DB
      // Save into localStorage since sessions do expire
      
      //console.log('Before: localStorage=');
        //console.log(localStorage);
          //console.log(localStorage.getItem(qID));
      
      if(localStorage.getItem(qID) === null){
        
        //console.log(' SETTING LOCAL STORAGE!');
        
        localStorage.setItem(qID, auID);
      }
      
      
      //console.log('After: localStorage=');
      //  console.log(localStorage);
    }
  }
  
  return {
    render: render
  };
})(this);