// document.addEventListener("click", function(e) {
//   let t = document.getElementById('sidenav-button-temlates-menu-js');
//   if (e.target.id != 'sidenav-button-temlates-js' && e.target.id != 'sidenav-button-temlates-menu-js') {
//     t.style.display = 'none';
//   } else if (e.target.id == 'sidenav-button-temlates-js') {
//     t.style.display = (t.style.display != 'block') ? 'block' : 'none';
//   }
// });
// document.addEventListener("click", function(e) {
//   let w = document.getElementById('sidenav-button-bIerps-js');
//   if (e.target.id != 'sidenav-button-Ws-js' && e.target.id != 'sidenav-button-bIerps-js') {
//     w.style.display = 'none';
//   } else if (e.target.id == 'sidenav-button-Ws-js') {
//     w.style.display = (w.style.display != 'block') ? 'block' : 'none';
//   }
// });

// $(document).ready(function(){
//   $("#sidenav-button-temlates-js").click(function(){
//     $("#sidenav-button-temlates-menu-js").slideDown("slow");
//   });

//   $("#sidenav-button-Ws-js").click(function(){
//     $("#sidenav-button-bIerps-js").slideDown("slow");
//   });


//   $(".sidenav-cards-top").click(function(){
//     console.log('test')
//      window.location.href ='http://127.0.0.1:5500/index.html'
//   });

//   $(".sidenav-cards-bottom").click(function(){
//     console.log('test')
//      window.location.href ='http://127.0.0.1:5500/index.html'
//   });

//   $(".sidenav-button-home-page").click(function(){
//     window.location.href='http://127.0.0.1:5500/index.html' //пока что для проверки
//   });
// });


$(document).ready(function(){
  $(document).on("click", function(e) {
    var t = $('#sidenav-button-temlates-menu-js');
    if (e.target.id === 'sidenav-button-temlates-js' || e.target.id === 'sidenav-button-temlates-menu-js') {
      t.slideToggle("slow");
    } else {
      t.slideUp("slow");
    }
  });
  

  $(document).on("click", function(e) {
    var w = $('#sidenav-button-bIerps-js');
    if (e.target.id === 'sidenav-button-Ws-js' || e.target.id === 'sidenav-button-bIerps-js') {
      w.slideToggle("slow");
    } else {
      w.slideUp("slow");
    }
  });

  $(".sidenav-cards-top").click(function(){
    console.log('test')
     window.location.href ='http://127.0.0.1:5500/index.html'
  });

  $(".sidenav-cards-bottom").click(function(){
    console.log('test')
     window.location.href ='http://127.0.0.1:5500/index.html'
  });

  $(".sidenav-button-home-page").click(function(){
    window.location.href='http://127.0.0.1:5500/index.html' //пока что для проверки
  });
});