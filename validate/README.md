#### validate.js

A JS form validation library that shares a rules library with a server side form validator in go-ns (https://github.com/ONSdigital/go-ns/tree/master/validator).

As this is WIP:
- The rules.json file is in this repo for now until we work out where to put it.
- There is no styling or complex error handling with logic/context.
- The library currently validates min length, phone number and email address. This will be extended when we know more about what we will validate.

### How it works

Below you have a simple form

```html
<form action="/search" name="searchForm" id="search-form" method="post">
  <div class="row">
    <input type="text" id="search" name="search" placeholder="Enter search terms">
  </div>
  <div class="row">
    <input type="text" id="phone-number" name="phone-number" placeholder="Enter phone number">
  </div>
  <div class="row">
    <input type="text" id="email" name="email" placeholder="Enter email">
  </div>
  <button type="submit" id="submit">Submit</button>
 </form>

```
The rules json can hold any number of criteria to validate against and should fit the structure shown in the example below:

```json
[
  {
    "id": "search",
    "rules": [
      {
        "name": "min_length",
        "value": 5
      }
    ]
  },
  {
    "id": "phone-number",
    "rules": [
      {
        "name": "numeric"
      }
    ]
  },
  {
    "id": "email",
    "rules": [
      {
        "name": "email"
      }
    ]
  }
]
```
The id's in the rules json will need to match the id of the form element to validate. The JS will then check for matches and then validate the fields against the rules criteria.

### Extending the library

If you want to add a new rule for say max length, add your rule to the json:

```js
"id": "search",
    "rules": [
      {
        "name": "max_length",
        "value": 10
      }
    ]
  },
 ```

In the js you need to create a function to check the max length, for example:

```js
  // Check the length of the field
  function checkMaxLength(minLength, id){
    var f = document.getElementById(id),
        v = f.value.length,
        $errorEl = $("<div class='error'>"+errorMessages.maxLengthErr+"</div>");

    // Show errors
    if(v > maxLength){
      $errorEl.insertBefore(f);
      return false;
    }
    return true;
  }
```

Add a new error message to the errorMessages object:

```js
// Default error messages
var errorMessages = {
  minLengthErr : "You must enter more characters",
  phoneNumErr : "You must enter a valid phone number",
  emailErr : "You must enter a valid email address",
  maxLength: "You can only enter a maximum of 10 characters"
}
```

Add a check in the validate function for the max length rule that will get the max length value from the rules json:

```js
// Check if there is a max length rule
  if(rules.name === 'max_length') {
    maxLength = rules.value;
    if(!checkMaxLength(maxLength, id)){
      e.preventDefault();
    }
  }
```
