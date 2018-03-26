//=============================================================================
// MODULE_RENDERING
//=============================================================================
var MODULE_RENDERING = (function() {
  
  // Include Modules
  var inc = {};
  
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
        if(isLoggedIn() === false){
          redirect('', true);
          return;
        }
        
        //console.p(settings.tests);
        
        if(!settings.tests)
          _renderStandardPage('.tests');
        else
          renderTestPages();
      },
      
      '#questions': function() {
        if(isLoggedIn() === false){
          redirect('', true);
          return;
        }
        
        //console.p(settings.questions);
        
        if(!settings.tests)
          _renderStandardPage('.questions');
        else
          renderTestPages();
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

  function _renderSingleQuestionPage(className){
    
    
    // Add event listeners to checkboxes and submit button
    singleQestionPage.jObj.find('.fnSubmit').on('click', _processAnswer('submit'));
    singleQestionPage.jObj.find('.answerOption').on('click', _processAnswer('select'));
    
    //$( "#book" ).toggle( "slow", function() {
    //  // Animation complete.
    //});
  }
  
  function renderTestPages(pageClassName){
    
    // Get the data
    var data = settings.tests.data;
    var pages = ['.tests', '.questions', '.singleQuestion'];
    
    // Construct pageObject for 3 pages
    for (var page in pages)
      _createPageObject(page);
    
    console.p(settings.pageObjects);
    
    var testsPage = settings.pageObjects;
    // Remove any extra stuff
    //testsPage.jUl.html('');
    
    console.p(testsPage);
    
    if(data.length){
      data = _.sortBy (data, [ 'testSequence' ]);
      
      console.p(data);
      
      _buildTemplate();
      
      //console.p(_.find(data, { 'questionSequence': 50 }));
      //_.sortBy(users, ['user', 'age']);
      //console.p(_.sortBy(data, ['testSequence','questions.questionUniqueID','questions.answers.answerUniqueID']));
      //console.p(_.sortBy(data, ['testSequence','questions.questionUniqueID','questions.answers.answerUniqueID']));
    }
    
  }
  function _createPageObject(pageClassName) {
    
    //settings.pageObjects
    var pageObject = {};
    //pageObject[pageClassName] = {};
    
    // For tests and questions views
    pageObject.jObj = settings.jBody.find(pageClassName);
    pageObject.jUl = pageObject.jObj.find('ul');
    pageObject.jLi = pageObject.jObj.find('li');
    
    if(pageClassName === '.singleQuestion'){
      // For singleQuestionPage
      pageObject.jh2 = pageObject.jObj.find('h2');
      pageObject.jAnswerTxt = pageObject.jObj.find('li .answerTxt');
      pageObject.jAswerOption = pageObject.jObj.find('li .answerOption');
      pageObject.jHint = pageObject.jObj.find('.hint');
      pageObject.jAnswer = pageObject.jObj.find('.answer');
      pageObject.jFnSubmit = pageObject.jObj.find('.fnSubmit');
    }
    
    pageObject.template = {
      content: '',
      uniqueId: '',
      jHtml: {}
    };
    
    settings.pageObjects[pageClassName] = pageObject;
  }
  
  function _buildTemplate(pageClassName) {
    
    var testsPage = settings.pageObjects[pageClassName];
    
    for (var key in data) {
        
        console.p(data[key]);
        
        if(pageClassName === '.tests'){
          testsPage.template = {
            content: data[key].testTitle,
            uniqueId: data[key].testUniqueID,
            jHtml: testsPage.jLi.clone()
                                .attr('data-unique-id', data[key].testUniqueID)
                                .html(data[key].testTitle)
          };
        }
        //for (var key2 in data[key]) {
          //console.p(_.find(data[key2], { 'questionSequence': 50 }));
        //}
        
        // Render
        testsPage.jUl.prepend(testsPage.template.jHtml);
      }
  }
  
  function _resolvedAnswersAmount(callback) {
    
    if(settings.appSession.currentUserAnswers) {
      
      var answeres = settings.appSession.currentUserAnswers;
      
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
  
  function isLoggedIn() {
    if(settings.appSession.currentUser) {
      return true;
    } else {
      return false;
    }
  }
  
  return {
    redirect: redirect,
    isLoggedIn: isLoggedIn,
    renderTestPages: renderTestPages
  };
})();