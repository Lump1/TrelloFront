var endpoint = "https://localhost:7193/";
var usersEndpoint = "api/users/";
var cardsEndpoint = "api/cards/";
var statusEndpoint = "api/statuses/";


$(document).ready(function () {
   
    function emailValidator(email){    
        const emailPattern = /^[a-zA-Z0-9_]+@[a-zA-Z0-9_]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    function usernameValidator(username){
        const usernamePattern = /^[a-zA-Z0-9_]+$/;
        return usernamePattern.test(username);
    }

    function fieldsTests(...fields) {
        for (let field of fields) {
            if (typeof field !== "string" || field.trim().length === 0) {
                return false;
            }
        }
        return true;
    }
          
    function showNotification(message, type) {
        var notification = $("#notification");
        notification.text(message);
        notification.removeClass("error success").addClass(type).addClass("show");

        setTimeout(function() {
            notification.removeClass("show");
        }, 5000);
    }

    $("#registrationButton").on("click", function(){
        var email = $("input[name='email']").val().trim();
        var username = $("input[name='username']").val().trim();
        var password = $("input[name='password']").val().trim();

        if (!fieldsTests(email, username, password) || !emailValidator(email) || !usernameValidator(username)) {
            showNotification("Please fill in all fields.", "error");
            return;
        }

        $.ajax({
            url: endpoint + usersEndpoint,
            method: "POST",
            dataType: "json",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {email: email, username: username, password: password},
            success: function(data) {
                showNotification("Registration successful.", "success");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showNotification("Error occurred during registration.", "error");
            }
        });
    });

    $("#loginButton").on("click", function() {
        var identifier = $("input[name='loginIdentifier']").val().trim(); 
        var password = $("input[name='loginPassword']").val().trim();
    
        if (!fieldsTests(identifier, password)) {
            showNotification("Please fill in all fields.", "error");
            return;
        }
    
        var requestData = {email:"",username:""}; 
        if (emailValidator(identifier)) { 
            requestData.email = identifier;
        } else { 
            requestData.username = identifier;
        }
    
        requestData.password = password; 
        console.log(requestData)
    
        $.ajax({
            url: endpoint + usersEndpoint + "auth",
            method: "GET",
            dataType: "json",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(requestData), 
            success: function(data) {
                showNotification("Login successful.", "success");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showNotification(textStatus, "error");
                console.log(errorThrown, textStatus, jqXHR)
            
            }
        });
    });
});
