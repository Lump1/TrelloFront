
var endpoint = "https://localhost:7193/";
var boardsEndpoint = "api/boards/";
var usersBoardEndpoint = "api/users/boards/";
var usersEndpoint = "api/users/";
var teamEndpoint = "api/teams/";
var teamuserEndpoint = "api/team-user/";



function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomIntInc(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateName() {
  var subWords = ["Super", "Hyper", "Cool", "Justice", "Strong", "Loonar", "Sunny"]
  var words = ["wo", "de", "mu", "re", "ba", "fo", "hu", "ki", "we", "by", "pu", "le", "lo", "fa", "da"];
  var tempText;
  tempText = "";

  for(let i = 0; i < getRandomIntInc(3, 4); i++) {
    console.log(i);
    tempText += words[getRandomInt(words.length)];
  }

  console.log(getRandomInt(subWords.length));
  return subWords[getRandomInt  (subWords.length)] + " " + tempText;
}

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
  $("#" + boardid + ".sidenav-sticker").html(" ");
  $("#" + boardid + ".sidenav-sticker").append('<span class="sidenav-sticker-span">' + sticker + '</span>');
}

function clickReload() {
  $(".sidenav-card").on("click", function(){
    var recentArray = Cookies.get("recent") != undefined ? JSON.parse(Cookies.get("recent")) : null;
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
  console.log(`${endpoint}${teamEndpoint}user=${Cookies.get("userGUID")}`);
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: `${endpoint}${teamEndpoint}user=${JSON.parse(Cookies.get("userGUID"))}`,
      dataType: "json",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({name: "teamname"}),

      success: function(data) {
        var teamid = data.id;
        resolve(teamid);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX error:", textStatus, errorThrown);
        console.log("Response:", jqXHR.responseText);
      },
    })
  });
}

function pushUsersAjax(teamid) {
  var usersArray = $(".team-list-item-content").toArray().map(item => {
    return item.id;
  });

  // usersArray.push(Cookies.get("userGUID").id);

  usersArray.forEach(userid => {
    console.log(userid)
    $.ajax({
      type: "POST",
      url: `${endpoint}${teamuserEndpoint}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: JSON.stringify({teamId: teamid, userGuid: userid}),

        success: function(data) {
          console.log(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log("AJAX error:", textStatus, errorThrown);
          console.log("Response:", jqXHR.responseText);
        },
    });
  });
}

// function addUserToTeam(username, teamid) {
//   new Promise((resolve, reject) => {
//     $.ajax({
//       type: "POST",
//       url: `${endpoint}${teamEndpoint}`,
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         data: {idTeam: teamid, idUser: },

//         success: function(data) {
//           var teamid = data.id;
//         }
//     });
//   });
// }

function addUserAjax(teamid, userid) {
  console.log(`${endpoint}${teamuserEndpoint}add/team=${teamid}&user=${userid}`);
  $.ajax({
    type: "POST",
    url: `${endpoint}${teamuserEndpoint}add/team=${teamid}&user=${userid}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // data: {idTeam: teamid, idUser: userid},

    success: function(data) {
      console.log(data);
    }
  })
}

function createBoard(teamid) {
  $.ajax({
    type: "POST",
    url: `${endpoint}${boardsEndpoint}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({name: generateName(), idTeam: teamid}),
    success: function(board) {
      console.log(board);
      boardCardRender(board);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("AJAX error:", textStatus, errorThrown);
      console.log("Response:", jqXHR.responseText);
    },
  })
}

function getUser(username, guid = null) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: guid == null ? `${endpoint}${usersEndpoint}search/${username}` : `${endpoint}${usersEndpoint}guid=${guid}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // data: guid == null ? {} : {guid: guid},

      success: function(data) {
        var user = data;
        // console.log("guid");
        // console.log(data);
        resolve(user);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(
          `Ошибка при получении данных: ${textStatus} - ${errorThrown}`
        );
      },
    })
  });
}

function userSelectReload() {
  console.log($(".team-list-item-content"));
  $(".team-list-item-content").off("click").on("click", function(e) {
    console.log($(e.target).closest(".team-list-item-content").attr("id"));
    getUser("", $(e.target).closest(".team-list-item-content").attr("id")).then(user => {
      // console.log("user: ")
      // console.log(user);
      getQuerryTemplate("Teamusercard", {id: user.guid, username: user.userName}).then((resultHTML) => {
        $(".team-list-item").append(resultHTML);

        $(".users-select").hide();
      }) 
    })
  })
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

      var recentArray = Cookies.get("recent") != undefined ? JSON.parse(Cookies.get("recent")) : [];
      var favArray = Cookies.get("favorite") != undefined ? JSON.parse(Cookies.get("favorite")) : [];

      console.log(recentArray);

      Object.keys(response).forEach((item) => {
        boardCardRender(response[item]);
        
        if(recentArray.includes(response[item].id.toString())){
          boardCardRender(response[item], "Recent");
        }

        if(favArray.includes(response[item].id.toString())){
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

  // $("#search_user_button").on("mouseup", function() {
  //   getUser($("#search_user_input").val()).then((user) => {
  //     Object.keys(user).forEach(key => {
  //       var tempUser = user[key];

  //       getQuerryTemplate("Teamusercard", {id: tempUser.id, username: tempUser.username}).then((resultHTML) =>{
  //         $(".team-list-item").append(resultHTML);
  //       })   
  //     })
  //   })
  // });

  $("#searchButton").on("click", function() {
    $(".users-select").show();
    $(".users-select").html("");

    getUser($("#search_user_input").val()).then((user) => {
      Object.keys(user).forEach(key => {
        var tempUser = user[key];

        getQuerryTemplate("Teamusercard", {id: tempUser.guid, username: tempUser.userName}).then((resultHTML) =>{
          $(".users-select").append(resultHTML);
          $(".users-select").append("<hr />");
          userSelectReload();
        })       
      })
    })
  })
  

  $("#boardCreationWithoutTemplate").on("mouseup", function() {
    createTeamAjax().then((teamid) => {
      pushUsersAjax(teamid);
      createBoard(teamid);
    })
  })

  $(".account-button").on("mouseup", function(e) {
    if($(".user-settings-container").css("display") == "none") {
      $(".user-settings-container").show();
    }
  })

  $(".logout-butt").on("click", function () {
    console.log(Cookies.get("userGUID"));
    if (Cookies.get("userGUID") != null) {
        Cookies.remove("userGUID");
        window.location.href = 'http://127.0.0.1:5500/reglog.html';
    }
})

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

  $(document).on("click", function(e) {
    if($(".user-settings-container").css("display") != "none" && 
    (!$(e.target).hasClass(".user-settings-container") &&
    $(e.target).closest(".account-button").length == 0)) {
      $(".user-settings-container").hide();
    }
  })

  $(".sidenav-button-home-page").click(function(){
    window.location.href='http://127.0.0.1:5500/index.html' //пока что для проверки
  });
});

// BUTTON SETTINGS ROOTING

$(document).ready(function () {
  $("#settings-button-js").click(function () {
    window.location.href = 'http://127.0.0.1:5500/profile-settings/profile_settings.html?#public-profile'
  });
});