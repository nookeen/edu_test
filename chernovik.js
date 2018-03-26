 /*
  
tests
-test_id
-test_unique_id
-test_title
-test_notes
-test_sequence
-questions
--question
----question_id
    question_unique_id
----question_title
----question_content
----question_sequence
----question_solved
----question_inprogress
----answer_hint
----question_type:_radio_||text||_checkbox_
----answers
------answer
--------answer_id
        answer_unique_id
--------answer_sequence
--------answer_text:''
--------answer_is_correct:false
------answer
--------answer_id
        answer_unique_id
--------answer_sequence
--------answer_text:''
--------answer_is_correct:false
------answer
--------answer_id
        answer_unique_id
--------answer_sequence
--------answer_text:'text here'
--------answer_is_correct:true
------answer
--------answer_id
        answer_unique_id
--------answer_sequence
--------answer_text:''
--------answer_is_correct:false
--question
----question_id
    question_unique_id
----question_title
----question_content
----question_sequence
----question_version
----question_solved
----answer_hint
----question_type:radio||_text_||checkbox
----answers
------answer
--------answer_id
        answer_unique_id
--------answer_sequence
--------answer_notes
--------answer_text
--------answer_is_correct:true
  
  
id_tracker
  tests
    new_test_id
    hash_number:1
  questions
    new_question_id
    hash_number:2
  answers
    new_answer_id
    hash_number:3
  users
    new_user_id
    hash_number:4
      */




// Remove saved data from sessionStorage
//sessionStorage.removeItem('key');

// Remove all saved data from sessionStorage
//sessionStorage.clear();



//db.transaction("rw", db.idHashNumber, function() {
      //    db.idHashNumber.add({section: "tests", idHashNumber: 1});
      //    db.idHashNumber.add({section: "questions", idHashNumber: 2});
      //    db.idHashNumber.add({section: "answers", idHashNumber: 3});
      //    db.idHashNumber.add({section: "users", idHashNumber: 4});
      //    
      //    var promise = db.idHashNumber.where("idHashNumber").equals(4).toArray();
      //    
      //    // Make the transaction resolve with the last promise result
      //    return promise;
      //
      //}).then(function (hashes) {
      //
      //    // Transaction complete.
      //    console.log(hashes);
      //
      //}).catch(function (error) {
      //
      //    // Log or display the error.
      //    console.error(error);
      //    // Notice that when using a transaction, it's enough to catch
      //    // the transaction Promise instead of each db operation promise.
      //});
      
      //db.open().catch(function (err) {
        //console.error (err.stack || err);
      //});
      
      
      function _isUserLoggedIn() {
      //(HANDLER_DB.addUser(userData) !== false ) ? return true : return false;
    }
    
    
    function _renderStandardPages(requestedPage) {
      
      // 00000000
      // remove aria tags that it is hidden, move it into view
      
      // This is the old page which we are hiding
      var previousPage = {};
      var myVar, myVar2;
      previousPage.name = settings.appSession.currentPage;
      
      //console.p(previousPage.name);
      //console.p(requestedPage);
      //return false;
      
      // If there is no previous page skip the hiding part
      if(previousPage.name === null){
        _renderRequestedPage(requestedPage);
        return true;
      }
      
      previousPage.jObj = settings.pages.jPages.siblings(previousPage.name);
      
      // Fisrt bring the opacity down, move from right to left, then move it to middle of nowhere
      if(previousPage.jObj.css('opacity') > 0)
      {
        previousPage.jObj.removeClass('classic').addClass('classic2');
        // Hide it from view
        myVar2 = setTimeout(_helperAnimationFn(previousPage), 550);
        // Show the requested page
        myVar = setTimeout(_renderRequestedPage(requestedPage), 450);
        
      
      }
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
    
    function _helperAnimationFn(previousPage) {
      previousPage.jObj.addClass('offscreen');
      
    }
    
    
    function _loginCheck(_in, _out, redirect, alertBox) {
      
      (_in) ? _in : _in = false;
      (_out) ? _out : _out = false;
      (redirect) ? redirect : redirect = false;
      
      var additionalOptions = function(){
        if(redirect === true)
          HANDLER_RENDERING.render(location);
        if(alertBox === true)
          HANDLER_UTILITIES.showAlertBox(HANDLER_TXT.txt.please_login, '.tests.page', HANDLER_TXT.txt.error);
      }
      
      if(settings.appSession.currentUser) {
        if(_in === true)
          additionalOptions();
        return true;
      } else {
        if(_out === true)
          additionalOptions();
        return false;
      }
    }
    
    return {
      render: render
    };
  })();
  
  var bike = "triumph",
   bikes = {
             bmw     : function(){ // do stg extraordinary
                       },
             aprilla : function(){ // do stg interesting
                       },
             triumph : function(){ // do stg different
                       }
            };
bikes[bike]();
  
  
        // The Homepage.
        //'#login': function() {
          //(_loginCheck() === true) ? _renderStandardPages('.tests') : _renderStandardPages('.login');
          
          //console.p('#login');
        //},
        
        
        <!-- Fixed navbar -->
    <nav id="nav-top" class="navbar navbar-fixed-top">
      <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
          
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li class="top_menu_close_btn"><a href="javascript:void(0);" id="top-btn-close">Close<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></a></li>
              <li><a href="#" class="top-btn">Home</a></li>
              <li><a href="javascript:void(0);" class="top-btn logout">Logout</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>
    
    
    
    <div class="alertBox alert-dismissible alert alert-dismissible ajax-warning" role="alert" style="display: none;">
      <button type="button" class="close"><span aria-hidden="true">x</span></button>
      <div class="container">
        <div class="row">
          <div class="offset-lg-1 offset-sm-1 col-sm-1 no-side-padding">
            <div class="danger-icon">
              <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
              <span class="sr-only">Error:</span>
            </div>
          </div>
          <div class="col-sm-10 no-side-padding">
            <p></p>
          </div>
        </div>
      </div>
    </div>
        