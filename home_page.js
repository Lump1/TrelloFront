
var endpoint = "https://localhost:7193/";
var boardsEndpoint = "api/boards/";
var usersBoardEndpoint = "api/users/boards/";
var usersEndpoint = "api/users/"
var teamuserEndpoint = "api/team-user/";


function boardCardRender(board, target="AllBoards"){
  getQuerryTemplate("Board", { name: board.name, id: board.id}).then(
    (resultHTML) => {
      $("#" + target + ".sidenav-cards-container").append(resultHTML);
      stickerRender(board.id);

      clickReload();
    }
  );
}

function generateSticker() {
  return Math.floor(Math.random() * (650 - 600) + 600);
}

function stickerRender(boardid){
  var char = Cookies.get("BoardSticker_" + boardid);
  var sticker;
  if(char == null) {
    char = "0x1F" + generateSticker();
    Cookies.set("BoardSticker_" + boardid, char);

    sticker = String.fromCodePoint(char);
  }
  else {
    sticker = String.fromCodePoint(char);
  }
  console.log($("#" + boardid + ".sidenav-sticker"));

  $("#" + boardid + ".sidenav-sticker").append('<span class="sidenav-sticker-span">' + sticker + '</span>');
}

function clickReload() {
  $(".sidenav-cards").click(function(){
    var recentArray = JSON.parse(Cookies.get("recent"));
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

    Cookies.set("recent", JSON.stringify(recentArray));

    window.location.href ='http://127.0.0.1:5500/index.html?boardid=' + identifier;
  });
}

function createTeamAjax() {
  var usersArray = [];
  usersArray.push(Cookies.get("userGUID"));

  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: `${endpoint}${teamendpoint}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {name: boardname, teamUsers: usersArray},

      success: function(data) {
        var teamid = data.id
        resolve(teamid);
      }
    })
  });
}

function addUserAjax(teamid, userid) {
  $.ajax({
    type: "POST",
    url: `${endpoint}${teamuserEndpoint}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {idTeam: teamid, idUser: userid},

    success: function(data) {
      console.log(data);
    }
  })
}

function createBoard(teamid) {
  $.ajax({
    type: "POST",
    url: `${endpoint}${boardendpoint}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {name: boardname, idTeam: teamid}
  })
}

function getUser(username) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: `${endpoint}${usersEndpoint}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {username: username},

      success: function(data) {
        resolve(data.id);
      }
    })
  });
}

$(document).ready(function(){
  $.ajax({
    type: "GET",
    url: `${endpoint}${usersBoardEndpoint}${Cookies.get("userGUID")}`,
    dataType: "json",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // data: {"userGuid": Cookies.get("userGUID")},
    success: function (response) {
      console.log(response);

      var recentArray = Cookies.get("recent") != null ? JSON.parse(Cookies.get("recent")) : [];
      var favArray = Cookies.get("favorite") != null ? JSON.parse(Cookies.get("favorite")) : [];

      Object.keys(response).forEach((item) => {
        boardCardRender(response[item]);

        if(recentArray != null && recentArray.includes(response[item].id)){
          boardCardRender(response[item], "Recent");
        }

        if(favArray != null && favArray.includes(response[item].id)){
          boardCardRender(response[item], "Favorite");
        }

        
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error(
        `Ошибка при получении данных: ${textStatus} - ${errorThrown}`
      );
    },
  });

  $("#search_user_button").on("mouseup", function() {
    $("#search_user_input")
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
  $(".sidenav-button-home-page").click(function(){
    window.location.href='http://127.0.0.1:5500/index.html' //пока что для проверки
  });
});