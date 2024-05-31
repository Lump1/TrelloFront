var endpoint = "https://localhost:7193/";
var cardsEndpoint = "api/cards/";
var statusEndpoint = "api/statuses/";




function dateFormater(dateToFormat) {
    var day, month;
    day = dateToFormat.getDate();
    month = dateToFormat.getMonth();

    if (day < 10) {
        day = '0' + day;
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
        month: 'short',
        day: 'numeric'
    });
}

function addCards() {
    $.ajax({
        type: "GET",
        url: `${endpoint}${cardsEndpoint}`,
        dataType: "json",
        success: function (response) {
            response.forEach(item => {
                getQuerryTemplate("Card", { title: item.title, label: item.label, deadline: getDataFormat(item.deadline) }).then(resultHTML => {
                    $("#" + item.idStatus + ".helping-container").prepend(resultHTML);
                });
            });

            dragulaReload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(`Error: ${textStatus} - ${errorThrown}`);
        }
    });
}

function dragulaReload() {
    var drake = dragula($('.helping-container').toArray(), {
        invalid: function (el, handle) {
            return el.classList.contains('card-plus-but');
        }
    });

    drake.on('drop', function (el, target, source, sibling) {
        // el - перемещаемый элемент (div с классом main-card)
        // target - элемент, в который перемещен объект (div с классом helping-container)
        // source - исходный элемент, из которого перемещен объект (div с классом helping-container)
        // sibling - соседний элемент, перед которым был перемещен объект (div с классом main-card)

        // Здесь можно добавить дополнительную логику после перемещения объекта
        console.log('Карточка перемещена!');
    });
}

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: `${endpoint}${statusEndpoint}`,
        dataType: "json",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function (response) {
            console.log(response);
            Object.keys(response).forEach(item => {
                getQuerryTemplate("Column", { name: response[item].name, id: response[item].id }).then(resultHTML => {
                    $("article.main-cards-container").append(resultHTML);
                });
            })

            addCards();

            dragulaReload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(`Ошибка при получении данных о карточках: ${textStatus} - ${errorThrown}`);
        }
    });




    // 
    $("#buttonColumnCreate").on("click", function () {
        $.ajax({
            type: "POST",
            url: endpoint + statusEndpoint,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ name: document.getElementById('titleColumnCreate').value.toString() }),
            success: (function (data, status) {
                getQuerryTemplate("Column", { name: data.name, id: data.id }).then(resultHTML => {
                    $("article.main-cards-container").append(resultHTML);
                });

                dragulaReload();
            }),
            error: (function (jqXHR, textStatus) {
                console.warn(textStatus + "|" + jqXHR.responseText);
            }),
            dataType: "json",
        });
    });

    $("#buttonCardCreate").on("click", function () {
        if ($("#titleCardCreate").val().length == 0) {
            console.warn("There is an error in data input!");
        }

        var data = {
            title: $("#titleCardCreate").val()
            , label: $("#textCardCreate").val()
            , startdate: dateFormater(new Date())
            , deadline: $("#dateCardCreate").val()
            , IdStatus: $("#idcolCardCreate").val()
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
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: (function (data, status) {
                console.log(data);
                console.log("#" + data.idStatus + ".helping-container");
                getQuerryTemplate("Card", { title: data.title, label: data.label, deadline: getDataFormat(data.deadline) }).then(resultHTML => {
                    $("#" + data.idStatus + ".helping-container").prepend(resultHTML);
                });

                dragulaReload();
            }),
            error: (function (jqXHR, textStatus) {
                console.warn(textStatus + "|" + jqXHR.responseText);
            }),
            dataType: "json",
        });
    });

    



});




