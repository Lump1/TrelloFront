var endpoint = "https://localhost:7193/";
var cardsEndpoint = "api/cards/";
var statusEndpoint = "api/statuses/";



$(document).ready(function () {
    var colums;

    $.ajax({
        type: "GET",
        url: endpoint + statusEndpoint,
        dataType: "json",
        async: false,
        success: function (response) {
            colums = response;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ": " + errorThrown);
        }
    });

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
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // В случае ошибки вы можете вывести сообщение об ошибке
            console.error(`Ошибка при получении данных о карточках: ${textStatus} - ${errorThrown}`);
        }
    });
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



    // function createColumnsWithData(cardData) {
    //     var columns = {};

    //     cardData.forEach(function (card) {
    //         // Если столбец для данной категории еще не создан, создаем его
    //         if (!columns[card.category]) {
    //             columns[card.category] = $(columnPattern);
    //             columns[card.category].find('.main-card-p').text(card.category);
    //         }

    //         var columnElement = columns[card.category];

    //         var cardElement = $("<div>").addClass("main-card rounded-2");
    //         cardElement.append($("<div>").addClass("card-header-man").append($("<p>").addClass("card-tag card-sm-text").text(card.label)));
    //         cardElement.append($("<div>").addClass("card-main").append($("<p>").addClass("card-main-text card-text").text(card.title)));
    //         cardElement.append($("<div>").addClass("card-footer-man").append($("<div>").addClass("d-inline-flex").append($("<img>").addClass("card-sm-img clock-img").attr("src", "assets/free-icon-clock-2088617.png"), $("<p>").addClass("card-text card-sm-text text-footer sm-mar-l").text(card.startDate))));

    //         columnElement.find(".main-card-container").append(cardElement);
    //     });

    //     // Возвращаем массив столбцов
    //     return Object.values(columns);
    // }

    // // Запрос AJAX для получения данных о карточках
    // $.ajax({
    //     type: "GET",
    //     url: `${endpoint}${cardsEndpoint}`,
    //     dataType: "json",
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     success: function (response) {
    //         // После успешного получения данных о карточках
    //         console.log(response);
    //         // Создаем столбцы с данными о карточках и добавляем на страницу
    //         var columns = createColumnsWithData(response);
    //         columns.forEach(function(column) {
    //             $("article.main-cards-container").append(column);
    //         });
    //     },
    //     error: function (jqXHR, textStatus, errorThrown) {
    //         // В случае ошибки вы можете вывести сообщение об ошибке
    //         console.error(`Ошибка при получении данных о карточках: ${textStatus} - ${errorThrown}`);
    //     }
    // });






    // $.ajax({
    //     type: "GET",
    //     url: endpoint + cardsEndpoint,
    //     dataType: "jsonp",
    //     async: false,
    //     success: function(response){
    //         alert('hi');
    //     },
    //     error: function(jqXHR, textStatus, errorThrown) {
    //         alert('Request failed: ' + textStatus + ' - ' + errorThrown);
    //     }
    // });
    // $.ajax ({
    //     type: "GET",
    //     url: endpoint + cardsEndpoint,
    //     dataType: "jsonp",
    //     async: false,
    //   }).done(function(data) {
    //     outputJSON = JSON.stringify(data);
    //     console.log(outputJSON);
    //     output = JSON.parse(outputJSON);
    //     console.log(output.Result);
    //   }).fail(function(data, err) {
    //     alert("fail " + JSON.stringify(err));
    //   });


    // $("#buttonColumnCreate").click(function() {
    //     var title = $("#titleColumnCreate").val();

    //     $.post(endpoint + statusEndpoint,
    //     {
    //         Name: title,
    //     },
    //     function(data,status){
    //         alert("Data: " + data + "\nStatus: " + status);
    //     });
    // });

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



