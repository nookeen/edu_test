//=============================================================================
// TXT_MODULE
//=============================================================================
var TXT_MODULE = (function() {
  
  // Everything related to view in terms of content and text goes here
  var txt = {};
  
  txt.already_registered = "There is a user with this name already, please select a different name or login.";
  txt.account_created = "Your account is created!";
  txt.please_login = "Please login to view this page.";
  txt.page_does_not_exist = "Page does not exist.";
  txt.only_letters = "User names can only contain letters.";
  txt.user_does_not_exist = "User with this name does not exist. Please register or check the spelling.";
  txt.unable_to_create_an_account = 'Wooops! An error occured, please try again.';
  
  return {
    txt: txt
  };
  
})();