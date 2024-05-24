const jscookies = require('js-cookie');

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
function boardCardRender(board, target="AllBoards"){
  getQuerryTemplate("Boardcard", { name: board.name, id: board.id}).then(
    (resultHTML) => {
      $("#" + target + ".sidenav-fight").append(resultHTML);
    }
  );
}

$(document).ready(function(){
  $.ajax({
    type: "GET",
    url: `${endpoint}${boardsEndpoint}`,
    dataType: "json",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {"guid": userGUID},
    success: function (response) {
      var recentArray = JSON.parse(jscookies.Cookies.get("recent"));

      Object.keys(response).forEach((item) => {
        boardCardRender(response[item]);
        if(recentArray != null && recentArray.includes(response[item].id)){
          boardCardRender(response[item], "Recent");
        }
      });

      addCards();

      dragulaReload();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error(
        `Ошибка при получении данных о карточках: ${textStatus} - ${errorThrown}`
      );
    },
  });

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

  $(".sidenav-cards").click(function(){
    var recentArray = JSON.parse(jscookies.Cookies.get("recent"));
    var identifier = $(this).attr("id");

    if(recentArray != null) {
      if(recentArray.includes(identifier)) {
        let index = recentArray.indexOf(identifier);
        recentArray.splice(index, index);
      }

      recentArray.unshift(identifier);

      if(recentArray.length > 6)
        recentArray.pop();
    }
    else {
      recentArray = [];
      recentArray.push(identifier);
    }

    jscookies.Cookies.set("recent", JSON.stringify(recentArray));

    window.location.href ='http://127.0.0.1:5500/index.html'
  });



  $(".sidenav-button-home-page").click(function(){
    window.location.href='http://127.0.0.1:5500/index.html' //пока что для проверки
  });
});