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
