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
})