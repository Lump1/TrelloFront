var endpoint = "https://localhost:8080/";
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
    console.log(id);
    $("#idcolCardCreate").val(id);
    console.log($("#idcolCardCreate").val());
}

function addCards(){
    $.ajax({
        type: "GET",
        url: `${endpoint}${cardsEndpoint}`,
        dataType: "json",
        success: function (response) {
            console.log(response);
            response.forEach(item => {
                console.log(item.idStatus);
                $("#"+item.idStatus+".helping-container").prepend(createCardWithData(item.title, item.label, item.title, item.deadline));
            });
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(`Error: ${textStatus} - ${errorThrown}`);
        }
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
                console.log(response[item]);
                $("article.main-cards-container").append(createColumnWithData(response[item].name, response[item].id));
            })

            addCards();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(`Ошибка при получении данных о карточках: ${textStatus} - ${errorThrown}`);
        }
    });




    // 
    $("#buttonColumnCreate").on("click", function() {
        $.ajax({
            type: "POST",
            url: endpoint + statusEndpoint,
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            data: JSON.stringify({name: document.getElementById('titleColumnCreate').value.toString()}),
            success: (function(data, status) {
                console.log(data);
                $("article.main-cards-container").append(createColumnWithData(data.name, data.id));
            }),
            error: (function(jqXHR, textStatus) {
                console.warn(textStatus + "|" + jqXHR.responseText);
            }),
            dataType: "json",
        });
    });
    
    $("#buttonCardCreate").on("click", function() {
        if($("#titleCardCreate").val().length == 0) {
            console.warn("There is an error in data input!");
        }

        var data = {title: $("#titleCardCreate").val()
                    , label: $("#textCardCreate").val()
                    , startdate: dateFormater(new Date())
                    , deadline: $("#dateCardCreate").val()
                    , IdStatus: $("#idcolCardCreate").val()
                };

        
        Object.keys(data).forEach(function(k){
            if(data[k] == undefined) data[k] = null;
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
            success: (function(data, status) {
                console.log(data);
                console.log("#" + data.idStatus + ".helping-container");
                $("#" + data.idStatus + ".helping-container").prepend(createCardWithData(data.title, data.label, data.title, data.deadline));
            }),
            error: (function(jqXHR, textStatus) {
                console.warn(textStatus + "|" + jqXHR.responseText);
            }),
            dataType: "json",
        });
    });


    // 
    
    // Инициализация Dragula для всех контейнеров с классом helping-container
    var drake = dragula($('.helping-container').toArray(), {
        invalid: function (el, handle) {
            return el.classList.contains('card-plus-but');
        }
    });

    // Обработчик события, который вызывается при перемещении объекта
    drake.on('drop', function (el, target, source, sibling) {
        // el - перемещаемый элемент (div с классом main-card)
        // target - элемент, в который перемещен объект (div с классом helping-container)
        // source - исходный элемент, из которого перемещен объект (div с классом helping-container)
        // sibling - соседний элемент, перед которым был перемещен объект (div с классом main-card)

        // Здесь можно добавить дополнительную логику после перемещения объекта
        console.log('Карточка перемещена!');
    });

});



