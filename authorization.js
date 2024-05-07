var endpoint = "https://localhost:8080/";
var usersEndpoint = "api/users/";
var cardsEndpoint = "api/cards/";
var statusEndpoint = "api/statuses/";

function emailValidator(email){    
    if(email.contains("@")){
        return true;
    }
    else {
        return false;
    }
}

function fieldsTests(...fields) {
    fields.forEach(field => {
        if (typeof field === "string" && field.length === 0) {
            return false;
          } 
          else if (field === null) {
            return false;
          } 
          else {
            return true;
          }
    });
}

$(document).ready(function () {
    $("#loginButton").on("click", function() {

        // here is fields tests with fieldsTests() and something more, like email field to @ including
        
        $.ajax({
            url: endpoint + usersEndpoint + "auth/",
            method: "GET",
            dataType: "json",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: emailValidator(emailPLACEHOLDER) ? {email: emailPLACEHOLDER, password: passwordPLACEHOLDER} : {username: usernamePLACEHOLDER, password: passwordPLACEHOLDER},
            success: function(data) {
                document.cookie = data;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // error handling with textStatus
            }
        })
    });

    $("#registrationButton").on("click", function(){
        
        // here are tests too

        $.ajax({
            url: endpoint + usersEndpoint,
            method: "POST",
            dataType: "json",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {email: emailPLACEHOLDER, username: usernamePLACEHOLDER, password: passwordPLACEHOLDER},
            success: function(data) {
                // Good ending
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // error handling with textStatus
            }
        })
    });
});