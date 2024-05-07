var endpoint = "https://localhost:7193/";
var usersEndpoint = "api/users/";
var cardsEndpoint = "api/cards/";
var statusEndpoint = "api/statuses/";


$(document).ready(function () {
    const endpoint = "https://localhost:8080/";
    const usersEndpoint = "api/users/";

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

    $("#registrationButton").on("click", function(){
        var email = $("input[name='email']").val().trim();
        var username = $("input[name='username']").val().trim();
        var password = $("input[name='password']").val().trim();

        if (!fieldsTests(email, username, password) || !emailValidator(email) || !usernameValidator(username)) {
            alert("Please fill in all fields correctly.");
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
                alert("Registration successful.");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error occurred during registration.");
            }
        });
    });

    $("#loginButton").on("click", function() {
        var username = $("input[name='loginUsername']").val().trim();
        var password = $("input[name='loginPassword']").val().trim();

        if (!fieldsTests(username, password)) {
            alert("Please fill in all fields.");
            return;
        }

    
        $.ajax({
            url: endpoint + usersEndpoint + "auth/",
            method: "GET",
            dataType: "json",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {username: username, password: password},
            success: function(data) {
                alert("Login successful.");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error occurred during login.");
            }
        });
    });
});
