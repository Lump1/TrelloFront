function generateRandomNumber(max = 500) {
  var multiplyer = Math.random() > 0.5 ? 1 : -1;

  return Math.floor(Math.random() * max) * multiplyer;
}

function getNumberCss(cssStyleName, $object) {
  return parseInt($object.css(cssStyleName).slice(0, $object.css(cssStyleName).indexOf("p")));
}

function generateSquares() {
  for(let i = 0; i < 4; i++) {
    setTimeout(() => {
      generateSquare();
    }, Math.floor(Math.random() * 10).toString());
  }
}

function generateSquare() {
  var $object = $( ".pre_page_window_img_container" ).data( "arr", [ 1 ] );
  var top = getNumberCss("top", $object);
  var left = getNumberCss("left", $object);
  var width = getNumberCss("width", $object);
  var height = getNumberCss("height", $object);

  var sizeMult = Math.random() * (0.8 - 0.2) + 0.2;
  
  $object = $object.clone(true)
  .css("top", top + generateRandomNumber())
  .css("left", left + generateRandomNumber())
  .css("width", width - (width * sizeMult))
  .css("height", height - (height * sizeMult))
  .css("background-color", `rgba(29, 29, 29, ${Math.random() * 0.3})`);

  $object.removeClass("pre_page_window_img_container_main");
  $object.appendTo("#squaresCont");
}

$(document).ready(function(){

  generateSquares();



  $(".pre_page_window_button_login").click(function(){
    window.location.href='http://127.0.0.1:5500/reglog.html'
  });
});

