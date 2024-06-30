var endpoint = "https://localhost:7193/";
var notificationsEndpoint = "api/team-user-notifications/";
var friendsEndpoint = "api/friendship/";

$(document).ready(function() {

    if (CSS.supports('scrollbar-gutter', 'stable')) {
        console.log('Поддерживается');
    } else {
        console.log('Не поддерживается');
    }
    getQuerryTemplate("UserInterface", {}).then(InterfaceHTML => {
        $("header").append(InterfaceHTML);

        $(".account-button").on("mouseup", function (e) {
            if ($(".user-settings-container").css("display") == "none") {
                $("#not-cont").html("");
                $(".user-settings-container").show();
            }
        })
    
        $(document).on("click", function (e) {
            if ($(".user-settings-container").css("display") != "none" &&
                (!$(e.target).hasClass(".user-settings-container") &&
                    $(e.target).closest(".account-button").length == 0)) {
                $("#not-cont").html("");
                $(".user-settings-container").hide();
            }
        })


        $(".logout-butt").on("click", function () {
            console.log(Cookies.get("userGUID"));
            if (Cookies.get("userGUID") != null) {
                Cookies.remove("userGUID");
                window.location.href = 'http://127.0.0.1:5500/reglog.html';
            }
        })

        $(".notifications-butt").on("click", function (e) {
            getQuerryTemplate("NotificationContainer", {}).then(container => {
                $("#not-cont").html("");
                $("#not-cont").append(container);

                getQuerryTemplate("Notifications", {}).then(notification => {
                    $(".notifications-container-inner").html("");
                    $(".notifications-container-inner").append(notification);
                })
            })
        })    
    })

    notificationsAjax().then(notifications => {
        notifications.forEach(notification => {

    });
})


function notificationsAjax() {
    return new Promise((resolve, reject) => {
        var notification = [];
        let counter = 0;
        notificationsBoardAjax().then(notificationsBoard => {
            notification.push(notificationsBoard);
            counter += 1;
        });
        notificationsFriendAjax().then(notificationsFriends => {
            notification.push(notificationsFriends);
            counter += 1;
        });
        
        var ajInterval = setInterval(function() {
            if(counter == 2) {
                resolve(notification);
                clearInterval(ajInterval);          
            } 
        }, 500)
    });
}

function notificationsFriendAjax() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: `${endpoint}${friendsEndpoint}requests/user=${Cookies.get("userGUID")}`, 
            contentType: "application/json",
            // data: JSON.stringify(newTag),
            success: function (response) {
                Object.keys(response).forEach(item => {
                    item.type = "friend"
                })
                resolve(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    });
}

function notificationsBoardAjax() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: `${endpoint}${notificationsEndpoint}user=${Cookies.get("userGUID")}`, 
            contentType: "application/json",
            // data: JSON.stringify(newTag),
            success: function (response) {
                Object.keys(response).forEach(item => {
                    item.type = "board"
                })
                resolve(response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    });
}

// function notificationsRender(notifications) {
    
// }