// Default error messages
var errorMessages = {
  minLengthErr : "You must enter more characters",
  phoneNumErr : "You must enter a valid phone number",
  emailErr : "You must enter a valid email address"
}

// Get the json file and store
function loadJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'rules.json');
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

// Load json...
loadJSON(response);

// Create global vars...
var lookup = [], lookupId;

function response(responseData) {
  // Create objects from json data
  var rulesSet = JSON.parse(responseData);

  // Loop through objects
  for (i = 0;  i < rulesSet.length; i++) {
    // Create a lookup for each object that can be used later
    lookup[rulesSet[i].id] = rulesSet[i];
  }

  // Validate the form
  function validate(e) {
    $('.error').remove();
    var elements = document.getElementsByTagName('input');
    for (i = 0; i < elements.length; i++) {
      // Loop through form elements and store id's
      id = elements[i].getAttribute('id');
      lookupId = lookup[id].rules; var rules;
      // Loop through rules of the matched ID's
      for (rules of lookupId){
        // Check if there is a min length rule
        if(rules.name === 'min_length') {
          minLength = rules.value;
          if(!checkMinLength(minLength, id)){
            e.preventDefault();
          }
        }
        // Check if there is a min length rule
        if(rules.name === 'numeric') {
          if(!checkPhoneNum(id)){
            e.preventDefault();
          }
        }
        // Check if the email address is valid
        if(rules.name === 'email') {
          if(!checkEmail(id)){
            e.preventDefault();
          }
        }
      }
    }
  }

  // Checks and error handling...

  // Check the length of the field
  function checkMinLength(minLength, id){
    var f = document.getElementById(id),
        v = f.value.length,
        $errorEl = $("<div class='error'>"+errorMessages.minLengthErr+"</div>");

    // Show errors
    if(v < minLength){
      $errorEl.insertBefore(f);
      return false;
    }
    return true;
  }

  // Check the field contains a valid phone number
  function checkPhoneNum(id){
    var f = document.getElementById(id),
        v = f.value,
        $errorEl = $("<div class='error'>"+errorMessages.phoneNumErr+"</div>"),
        phoneNumRegEx = /^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/;

    // Show errors
    if(!v.match(phoneNumRegEx)){
      $errorEl.insertBefore(f);
      return false;
    }
    return true;
  }

  // Check the field contains a valid phone number
  function checkEmail(id){
    var f = document.getElementById(id),
        v = f.value,
        $errorEl = $("<div class='error'>"+errorMessages.emailErr+"</div>"),
        emailRegEx = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    // Show errors
    if(!v.match(emailRegEx)){
      $errorEl.insertBefore(f);
      return false;
    }
    return true;
  }

  // Run the validate function on form submit
  $('#submit').on('click',function(e){
      validate(e);
  });

}
