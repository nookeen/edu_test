// NOTES

// So here we go
//
// We need a login functionality, so lets do the dexie crap with login and passeord
// Then we also need registration with username and email and passowrd
//
// After registration you land on a test window
// Query db for the tests
// one test available
//
// Click on the test and you see the test screen
// I do not want pre-loading, NO only check answer on submit
// So we pull the question and options from the db and compile it
//
// Here is the code for the test itself, lets write it without DB first to understand the structure
// Make it scalable to 1000 questions

/////// TEST //////////

// identify its structure, each test will have
/*

// TEST OBJECT

test
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
----question_version
----question_solved
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


user
  userId
  userUniqueID
  userName
  userAnswers :
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
populate LIs

then for each unique ID check which tests are 


for each uniqID do check when matched

if a == a
isSolved
true false
isInProgress
true false
a != val => locked invisible
true false

default status: locked, cant view

status:
- locked, cant view // leave as is
- unlocked, cant edit a == a
- unlocked, can edit => inProgress

ON SUBMIT ANSWER
you add this qUid to your
 - add to your arrays
 save into localstorage and save to DB the new array

save params keep somewhere on page load



on tests

1 id=a

2 id=b +

3 id=c


on questions


on singleQuestion

legnth of questions
length of tests


// ID TRACKING
id_hash_number
  tests:1
  questions:2
  answers:3
  users:4


//////////// COMMON METHODS

// REGISTER
create_account()
check_if_user_name_exists()
login()

// OPERATIONS
goto_tests_overview()
goto_questions_overview(test_id, test_sequence)
goto_start_test(test_id, test_sequence)
goto_continue_test(test_id, test_sequence)

hide_page_from_view()
show_page_from_view(page_section)

show_alert(txt, class)

// TEST RELATED
show_question(question_id, question_sequence)
show_next_question(question_id, question_sequence)
show_answer(question_id, answer_id)
show_hint(question_id, answer_id)
check_answer(question_id, answer_id)

// REPLIES
txt.module_done
txt.registration_success

// HOW QUESTIONS WOULD LOOK LIKE
SILDE_1
  Image
  Test name
  Test notes
  List of quetions
QUESTION_N
  Image
  question_title
  question_content
  answers
  
MENU
logout -> login screen
back to test overview
back to questions

// SET THE STAGE
page1 - login/register
page2 - tests overview
page3 - questions overview
page4 - questions 


// LETS MAKE IT FUN



*/