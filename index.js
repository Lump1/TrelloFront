var endpoint = "https://localhost:7193/";
var cardsEndpoint = "api/cards/";
var statusEndpoint = "api/statuses/";
var boardsEndpoint = "api/boards/";

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

function getUrlParameter(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
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

// function addCards() {
//     $.ajax({
//         type: "GET",
//         url: `${endpoint}${cardsEndpoint}`,
//         dataType: "json",
//         success: function (response) {
//             response.forEach((item) => {
//                 cardRender(item);
//             });

//             dragulaReload();
//         },
//         error: function (jqXHR, textStatus, errorThrown) {
//             console.error(`Error: ${textStatus} - ${errorThrown}`);
//         },
//     });
// }

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
    }).catch(function (error) {
        console.log(error);
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
        // Загружаем теги, соответствующие карте
        $.ajax({
            type: "GET",
            url: `${endpoint}api/cards/${data.id}/tags`,
            dataType: "json",
            success: function (response) {
                var tags = response.map(tag => tag.name).join(', '); // Преобразуем массив названий тегов в строку
                // Заменяем PLACEHOLDERtag на полученные теги в HTML-шаблоне карточки
                resultHTML = resultHTML.replace("PLACEHOLDERtag", tags);
                $("#" + data.idStatus + ".helping-container").prepend(resultHTML);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            },
        });
    });
}

$(document).ready(function () {
    // columnRender({name: "Upcomming", id: 1});
    // columnRender({name: "In Progress", id: 2});
    // columnRender({name: "Done", id: 3});

    // cardRender({title: "Card title 1", label: "", deadline: "03-03-2024", cardid: 1, columnid: 1})
    // cardRender({title: "Card title 2", label: "", deadline: "03-03-2024", cardid: 2, columnid: 2})
    // cardRender({title: "Card title 3", label: "", deadline: "03-03-2024", cardid: 3, columnid: 1})

    $.ajax({
        type: "GET",
        url: `${endpoint}${boardsEndpoint}${getUrlParameter("boardid")}`,
        dataType: "json",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        success: function (response) {
            console.log(response);

            Object.keys(response.statusColumns).forEach((item) => {
                columnRender(response.statusColumns[item]);
            });

            Object.keys(response.cards).forEach((item) => {
                cardRender(response.cards[item]);
            });

            loadTags(response.tags)

            dragulaReload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(
                `Ошибка при получении данных о карточках: ${textStatus} - ${errorThrown}`
            );
        },
    });

    // $.ajax({
    //     type: "GET",
    //     url: `${endpoint}${statusEndpoint}`,
    //     dataType: "json",
    //     headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json",
    //     },
    //     success: function (response) {
    //         console.log(response);
    //         Object.keys(response).forEach((item) => {
    //             columnRender(response[item]);
    //         });

    //         addCards();
    //         dragulaReload();
    //     },
    //     error: function (jqXHR, textStatus, errorThrown) {
    //         console.error(
    //             `Ошибка при получении данных о карточках: ${textStatus} - ${errorThrown}`
    //         );
    //     },
    // });

    $("#buttonColumnCreate").on("click", function () {
        $.ajax({
            type: "POST",
            url: endpoint + statusEndpoint,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            data: JSON.stringify({
                name: document.getElementById("titleColumnCreate").value.toString(), idBoard: getUrlParameter("boardid")
            }),
            success: function (data, status) {
                console.log(data);
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
            idBoard: getUrlParameter("boardid")
        };

        var tagId = $("#tagSelect").val();

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
            success: function (cardData, status) {
                console.log(cardData);
                cardRender(cardData);
                dragulaReload();

                if (tagId) {
                    addTagToCard(cardData.id, tagId); // Добавляем тег к карте
                }
            },
            error: function (jqXHR, textStatus) {
                console.warn(textStatus + "|" + jqXHR.responseText);
            },
            dataType: "json",
        });
    });
    
    $(".main-card").on("mouseup", function() {
        var sidePanelObj = $(".side-panel-card");

        if(sidePanelObj.css("right")[0] == "-") {
            sidePanelObj.animate({
                "right": "10px"
            }, 1500)
        }
        else {
            sidePanelObj.animate({
                "right": "-65%"
            }, 1500)
        }
    })

    $(document).mouseup(function (e) {
        var divs = $(".popup-window");
        if (divs == null) {
            return;
        }

        divs.hide();
    });

    function loadTags(tags) {
        tags.forEach(tag => tagSelect.append(new Option(tag.name, tag.id)))

        // $.ajax({
        //     type: "GET",
        //     url: `${endpoint}api/boards/${boardId}/tags`,
        //     dataType: "json",
        //     success: function (response) {
        //         var tagSelect = $('#tagSelect');
        //         tagSelect.empty();
        //         response.forEach(function (tag) {
        //             tagSelect.append(new Option(tag.name, tag.id));
        //         });
        //     },
        //     error: function (jqXHR, textStatus, errorThrown) {
        //         console.error(`Error: ${textStatus} - ${errorThrown}`);
        //     },
        // });
    }

    $(document).mouseup(function (e) {
        if (isPopupOpened &&
            (!$(e.target).hasClass("popup-window") &&
                $(e.target).closest(".popup-window").length == 0)) {
            console.log("Text;");
            isPopupOpened = false;
            $(".popup-window").toArray().forEach(element => {
                $(element).hide();
            })
        }

        if($(".side-panel-card").css("right")[0] != "-" 
            && $(e.target).closest(".side-panel-card").length == 0) {
            $(".side-panel-card").animate({
                "right": "-65%"
            }, 1500)
        }
    });

    

    // $(document).on('click', 'a[href="#create"]', function () {
    //     var boardId = getUrlParameter("boardid");
    //     if (boardId) {
    //         loadTags(boardId);
    //         console.log("Selected board ID: " + boardId);
    //     }
    // });

    function addTagToCard(cardId, tagId) {
        $.ajax({
            type: "POST",
            url: `${endpoint}api/card-tags`,
            data: JSON.stringify({ IdCard: cardId, IdTags: tagId }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            success: function (response) {
                console.log("Tag added to card:", response);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            },
            dataType: "json",
        });
    }

    dragulaReload();
});