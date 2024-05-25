var endpoint = "https://localhost:7193/";
var cardsEndpoint = "api/cards/";
var statusEndpoint = "api/statuses/";

var isPopupOpened = false;

function dateFormater(dateToFormat) {
    var day, month;
    day = dateToFormat.getDate();
    month = dateToFormat.getMonth();

    if (day < 10) {
        day = "0" + day;
    }

    if (month < 10) {
        month = `0${month}`;
    }

    return dateToFormat.getFullYear() + "-" + month + "-" + day;
}

function setStatId(id) {
    $("#idcolCardCreate").val(id);
}

function getDataFormat(date) {
    return new Date(date).toLocaleString("en", {
        month: "short",
        day: "numeric",
    });
}

function addCards() {
    $.ajax({
        type: "GET",
        url: `${endpoint}${cardsEndpoint}`,
        dataType: "json",
        success: function (response) {
            response.forEach((item) => {
                cardRender(item);
            });

            dragulaReload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(`Error: ${textStatus} - ${errorThrown}`);
        },
    });
}

function dragulaReload() {
    var drake = dragula($(".helping-container").toArray(), {
        invalid: function (el, handle) {
            return el.classList.contains("card-plus-but");
        },
    });

    drake.on("drop", function (el, target, source, sibling) {
        var cardid = $(el).data("card-id");
        var columnid = $(target).attr("id");
        var cardTitle = $(el).find('.card-main-text').text();

        console.log(cardid + " " + columnid);
        console.log($(target));
        $.ajax({
            type: "PUT",
            url: endpoint + cardsEndpoint,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            data: JSON.stringify({
                id: cardid,
                title: cardTitle,
                idStatus: columnid,
            }),
            success: function (data, status) {
                console.log(data);
            },
            error: function (jqXHR, textStatus) {
                console.warn(textStatus + "|" + jqXHR.responseText);
            },
            dataType: "json",
        });
    });
}

function columnSettingsRender(id) {
  var target = "#" + id + ".main-card-men";
  console.log(target);
  getQuerryTemplate("Popup", { id: id }).then((resultHTML) => {
    $("#content").append(resultHTML);

    $("#" + id + ".popup-window").hide();

    $(target).on("click", function (e) {
      isPopupOpened = true;
  
      $("#" + id + ".popup-window").show();
      $("#" + id + ".popup-window").css("left", e.pageX).css("top", e.pageY);
    });
  }).catch(function(erorr) {
    console.log(erorr);
  });
}

function columnRender(data) {
    getQuerryTemplate("Column", { name: data.name, id: data.id }).then(
        (resultHTML) => {
            $("article.main-cards-container").append(resultHTML);
        }
    );

    columnSettingsRender(data.id);
}

function cardRender(data) {
    getQuerryTemplate("Card", {
        title: data.title,
        label: data.label,
        deadline: getDataFormat(data.deadline),
        cardid: data.id,
        columnid: data.idStatus,
    }).then((resultHTML) => {
        $("#" + data.idStatus + ".helping-container").prepend(resultHTML);
    });
}

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: `${endpoint}${statusEndpoint}`,
        dataType: "json",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        success: function (response) {
            console.log(response);
            Object.keys(response).forEach((item) => {
                columnRender(response[item]);
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

    $("#buttonColumnCreate").on("click", function () {
        $.ajax({
            type: "POST",
            url: endpoint + statusEndpoint,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            data: JSON.stringify({
                name: document.getElementById("titleColumnCreate").value.toString(),
            }),
            success: function (data, status) {
                columnRender(data);
                dragulaReload();
            },
            error: function (jqXHR, textStatus) {
                console.warn(textStatus + "|" + jqXHR.responseText);
            },
            dataType: "json",
        });
    });

    $("#buttonCardCreate").on("click", function () {
        if ($("#titleCardCreate").val().length == 0) {
            console.warn("There is an error in data input!");
            return;
        }

        var data = {
            title: $("#titleCardCreate").val(),
            label: $("#textCardCreate").val(),
            startdate: dateFormater(new Date()),
            deadline: $("#dateCardCreate").val(),
            idStatus: $("#idcolCardCreate").val(),
            idTag: $("#tagSelect").val(), // Новое поле для тега, закомментировано
        };

        Object.keys(data).forEach(function (k) {
            if (data[k] == undefined) data[k] = null;
        });

        console.log(JSON.stringify(data));

        $.ajax({
            type: "POST",
            url: endpoint + cardsEndpoint,
            data: JSON.stringify(data),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            success: function (data, status) {
                console.log(data);
                console.log("#" + data.idStatus + ".helping-container");
                cardRender(data);
                dragulaReload();
            },
            error: function (jqXHR, textStatus) {
                console.warn(textStatus + "|" + jqXHR.responseText);
            },
            dataType: "json",
        });
    });

    $(document).mouseup(function (e) {
        var divs = $(".popup-window");
        if (divs == null) {
            return;
        }

        divs.hide();
    });
  });

  $(document).mouseup(function (e) {
    if(isPopupOpened && 
      (!$(e.target).hasClass("popup-window") &&
      $(e.target).closest(".popup-window").length == 0)) 
    {
      console.log("Text;")
      isPopupOpened = false;
      $(".popup-window").toArray().forEach(element => {
        $(element).hide();
      })
    }
  });

    
     function loadTags(boardId) {
         $.ajax({
             type: "GET",
             url: `${endpoint}api/boards/${boardId}/tags`,
             dataType: "json",
             success: function (response) {
                 var tagSelect = $('#tagSelect');
                 tagSelect.empty();
                 response.forEach(function (tag) {
                     tagSelect.append(new Option(tag.name, tag.id));
                 });
             },
             error: function (jqXHR, textStatus, errorThrown) {
                 console.error(`Error: ${textStatus} - ${errorThrown}`);
             },
         });
     }

    
     $(document).on('click', 'a[href="#create"]', function() {
         var boardId = 2;
         if (boardId) {
             loadTags(boardId);
             console.log("aaaaaaaaaaaa " + boardId)

        }
    });
});
