var endpoint = "https://localhost:7193/";
var cardsEndpoint = "api/cards/";
var statusEndpoint = "api/statuses/";
var boardsEndpoint = "api/boards/";
var tasksEndpoint = "api/tasks/";

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

function getTask(taskId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: `${endpoint}${tasksEndpoint}${taskId}`,
            success: function (response) {
                var responseTask = response;
                resolve(responseTask);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // reject(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    })

}

function getTasks(cardId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: `${endpoint}${cardsEndpoint}${cardId}/tasks`,
            success: function (response) {
                var responseTasks = response;
                resolve(responseTasks);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // reject(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    })

}

function toggleTaskCompletion(taskid) {

    $.ajax({
        type: "GET",
        url: `${endpoint}${tasksEndpoint}${taskid}/change-complete-status`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        contentType: "json",
        success: function (response) {
            console.log(response);
            getTask(taskid).then(task => {
                getTasks(task.idCard).then(responseTasks => {
                    updateProgress(responseTasks);
                })
            })
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(`Error: ${textStatus} - ${errorThrown}`);
        }
    });


}

function updateProgress(tasks) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.iscompleted).length;
    const progressPercentage = Math.floor((totalTasks === 0) ? 0 : (completedTasks / totalTasks) * 100);

    $('.side-card-progress-bar-fill').stop().animate({
        width: `${progressPercentage}%`
    }, {
        duration: 500,
        easing: 'swing'
    });
    $('.side-card-progress-bar-fill').html(progressPercentage + "%");
}

function checkboxesReload(tasks) {
    $("input:checkbox").change(function (e) {
        e.stopImmediatePropagation()
        console.log(e.target);
        var identifier = $(e.target).attr("id").slice(0, 4) == "task" ? $(e.target).attr("id").slice(5) : undefined;
        if (identifier == undefined) return;

        toggleTaskCompletion(identifier);
        getTask(identifier).then(task => {
            getTasks(task.idCard).then(responseTasks => {
                updateProgress(responseTasks);
            })
        })

    })
}

function clickReload() {
    $(".main-card").on("mouseup", function () {
        var sidePanelObj = $(".side-panel-card");

        if (sidePanelObj.css("right")[0] == "-") {
            sidePanelObj.animate({
                "right": "10px"
            }, 850)
        }
        else {
            sidePanelObj.animate({
                "right": "-65%"
            }, 850)
        }
    })
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

        // $(el).data("column-id") = columnid;
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

                clickReload();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            },
        });

        dragulaReload();
    });
}


$(document).ready(function () {
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

            getQuerryTemplate("Title", response).then((resultHTML) => {
                $(".aside-h-container").append($(resultHTML));
                new changingInput();
            })

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
                    addTagToCard(cardData.id, tagId);
                }
            },
            error: function (jqXHR, textStatus) {
                console.warn(textStatus + "|" + jqXHR.responseText);
            },
            dataType: "json",
        });
    });

    $(document).on("click", ".main-card", function () {
        var cardId = $(this).data("card-id");
        var id_status = $(this).data("column-id");
        console.log("card-id" + cardId);
        updateCardSettingsMenu(cardId);


        updateColumnTitle(id_status);

        console.log("column-id" + id_status);


        var sidePanelObj = $(".side-panel-card");

        if (sidePanelObj.css("right")[0] == "-" || sidePanelObj.css("right")[0] == "0") {
            sidePanelObj.stop().animate({
                "right": "10px"
            }, 1500)
        }
        else {
            sidePanelObj.stop().animate({
                "right": "-65%"
            }, 1500)
        }

        $("textarea[placeholder='Add more detailed description...']").off('change').on('change', function () {
            var newLabel = $(this).val();
            saveCardLabel(cardId, newLabel);
        });


        $(document).on("click", ".delete-card-button", function () {
            deleteCard(cardId);
        });

        function deleteCard(cardId) {
            $.ajax({
                type: "DELETE",
                url: `${endpoint}${cardsEndpoint}${cardId}`,
                success: function (response) {
                    console.log(response);
                    closeModal();
                    $(`[data-card-id='${cardId}']`).remove();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(`Error: ${textStatus} - ${errorThrown}`);
                }
            });
        }

    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function updateCardSettingsMenu(cardId) {
        $.ajax({
            type: "GET",
            url: `${endpoint}${cardsEndpoint}${cardId}`,
            dataType: "json",
            success: function (response) {
                console.log(response);
                $("textarea[placeholder='Add more detailed description...']").val(response.label);
                $(".side-card-side-card-text").text(response.title);

                if (response.taskDTOs != undefined) {
                    getQuerryTemplate("Tasksdiv", {}).then(resultHTML => {

                        $("#task-cont-div").html(resultHTML);
                        renderTasks(response.taskDTOs);
                        updateProgress(response.taskDTOs);


                    })

                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    }
    function updateColumnTitle(id_status) {

        $.ajax({
            type: "GET",
            url: `${endpoint}${statusEndpoint}${id_status}`,
            dataType: "json",
            success: function (response) {

                var columnTitle = response.name;


                $(".side-card-side-card-column-text").text("In the column " + columnTitle);


            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    }

    // function updateCardLabel(cardId) {
    //     $.ajax({
    //         type: "GET",
    //         url: `${endpoint}${cardsEndpoint}${cardId}`,
    //         dataType: "json",
    //         success: function (response) {
    //             var cardLabel = response.label;
    //             $("textarea[placeholder='Add more detailed description...']").val(cardLabel);
    //         },
    //         error: function (jqXHR, textStatus, errorThrown) {
    //             console.error(`Error: ${textStatus} - ${errorThrown}`);
    //         }
    //     });
    // }

    function saveCardLabel(cardId, newLabel) {
        $.ajax({
            type: "GET",
            url: `${endpoint}${cardsEndpoint}${cardId}`,
            dataType: "json",
            success: function (cardData) {

                cardData.label = newLabel;


                $.ajax({
                    type: "PUT",
                    url: `${endpoint}${cardsEndpoint}`,
                    contentType: "application/json",
                    data: JSON.stringify(cardData),
                    success: function (response) {
                        console.log(`Card ${cardId} label updated successfully`);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(`Error: ${textStatus} - ${errorThrown}`);
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    }





    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    ///начало работы с тасками ////////////////////////////////////////////////////////////////////////////////////////////////






    function createTask(taskData) {
        $.ajax({
            type: "POST",
            url: `${endpoint}${tasksEndpoint}`,
            data: JSON.stringify(taskData),
            contentType: "application/json",
            success: function (response) {
                renderTask(response);
                // updateProgress(response.tasks);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    }

    function deleteTask(tasksId) {
        $.ajax({
            type: "DELETE",
            url: `${endpoint}${tasksEndpoint}/${tasksId}`,
            success: function (response) {
                console.log(response);
                closeModal();

                $("input#task" + tasksId).remove();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(`Error: ${textStatus} - ${errorThrown}`);
            }
        });
    }







    function renderTasks(tasks) {
        tasks.forEach(task => {
            renderTask(task);
        })
    }

    function renderTask(task) {
        getQuerryTemplate("Taskobj", task).then(resultHTML => {
            $("#tasks-div").prepend(resultHTML);
            checkboxesReload();
        })
    }




















    ///конец работы с тасками ////////////////////////////////////////////////////////////////////////////////////////////////



    $(document).mouseup(function (e) {
        var divs = $(".popup-window");
        if (divs == null) {
            return;
        }

        divs.hide();
    });

    function loadTags(tags) {
        tags.forEach(tag => tagSelect.append(new Option(tag.name, tag.id)))
    }

    $('#My-boards-button').on('click', function (event) {
        var $menu = $('.My-boards-container-dropdown-menu');
        if ($menu.hasClass('show')) {
            $menu.removeClass('show');
        } else {
            $menu.addClass('show');
        }
        event.stopPropagation();
    });

    $(document).on('click', function (event) {
        if (!$(event.target).closest('.My-boards-container').length) {
            $('.My-boards-container-dropdown-menu').removeClass('show');
        }
    });

    $('.My-boards-container-dropdown-menu li').on('click', function () {
        $('.My-boards-container-dropdown-menu').removeClass('show');
    });

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

        if ($(".side-panel-card").css("right")[0] != "-"
            && $(e.target).closest(".side-panel-card").length == 0) {
            $(".side-panel-card").animate({
                "right": "-65%"
            }, 1500)
        }
    });



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

    $(".account-button").on("mouseup", function (e) {
        if ($(".user-settings-container").css("display") == "none") {
            $(".user-settings-container").show();
        }
    })

    $(document).on("click", function (e) {
        if ($(".user-settings-container").css("display") != "none" &&
            (!$(e.target).hasClass(".user-settings-container") &&
                $(e.target).closest(".account-button").length == 0)) {
            $(".user-settings-container").hide();
        }
    })

    $(".logout-butt").on("click", function () {
        console.log(Cookies.get("userGUID"));
        if (Cookies.get("userGUID") != null) {
            Cookies.remove("userGUID");
            window.location.href = 'http://127.0.0.1:5500/reglog.html';
        }
    })

    
});
