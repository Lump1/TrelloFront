var endpoint = "https://localhost:7193/";
$(document).ready(function () {
  $("#go-back-js").click(function () {
    window.location.href = 'http://127.0.0.1:5500/home_page_layout.html'
  });
});

$(document).ready(function () {
  $('#password-fields').hide();
  $('.change-password-setting').click(function () {
    $('#password-fields').toggle();
  });
});

$(document).ready(function () {
  function getQueryParam(param) {
      var urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
  }

  var userGUID = getQueryParam('userGUID');
  if (userGUID != null) {
      $.ajax({
          type: "GET",
          url: `${endpoint}api/users/guid=${userGUID}`,
          dataType: "json",
          success: function (response) {
              updateUserInfo(response);
          },
          error: function (jqXHR, textStatus, errorThrown) {
              console.error(`Error: ${textStatus} - ${errorThrown}`);
          }
      });
  } else {
      console.log("userGUID is not available in URL");
  }

  function updateUserInfo(user) {
      if (user) {
          $('.username').text(user.userName);
          $('.email').text(user.email);
      } else {
          console.error("User data is not available");
      }
  }
});



