var endpoint = "https://localhost:8080/";
var cardsEndpoint = "api/cards/";


$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: endpoint + cardsEndpoint + "GetAllCards/",
        dataType: "jsonp",
        async: false,
        success: function(response){
            alert('hi');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Request failed: ' + textStatus + ' - ' + errorThrown);
        }
    });
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


    // Инициализация Dragula для всех контейнеров с классом helping-container
    var drake = dragula($('.helping-container').toArray(), {
        invalid: function(el, handle) {
            return el.classList.contains('card-plus-but');
        }
    });

    // Обработчик события, который вызывается при перемещении объекта
    drake.on('drop', function(el, target, source, sibling) {
        // el - перемещаемый элемент (div с классом main-card)
        // target - элемент, в который перемещен объект (div с классом helping-container)
        // source - исходный элемент, из которого перемещен объект (div с классом helping-container)
        // sibling - соседний элемент, перед которым был перемещен объект (div с классом main-card)

        // Здесь можно добавить дополнительную логику после перемещения объекта
        console.log('Карточка перемещена!');
    });

});



