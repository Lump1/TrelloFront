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

$(document).ready(function() {
    var colums;

    $.ajax({
        type: "GET",
        url: endpoint + statusEndpoint,
        dataType: "json",
        async: false,
        success: function(response){
            colums = JSON.parse(response.response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus + ": " + errorThrown);
        }
    });
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



    // 
    $("#buttonColumnCreate").on("click", function() {
        $.ajax({
            type: "POST",
            url: endpoint + statusEndpoint,
            data: {name: document.getElementById('titleColumnCreate').value.toString()},
            success: (function(data, status) {
                console.log(status + "|" + data);
            }),
            dataType: "jsonp",
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
                    , IdStatus: $("#idcolCardCreate").val() + 1
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
                console.log(status + "|" + data);
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



