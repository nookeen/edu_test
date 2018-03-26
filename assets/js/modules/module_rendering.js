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